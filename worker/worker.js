// physiq-copilot — single-file Cloudflare Worker (paste into dashboard editor)
// Endpoints:
//   GET  /transcribe  — WebSocket proxy to Deepgram Nova-3
//   POST /suggest     — RAG-backed clinical suggestion (embed → pgvector → Claude)
//   POST /notes       — SOAP note generation (transcript + session → Claude)
//
// Secrets to set in Dashboard → Worker → Settings → Variables → Add secret:
//   DEEPGRAM_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY,
//   SUPABASE_URL, SUPABASE_ANON_KEY
//
// Variable (plain text, not secret):
//   ALLOWED_ORIGIN = https://physiodevapp.github.io

// ── CORS ─────────────────────────────────────────────────────────────────────

const CORS = origin => ({
  'Access-Control-Allow-Origin':  origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin',
});

function trusted(origin, allowed) {
  return origin === allowed
    || origin.startsWith('http://localhost')
    || origin.startsWith('http://127.0.0.1');
}

// ── Router ────────────────────────────────────────────────────────────────────

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

    if (url.pathname === '/transcribe') return handleTranscribe(request, env);

    let resp;
    if (url.pathname === '/suggest' && request.method === 'POST') {
      resp = await handleSuggest(request, env);
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

// ── /transcribe — Deepgram WebSocket proxy ────────────────────────────────────

async function handleTranscribe(request, env) {
  if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  const url    = new URL(request.url);
  const params = new URLSearchParams(url.search);
  if (!params.has('model'))            params.set('model',            'nova-3');
  if (!params.has('language'))         params.set('language',         'es');
  if (!params.has('encoding'))         params.set('encoding',         'linear16');
  if (!params.has('punctuate'))        params.set('punctuate',        'true');
  if (!params.has('smart_format'))     params.set('smart_format',     'true');
  if (!params.has('interim_results'))  params.set('interim_results',  'true');
  if (!params.has('vad_events'))       params.set('vad_events',       'true');
  if (!params.has('utterance_end_ms')) params.set('utterance_end_ms', '1500');

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

  workerSocket.addEventListener('message', ({ data }) => {
    try { dg.send(data); } catch {}
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

// ── /suggest — embed → pgvector → Claude ─────────────────────────────────────

async function handleSuggest(request, env) {
  let body;
  try { body = await request.json(); } catch {
    return new Response('Bad request', { status: 400 });
  }

  const { query, session = {} } = body;
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
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    const sbResp = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/match_chunks`, {
      method: 'POST',
      headers: {
        'apikey':        env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({ query_embedding: embedding, match_count: 5 }),
    });
    if (sbResp.ok) {
      const chunks = await sbResp.json();
      if (Array.isArray(chunks) && chunks.length) {
        knowledgeContext = chunks.map(c => c.content).join('\n\n---\n\n');
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

  const system = [
    'Eres un asistente clínico de fisioterapia.',
    'Dado un fragmento de transcripción y contexto clínico, genera UNA sugerencia clínica en JSON.',
    'El JSON debe tener exactamente dos claves:',
    '  "type": uno de ["redflag","followup","differential","test"]',
    '  "text": sugerencia concisa en español (máx. 2 frases)',
    'Responde SOLO con el objeto JSON, sin texto adicional.',
    knowledgeContext ? `\nBase de conocimiento clínico:\n${knowledgeContext}` : '',
  ].join('\n');

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
  const raw = claudeData.content?.[0]?.text || '';

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

// ── /notes — transcript → SOAP ────────────────────────────────────────────────

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
