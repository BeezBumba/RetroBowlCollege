const CACHE_NAME = 'GAME_CACHE_V1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Cache URLs sent from the page
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  if (type !== 'CACHE_URLS' || !Array.isArray(payload)) return;

  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(payload.map(async (url) => {
      try {
        const req = new Request(url, { credentials: 'same-origin' });
        const res = await fetch(req);
        if (res.ok) await cache.put(req, res.clone());
      } catch (_) {
        // Skip if fetch fails
      }
    }));
  })());
});

// Runtime caching: cache-first, then network
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Same-origin only
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) return cached;

    try {
      const res = await fetch(req);
      if (res.ok) event.waitUntil(cache.put(req, res.clone()));
      return res;
    } catch (err) {
      // Optionally return a fallback asset here
      throw err;
    }
  })());
});
