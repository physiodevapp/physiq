// RAG-backed clinical suggestion.
// 1. Embed the transcript excerpt (OpenAI text-embedding-3-small)
// 2. Vector search in Supabase pgvector (match_chunks RPC)
// 3. Ask Claude with the retrieved context
// Returns: { type: 'redflag'|'followup'|'differential'|'test', text: string }
export async function handleSuggest(request, env) {
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
      'Authorization':  `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type':   'application/json',
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
        'apikey':          env.SUPABASE_ANON_KEY,
        'Authorization':   `Bearer ${env.SUPABASE_ANON_KEY}`,
        'Content-Type':    'application/json',
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
      'x-api-key':          env.ANTHROPIC_API_KEY,
      'anthropic-version':  '2023-06-01',
      'Content-Type':       'application/json',
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
