import { handleTranscribe } from './transcribe.js';
import { handleSuggest }    from './suggest.js';
import { handleNotes }      from './notes.js';

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

async function checkLicense(request, env, origin) {
  if (isLocalDev(origin)) return null;  // dev bypass
  if (!env.LICENSES) return null;       // KV not configured yet — passthrough

  const url = new URL(request.url);
  // WebSocket (/transcribe) can't send custom headers — key comes as ?key= query param
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

    // WebSocket proxy — returned directly (no CORS wrapping needed for WS)
    if (url.pathname === '/transcribe') return handleTranscribe(request, env);

    let resp;
    if (url.pathname === '/validate' && request.method === 'GET') {
      resp = new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } else if (url.pathname === '/suggest' && request.method === 'POST') {
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
