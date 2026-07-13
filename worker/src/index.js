import { handleTranscribe } from './transcribe.js';
import { handleSuggest }    from './suggest.js';
import { handleNotes }      from './notes.js';

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

    // WebSocket proxy — returned directly (no CORS wrapping needed for WS)
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
