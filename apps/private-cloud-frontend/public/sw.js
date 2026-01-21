// Service Worker for Private Cloud PWA
const CACHE_NAME = "private-cloud-cache-v1";
const RUNTIME_CACHE = "private-cloud-runtime-v1";
const ASSETS_TO_CACHE = ["/", "/manifest.json", "/offline.html"];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching essential assets");
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.warn("Some assets failed to cache:", err);
                // Continue even if some assets fail to cache
                return Promise.resolve();
            });
        })
    );

    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    console.log("Service Worker activating...");

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (
                        cacheName !== CACHE_NAME &&
                        cacheName !== RUNTIME_CACHE
                    ) {
                        console.log("Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    // Claim all clients immediately
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== "GET") {
        return;
    }

    // Skip requests to external origins (but allow same-origin requests)
    if (url.origin !== self.location.origin) {
        return;
    }

    // Strategy: Network first, fallback to cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Don't cache if not a success response
                if (
                    !response ||
                    response.status !== 200 ||
                    response.type === "error"
                ) {
                    return response;
                }

                // Clone and cache successful responses
                const responseClone = response.clone();
                const cacheName = request.url.includes("/api/")
                    ? RUNTIME_CACHE
                    : CACHE_NAME;

                caches.open(cacheName).then((cache) => {
                    cache.put(request, responseClone);
                });

                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(request).then((response) => {
                    if (response) {
                        return response;
                    }

                    // Return offline page if nothing else is available
                    if (request.destination === "document") {
                        return caches.match("/offline.html");
                    }
                });
            })
    );
});

// Handle messages from clients
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
