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

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Carregar notificações do localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('solidar-notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Salvar notificações no localStorage sempre que mudarem
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('solidar-notifications', JSON.stringify(notifications));
      // Disparar evento para atualizar o Header
      window.dispatchEvent(new Event('notificationAdded'));
    }
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const addChatNotification = (conversationId, senderName, message, conversationTitle) => {
    const notification = {
      id: `chat-${conversationId}-${Date.now()}`,
      type: 'chat',
      title: `Nova mensagem de ${senderName}`,
      message: message.length > 50 ? `${message.substring(0, 50)}...` : message,
      conversationId,
      conversationTitle,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [notification, ...prev]);
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

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      addChatNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      removeNotification,
      getUnreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};