// Service worker: guarda la app para usarla sin internet.
// 20261013150158 lo reemplaza construir-netlify.sh en cada publicación, así el teléfono descarga la versión nueva.
const VERSION = "20261013150158";
const CACHE = "pizarron-" + VERSION;
const FUENTES = "pizarron-fuentes";
const BASE = [
  "./", "./index.html", "./lecciones.js", "./pwa.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png", "./icons/apple-touch-icon.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== FUENTES).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) e.respondWith(redPrimero(req));
  else if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") e.respondWith(cachePrimero(req));
});

// Con internet trae lo más nuevo (lecciones nuevas); sin internet o con red muy lenta usa la copia guardada.
async function redPrimero(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await Promise.race([
      fetch(req),
      new Promise((_, rechazar) => setTimeout(() => rechazar(new Error("red lenta")), 4000)),
    ]);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    const guardada = await cache.match(req, { ignoreSearch: true });
    if (guardada) return guardada;
    if (req.mode === "navigate") return (await cache.match("./index.html")) || Response.error();
    return Response.error();
  }
}

// Las tipografías no cambian: se guardan la primera vez y después siempre salen de la copia.
async function cachePrimero(req) {
  const cache = await caches.open(FUENTES);
  const guardada = await cache.match(req);
  if (guardada) return guardada;
  try {
    const res = await fetch(req);
    if (res.ok || res.type === "opaque") cache.put(req, res.clone());
    return res;
  } catch {
    return Response.error();
  }
}
