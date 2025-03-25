const KEY = 'RETROBOWLCOLLEGE';

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install event triggered');
    event.waitUntil(self.skipWaiting());
    console.log('[Service Worker] skipWaiting called');
});

self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message event triggered:', event.data);
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(KEY)
                .then((cache) => {
                    console.log(`[Service Worker] Opened cache: ${KEY}`);
                    return cache.addAll(event.data.payload).then(() => {
                        console.log(`[Service Worker] Cached URLs:`, event.data.payload);
                    }).catch((err) => {
                        console.error('[Service Worker] Error adding to cache:', err);
                    });
                })
        );
    }
});

self.addEventListener("fetch", (e) => {
    console.log(`[Service Worker] Fetch event triggered for: ${e.request.url}`);
    e.respondWith(
        (async () => {
            try {
                console.log(`[Service Worker] Attempting to serve resource from cache: ${e.request.url}`);
                const r = await caches.match(e.request);
                if (r) {
                    console.log(`[Service Worker] Resource found in cache: ${e.request.url}`);
                    return r;
                }
                console.log(`[Service Worker] Resource not found in cache. Attempting live fetch: ${e.request.url}`);
                const response = await fetch(e.request);
                const cache = await caches.open(KEY);
                console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                cache.put(e.request, response.clone());
                console.log(`[Service Worker] Resource cached successfully: ${e.request.url}`);
                return response;
            } catch (err) {
                console.error(`[Service Worker] Fetch failed for: ${e.request.url}`, err);
            }
        })()
    );
});
