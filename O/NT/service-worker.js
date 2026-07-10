// NoteTile Service Worker
// Caches all app shell assets for full offline support

const CACHE_NAME = 'notetile-v11';
const RUNTIME_CACHE = 'notetile-runtime-v3';
const MAX_RUNTIME_ITEMS = 50;

function trimCache(cacheName, maxItems) {
    caches.open(cacheName).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > maxItems) {
                cache.delete(keys[0]).then(() => trimCache(cacheName, maxItems));
            }
        });
    });
}
const ASSETS = [
    './',
    './index.html',
    './app.js',
    './manifest.json'
];

// Install — pre-cache app shell
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME && k !== RUNTIME_CACHE).map(k => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — cache-first with runtime caching and offline fallback
self.addEventListener('fetch', e => {
    const url = new URL(e.request.url);

    // Only handle same-origin requests
    if (url.origin !== location.origin) return;

    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(response => {
                // Cache successful GET responses, limit to 1MB
                if (e.request.method === 'GET' && response.status === 200) {
                    const contentLength = response.headers.get('content-length');
                    if (!contentLength || parseInt(contentLength) < 1024 * 1024) {
                        const clone = response.clone();
                        caches.open(RUNTIME_CACHE).then(cache => {
                            cache.put(e.request, clone);
                            trimCache(RUNTIME_CACHE, MAX_RUNTIME_ITEMS);
                        });
                    }
                }
                return response;
            });
        }).catch(() => {
            // Offline fallback for navigation
            if (e.request.mode === 'navigate') {
                return caches.match('./index.html');
            }
        })
    );
});
