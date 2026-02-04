import React, { useEffect, useMemo } from 'react';
import AppRoutes from './routes/AppRoutes';
import { NotificationProvider } from './contexts/NotificationContext';
import { useAuth } from './contexts/AuthContext';
import { connectSocket } from './services/socketService';
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

  useEffect(() => {
    let socket;
    if (isAuthenticated() && user) {
      socket = connectSocket(user.uid || user.id);

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
              if (notification.type === 'chat' && notification.data?.conversationId) {
                  // Usar window.location para garantir navegação independente do contexto do Router neste nível
                  window.location.href = `/chat/${notification.data.conversationId}`;
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
    }

    return () => {
      if (socket) socket.off('notification');
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user, notificationSound]);

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