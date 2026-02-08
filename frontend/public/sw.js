// Service Worker para SolidarBairro
const CACHE_NAME = 'solidar-bairro-v1';
const STATIC_CACHE = 'solidar-bairro-static-v1';
const API_CACHE = 'solidar-bairro-api-v1';

// Recursos estáticos para cache
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// URLs da API para cache offline
const API_ENDPOINTS = [
  '/api/pedidos',
  '/api/interesses/meus',
  '/api/pedidos/meus'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    Promise.all([
      // Cache de recursos estáticos
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Cacheando recursos estáticos');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache de API (se disponível)
      caches.open(API_CACHE).then((cache) => {
        console.log('Service Worker: Preparando cache de API');
        return cache;
      })
    ]).then(() => {
      self.skipWaiting();
    })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia Cache First para recursos estáticos
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Estratégia Network First para API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(API_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Fallback para cache se offline
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Retornar resposta offline padrão
          return new Response(JSON.stringify({
            error: 'Offline',
            message: 'Você está offline. Dados podem estar desatualizados.'
          }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // Estratégia Stale While Revalidate para outros recursos
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});

// Sincronização em background (para futuras implementações)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Sincronização em background:', event.tag);
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implementar sincronização de dados pendentes
  console.log('Executando sincronização em background...');
}
