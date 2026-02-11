import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Bell, MessageCircle, Heart, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import apiService from '../../services/apiService';
import { getSocket } from '../../services/socketService';
import logo from '../../assets/images/marca.png';
import '../../styles/components/Header.css';

const Header = ({ showLoginButton = false }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
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

  useEffect(() => {
    if (isAuthenticated()) {
      // Load user stats
      const loadUserStats = async () => {
        if (user?.uid || user?.id) {
          try {
            const pedidosResponse = await apiService.getMeusPedidos();
            const receivedHelpCount = pedidosResponse?.data?.length || 0;
            
            const interessesResponse = await apiService.getMeusInteresses();
            const helpedCount = interessesResponse?.data?.length || 0;
            
            setUserStats({ helpedCount, receivedHelpCount });
          } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
          }
        }
      };

      loadUserStats();

      // Iniciar monitoramento via Socket (Substituindo o serviço antigo)
      const socket = getSocket();
      
      if (socket) {
        const handleNewNotification = (data) => {
          // Verifica se é uma notificação de chat e adiciona
          if (data && (data.type === 'chat' || data.conversationId || data.data?.conversationId)) {
            const conversationId = data.conversationId || data.data?.conversationId;
            const senderName = data.senderName || data.data?.senderName || data.title || 'Usuário';
            
            addChatNotification(
              conversationId, 
              senderName, 
              data.message
            );
          }
        };
        
        socket.on('notification', handleNewNotification);
        
        return () => {
          socket.off('notification', handleNewNotification);
        };
      }
    }
  }, [isAuthenticated, user, addChatNotification]);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      const userMenuElement = document.querySelector('.user-menu-wrapper');
      if (showUserMenu && userMenuElement && !userMenuElement.contains(event.target)) {
        setShowUserMenu(false);
      }
      
      const notificationElement = document.querySelector('.notification-wrapper');
      if (showNotifications && notificationElement && !notificationElement.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  const handleNotificationClick = (notification) => {
    // Marcar como lida
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Se for notificação de chat, navegar para a conversa
    const conversationId = notification.conversationId || notification.data?.conversationId;
    if (notification.type === 'chat' && conversationId) {
      navigate(`/chat/${conversationId}`);
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
                    <div className="notification-dropdown-improved">
                      <div className="notification-header-improved">
                        <div className="notification-title-section">
                          <h3>Notificações</h3>
                          {unreadCount > 0 && (
                            <span className="unread-count">{unreadCount} não lidas</span>
                          )}
                        </div>
                        <button
                          className="notification-close-btn"
                          onClick={() => setShowNotifications(false)}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {notifications.length === 0 ? (
                        <div className="notification-empty-improved">
                          <Bell size={32} className="empty-icon" />
                          <p className="empty-title">Nenhuma notificação</p>
                          <p className="empty-subtitle">Você receberá notificações sobre mensagens e atividades aqui</p>
                        </div>
                      ) : (
                        <>
                          <div className="notification-list-improved">
                            {notifications.slice(0, 10).map((notification) => {
                              const timeAgo = (() => {
                                const now = new Date();
                                let time;

                                // Verificar se é um timestamp do Firebase (objeto com seconds)
                                if (notification.timestamp && typeof notification.timestamp === 'object' && notification.timestamp.seconds) {
                                  time = new Date(notification.timestamp.seconds * 1000);
                                }
                                // Verificar se é uma string ISO
                                else if (typeof notification.timestamp === 'string') {
                                  time = new Date(notification.timestamp);
                                }
                                // Verificar se é um método toDate (Firebase Timestamp)
                                else if (notification.timestamp && notification.timestamp.toDate) {
                                  time = notification.timestamp.toDate();
                                }
                                // Fallback para data atual
                                else {
                                  time = new Date();
                                }

                                if (isNaN(time.getTime())) return 'Data desconhecida';

                                const diffInMinutes = Math.floor((now - time) / (1000 * 60));

                                if (diffInMinutes < 1) return 'Agora mesmo';
                                if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;

                                const diffInHours = Math.floor(diffInMinutes / 60);
                                if (diffInHours < 24) return `${diffInHours}h atrás`;

                                const diffInDays = Math.floor(diffInHours / 24);
                                if (diffInDays < 7) return `${diffInDays}d atrás`;

                                return time.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                              })();

                              const getNotificationIcon = (type) => {
                                switch (type) {
                                  case 'chat': return <MessageCircle size={16} className="text-blue-500" />;
                                  case 'help': return <Heart size={16} className="text-red-500" />;
                                  case 'success': return <CheckCircle2 size={16} className="text-green-500" />;
                                  case 'warning': return <AlertTriangle size={16} className="text-orange-500" />;
                                  default: return <Bell size={16} className="text-gray-500" />;
                                }
                              };

                              return (
                                <div
                                  key={notification.id}
                                  className={`notification-item-improved ${!notification.read ? 'unread' : ''}`}
                                  onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                  <div className="notification-icon-improved">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="notification-content-improved">
                                    <div className="notification-item-header">
                                      <h4 className="notification-item-title">{notification.title}</h4>
                                      <span className="notification-time">
                                        <Clock size={12} />
                                        {timeAgo}
                                      </span>
                                    </div>
                                    <p className="notification-item-message">{notification.message}</p>
                                  </div>
                                  {!notification.read && <div className="unread-dot" />}
                                </div>
                              );
                            })}
                          </div>

                          <div className="notification-footer-improved">
                            <button
                              onClick={clearNotifications}
                              className="clear-all-btn"
                            >
                              Limpar todas
                            </button>
                            {notifications.length > 10 && (
                              <span className="more-notifications">
                                +{notifications.length - 10} mais
                              </span>
                            )}
                          </div>
                        </>
                      )}
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
                      
                      <button 
                        className="menu-item logout-btn"
                        onClick={async () => {
                          const socket = getSocket();
                          if (socket) socket.disconnect();
                          if (logout) await logout();
                          navigate('/login');
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
    </header>
  );
};

export default Header;