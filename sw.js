const CACHE_NAME = 'physiq-hub-v3';

const HUB_SHELL = [
  '/physiq/',
  '/physiq/index.html',
  '/physiq/manifest.json',
  '/physiq/favicon.svg',
  '/physiq/icons/icon-192.png',
  '/physiq/icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(HUB_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (HUB_SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then(cached => cached ?? fetch(request))
    );
  }
  // Satellite routes: no intercept — satellite SWs handle their own scope
});
