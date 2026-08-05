// worker/demo/handlers.js — servido de las rutas en modo demo.
//
// ⚠ INVARIANTE DE DISEÑO — ninguna función de este módulo recibe `env`.
//
// Es la garantía estructural de "coste cero": los secretos (DEEPGRAM_API_KEY,
// OPENAI_API_KEY, ANTHROPIC_API_KEY) viven en `env`, y este módulo no tiene
// acceso a él. Un handler demo no puede llamar a una API de pago aunque
// alguien lo intente por error: no tendría con qué autenticarse. La propiedad
// deja de depender de "no habernos dejado ningún if" y pasa a ser verificable
// leyendo las firmas.
//
// Corolario práctico: este archivo no debe importar nada más que fixtures.js.
//   grep -n "api\.\(openai\|anthropic\|deepgram\)\|env\." worker/demo/  → vacío

import {
  DEMO_TRANSCRIPT,
  DEMO_DICTATION,
  DEMO_SUGGESTIONS,
  DEMO_CHAT,
  DEMO_CHAT_FALLBACK,
  DEMO_SOAP,
} from './fixtures.js';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const json = (obj, status = 200) => new Response(JSON.stringify(obj), {
  status, headers: { 'Content-Type': 'application/json' },
});

// ── Router demo ────────────────────────────────────────────────────────────
// Recibe `ctx` (para waitUntil) pero nunca `env`.
export function handleDemo(request, url, ctx) {
  if (url.pathname === '/validate' && request.method === 'GET')  return json({ ok: true, mode: 'demo' });
  if (url.pathname === '/transcribe')                            return demoTranscribe(request, url, ctx);
  if (url.pathname === '/suggest' && request.method === 'POST')  return demoSuggest(request);
  if (url.pathname === '/chat'    && request.method === 'POST')  return demoChat(request);
  if (url.pathname === '/notes'   && request.method === 'POST')  return demoNotes();
  return new Response('Not found', { status: 404 });
}

// ── /transcribe — replay del fixture con el formato exacto de Deepgram ──────
//
// El worker acepta el upgrade y NO abre ninguna conexión con Deepgram. Los
// frames de audio que llegan se descartan sin bufferizar: cero coste, cero
// memoria y, como efecto colateral valioso, el audio del visitante nunca sale
// de su navegador.
//
// El formato emitido es el que consume _onDgMessage() en lib/copilot.js:
//   { type:'Results', is_final, channel:{ alternatives:[{ transcript, words }] } }
//   { type:'UtteranceEnd' }
// Por eso el cliente no necesita ni una línea de código específica de demo
// para transcribir: no distingue esta fuente de la real.
function demoTranscribe(request, url, ctx) {
  if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  const [clientSocket, workerSocket] = Object.values(new WebSocketPair());
  workerSocket.accept();

  // El motor pasivo pide diarize=true; el dictado del chat pide diarize=false.
  // Son dos guiones distintos: la consulta completa frente a una sola pregunta.
  const dictation = url.searchParams.get('diarize') === 'false';
  const script    = dictation
    ? DEMO_DICTATION.map(text => ({ speaker: 0, text }))
    : DEMO_TRANSCRIPT;

  let closed = false;
  workerSocket.addEventListener('close',   () => { closed = true; });
  workerSocket.addEventListener('error',   () => { closed = true; });
  workerSocket.addEventListener('message', ({ data }) => {
    // CloseStream es el único mensaje de texto que manda el cliente; el resto
    // son frames PCM que se descartan deliberadamente.
    if (typeof data === 'string' && data.includes('CloseStream')) closed = true;
  });

  const send = obj => {
    if (closed) return false;
    try { workerSocket.send(JSON.stringify(obj)); return true; }
    catch { closed = true; return false; }
  };

  const results = (transcript, isFinal, words) => ({
    type: 'Results',
    is_final: isFinal,
    speech_final: isFinal,
    channel: { alternatives: [{ transcript, words: words ?? [] }] },
  });

  ctx.waitUntil((async () => {
    await sleep(900);   // el "warm-up" que tiene cualquier stream real

    for (const turn of script) {
      if (closed) break;

      const tokens = turn.text.split(/\s+/).filter(Boolean);

      // Interinos: prefijos crecientes, sin `words` (el cliente solo usa el
      // texto para el indicador "◉ …" mientras la frase se está formando).
      for (const frac of [0.35, 0.7]) {
        const cut = Math.max(1, Math.round(tokens.length * frac));
        if (!send(results(tokens.slice(0, cut).join(' '), false))) break;
        await sleep(420);
      }
      if (closed) break;

      // Final: con `words[]` y su `speaker`, que es lo que alimenta el
      // diarizado y la agrupación por hablante del transcript.
      const words = tokens.map(t => ({
        word:            t.replace(/[.,;:¿?¡!]/g, '').toLowerCase(),
        punctuated_word: t,
        speaker:         turn.speaker,
      }));
      if (!send(results(turn.text, true, words))) break;

      await sleep(320);
      send({ type: 'UtteranceEnd' });
      await sleep(1100);   // silencio entre turnos
    }

    // El guion se acaba: cierre limpio. Acota la vida del WebSocket en lugar
    // de dejarlo abierto indefinidamente consumiendo tiempo de worker.
    if (!closed) {
      send({ type: 'Metadata', demo: true });
      try { workerSocket.close(1000, 'demo script finished'); } catch { /* ya cerrado */ }
    }
  })());

  return new Response(null, { status: 101, webSocket: clientSocket });
}

// ── /suggest — pool determinista con deduplicado ────────────────────────────
// Reproduce el contrato del motor real, incluido el `{skip:true}` que este
// devuelve cuando la sugerencia sería redundante con las ya mostradas.
async function demoSuggest(request) {
  let body = {};
  try { body = await request.json(); } catch { /* cuerpo inválido: irrelevante en demo */ }

  const shown   = new Set((body.suggestions || []).map(s => (s?.text || '').trim()));
  const pending = DEMO_SUGGESTIONS.filter(s => !shown.has(s.text));

  await sleep(600);   // latencia simulada: evita que aparezcan todas de golpe

  if (!pending.length) return json({ skip: true });

  // Determinista respecto al fragmento: el mismo texto da siempre la misma
  // tarjeta, en vez de un aleatorio que haría el demo irreproducible.
  const idx = hash(String(body.query || '')) % pending.length;
  return json(pending[idx]);
}

// ── /chat — SSE troceado, mismo protocolo que el modo real ──────────────────
// El worker real transforma el stream de Anthropic en `data: {text}` sucesivos
// más `data: [DONE]`. Aquí se emite exactamente eso, troceando el fixture y
// espaciando los envíos, para que copilotSendChat() recorra el mismo camino:
// mismo parser, mismo cursor, mismo render de Markdown al cerrar.
async function demoChat(request) {
  let body = {};
  try { body = await request.json(); } catch { /* ídem */ }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const lastUser = [...messages].reverse().find(m => m?.role === 'user' && m.text?.trim());
  const answer   = pickChatAnswer(lastUser?.text || '');

  const encoder = new TextEncoder();
  const stream  = new ReadableStream({
    async start(controller) {
      const push = obj => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        await sleep(700);   // el "pensando" previo al primer token

        // De dos en dos palabras a ~60 ms ≈ 30 palabras/s, que es el orden de
        // magnitud al que streamea el modelo real.
        const tokens = answer.split(/(\s+)/);
        for (let i = 0; i < tokens.length; i += 4) {
          push({ text: tokens.slice(i, i + 4).join('') });
          await sleep(60);
        }
        push({ done: true });
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch {
        push({ error: 'stream_interrupted' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
    },
  });
}

// Puntuación por palabras clave. No pretende ser clasificación: pretende que
// preguntar "¿qué banderas rojas descarto?" no devuelva el plan de tratamiento.
// Sin señal suficiente cae en el fallback, que dice abiertamente que la
// respuesta es precargada en lugar de fingir que ha entendido la pregunta.
function pickChatAnswer(question) {
  const q = question.toLowerCase();
  let best = null, bestScore = 0;
  for (const entry of DEMO_CHAT) {
    const score = entry.keywords.reduce((n, k) => n + (q.includes(k) ? 1 : 0), 0);
    if (score > bestScore) { best = entry; bestScore = score; }
  }
  return bestScore > 0 ? best.text : DEMO_CHAT_FALLBACK;
}

// ── /notes — nota SOAP precargada ───────────────────────────────────────────
async function demoNotes() {
  await sleep(1200);   // suficiente para que se vea el estado disabled del botón
  return json({ soap: DEMO_SOAP });
}

// FNV-1a: hash estable y sin dependencias, solo para repartir el pool.
function hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h);
}
