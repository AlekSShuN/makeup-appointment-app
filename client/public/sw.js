// Конфигурация кэширования
const CACHE_NAME = 'makeup-app-v1.2.0';
const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';

// Ресурсы для кэширования при установке
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/slider/slider1.JPG',
    '/slider/slider2.JPG',
    '/slider/slider3.JPG',
    '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    console.log('🚀 Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker installed');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Cache installation failed:', error);
            })
    );
});

// Активация - очистка старых кэшей
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker: Activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Перехват запросов 
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (!url.protocol.startsWith('http')) {
        return;
    }

    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(request)
                        .then((cachedResponse) => {
                            return cachedResponse || new Response(JSON.stringify({
                                error: 'Network error and no cache available'
                            }), {
                                status: 503,
                                headers: { 'Content-Type': 'application/json' }
                            });
                        });
                })
        );
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((networkResponse) => {
                        if (networkResponse.status === 200 &&
                            networkResponse.type === 'basic' &&
                            request.url.includes('/static/')) {
                            const responseClone = networkResponse.clone();
                            caches.open(STATIC_CACHE)
                                .then((cache) => cache.put(request, responseClone));
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Fetch failed:', error);
                        if (request.destination === 'document') {
                            return caches.match('/');
                        }
                    });
            })
    );
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('🔄 Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    console.log('Performing background sync...');
}