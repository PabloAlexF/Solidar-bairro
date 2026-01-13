import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Heart, Bell, User, LogOut } from 'lucide-react';
import chatNotificationService from '../../services/chatNotificationService';
import './LandingHeader.css';

const LandingHeader = ({ scrolled = false }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    notifications, 
    addChatNotification, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications, 
    getUnreadCount 
  } = useNotifications();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [globalMonitoringInterval, setGlobalMonitoringInterval] = useState(null);

  useEffect(() => {
    // Iniciar monitoramento global de mensagens
    const startChatMonitoring = () => {
      if (isAuthenticated() && (user?.uid || user?.id)) {
        const userId = user.uid || user.id;
        
        // Callback para novas mensagens
        const handleNewChatMessage = (conversationId, senderName, message) => {
          addChatNotification(conversationId, senderName, message);
        };
        
        // Iniciar monitoramento global
        const interval = chatNotificationService.startGlobalMessageMonitoring(
          userId, 
          handleNewChatMessage
        );
        
        setGlobalMonitoringInterval(interval);
      }
    };
    
    if (isAuthenticated()) {
      startChatMonitoring();
    }

    const handleClickOutside = (event) => {
      if (showUserMenu || showNotifications) {
        const userMenuElement = document.querySelector('.user-menu-wrapper');
        const notificationElement = document.querySelector('.notification-wrapper');
        
        if (userMenuElement && !userMenuElement.contains(event.target)) {
          setShowUserMenu(false);
        }
        
        if (notificationElement && !notificationElement.contains(event.target)) {
          setShowNotifications(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
      // Limpar monitoramento global
      if (globalMonitoringInterval) {
        clearInterval(globalMonitoringInterval);
      }
      
      // Limpar serviço de chat
      chatNotificationService.cleanup();
    };
  }, [showUserMenu, showNotifications, isAuthenticated, user, addChatNotification]);

  const handleNotificationClick = (notification) => {
    // Marcar como lida
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Se for notificação de chat, navegar para a conversa
    if (notification.type === 'chat' && notification.conversationId) {
      navigate(`/chat/${notification.conversationId}`);
      setShowNotifications(false);
    }
  };

  const unreadCount = getUnreadCount();
  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial || "Vizinho";

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="section-container nav-container">
        <div className="logo-wrapper" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <Heart fill="white" size={24} />
          </div>
          <span className="logo-text">Solidar<span className="logo-accent">Bairro</span></span>
        </div>
        
        <div className="nav-menu">
          <a href="/#features" className="nav-link">
            Funcionalidades
            <span className="link-underline" />
          </a>
          <a href="/#how-it-works" className="nav-link">
            Como Funciona
            <span className="link-underline" />
          </a>
          <a href="/#about" className="nav-link">
            Missão
            <span className="link-underline" />
          </a>
          
          {!isAuthenticated() ? (
            <div className="auth-group">
              <button 
                className="auth-btn-login"
                onClick={() => navigate('/login')}
              >
                Entrar
              </button>
              <button 
                className="auth-btn-register" 
                onClick={() => navigate('/cadastro')}
              >
                Cadastrar
              </button>
            </div>
          ) : (
            <div className="user-section">
              <div className="notification-wrapper">
                <button 
                  className="notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h3>Notificações</h3>
                      {notifications.length > 0 && (
                        <div className="notification-actions">
                          {unreadCount > 0 && (
                            <button 
                              className="action-btn mark-read-btn"
                              onClick={markAllAsRead}
                              title="Marcar todas como lidas"
                            >
                              ✓
                            </button>
                          )}
                          <button 
                            className="action-btn clear-btn"
                            onClick={clearNotifications}
                            title="Limpar todas"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="no-notifications">
                          Nenhuma notificação ainda
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type === 'chat' ? 'chat-notification' : ''}`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="notification-content">
                              <div className="notification-icon">
                                {notification.type === 'chat' ? '💬' : '🔔'}
                              </div>
                              <div className="notification-text">
                                <p className="notification-title">{notification.title}</p>
                                <p className="notification-message">{notification.message}</p>
                                <span className="notification-time">
                                  {new Date(notification.timestamp).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                            {!notification.read && <div className="unread-dot"></div>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="user-menu-wrapper">
                <button 
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {userName?.substring(0, 2).toUpperCase()}
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {userName?.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <div className="user-name">
                          {userName}
                          {user?.isVerified && (
                            <span className="verified-text">Verificado</span>
                          )}
                        </div>
                        <div className="user-phone">{user?.phone || user?.telefone || user?.email}</div>
                      </div>
                    </div>

                    <div className="user-stats">
                      <div className="stat">
                        <div className="stat-number">{user?.helpedCount || 0}</div>
                        <div className="stat-label">Pessoas ajudadas</div>
                      </div>
                      <div className="stat">
                        <div className="stat-number">{user?.receivedHelpCount || 0}</div>
                        <div className="stat-label">Ajudas recebidas</div>
                      </div>
                    </div>

                    <div className="user-actions">
                      <button 
                        className="menu-item profile-btn"
                        onClick={() => {
                          navigate('/perfil');
                          setShowUserMenu(false);
                        }}
                      >
                        👤 Ver perfil
                      </button>
                      
                      <button 
                        className="menu-item"
                        onClick={() => {
                          navigate('/conversas');
                          setShowUserMenu(false);
                        }}
                      >
                        💬 Minhas conversas
                        {unreadCount > 0 && (
                          <span className="menu-badge">{unreadCount}</span>
                        )}
                      </button>
                      
                      <button 
                        className="menu-item logout-btn"
                        onClick={() => {
                          localStorage.removeItem('solidar-user');
                          window.location.reload();
                        }}
                      >
                        🚪 Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;