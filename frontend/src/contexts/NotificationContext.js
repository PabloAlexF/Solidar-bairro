import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/apiService';
import { getSocket } from '../services/socketService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const formatNotificationMessage = (message, maxLength = 80) => {
  if (!message) return '';
  return message.length > maxLength ? `${message.substring(0, maxLength)}...` : message;
};

const generateNotificationTitle = (type, senderName, category) => {
  switch (type) {
    case 'chat':
      return `💬 Nova mensagem de ${senderName}`;
    case 'help_request':
      return `🆘 Novo pedido de ajuda: ${category}`;
    case 'help_offer':
      return `🤝 Alguém quer ajudar você!`;
    case 'match':
      return `✨ Encontramos uma conexão para você!`;
    case 'system':
      return `📢 Atualização do sistema`;
    case 'welcome':
      return `🎉 Bem-vindo ao SolidarBairro!`;
    default:
      return `🔔 Nova notificação`;
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Carregar notificações do banco de dados
  useEffect(() => {
    if (isAuthenticated() && user) {
      const loadNotificationsFromDB = async () => {
        try {
          const response = await apiService.getNotifications();
          if (response.success && response.data) {
            // Converter formato do banco para formato local
            const dbNotifications = response.data.map(n => ({
              id: n.id,
              timestamp: n.createdAt?.seconds ? new Date(n.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
              read: n.read || false,
              type: n.type || 'system',
              priority: 'normal',
              title: n.title || 'Nova notificação',
              message: n.message || '',
              data: n.data || {}
            }));
            setNotifications(dbNotifications);
          }
        } catch (error) {
          console.error('Erro ao carregar notificações do banco:', error);
        }
      };

      loadNotificationsFromDB();
    }
  }, [isAuthenticated, user]);

  // Socket listeners para notificações em tempo real
  useEffect(() => {
    if (isAuthenticated() && user) {
      const socket = getSocket();
      if (socket) {
        const handleNewNotification = (notificationData) => {
          console.log('Nova notificação recebida via socket:', notificationData);

          // Converter formato do socket para formato local
          const newNotification = {
            id: notificationData.id,
            timestamp: notificationData.createdAt?.seconds ? new Date(notificationData.createdAt.seconds * 1000).toISOString() : notificationData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            read: notificationData.read || false,
            type: notificationData.type || 'system',
            priority: 'normal',
            title: notificationData.title || 'Nova notificação',
            message: notificationData.message || '',
            data: notificationData.data || {}
          };

          // Adicionar à lista de notificações
          setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
        };

        const handleNotificationRead = (data) => {
          if (data.notificationId) {
            setNotifications(prev =>
              prev.map(n => n.id === data.notificationId ? { ...n, read: true } : n)
            );
          }
        };

        socket.on('notification', handleNewNotification);
        socket.on('notification_read', handleNotificationRead);

        return () => {
          socket.off('notification', handleNewNotification);
          socket.off('notification_read', handleNotificationRead);
        };
      }
    }
  }, [isAuthenticated, user]);

  const addNotification = (notification) => {
    const newNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: notification.type || 'system',
      priority: notification.priority || 'normal', // low, normal, high, urgent
      ...notification,
      title: notification.title || generateNotificationTitle(
        notification.type,
        notification.senderName,
        notification.category
      ),
      message: formatNotificationMessage(notification.message)
    };

    // Evitar duplicatas baseadas no conteúdo
    const isDuplicate = notifications.some(n =>
      n.title === newNotification.title &&
      n.message === newNotification.message &&
      Math.abs(new Date(n.timestamp) - new Date(newNotification.timestamp)) < 60000 // 1 minuto
    );

    if (!isDuplicate) {
      setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Manter apenas 50 notificações
    }

    return newNotification.id;
  };

  const addChatNotification = (conversationId, senderName, message, conversationTitle) => {
    const notification = {
      type: 'chat',
      senderName,
      message: formatNotificationMessage(message, 60),
      conversationId,
      conversationTitle: conversationTitle || `Conversa com ${senderName}`,
      priority: 'high'
    };

    return addNotification(notification);
  };

  const addHelpRequestNotification = (category, description, location, urgency) => {
    const notification = {
      type: 'help_request',
      category,
      message: `${formatNotificationMessage(description, 60)} - ${location}`,
      urgency,
      priority: urgency === 'critico' ? 'urgent' : urgency === 'urgente' ? 'high' : 'normal'
    };

    return addNotification(notification);
  };

  const addHelpOfferNotification = (helperName, category, message) => {
    const notification = {
      type: 'help_offer',
      helperName,
      category,
      message: formatNotificationMessage(message || `${helperName} quer ajudar com ${category}`, 60),
      priority: 'high'
    };

    return addNotification(notification);
  };

  const addSystemNotification = (title, message, priority = 'normal') => {
    const notification = {
      type: 'system',
      title,
      message: formatNotificationMessage(message),
      priority
    };

    return addNotification(notification);
  };

  const markAsRead = async (notificationId) => {
    // Marcar como lida no estado local
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );

    // Sincronizar com o banco de dados
    try {
      await apiService.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida no banco:', error);
    }
  };

  const markAllAsRead = async () => {
    // Marcar todas como lidas no estado local
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    // Sincronizar com o banco de dados
    try {
      await apiService.markAllNotificationsAsRead();
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas no banco:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  const getNotificationsByPriority = (priority) => {
    return notifications.filter(n => n.priority === priority);
  };

  const clearOldNotifications = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    setNotifications(prev =>
      prev.filter(n => new Date(n.timestamp) > weekAgo)
    );
  };

  // Limpar notificações antigas automaticamente
  useEffect(() => {
    const interval = setInterval(clearOldNotifications, 24 * 60 * 60 * 1000); // Diariamente
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      addChatNotification,
      addHelpRequestNotification,
      addHelpOfferNotification,
      addSystemNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      removeNotification,
      getUnreadCount,
      getNotificationsByType,
      getNotificationsByPriority,
      clearOldNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
