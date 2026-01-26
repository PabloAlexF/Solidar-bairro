import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import chatNotificationService from '../services/chatNotificationService';

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

  // Carregar notificações do localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('solidar-notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Filtrar notificações antigas (mais de 7 dias)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentNotifications = parsed.filter(n => 
          new Date(n.timestamp) > weekAgo
        );
        setNotifications(recentNotifications);
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        localStorage.removeItem('solidar-notifications');
      }
    }
  }, []);

  // Salvar notificações no localStorage sempre que mudarem
  useEffect(() => {
    if (notifications.length >= 0) {
      localStorage.setItem('solidar-notifications', JSON.stringify(notifications));
      // Disparar evento para atualizar o Header
      window.dispatchEvent(new Event('notificationAdded'));
    }
  }, [notifications]);

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

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('solidar-notifications');
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