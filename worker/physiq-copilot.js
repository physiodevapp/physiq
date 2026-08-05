// physiq-copilot — Cloudflare Worker (deploy with `wrangler deploy`)
// Endpoints:
//   GET  /validate    — mode check (real | demo), per route
//   GET  /transcribe  — WebSocket proxy to Deepgram Nova-3
//   POST /suggest     — RAG-backed clinical suggestion (embed → pgvector → Claude)
//   POST /chat        — RAG-backed conversational reply, SSE-streamed (embed → pgvector → Claude)
//   POST /notes       — SOAP note generation (transcript + session → Claude)
//
// ⚠ No longer a single file: worker/demo/ is bundled at deploy time, so pasting
// this file alone into the dashboard editor is no longer a valid fallback. Use
// `wrangler deploy` (the GitHub Action does this on every push to main).
//
// Secrets to set in Dashboard → Worker → Settings → Variables → Add secret:
//   DEEPGRAM_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY,
//   SUPABASE_URL, SUPABASE_ANON_KEY
//
// Variables (plain text, not secret):
//   ALLOWED_ORIGIN = https://physiodevapp.github.io
//   DEMO_ONLY      = "1" forces every request into demo mode (budget kill switch)
//   DAILY_CAP      = per-IP cap of real (paid) requests per day; default 200
//
// KV Namespace binding (Dashboard → Worker → Settings → Bindings):
//   Variable name: LICENSES  →  KV namespace: physiq-licenses
//   Key format:  <license-key-string>  →  {"clinic":"Nombre","active":true}
//   While LICENSES is unbound the worker serves demo mode (fail-closed) except
//   on localhost, where it assumes a developer with .dev.vars.
//
// Optional bindings (all degrade to "no limiting" when absent):
//   RL_STT, RL_AI, RL_DEMO — Workers rate limiting bindings (see wrangler.toml)
//   RATE                   — KV namespace for the per-IP daily budget cap

import { handleDemo } from './demo/handlers.js';

// ── CORS ────────────────────────────────────────────────────────────────

const CORS = origin => ({
  'Access-Control-Allow-Origin':  origin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-License-Key',
  // The client reads the mode off every response to render the DEMO badge.
  'Access-Control-Expose-Headers': 'X-PhysiQ-Mode',
  'Vary': 'Origin',
});

function trusted(origin, allowed) {
  return origin === allowed
    || origin.startsWith('http://localhost')
    || origin.startsWith('http://127.0.0.1');
}

function isLocalDev(origin) {
  return origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
}

// ── RAG region adjacency ─────────────────────────────────────────────────────────
// A session's active region also pulls in its immediate proximal/distal neighbour
// (plus 'global', which match_chunks always includes anyway). Keeps referred-pain
// overlap retrievable — e.g. a lumbar session still reaches hip chunks (L5-S1, SI
// joint, piriformis) and vice-versa. Symmetric neuro-referral to the spine: distal
// limb segments reach their proximal neurological source one-directionally (the
// spine does not pull distal procedures back). Upper limb -> cervical: wrist and
// elbow (double crush with CTS, C6-C8/T1; C6-C7 mimics lateral elbow pain). Lower
// limb -> lumbar: knee and ankle (radicular referral — L3-L4 to knee, L5-S1 to
// ankle/foot; sciatica). shoulder<->cervical and hip<->lumbar are the bidirectional
// spine pairs; wrist<->elbow is a mechanical forearm pair (shared median/ulnar/radial
// pathways). match_chunks accepts filter_regions text[] and matches c.region =
// ANY(...); unknown regions fall back to [region, global].
const REGION_ADJACENCY = {
  lumbar:   ['lumbar', 'hip', 'global'],
  hip:      ['hip', 'lumbar', 'global'],
  knee:     ['knee', 'hip', 'lumbar', 'global'],
  ankle:    ['ankle', 'knee', 'lumbar', 'global'],
  shoulder: ['shoulder', 'cervical', 'global'],
  cervical: ['cervical', 'shoulder', 'global'],
  elbow:    ['elbow', 'wrist', 'cervical', 'global'],
  wrist:    ['wrist', 'elbow', 'cervical', 'global'],
};

function regionsFor(region) {
  if (!region) return null;
  return REGION_ADJACENCY[region] || [region, 'global'];
}

// ── Session-data summarisers ─────────────────────────────────────────────
// Force / questionnaire / assessment payloads live in the shared IDB session
// (written by their satellites). They are condensed here into short clinical
// lines for the copilot prompt — never dumped as raw JSON — mirroring how the
// report satellite renders them. Each returns '' when there is nothing useful.
function fmtForce(force) {
  if (!force) return '';
  const arr = Array.isArray(force) ? force : [force];
  if (!arr.length) return '';
  return arr.map((m) => {
    const label = m.label ?? (m.testType === 'peak' ? 'MVC' : (m.testType ? m.testType.toUpperCase() : 'Fuerza'));
    if (m.laterality === 'comparison') {
      const l = m.sides?.left?.peak;
      const r = m.sides?.right?.peak;
      let ai = m.asymmetryIndex;
      if (ai == null && l != null && r != null) {
        const avg = (l + r) / 2;
        ai = avg ? Math.abs(l - r) / avg * 100 : null;
      }
      return [
        label,
        l  != null ? `Izq ${l.toFixed(1)} kg` : null,
        r  != null ? `Der ${r.toFixed(1)} kg` : null,
        ai != null ? `AI ${ai.toFixed(1)}%`   : null,
      ].filter(Boolean).join(' · ');
    }
    const side = m.side === 'left' ? ' Izq' : m.side === 'right' ? ' Der' : '';
    return `${label}${side}${m.peak != null ? ` · ${m.peak.toFixed(1)} kg` : ''}`;
  }).join(' | ');
}

function fmtQuestionnaires(qs) {
  if (!qs) return '';
  const arr = Array.isArray(qs) ? qs : [qs];
  if (!arr.length) return '';
  return arr.map((q) => {
    const name  = q.abbr || q.name || q.id || '?';
    const score = q.score != null ? `${q.score}` : '—';
    const label = q.label ? ` (${q.label})` : '';
    const risk  = q.risk ? ' ⚠riesgo' : '';
    return `${name}: ${score}${label}${risk}`;
  }).join(' | ');
}

function fmtAssessment(a) {
  if (!a || typeof a !== 'object') return '';
  const parts = [];
  // patient / region / diagnosis are already emitted as their own session
  // lines, so the summary skips them and keeps only the clinical reasoning.
  if (a.mo) parts.push(`Motivo: ${a.mo}`);
  if (a.me) parts.push(`Mecanismo: ${a.me}`);
  if (a.cr) parts.push(`Cronología: ${a.cr}`);
  if (a.na) parts.push(`Naturaleza: ${a.na}`);
  if (a.nr != null) parts.push(`NRS: ${a.nr}/10`);
  if (a.ir) parts.push(`Irritabilidad: ${a.ir}`);
  if (a.rp) parts.push(`Riesgo psicosocial: ${a.rp}`);
  if (a.si) parts.push('Cribado sistémico: POSITIVO');
  if (Array.isArray(a.br) && a.br.length) parts.push(`Banderas rojas: ${a.br.join(', ')}`);
  if (Array.isArray(a.sq) && a.sq.length) parts.push(`Hallazgos sistémicos: ${a.sq.join('; ')}`);
  if (Array.isArray(a.h) && a.h.length) {
    const hyps = a.h.map((h) => {
      const lr = h.lr != null ? `, LR ${h.lr}` : '';
      return `${h.name ?? h.id} (${h.sc ?? 'sin evaluar'}${lr})`;
    }).join('; ');
    parts.push(`Hipótesis: ${hyps}`);
  }
  if (a.pn && typeof a.pn === 'object') {
    const pn = [];
    if (a.pn.variableControl)     pn.push(`control: ${a.pn.variableControl}`);
    if (a.pn.ventanaRecuperacion) pn.push(`ventana: ${a.pn.ventanaRecuperacion}`);
    if (a.pn.anclajeHabito)       pn.push(`hábito: ${a.pn.anclajeHabito}`);
    if (pn.length) parts.push(`Plan: ${pn.join(' · ')}`);
  }
  return parts.join('\n');
}

function fmtBalance(balance) {
  if (!balance || typeof balance !== 'object') return '';
  // _balanceResults is keyed by testId; each test carries posturography scalars.
  // Keep only the clinical summary (score + a couple of COP metrics) — the raw
  // COP series/hull/ellipse chart arrays inside metrics.cop are dropped.
  const tests = Object.values(balance).filter((t) => t && typeof t === 'object');
  if (!tests.length) return '';
  return tests.map((t) => {
    const label = t.label ?? t.testId ?? 'Test';
    const cond  = [t.eyes, t.stance].filter(Boolean).join(' · ');
    const score = t.score != null ? `${t.score}/100` : (t.metrics?.score != null ? `${t.metrics.score}/100` : null);
    const cop   = t.metrics?.cop;
    const vel   = cop?.meanVelocity != null ? `vel COP ${cop.meanVelocity.toFixed(1)} cm/s` : null;
    const area  = cop?.ellipseArea  != null ? `área ${cop.ellipseArea.toFixed(1)} cm²`      : null;
    const head  = cond ? `${label} (${cond})` : label;
    const rest  = [score, vel, area].filter(Boolean).join(' · ');
    return rest ? `${head}: ${rest}` : head;
  }).join('\n');
}

function fmtJump(jump) {
  // session.jump is the raw array of individual jumps (broadcast key is `jumps`,
  // IDB key is `jump` — the copilot stores it under `jump`). Summarise the way the
  // jump satellite groups its results: by type, then by the optional note, since
  // jumps of the same type with different notes are distinct conditions with their
  // own stats. Per-rep raw fields (id, fps, flightTime) are dropped.
  if (!Array.isArray(jump) || !jump.length) return '';
  const byType = new Map();
  for (const j of jump) {
    if (!j || j.height == null) continue;
    const type = j.type || 'Salto';
    if (!byType.has(type)) byType.set(type, new Map());
    const key = j.note || '';
    if (!byType.get(type).has(key)) byType.get(type).set(key, []);
    byType.get(type).get(key).push(j);
  }
  const lines = [];
  for (const [type, noteGroups] of byType) {
    for (const [note, list] of noteGroups) {
      const heights = list.map((j) => j.height);
      const best    = Math.max(...heights);
      const worst   = Math.min(...heights);
      const avg     = heights.reduce((s, h) => s + h, 0) / heights.length;
      const count   = `${list.length} salto${list.length === 1 ? '' : 's'}`;
      const legs    = [...new Set(list.map((j) => j.leg).filter(Boolean))];
      const head    = note ? `${type} (${note.toUpperCase()})` : `${type} (Sin etiqueta)`;
      const parts   = [`mejor ${best.toFixed(1)} cm`, `media ${avg.toFixed(1)} cm`, count];
      // Fatigue index over the group, matching the satellite (only for ≥3 jumps).
      if (list.length >= 3 && best > 0) parts.push(`FI ${(((best - worst) / best) * 100).toFixed(1)}%`);
      if (legs.length === 1) parts.push(legs[0]);
      lines.push(`${head}: ${parts.join(' · ')}`);
    }
  }
  return lines.join('\n');
}

function fmtKinematics(kinematics) {
  // session.kinematics is an array of recordings, each { joints[], series{joint:{t,a}}, duration }.
  // Summarise like the report legend: per recording, duration + per-joint angular
  // range (min°–max°, i.e. dynamic ROM). The raw t/a time series are dropped.
  const recs = (Array.isArray(kinematics) ? kinematics : [kinematics])
    .filter((r) => r && Array.isArray(r.joints) && r.joints.length && r.series);
  if (!recs.length) return '';
  const fmtJoint = (name) => name
    .replace(/^left_/, 'L ').replace(/^right_/, 'R ')
    .replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const lines = [];
  recs.forEach((rec, i) => {
    const jointSeries = rec.joints.filter((j) => rec.series[j]?.a?.length);
    if (!jointSeries.length) return;
    const ranges = jointSeries.map((j) => {
      const a = rec.series[j].a;
      return `${fmtJoint(j)} ${Math.round(Math.min(...a))}°–${Math.round(Math.max(...a))}°`;
    }).join(' · ');
    const dur  = rec.duration ? ` (${(rec.duration / 1000).toFixed(1)} s)` : '';
    const head = recs.length > 1 ? `Grabación ${i + 1}${dur}` : `Grabación${dur}`;
    lines.push(`${head}: ${ranges}`);
  });
  return lines.join('\n');
}

// ── Mode resolution ─────────────────────────────────────────────────────────
//
// The single authority on real vs demo. It runs in the router, before any
// handler is reached, and it is fail-closed: 'real' requires EVERY condition
// below to hold, anything else degrades to 'demo'.
//
// Why here and not inside each handler: with the decision at the edge, the
// guarantee is "there is exactly one entry point to the paid handlers" —
// checkable at a glance and stable when routes are added later. Scattered
// `if (demo)` guards would make it "we didn't forget one", which has to be
// re-verified on every future change.
//
// Note what is NOT part of the decision: the Origin header. The worker does
// reject foreign origins with 403, but CORS is a browser policy — `curl -H
// 'Origin: …'` walks straight through it. The only thing separating spend from
// no-spend is the KV license, which is why it is the only thing consulted here.

// Which secrets a route genuinely needs to run for real. Missing any of them
// means the real handler would fail anyway, so the route serves demo instead of
// a 502. Side effect worth having: a fork deployed with no secrets at all comes
// up as a fully working demo, and partial configuration degrades per route.
const ROUTE_SECRETS = {
  '/transcribe': ['DEEPGRAM_API_KEY'],
  '/suggest':    ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY'],
  '/chat':       ['ANTHROPIC_API_KEY'],   // OpenAI/Supabase optional — chat degrades without RAG
  '/notes':      ['ANTHROPIC_API_KEY'],
  '/validate':   [],
};

// One KV read per request, shared by every route decision below.
// Returns the key too — the rate limiter uses it as its primary identity.
async function licenseState(request, url, env, origin) {
  // WebSocket (/transcribe) can't send custom headers — key arrives as ?key=
  const key = request.headers.get('X-License-Key') || url.searchParams.get('key') || '';

  if (isLocalDev(origin)) return { licensed: true,  key };   // dev machine with .dev.vars
  if (!env.LICENSES)      return { licensed: false, key };   // KV unbound in prod → fail closed to demo
  if (!key)               return { licensed: false, key: '' };

  const entry = await env.LICENSES.get(key, { type: 'json' });
  return { licensed: !!entry && entry.active !== false, key };
}

function modeFor(env, pathname, licensed) {
  if (env.DEMO_ONLY === '1' || env.DEMO_ONLY === 'true') return 'demo';   // budget kill switch
  if (!licensed) return 'demo';
  const needed = ROUTE_SECRETS[pathname] ?? [];
  if (needed.some(name => !env[name])) return 'demo';
  return 'real';
}

// ── Rate limiting ───────────────────────────────────────────────────────────
//
// Second layer, on top of mode resolution. Demo costs nothing, so the budget
// does not depend on this — but a leaked license key would, and this is what
// contains the damage until the key is revoked in KV.
//
// Two identities, because they fail differently:
//   · License key — the identity Cloudflare's own guidance recommends (stable,
//     one actor). In real mode there is always one: having a valid key is what
//     *defines* real mode. This is the per-license budget guard, and it holds
//     even if the key is shared across many machines.
//   · IP — required by design here even though the docs warn against it (NAT,
//     mobile carriers and privacy proxies share IPs). It catches the reverse
//     case: one host cycling through keys. Kept deliberately loose so a clinic
//     behind a single NAT is not locked out.
//
// Two tiers, because they fail on different timescales:
//   · Rate limiting binding — sliding window at the edge, no KV writes and no
//     added latency. `period` only accepts 10 or 60 s, and counters are LOCAL
//     TO EACH CLOUDFLARE LOCATION, so this stops bursts, not a slow global drain.
//   · KV daily counter — the actual budget ceiling, global but eventually
//     consistent, so a distributed attacker can overshoot a little.
// Every binding is optional: unbound means "no limiting", never a 500.
async function rateLimited(request, env, pathname, mode, licenseKey) {
  const ip    = request.headers.get('CF-Connecting-IP') || 'unknown';
  // Never use the raw key as a limiter key: those strings end up in logs and
  // analytics, and the license is a bearer secret.
  const actor = licenseKey ? `lic:${fnv1a(licenseKey)}` : `ip:${ip}`;

  const limiter = mode === 'demo'
    ? env.RL_DEMO
    : (pathname === '/transcribe' ? env.RL_STT : env.RL_AI);
  if (limiter) {
    const { success } = await limiter.limit({ key: `${pathname}:${actor}` });
    if (!success) return true;
  }

  if (mode !== 'real') return false;

  if (env.RL_IP) {
    const { success } = await env.RL_IP.limit({ key: `ip:${ip}` });
    if (!success) return true;
  }

  // Daily budget ceiling — only guards real (paid) traffic.
  if (!env.RATE) return false;
  const cap = parseInt(env.DAILY_CAP || '200', 10);
  const day = new Date().toISOString().slice(0, 10);
  const k   = `rl:${day}:${actor}`;
  const n   = parseInt(await env.RATE.get(k) || '0', 10);
  if (n >= cap) return true;
  // TTL 25h: the key expires on its own, no cleanup job needed.
  await env.RATE.put(k, String(n + 1), { expirationTtl: 90000 });
  return false;
}

// FNV-1a — stable, dependency-free, used only to avoid putting the license key
// itself into rate-limit keys.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

// ── Router ──────────────────────────────────────────────────────────────

export default {
  async fetch(request, env, ctx) {
    const url     = new URL(request.url);
    const origin  = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || 'https://physiodevapp.github.io';
    const ok      = trusted(origin, allowed);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: ok ? CORS(origin) : {} });
    }

    if (!ok) return new Response('Forbidden', { status: 403 });

    const { licensed, key } = await licenseState(request, url, env, origin);
    const mode = modeFor(env, url.pathname, licensed);

    if (await rateLimited(request, env, url.pathname, mode, licensed ? key : '')) {
      // WebSocket clients can't read a 429 body, but the close code is enough
      // for lib/copilot.js to surface "límite alcanzado".
      const h = new Headers(CORS(origin));
      h.set('Content-Type', 'application/json');
      h.set('Retry-After', '60');
      h.set('X-PhysiQ-Mode', mode);
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: 60 }), { status: 429, headers: h });
    }

    // ── The fork. Everything below the `demo` branch runs without `env`, so no
    // demo path can reach a paid API even by mistake — it has no credentials to
    // authenticate with. See worker/demo/handlers.js.
    if (mode === 'demo') {
      const resp = handleDemo(request, url, ctx);
      if (url.pathname === '/transcribe') return resp;   // 101 — headers are fixed
      return withMode(await resp, origin, mode);
    }

    // WebSocket — returned directly (no CORS wrapping needed for WS)
    if (url.pathname === '/transcribe') return handleTranscribe(request, env);

    let resp;
    if (url.pathname === '/validate' && request.method === 'GET') {
      resp = await handleValidate(env, licensed);
    } else if (url.pathname === '/suggest' && request.method === 'POST') {
      resp = await handleSuggest(request, env);
    } else if (url.pathname === '/chat' && request.method === 'POST') {
      resp = await handleChat(request, env);
    } else if (url.pathname === '/notes' && request.method === 'POST') {
      resp = await handleNotes(request, env);
    } else {
      return new Response('Not found', { status: 404 });
    }

    return withMode(resp, origin, mode);
  },
};

function withMode(resp, origin, mode) {
  const headers = new Headers(resp.headers);
  for (const [k, v] of Object.entries(CORS(origin))) headers.set(k, v);
  headers.set('X-PhysiQ-Mode', mode);
  return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers });
}

// ── /validate — what mode is this visitor actually getting? ─────────────────
//
// Reports the mode per route, because secrets are configured per provider: with
// only ANTHROPIC_API_KEY set, chat is real while transcription is demo. The
// client renders the badge off `mode` and can label each feature off `routes`.
//
// Deliberately never says *why* it is demo. Distinguishing "no key" from
// "invalid key" would hand a brute-forcer exactly the oracle it needs; a client
// that sent a key and got `demo` back already knows its key is not valid.
async function handleValidate(env, licensed) {
  const routes = {};
  for (const path of ['/transcribe', '/suggest', '/chat', '/notes']) {
    routes[path.slice(1)] = modeFor(env, path, licensed);
  }
  const values = Object.values(routes);
  const mode = values.every(m => m === 'real') ? 'real'
             : values.every(m => m === 'demo') ? 'demo'
             : 'mixed';
  return new Response(JSON.stringify({ ok: true, mode, routes }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
}

// ── /transcribe — Deepgram WebSocket proxy ──────────────────────────────────

async function handleTranscribe(request, env) {
  if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  const url    = new URL(request.url);
  const params = new URLSearchParams(url.search);
  params.delete('key');  // license key — strip before forwarding to Deepgram
  if (!params.has('model'))            params.set('model',            'nova-3');
  if (!params.has('language'))         params.set('language',         'es');
  if (!params.has('encoding'))         params.set('encoding',         'linear16');
  if (!params.has('punctuate'))        params.set('punctuate',        'true');
  if (!params.has('smart_format'))     params.set('smart_format',     'true');
  if (!params.has('interim_results'))  params.set('interim_results',  'true');
  if (!params.has('vad_events'))       params.set('vad_events',       'true');
  if (!params.has('utterance_end_ms')) params.set('utterance_end_ms', '1500');
  if (!params.has('diarize'))          params.set('diarize',          'true');

  let dgResp;
  try {
    // CF Workers fetch() requires https:// (not wss://) for outbound WebSocket upgrades
    dgResp = await fetch(`https://api.deepgram.com/v1/listen?${params}`, {
      headers: {
        'Authorization': `Token ${env.DEEPGRAM_API_KEY}`,
        'Upgrade': 'websocket',
      },
    });
  } catch {
    return new Response('Deepgram unreachable', { status: 502 });
  }

  const dg = dgResp.webSocket;
  if (!dg) return new Response('Deepgram handshake failed', { status: 502 });
  dg.accept();

  const [clientSocket, workerSocket] = Object.values(new WebSocketPair());
  workerSocket.accept();

  workerSocket.addEventListener('message', async ({ data }) => {
    // CF Workers delivers binary WebSocket frames as Blob objects.
    // dg.send(Blob) serialises to the string "[object Blob]" (13 chars) instead of
    // the actual bytes, so Deepgram receives garbage and replies with Error on every
    // packet. We must resolve the Blob to its underlying ArrayBuffer first.
    let payload;
    if (data instanceof ArrayBuffer) {
      payload = data;
    } else if (ArrayBuffer.isView(data)) {
      payload = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    } else if (data instanceof Blob) {
      payload = await data.arrayBuffer();
    } else {
      payload = data; // string text frame — forward as-is
    }
    try { dg.send(payload); } catch (e) { console.error(`[dg] send fail: ${e.message}`); }
  });
  workerSocket.addEventListener('close', ({ code, reason }) => {
    try { dg.close(code || 1000, reason || ''); } catch {}
  });

  dg.addEventListener('message', ({ data }) => {
    try { workerSocket.send(data); } catch {}
  });
  dg.addEventListener('close', ({ code, reason }) => {
    try { workerSocket.close(code || 1000, reason || ''); } catch {}
  });
  dg.addEventListener('error', () => {
    try { workerSocket.close(1011, 'Deepgram error'); } catch {}
  });

  return new Response(null, { status: 101, webSocket: clientSocket });
}

// ── /suggest — embed → pgvector → Claude ────────────────────────────────

async function handleSuggest(request, env) {
  let body;
  try { body = await request.json(); } catch {
    return new Response('Bad request', { status: 400 });
  }

  const { query, session = {}, suggestions = [] } = body;
  if (typeof query !== 'string' || !query.trim()) {
    return new Response('Missing query', { status: 400 });
  }

  // 1. Embed
  const embResp = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: query }),
  });
  if (!embResp.ok) return new Response('Embedding failed', { status: 502 });

  const { data } = await embResp.json();
  const embedding = data[0].embedding;

  // 2. Vector search
  let knowledgeContext = '';
  const filterRegions = regionsFor(session.manualRegion);
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    const sbResp = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/match_chunks`, {
      method: 'POST',
      headers: {
        'apikey':        env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        query_embedding:  embedding,
        match_count:      3,
        min_similarity:   0.6,
        ...(filterRegions        && { filter_regions:  filterRegions }),
        ...(session.category     && { filter_category: session.category }),
      }),
    });
    if (sbResp.ok) {
      const chunks = await sbResp.json();
      if (Array.isArray(chunks) && chunks.length) {
        knowledgeContext = chunks.map(c => {
          const head = [c.title && `Tema: ${c.title}`, c.source && `Fuente: ${c.source}`]
            .filter(Boolean).join(' · ');
          return head ? `${head}\n${c.content}` : c.content;
        }).join('\n\n---\n\n');
      }
    }
  }

  // 3. Claude
  const forceStr   = fmtForce(session.force);
  const questStr   = fmtQuestionnaires(session.questionnaires);
  const assessStr  = fmtAssessment(session.assessment);
  const balanceStr = fmtBalance(session.balance);
  const jumpStr    = fmtJump(session.jump);
  const kinemStr   = fmtKinematics(session.kinematics);
  const sessionLines = [
    session.patient      && `Paciente: ${session.patient}`,
    session.diagnosis    && `Diagnóstico: ${session.diagnosis}`,
    session.manualRegion && `Región: ${session.manualRegion}`,
    session.rom          && `ROM: ${JSON.stringify(session.rom)}`,
    forceStr             && `Fuerza: ${forceStr}`,
    questStr             && `Cuestionarios: ${questStr}`,
    assessStr            && `Valoración:\n${assessStr}`,
    balanceStr           && `Equilibrio:\n${balanceStr}`,
    jumpStr              && `Salto:\n${jumpStr}`,
    kinemStr             && `Cinemática:\n${kinemStr}`,
  ].filter(Boolean);

  const existingBlock = suggestions.length
    ? `Sugerencias ya mostradas al fisioterapeuta:\n${suggestions.map((s, i) => `${i + 1}. [${s.type}] ${s.text}`).join('\n')}\nSi tu sugerencia sería semánticamente equivalente a alguna de las anteriores, responde SOLO con la palabra: null`
    : '';

  const system = [
    'Eres un asistente clínico de fisioterapia.',
    'Dado un fragmento de transcripción y contexto clínico, genera UNA sugerencia clínica en JSON.',
    'Fundaméntate en evidencia de fisioterapia y en la base de conocimiento recuperada cuando esté disponible; no inventes hallazgos ni referencias.',
    'El JSON debe tener exactamente dos claves:',
    '  "type": uno de ["redflag","followup","differential","test"]',
    '  "text": sugerencia concisa en español (máx. 2 frases)',
    'Responde SOLO con el objeto JSON, sin texto adicional.',
    existingBlock,
    knowledgeContext ? `\nBase de conocimiento clínico:\n${knowledgeContext}` : '',
  ].filter(Boolean).join('\n');

  const user = [
    sessionLines.length ? `Sesión:\n${sessionLines.join('\n')}\n` : '',
    `Fragmento de transcripción: "${query.trim()}"`,
  ].join('\n');

  const claudeResp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-5',
      max_tokens: 256,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!claudeResp.ok) return new Response('Claude failed', { status: 502 });

  const claudeData = await claudeResp.json();
  const raw = claudeData.content?.[0]?.text?.trim() || '';

  if (raw === 'null') {
    return new Response(JSON.stringify({ skip: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let suggestion;
  try {
    suggestion = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? raw);
  } catch {
    return new Response('Claude parse error', { status: 502 });
  }

  return new Response(JSON.stringify(suggestion), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── /chat — conversational reply, RAG-grounded, SSE-streamed ───────────────────

async function handleChat(request, env) {
  let body;
  try { body = await request.json(); } catch {
    return new Response('Bad request', { status: 400 });
  }

  const { messages = [], session = {}, transcript = [], region } = body;
  if (!Array.isArray(messages) || !messages.length) {
    return new Response('Missing messages', { status: 400 });
  }

  // Last user turn drives the semantic retrieval.
  const lastUser = [...messages].reverse().find(m => m?.role === 'user' && m.text?.trim());
  const query = (lastUser?.text || '').trim();
  if (!query) return new Response('Missing message', { status: 400 });

  // 1. Embed the last user message (best-effort — chat still works without RAG)
  let embedding = null;
  try {
    const embResp = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: query }),
    });
    if (embResp.ok) {
      const { data } = await embResp.json();
      embedding = data?.[0]?.embedding ?? null;
    }
  } catch { /* embedding unavailable — proceed without RAG */ }

  // 2. Vector search (chat pulls a few more chunks than /suggest)
  let knowledgeContext = '';
  const filterRegion  = region || session.manualRegion;
  const filterRegions = regionsFor(filterRegion);
  if (embedding && env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    try {
      const sbResp = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/match_chunks`, {
        method: 'POST',
        headers: {
          'apikey':        env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          query_embedding:  embedding,
          match_count:      5,
          min_similarity:   0.6,
          ...(filterRegions    && { filter_regions:  filterRegions }),
          ...(session.category && { filter_category: session.category }),
        }),
      });
      if (sbResp.ok) {
        const chunks = await sbResp.json();
        if (Array.isArray(chunks) && chunks.length) {
          knowledgeContext = chunks.map(c => {
            const head = [c.title && `Tema: ${c.title}`, c.source && `Fuente: ${c.source}`]
              .filter(Boolean).join(' · ');
            return head ? `${head}\n${c.content}` : c.content;
          }).join('\n\n---\n\n');
        }
      }
    } catch { /* retrieval failed — proceed without RAG */ }
  }

  // 3. Build system prompt + conversation context
  const forceStr   = fmtForce(session.force);
  const questStr   = fmtQuestionnaires(session.questionnaires);
  const assessStr  = fmtAssessment(session.assessment);
  const balanceStr = fmtBalance(session.balance);
  const jumpStr    = fmtJump(session.jump);
  const kinemStr   = fmtKinematics(session.kinematics);
  const sessionLines = [
    session.patient      && `Paciente: ${session.patient}`,
    session.diagnosis    && `Diagnóstico: ${session.diagnosis}`,
    (filterRegion)       && `Región: ${filterRegion}`,
    session.rom          && `ROM: ${JSON.stringify(session.rom)}`,
    forceStr             && `Fuerza: ${forceStr}`,
    questStr             && `Cuestionarios: ${questStr}`,
    assessStr            && `Valoración:\n${assessStr}`,
    balanceStr           && `Equilibrio:\n${balanceStr}`,
    jumpStr              && `Salto:\n${jumpStr}`,
    kinemStr             && `Cinemática:\n${kinemStr}`,
  ].filter(Boolean);

  // Cap the live consultation transcript to the most recent exchanges.
  const txText = (Array.isArray(transcript) ? transcript : [])
    .slice(-20)
    .map(l => `${l.speaker === 'fisio' ? 'Fisioterapeuta' : 'Paciente'}: ${l.text}`)
    .join('\n');

  const system = [
    'Eres un copiloto clínico de fisioterapia que conversa con el fisioterapeuta durante o después de la consulta.',
    'Responde en español, de forma concisa y clínica, con un tono de compañero experto.',
    'Fundaméntate en la base de conocimiento y en la transcripción de la consulta cuando estén disponibles; no inventes datos que no aparezcan.',
    'Fundamenta tus respuestas únicamente en evidencia científica y académica: revisiones sistemáticas y guías clínicas, revistas revisadas por pares (p. ej. BJSM), libros de texto de medicina, fisioterapia o fisiología, y organismos o fuentes universitarias/institucionales (p. ej. APTA, IASP). No te apoyes en fuentes divulgativas, blogs, foros ni contenido no revisado. No tienes acceso a internet: no "buscas" en esas fuentes, sino que razonas a partir de tu conocimiento fundamentado en ellas y de la base de conocimiento recuperada. Cuando una recomendación provenga de la base de conocimiento recuperada, cita su fuente (campo "Fuente" del fragmento); NUNCA inventes ni atribuyas referencias que no aparezcan en la base de conocimiento.',
    'Distingue con claridad lo respaldado por la base de conocimiento de tu conocimiento general: si una afirmación no está respaldada por los fragmentos recuperados, indícalo explícitamente (p. ej. "no encontrado en la base de conocimiento").',
    'Si te falta información para responder con seguridad, dilo y sugiere qué explorar.',
    'Recuerda que asistes a un profesional: no sustituyes su juicio clínico ni emites diagnósticos definitivos.',
    sessionLines.length ? `\nContexto de sesión:\n${sessionLines.join('\n')}` : '',
    txText ? `\nTranscripción reciente de la consulta:\n${txText}` : '',
    knowledgeContext ? `\nBase de conocimiento clínico:\n${knowledgeContext}` : '',
  ].filter(Boolean).join('\n');

  // Map the client thread to Anthropic messages (drop empties, coerce roles).
  const claudeMessages = messages
    .filter(m => m?.text?.trim())
    .map(m => ({
      role:    m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text.trim(),
    }));

  // 4. Stream from Claude
  const claudeResp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type':      'application/json',
    },
    body: JSON.stringify({
      // 2048: detailed clinical protocol answers (multi-phase progressions, several
      // options) were being cut off mid-word at 1024 tokens.
      model:      'claude-sonnet-5',
      max_tokens: 2048,
      stream:     true,
      system,
      messages: claudeMessages,
    }),
  });
  if (!claudeResp.ok || !claudeResp.body) return new Response('Claude failed', { status: 502 });

  // Transform Anthropic's SSE into a minimal {text} / [DONE] SSE for the client.
  const reader  = claudeResp.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async pull(controller) {
      let buffer = '';
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let nl;
          while ((nl = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;
            let evt;
            try { evt = JSON.parse(payload); } catch { continue; }
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
              const text = evt.delta.text || '';
              if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            } else if (evt.type === 'message_delta' && evt.delta?.stop_reason === 'max_tokens') {
              // Reply hit the token ceiling — tell the client so it can flag it.
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ truncated: true })}\n\n`));
            } else if (evt.type === 'message_stop') {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            }
          }
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'stream_interrupted' })}\n\n`));
      } finally {
        controller.close();
      }
    },
    cancel() { try { reader.cancel(); } catch {} },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    },
  });
}

// ── /notes — transcript → SOAP ───────────────────────────────────────────────

async function handleNotes(request, env) {
  let body;
  try { body = await request.json(); } catch {
    return new Response('Bad request', { status: 400 });
  }

  const { transcript = [], session = {} } = body;

  const txText = transcript
    .map(l => `${l.speaker === 'fisio' ? 'Fisioterapeuta' : 'Paciente'}: ${l.text}`)
    .join('\n');

  const sessionLines = [
    session.patient      && `Paciente: ${session.patient}`,
    session.date         && `Fecha: ${session.date}`,
    session.diagnosis    && `Diagnóstico: ${session.diagnosis}`,
    session.manualRegion && `Región: ${session.manualRegion}`,
  ].filter(Boolean);

  const system = `Eres un asistente clínico de fisioterapia experto en documentación clínica.
Genera una nota SOAP completa en español a partir de la transcripción de la consulta.
Usa estrictamente el formato:
S (Subjetivo): <texto>
O (Objetivo): <texto>
A (Análisis): <texto>
P (Plan): <texto>
Sé conciso y clínico. No inventes datos que no aparezcan en la transcripción.`;

  const user = [
    sessionLines.length ? `Contexto de sesión:\n${sessionLines.join('\n')}\n` : '',
    `Transcripción:\n${txText || '(sin transcripción disponible)'}`,
  ].join('\n');

  const claudeResp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type':      'application/json',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-5',
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!claudeResp.ok) return new Response('Claude failed', { status: 502 });

  const claudeData = await claudeResp.json();
  const soap = claudeData.content?.[0]?.text || '';

  return new Response(JSON.stringify({ soap }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
