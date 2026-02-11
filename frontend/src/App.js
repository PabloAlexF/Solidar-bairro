import React, { useEffect, useMemo } from 'react';
import AppRoutes from './routes/AppRoutes';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './contexts/AuthContext';
import ApiService from './services/apiService';
import { getMessaging, getToken } from 'firebase/messaging';

import SecurityMiddleware from './utils/securityMiddleware';
import './styles/globals.css';
import './styles/visibility-fix.css';
import './pages/Chat/styles.css';
import './pages/Chat/MobileChat.css';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const { user, isAuthenticated } = useAuth();
  const notificationSound = useMemo(() => typeof Audio !== "undefined" && new Audio('/sounds/notification.mp3'), []);

  useEffect(() => {
    // Inicializar proteções de segurança
    SecurityMiddleware.initialize();
  }, []);

  // Socket já é conectado no AuthContext, não conectar novamente aqui
  // Apenas escutar notificações do socket existente
  useEffect(() => {
    if (isAuthenticated() && user) {
      const socket = window.socketInstance; // Usar instância global do socket
      if (!socket) return;

      const handleNewNotification = (notification) => {
        // Tocar som
        if (notification.type === 'chat' && notificationSound) {
          notificationSound.play().catch(e => console.error("Erro ao tocar som de notificação:", e));
        }

        // Exibir Toast Global
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        toast((t) => (
          <div 
            onClick={() => {
              const conversationId = notification.conversationId || notification.data?.conversationId;
              if (notification.type === 'chat' && conversationId) {
                  window.location.href = `/chat/${conversationId}`;
              }
              toast.dismiss(t.id);
            }} 
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{notification.title}</div>
            <div style={{ fontSize: '0.85rem' }}>{notification.message}</div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{timeString}</div>
          </div>
        ), { duration: 5000, position: 'top-right', icon: notification.type === 'chat' ? '💬' : '🔔', style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } });
      };

      socket.on('notification', handleNewNotification);

      return () => {
        socket.off('notification', handleNewNotification);
      };
    }
  }, [isAuthenticated, user, notificationSound]);

  // Configuração de Notificações Push (FCM)
  useEffect(() => {
    const setupFCM = async () => {
      if (isAuthenticated && user?.uid) {
        try {
          const messaging = getMessaging();
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