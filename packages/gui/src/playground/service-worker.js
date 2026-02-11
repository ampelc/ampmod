import log from '../lib/log';

const ampmod_version = process.env.ampmod_version;
const CACHE_NAME = `ampmod-cache-v${ampmod_version}`;

self.addEventListener('install', (event) => {
    log.info(`installing version ${ampmod_version}`);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        log.info('cleaing sw cache', name);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request);
        })
    );
});
