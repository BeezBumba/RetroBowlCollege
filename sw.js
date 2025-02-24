const cacheName = 'RETROBOWLCOLLEGE';

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            console.log('Precache Manifest:', self.__precacheManifest); // Log the precache manifest
            return cache.addAll(self.__precacheManifest);
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

// Activate event
self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (!cacheWhitelist.includes(key)) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
