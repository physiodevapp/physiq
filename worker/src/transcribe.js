// Deepgram Nova-3 WebSocket proxy.
// Keeps the API key server-side; forwards audio binary frames from the client
// to Deepgram and transcript JSON events back to the client.
export async function handleTranscribe(request, env) {
  if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 426 });
  }

  // Forward query params from the client; fill in defaults for anything missing
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

  // Open outbound WebSocket to Deepgram
  let dgResp;
  try {
    dgResp = await fetch(`wss://api.deepgram.com/v1/listen?${params}`, {
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

  // Create the client-facing WebSocket pair
  const [clientSocket, workerSocket] = Object.values(new WebSocketPair());
  workerSocket.accept();

  // client → Deepgram (audio binary frames)
  workerSocket.addEventListener('message', ({ data }) => {
    if (dg.readyState === 1) dg.send(data);
  });
  workerSocket.addEventListener('close', ({ code, reason }) => {
    try { dg.close(code || 1000, reason || ''); } catch {}
  });

  // Deepgram → client (JSON transcript events)
  dg.addEventListener('message', ({ data }) => {
    if (workerSocket.readyState === 1) workerSocket.send(data);
  });
  dg.addEventListener('close', ({ code, reason }) => {
    try { workerSocket.close(code || 1000, reason || ''); } catch {}
  });
  dg.addEventListener('error', () => {
    try { workerSocket.close(1011, 'Deepgram error'); } catch {}
  });

  return new Response(null, { status: 101, webSocket: clientSocket });
}
