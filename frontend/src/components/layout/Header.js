import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import apiService from '../../services/apiService';
import chatNotificationService from '../../services/chatNotificationService';
import LogoutButton from '../LogoutButton';
import logo from '../../assets/images/marca.png';
import '../../styles/components/Header.css';

const Header = ({ showLoginButton = false }) => {
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
  const [userStats, setUserStats] = useState({ helpedCount: 0, receivedHelpCount: 0 });
  const [globalMonitoringInterval, setGlobalMonitoringInterval] = useState(null);

  useEffect(() => {
    // Load user stats
    const loadUserStats = async () => {
      if (user?.uid || user?.id) {
        try {
          // Buscar pedidos do usuário (ajudas recebidas)
          const pedidosResponse = await apiService.getMeusPedidos();
          const receivedHelpCount = pedidosResponse?.data?.length || 0;
          
          // Buscar interesses do usuário (pessoas ajudadas)
          const interessesResponse = await apiService.getMeusInteresses();
          const helpedCount = interessesResponse?.data?.length || 0;
          
          setUserStats({ helpedCount, receivedHelpCount });
        } catch (error) {
          console.error('Erro ao carregar estatísticas:', error);
        }
      }
    };
    
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
      loadUserStats();
      startChatMonitoring();
    }

    // Close dropdowns when clicking outside
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
  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial;
  const userPhoto = user?.fotoPerfil;
  
  // Verificar se a foto existe e é válida
  const hasValidPhoto = userPhoto && 
                       userPhoto.trim() !== '' && 
                       userPhoto !== 'undefined' && 
                       userPhoto !== 'null' &&
                       (userPhoto.startsWith('http') || userPhoto.startsWith('data:'));

  console.log('User data no header:', { userName, userPhoto, user, hasValidPhoto });

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <div className="logo-icon">
              <img src={logo} alt="SolidarBrasil" style={{ width: '40px', height: '40px' }} />
            </div>
            <span className="logo-text">
              Solidar<span className="logo-accent">Brasil</span>
            </span>
          </div>

          {!isAuthenticated() && showLoginButton && (
            <div className="auth-buttons">
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/login')}
              >
                Entrar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/cadastro')}
              >
                Cadastrar
              </button>
            </div>
          )}

          {isAuthenticated() && userName && (
            <div className="user-section">
              {/* Notificações */}
              <div className="notification-wrapper">
                <button 
                  className="notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  🔔
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

              {/* Menu do usuário */}
              <div className="user-menu-wrapper">
                <button 
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {hasValidPhoto ? (
                      <img 
                        src={userPhoto} 
                        alt="Perfil" 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          console.log('Erro ao carregar imagem:', userPhoto);
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = userName.substring(0, 2).toUpperCase();
                        }}
                      />
                    ) : (
                      userName.substring(0, 2).toUpperCase()
                    )}
                  </div>
                  {user?.isVerified && <span className="verified-badge">✓</span>}
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {hasValidPhoto ? (
                          <img 
                            src={userPhoto} 
                            alt="Perfil" 
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            onError={(e) => {
                              console.log('Erro ao carregar imagem grande:', userPhoto);
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = userName.substring(0, 2).toUpperCase();
                            }}
                          />
                        ) : (
                          userName.substring(0, 2).toUpperCase()
                        )}
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
                        <div className="stat-number">{userStats.helpedCount}</div>
                        <div className="stat-label">Pessoas ajudadas</div>
                      </div>
                      <div className="stat">
                        <div className="stat-number">{userStats.receivedHelpCount}</div>
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
                      
                      <LogoutButton className="menu-item logout-btn">
                        🚪 Sair
                      </LogoutButton>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;