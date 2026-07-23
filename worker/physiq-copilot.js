// physiq-copilot — single-file Cloudflare Worker (paste into dashboard editor)
// Endpoints:
//   GET  /validate    — license key check
//   GET  /transcribe  — WebSocket proxy to Deepgram Nova-3
//   POST /suggest     — RAG-backed clinical suggestion (embed → pgvector → Claude)
//   POST /chat        — RAG-backed conversational reply, SSE-streamed (embed → pgvector → Claude)
//   POST /notes       — SOAP note generation (transcript + session → Claude)
//
// Secrets to set in Dashboard → Worker → Settings → Variables → Add secret:
//   DEEPGRAM_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY,
//   SUPABASE_URL, SUPABASE_ANON_KEY
//
// Variable (plain text, not secret):
//   ALLOWED_ORIGIN = https://physiodevapp.github.io
//
// KV Namespace binding (Dashboard → Worker → Settings → Bindings):
//   Variable name: LICENSES  →  KV namespace: physiq-licenses
//   Key format:  <license-key-string>  →  {"clinic":"Nombre","active":true}
//   While LICENSES is unbound the worker runs without license checks (dev passthrough).

// ── CORS ────────────────────────────────────────────────────────────────

const CORS = origin => ({
  'Access-Control-Allow-Origin':  origin,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-License-Key',
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
// joint, piriformis) and vice-versa. match_chunks accepts filter_regions text[]
// and matches c.region = ANY(...); unknown regions fall back to [region, global].
const REGION_ADJACENCY = {
  lumbar:   ['lumbar', 'hip', 'global'],
  hip:      ['hip', 'lumbar', 'global'],
  knee:     ['knee', 'hip', 'global'],
  ankle:    ['ankle', 'knee', 'global'],
  shoulder: ['shoulder', 'cervical', 'global'],
  cervical: ['cervical', 'shoulder', 'global'],
};

function regionsFor(region) {
  if (!region) return null;
  return REGION_ADJACENCY[region] || [region, 'global'];
}

async function checkLicense(request, env, origin) {
  if (isLocalDev(origin)) return null;   // dev bypass
  if (!env.LICENSES) return null;        // KV not bound yet — passthrough

  const url = new URL(request.url);
  // WebSocket (/transcribe) can't send custom headers — key arrives as ?key= query param
  const key = request.headers.get('X-License-Key') || url.searchParams.get('key') || '';
  if (!key) return new Response(JSON.stringify({ error: 'license_required' }), {
    status: 401, headers: { 'Content-Type': 'application/json' },
  });

  const entry = await env.LICENSES.get(key, { type: 'json' });
  if (!entry || entry.active === false) return new Response(JSON.stringify({ error: 'license_invalid' }), {
    status: 401, headers: { 'Content-Type': 'application/json' },
  });

  return null;
}

// ── Router ──────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const url     = new URL(request.url);
    const origin  = request.headers.get('Origin') || '';
    const allowed = env.ALLOWED_ORIGIN || 'https://physiodevapp.github.io';
    const ok      = trusted(origin, allowed);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: ok ? CORS(origin) : {} });
    }

    if (!ok) return new Response('Forbidden', { status: 403 });

    const licenseErr = await checkLicense(request, env, origin);
    if (licenseErr) {
      const h = new Headers(licenseErr.headers);
      for (const [k, v] of Object.entries(CORS(origin))) h.set(k, v);
      return new Response(licenseErr.body, { status: licenseErr.status, headers: h });
    }

    // WebSocket — returned directly (no CORS wrapping needed for WS)
    if (url.pathname === '/transcribe') return handleTranscribe(request, env);

    let resp;
    if (url.pathname === '/validate' && request.method === 'GET') {
      resp = new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else if (url.pathname === '/suggest' && request.method === 'POST') {
      resp = await handleSuggest(request, env);
    } else if (url.pathname === '/chat' && request.method === 'POST') {
      resp = await handleChat(request, env);
    } else if (url.pathname === '/notes' && request.method === 'POST') {
      resp = await handleNotes(request, env);
    } else {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers(resp.headers);
    for (const [k, v] of Object.entries(CORS(origin))) headers.set(k, v);
    return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers });
  },
};

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
  const sessionLines = [
    session.patient      && `Paciente: ${session.patient}`,
    session.diagnosis    && `Diagnóstico: ${session.diagnosis}`,
    session.manualRegion && `Región: ${session.manualRegion}`,
    session.rom          && `ROM: ${JSON.stringify(session.rom)}`,
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
  const sessionLines = [
    session.patient      && `Paciente: ${session.patient}`,
    session.diagnosis    && `Diagnóstico: ${session.diagnosis}`,
    (filterRegion)       && `Región: ${filterRegion}`,
    session.rom          && `ROM: ${JSON.stringify(session.rom)}`,
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
    'Apóyate en evidencia de fisioterapia y fuentes validadas (guías clínicas, revisiones sistemáticas, organismos como APTA o IASP, revistas como BJSM). Cuando una recomendación provenga de la base de conocimiento recuperada, cita su fuente (campo "Fuente" del fragmento); NUNCA inventes ni atribuyas referencias que no aparezcan en la base de conocimiento.',
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
