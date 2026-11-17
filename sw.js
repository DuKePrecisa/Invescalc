// Service Worker básico para ativar o modo PWA no InvestCalc
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Apenas passa as requisições normalmente sem quebrar o cache
  event.respondWith(fetch(event.request));
});
