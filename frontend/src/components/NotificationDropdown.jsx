import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, CheckCircle, AlertCircle, MessageCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now - time) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Agora mesmo';
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  return time.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'chat': return <MessageCircle size={16} className="text-blue-500" />;
    case 'help': return <Heart size={16} className="text-red-500" />;
    case 'success': return <CheckCircle size={16} className="text-green-500" />;
    case 'warning': return <AlertCircle size={16} className="text-orange-500" />;
    default: return <Bell size={16} className="text-gray-500" />;
  }
};

export const NotificationDropdown = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [localNotifications, setLocalNotifications] = useState([]);
  const [showModalNotification, setShowModalNotification] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const { notifications, clearNotifications, markAsRead, getUnreadCount } = useNotifications();

  useEffect(() => {
    const hasShownWelcome = localStorage.getItem('solidar-welcome-shown');
    const timer = setTimeout(() => {
      if (!hasShownWelcome && !localNotifications.some(n => n.id === 'welcome-notification')) {
        setLocalNotifications([{
          id: 'welcome-notification',
          type: 'success',
          title: 'Bem-vindo ao SolidarBairro! 🎉',
          message: 'Conecte-se com sua comunidade e descubra como ajudar ou receber ajuda dos seus vizinhos.',
          timestamp: new Date().toISOString(),
          read: false
        }]);
        setShowNotifications(true);
        localStorage.setItem('solidar-welcome-shown', 'true');

        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            setShowNotifications(false);
            setIsClosing(false);
            setLocalNotifications([]);
          }, 300);
        }, 8000);
      }
    }, 2000);

    const handleExploreClick = () => {
      if (!showModalNotification) {
        setShowModalNotification(true);
        setTimeout(() => {
          setIsModalClosing(true);
          setTimeout(() => {
            setShowModalNotification(false);
            setIsModalClosing(false);
          }, 300);
        }, 5000);
      }
    };

    window.addEventListener('explorePlatformClick', handleExploreClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('explorePlatformClick', handleExploreClick);
    };
  }, [localNotifications]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowNotifications(false);
      setIsClosing(false);
    }, 300);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.type === 'chat' && notification.conversationId) {
      // Navigate to chat
      window.location.href = `/chat/${notification.conversationId}`;
    }
  };

  const allNotifications = [...localNotifications, ...notifications];
  const unreadCount = getUnreadCount() + localNotifications.filter(n => !n.read).length;

  return (
    <div className="notification-container">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="notification-bell-btn"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="notification-badge"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>
      
      <AnimatePresence>
        {(showNotifications || isClosing) && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="notification-header">
              <div className="notification-title-section">
                <h3 className="notification-title">Notificações</h3>
                {unreadCount > 0 && (
                  <span className="unread-count">{unreadCount} não lidas</span>
                )}
              </div>
              <button onClick={handleClose} className="notification-close-btn">
                <X size={16} />
              </button>
            </div>
            
            {allNotifications.length === 0 ? (
              <div className="notification-empty">
                <Bell size={32} className="empty-icon" />
                <p className="empty-title">Nenhuma notificação</p>
                <p className="empty-subtitle">Você receberá notificações sobre mensagens e atividades aqui</p>
              </div>
            ) : (
              <>
                <div className="notification-list">
                  {allNotifications.slice(0, 10).map(notification => (
                    <motion.div 
                      key={notification.id} 
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <div className="notification-item-header">
                          <h4 className="notification-item-title">{notification.title}</h4>
                          <span className="notification-time">
                            <Clock size={12} />
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        <p className="notification-item-message">{notification.message}</p>
                        {notification.conversationTitle && (
                          <span className="conversation-tag">{notification.conversationTitle}</span>
                        )}
                      </div>
                      {!notification.read && <div className="unread-dot" />}
                    </motion.div>
                  ))}
                </div>
                
                {allNotifications.length > 0 && (
                  <div className="notification-footer">
                    <button
                      onClick={() => {
                        clearNotifications();
                        setLocalNotifications([]);
                      }}
                      className="clear-all-btn"
                    >
                      Limpar todas
                    </button>
                    {allNotifications.length > 10 && (
                      <span className="more-notifications">
                        +{allNotifications.length - 10} mais
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {(showModalNotification || isModalClosing) && (
          <motion.div
            className="modal-notification-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="modal-notification"
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="modal-notification-icon">
                <Heart size={24} className="text-red-500" />
              </div>
              <div className="modal-notification-content">
                <h3 className="modal-notification-title">Escolha como contribuir!</h3>
                <p className="modal-notification-message">
                  Selecione uma das opções abaixo para começar sua jornada de solidariedade.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .notification-container {
          position: relative;
        }
        
        .notification-bell-btn {
          position: relative;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-bell-btn:hover {
          background: rgba(0, 0, 0, 0.05);
        }
        
        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        
        .notification-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 380px;
          max-height: 500px;
          background: white;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          z-index: 1000;
          overflow: hidden;
        }
        
        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .notification-title-section {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .notification-title {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }
        
        .unread-count {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }
        
        .notification-close-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .notification-close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        
        .notification-empty {
          padding: 40px 20px;
          text-align: center;
        }
        
        .empty-icon {
          color: #cbd5e1;
          margin-bottom: 12px;
        }
        
        .empty-title {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }
        
        .empty-subtitle {
          margin: 0;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.4;
        }
        
        .notification-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .notification-item:hover {
          background: #f8fafc;
        }
        
        .notification-item.unread {
          background: #fefefe;
          border-left: 3px solid #3b82f6;
        }
        
        .notification-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-content {
          flex: 1;
          min-width: 0;
        }
        
        .notification-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 4px;
        }
        
        .notification-item-title {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.3;
        }
        
        .notification-time {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #94a3b8;
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        .notification-item-message {
          margin: 0 0 6px;
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .conversation-tag {
          display: inline-block;
          background: #e0f2fe;
          color: #0369a1;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        .unread-dot {
          position: absolute;
          top: 20px;
          right: 16px;
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
        }
        
        .notification-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
        }
        
        .clear-all-btn {
          background: none;
          border: none;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .clear-all-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        
        .more-notifications {
          font-size: 11px;
          color: #94a3b8;
        }
        
        .modal-notification-overlay {
          position: fixed;
          top: 20px;
          left: 0;
          right: 0;
          z-index: 10000;
          display: flex;
          justify-content: center;
          pointer-events: none;
        }
        
        .modal-notification {
          background: white;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          padding: 20px 24px;
          max-width: 400px;
          display: flex;
          align-items: center;
          gap: 16px;
          pointer-events: auto;
        }
        
        .modal-notification-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          background: #fef2f2;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-notification-content {
          flex: 1;
        }
        
        .modal-notification-title {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
        }
        
        .modal-notification-message {
          margin: 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }
        
        @media (max-width: 480px) {
          .notification-dropdown {
            width: 320px;
            right: -20px;
          }
          
          .modal-notification {
            margin: 0 20px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};
