import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Heart, Bell, User, LogOut, Settings, Globe, ArrowLeft, X, MessageCircle, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { getSocket } from '../../services/socketService';
import marca from '../../assets/images/marca.png';
import apiService from '../../services/apiService';
import './LandingHeader.css';

const LandingHeader = ({ scrolled = false, showPanelButtons = false, showCadastroButtons = false, showNavLinks = true }) => {
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
  const [userStats, setUserStats] = useState({
    helpedCount: 0,
    receivedHelpCount: 0
  });

  // Verificar se é administrador
  console.log('User data:', { user }); // Debug

  const isAdmin = user?.role === 'admin' ||
                  user?.isAdmin ||
                  user?.tipo === 'admin' ||
                  user?.email === 'admin@solidarbairro.com';

  const showAdminButton = isAdmin;

  console.log('=== LANDING HEADER DEBUG ===');
  console.log('showPanelButtons:', showPanelButtons);
  console.log('isAuthenticated:', isAuthenticated());
  console.log('user:', user);
  console.log('isAdmin:', isAdmin);
  console.log('showAdminButton:', showAdminButton);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu) {
        const userMenuElement = document.querySelector('.user-menu-wrapper');
        const notificationElement = document.querySelector('.notification-wrapper');
        
        if (userMenuElement && !userMenuElement.contains(event.target)) {
          setShowUserMenu(false);
        }
        
      }
      if (showNotifications) {
        const notificationElement = document.querySelector('.notification-wrapper');
        if (notificationElement && !notificationElement.contains(event.target)) {
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  useEffect(() => {
    if (isAuthenticated()) {
      // Iniciar monitoramento via Socket
      const socket = getSocket();
      if (socket) {
        const handleNewNotification = (data) => {
          if (data && (data.type === 'chat' || data.conversationId)) {
            addChatNotification(
              data.conversationId,
              data.senderName || data.title || 'Usuário',
              data.message,
              data.timestamp
            );
          }
        };
        socket.on('notification', handleNewNotification);
        return () => socket.off('notification', handleNewNotification);
      }
    }
  }, [isAuthenticated, user, addChatNotification]);

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

    if (isAuthenticated()) {
      loadUserStats();
    }
  }, [user, isAuthenticated]);

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

  console.log('=== DEBUG FOTO ===');
  console.log('User completo:', user);
  console.log('fotoPerfil:', user?.fotoPerfil);
  console.log('Tipo fotoPerfil:', typeof user?.fotoPerfil);
  
  // Verificar se a foto existe e é válida
  const hasValidPhoto = user?.fotoPerfil && 
                       user.fotoPerfil.trim() !== '' && 
                       user.fotoPerfil !== 'undefined' && 
                       user.fotoPerfil !== 'null' &&
                       (user.fotoPerfil.startsWith('http') || user.fotoPerfil.startsWith('data:'));
  
  console.log('hasValidPhoto:', hasValidPhoto);

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="section-container nav-container">
        {showCadastroButtons && (
          <button
            className="cadastro-back-btn"
            onClick={() => window.history.back()}
            style={{
              background: 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginRight: '12px'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.05)'}
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="logo-wrapper" onClick={() => navigate('/')}>
          <div className="logo-icon" style={{ width: '48px', height: '48px', position: 'relative', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={marca} alt="SolidarBrasil" style={{ width: '80px', height: '80px', objectFit: 'contain', position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          </div>
          <span className="logo-text">Solidar<span className="logo-accent">Brasil</span></span>
        </div>

        <div className="nav-menu">
          {showNavLinks && (
            <>
              <button className="nav-link" onClick={() => navigate('/contato')}>
                Contato
                <span className="link-underline" />
              </button>
            </>
          )}

          {!isAuthenticated() ? (
            <div className="auth-buttons">
              <button
                className="login-btn"
                onClick={() => navigate('/login')}
                style={{
                  background: 'linear-gradient(135deg, #64748b, #475569)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginRight: '8px'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Entrar
              </button>
              <button
                className="register-btn"
                onClick={() => navigate('/cadastro')}
                style={{
                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Cadastrar
              </button>
            </div>
          ) : isAuthenticated() ? (
            <>
              {showAdminButton && (
                <>
                  <button
                    onClick={() => navigate('/painel-social')}
                    title="Painel Social"
                    className="panel-icon-button"
                  >
                    <Globe size={20} />
                  </button>
                  <button
                    onClick={() => navigate('/admin')}
                    title="Painel Admin"
                    className="panel-icon-button admin"
                  >
                    <Settings size={20} />
                  </button>
                </>
              )}

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
                            if (notification.timestamp && notification.timestamp.seconds) {
                              time = new Date(notification.timestamp.seconds * 1000);
                            } else {
                              time = new Date(notification.timestamp);
                            }
                            if (isNaN(time.getTime())) return 'Data inválida';

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

              <div className="user-menu-wrapper">
                <button
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {(() => {
                      console.log('=== RENDERIZANDO AVATAR ===');
                      console.log('user?.fotoPerfil:', user?.fotoPerfil);
                      console.log('Existe fotoPerfil:', !!user?.fotoPerfil);

                      if (user?.fotoPerfil) {
                        console.log('Renderizando IMAGEM');
                        return (
                          <img
                            src={user.fotoPerfil}
                            alt="Foto do perfil"
                            className="avatar-image"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                            onLoad={() => console.log('Imagem carregou com sucesso!')}
                            onError={(e) => {
                              console.log('ERRO ao carregar imagem:', user.fotoPerfil);
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = userName?.substring(0, 2).toUpperCase();
                            }}
                          />
                        );
                      } else {
                        console.log('Renderizando INICIAIS:', userName?.substring(0, 2).toUpperCase());
                        return userName?.substring(0, 2).toUpperCase();
                      }
                    })()}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {hasValidPhoto ? (
                          <img
                            src={user.fotoPerfil}
                            alt="Foto do perfil"
                            className="avatar-image-large"
                            onError={(e) => {
                              console.log('Erro ao carregar imagem grande:', user.fotoPerfil);
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = userName?.substring(0, 2).toUpperCase();
                            }}
                          />
                        ) : (
                          userName?.substring(0, 2).toUpperCase()
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

                      {showAdminButton && (
                        <button
                          className="menu-item admin-btn"
                          onClick={() => {
                            navigate('/admin');
                            setShowUserMenu(false);
                          }}
                        >
                          ⚙️ Dashboard Admin
                        </button>
                      )}

                      <button
                        className="menu-item logout-btn"
                        onClick={async () => {
                          try {
                            await logout();
                            navigate('/');
                          } catch (error) {
                            console.error('Erro ao fazer logout:', error);
                            // Mesmo com erro, redirecionar
                            navigate('/');
                          }
                        }}
                      >
                        🚪 Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;