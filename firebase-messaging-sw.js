importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Inicialize o Firebase no Service Worker
// IMPORTANTE: Copie as mesmas configurações que você usa no seu arquivo de configuração do Firebase (src/services/firebase.js ou similar)
firebase.initializeApp({
  apiKey: "AIzaSyCRWDyB6xS2swKULP6IunF8plpkrbFOsCM",
  authDomain: "solidar-bairro-novo.firebaseapp.com",
  projectId: "solidar-bairro-novo",
  storageBucket: "solidar-bairro-novo.firebasestorage.app",
  messagingSenderId: "440503349998",
  appId: "1:440503349998:web:7012dc38f9ff79382079ff"
});

const messaging = firebase.messaging();

// Handler para mensagens em background (quando o app está fechado)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensagem em background recebida:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.data?.icon || '/logo192.png', // Ícone principal (pode vir do backend)
    image: payload.data?.image, // Imagem grande (ex: foto enviada no chat)
    badge: '/favicon.ico', // Ícone pequeno monocromático (barra de status Android)
    vibrate: [200, 100, 200], // Padrão de vibração
    sound: '/sounds/notification.mp3', // Som personalizado (crie a pasta public/sounds)
    data: payload.data,
    tag: payload.data?.conversationId || 'general', // Agrupa notificações da mesma conversa
    renotify: true // Toca som novamente mesmo se a tag for a mesma
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handler para clique na notificação (Abre o chat correto)
self.addEventListener('notificationclick', function(event) {
  console.log('[firebase-messaging-sw.js] Notificação clicada');
  event.notification.close();

  const urlToOpen = event.notification.data?.conversationId 
    ? `/chat/${event.notification.data.conversationId}` 
    : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Tenta focar em uma aba já aberta
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus().then(c => c.navigate(urlToOpen));
        }
      }
      // Se não houver aba aberta, abre uma nova
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});