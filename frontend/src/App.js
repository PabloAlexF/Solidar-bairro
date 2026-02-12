import React, { useEffect, useMemo } from 'react';
import AppRoutes from './routes/AppRoutes';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './contexts/AuthContext';
import ApiService from './services/apiService';
import { getMessaging, getToken } from 'firebase/messaging';
import { getSocket, connectSocket } from './services/socketService';
import { initializeApp, getApps } from 'firebase/app';

import SecurityMiddleware from './utils/securityMiddleware';
import './styles/globals.css';
import './styles/visibility-fix.css';
import './pages/Chat/styles.css';
import './pages/Chat/MobileChat.css';
import toast, { Toaster } from 'react-hot-toast';

// Configuração do Firebase (mesma do service worker)
const firebaseConfig = {
  apiKey: "AIzaSyCRWDyB6xS2swKULP6IunF8plpkrbFOsCM",
  authDomain: "solidar-bairro-novo.firebaseapp.com",
  projectId: "solidar-bairro-novo",
  storageBucket: "solidar-bairro-novo.firebasestorage.app",
  messagingSenderId: "440503349998",
  appId: "1:440503349998:web:7012dc38f9ff79382079ff"
};

function App() {
  const { user, isAuthenticated } = useAuth();
  const notificationSound = useMemo(() => typeof Audio !== "undefined" && new Audio('/sounds/notification.mp3'), []);

  useEffect(() => {
    // Inicializar proteções de segurança
    SecurityMiddleware.initialize();
  }, []);

  useEffect(() => {
    if (isAuthenticated() && user) {
      console.log('🔔 [App.js] Configurando listener de notificações para:', user.uid);
      
      // Garantir que o socket esteja conectado globalmente
      const socket = connectSocket(user.uid || user.id);
      if (!socket) {
        console.error('❌ [App.js] Socket não conectado!');
        return;
      }

      console.log('✅ [App.js] Socket conectado, registrando listener...');

      const handleNewNotification = (notification) => {
        console.log('🔔 [App.js] Notificação recebida:', notification);
        
        // Verificar se o usuário já está na conversa da notificação
        const currentPath = window.location.pathname;
        console.log('📍 [App.js] Caminho atual:', currentPath);
        
        const conversationId = notification.conversationId || notification.data?.conversationId;
        console.log('💬 [App.js] ConversationId da notificação:', conversationId);
        
        // Se estiver na mesma conversa, não mostrar Toast nem tocar som (já está vendo a mensagem)
        if (conversationId && currentPath.includes(`/chat/${conversationId}`)) {
          console.log('⚠️ [App.js] Usuário já está na conversa, não exibir toast');
          return;
        }

        console.log('✅ [App.js] Exibindo toast de notificação...');

        // Tocar som
        if (notification.type === 'chat' && notificationSound) {
          notificationSound.play().catch(e => console.error("Erro ao tocar som de notificação:", e));
        }

        // Exibir Toast Global
        let date = new Date();
        const timestamp = notification.timestamp || notification.createdAt;
        
        if (timestamp) {
          if (timestamp.seconds) {
            date = new Date(timestamp.seconds * 1000);
          } else if (timestamp._seconds) {
            date = new Date(timestamp._seconds * 1000);
          } else {
            date = new Date(timestamp);
          }
        }

        const senderPhoto = notification.data?.senderPhoto;

        toast.custom((t) => (
          <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              background: '#fff',
              color: '#1e293b',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              width: '350px',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              maxWidth: 'calc(100vw - 32px)'
            }}
            onClick={() => {
              const conversationId = notification.conversationId || notification.data?.conversationId;
              if (notification.type === 'chat' && conversationId) {
                  window.location.href = `/chat/${conversationId}`;
              }
              toast.dismiss(t.id);
            }}
          >
            {/* Avatar */}
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', flexShrink: 0, overflow: 'hidden' }}>
              {senderPhoto ? (
                <img src={senderPhoto} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>
                  {notification.title?.split(' ').pop()?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notification.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notification.message}</div>
              <button 
                style={{ 
                  marginTop: '6px', 
                  background: '#eff6ff', 
                  color: '#2563eb', 
                  border: 'none', 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  width: 'fit-content',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#dbeafe'}
                onMouseLeave={(e) => e.target.style.background = '#eff6ff'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                Responder
              </button>
            </div>
            {/* Close button */}
            <button onClick={(e) => { e.stopPropagation(); toast.dismiss(t.id); }} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px', alignSelf: 'flex-start' }} > <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> </button>
          </div>
        ), { duration: 6000, position: 'top-right' });
        
        console.log('✅ [App.js] Toast exibido com sucesso!');
      };

      socket.on('notification', handleNewNotification);
      console.log('✅ [App.js] Listener registrado com sucesso!');

      return () => {
        socket.off('notification', handleNewNotification);
        console.log('🗑️ [App.js] Listener removido');
      };
    }
  }, [isAuthenticated, user, notificationSound]);

  // Configuração de Notificações Push (FCM)
  useEffect(() => {
    const setupFCM = async () => {
      if (isAuthenticated && user?.uid) {
        try {
          // Inicializar Firebase App se ainda não estiver inicializado
          if (getApps().length === 0) {
            initializeApp(firebaseConfig);
          }

          // Verificar se o Firebase foi inicializado antes de chamar getMessaging
          let messaging;
          try {
            messaging = getMessaging();
          } catch (e) {
            console.warn('FCM não inicializado ou não suportado:', e.message);
            return;
          }

          const permission = await Notification.requestPermission();
          
          if (permission === 'granted') {
            // Obter token FCM
            // IMPORTANTE: Substitua pela sua VAPID Key do Firebase Console -> Project Settings -> Cloud Messaging
            const token = await getToken(messaging, { 
              vapidKey: "BDwC7fGsTw2dNTpQimAm5KCQTQHjqsAes6jIsjoY6-wQNE31ycsVOl5XfMPw0mfUH4CbK_1RvdgIWlVfY4GPJVQ" 
            });
            
            if (token) {
              console.log('FCM Token:', token);
              
              // Determinar endpoint baseado no tipo de usuário para salvar o token
              let endpoint = `/users/${user.uid}`;
              if (user.tipo === 'cidadao') endpoint = `/cidadaos/${user.uid}`;
              else if (user.tipo === 'comercio') endpoint = `/comercios/${user.uid}`;
              else if (user.tipo === 'ong') endpoint = `/ongs/${user.uid}`;
              else if (user.tipo === 'familia') endpoint = `/familias/${user.uid}`;

              await ApiService.request(endpoint, {
                method: 'PATCH',
                body: JSON.stringify({ fcmToken: token })
              }).catch(() => {});
            }
          }
        } catch (error) {
          console.error('Erro ao configurar FCM:', error);
        }
      }
    };

    setupFCM();
  }, [isAuthenticated, user]);

  return (
    <div className="App">
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#1e293b', color: '#fff', borderRadius: '12px' },
      }} />
    </div>
  );
}

export default App;