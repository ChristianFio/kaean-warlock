// Offline copy of the sheet: pages and scripts from the network first, the cache when there is no connection.
const CACHE = 'sheet-v7';
const CORE = ['./', 'index.html', 'engine/engine.js?v=7', 'engine/engine.css?v=7', 'characters/kaean-warlock/texts.js?v=7', 'characters/kaean-warlock/character.js?v=7', 'characters/kaean-warlock/theme.css?v=7', 'manifest.webmanifest', 'icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.hostname.endsWith('firebasedatabase.app')) return;
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (u.origin !== location.origin && !font) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    if (font){ const hit = await c.match(e.request); if (hit) return hit; }
    try { const r = await fetch(e.request); if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; }
    catch (x) { return (await c.match(e.request, {ignoreSearch:!font})) || (await c.match('index.html')) || Response.error(); }
  })());
});
