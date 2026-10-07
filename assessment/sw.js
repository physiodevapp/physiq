const CACHE = 'physiq-assessment-v1';

const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './data.js',
  './manifest.json',
  './favicon.svg',
  './apple-touch-icon.png',
];

const NETWORK_ONLY_HOSTS = [
  'workers.dev',
  'api.anthropic.com',
  'challenges.cloudflare.com',   // Turnstile del informe narrativo: nunca desde caché
];

const CDN_HOSTS = [
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (NETWORK_ONLY_HOSTS.some(h => url.hostname.includes(h))) return;

  // Versión publicada (comprobarVersion, app.js): siempre de la red, y sin
  // guardarla — cada comprobación lleva ?t=… y llenaría la caché.
  if (url.pathname.endsWith('/version.json')) return;

  // CDN resources: cache-first (rarely change, long-lived)
  if (CDN_HOSTS.some(h => url.hostname.includes(h))) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // App shell: network-first, cache fallback for offline. Los archivos propios
  // se revalidan (cache: 'no-cache', 304 si no han cambiado): sin eso, tras un
  // despliegue el navegador podía seguir sirviendo app.js y compañía de su
  // caché HTTP (GitHub Pages da max-age=600) aunque la página fuera nueva.
  const red = request.mode !== 'navigate' && url.origin === self.location.origin
    ? new Request(request, { cache: 'no-cache' })
    : request;
  event.respondWith(
    fetch(red).then(response => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, clone));
      }
      return response;
    }).catch(() => caches.match(request))
  );
});
