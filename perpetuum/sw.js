// Taller Perpetuum — service worker: la app funciona sin conexión.
// El nombre de la caché cambia con cada versión publicada y se borra la anterior.
const CACHE = 'perpetuum-1.1.0-f81e77af';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './privacidad.html',
  './privacy.html',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './lib/three.min.js',
  './js/i18n.js?v=1.1.0',
  './js/engine.js?v=1.1.0',
  './js/build.js?v=1.1.0',
  './js/gl3d.js?v=1.1.0',
  './js/vision.js?v=1.1.0',
  './js/app.js?v=1.1.0',
  './fonts/barlow-condensed-latin-500-normal.woff2',
  './fonts/barlow-condensed-latin-600-normal.woff2',
  './fonts/barlow-condensed-latin-700-normal.woff2',
  './fonts/barlow-latin-400-normal.woff2',
  './fonts/barlow-latin-500-normal.woff2',
  './fonts/barlow-latin-600-normal.woff2',
  './fonts/ibm-plex-mono-latin-400-normal.woff2',
  './fonts/ibm-plex-mono-latin-500-normal.woff2'
];

self.addEventListener('install', (e) => {
  // cache: 'reload' evita la caché HTTP: se guarda siempre la versión recién publicada
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  // la temporada (patrocinadores y concurso) se pide primero a la red, para que los cambios lleguen enseguida
  if (url.pathname.endsWith('/temporada.json')) {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const fresh = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
