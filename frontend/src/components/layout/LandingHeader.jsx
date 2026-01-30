import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Heart, Bell, User, LogOut, Settings, Globe, ArrowLeft } from 'lucide-react';
import chatNotificationService from '../../services/chatNotificationService';
import './LandingHeader.css';

const LandingHeader = ({ scrolled = false, showPanelButtons = false, showCadastroButtons = false }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  console.log('=== LANDING HEADER DEBUG ===');
  console.log('showPanelButtons:', showPanelButtons);
  console.log('isAuthenticated:', isAuthenticated());
  console.log('user:', user);
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

  // Verificar se é administrador
  const storedUser = JSON.parse(localStorage.getItem('solidar-user') || '{}');
  console.log('User data:', { user, storedUser }); // Debug
  
  const isAdmin = user?.role === 'admin' || 
                  user?.isAdmin || 
                  user?.tipo === 'admin' || 
                  user?.email === 'admin@solidarbairro.com' ||
                  storedUser?.role === 'admin' || 
                  storedUser?.isAdmin || 
                  storedUser?.tipo === 'admin' ||
                  storedUser?.email === 'admin@solidarbairro.com';
  
  const showAdminButton = true; // Forçar sempre

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
          <div className="logo-icon">
            <Heart fill="white" size={24} />
          </div>
          <span className="logo-text">Solidar<span className="logo-accent">Brasil</span></span>
        </div>

        <div className="nav-menu">
          <a href="/#features" className="nav-link">
            Funcionalidades
            <span className="link-underline" />
          </a>
          <button className="nav-link" onClick={() => navigate('/quero-ajudar')}>
            Quero Ajudar
            <span className="link-underline" />
          </button>
          <button className="nav-link" onClick={() => navigate('/preciso-de-ajuda')}>
            Preciso de Ajuda
            <span className="link-underline" />
          </button>
          <button className="nav-link" onClick={() => navigate('/achados-perdidos')}>
            <span className="link-underline" />
          </button>
          
          {showPanelButtons && (
            <div className="panel-buttons-container">
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
            </div>
          )}
          
          {showCadastroButtons ? (
            <button
              className="cadastro-login-btn"
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #64748b, #475569)',
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
              Entrar
            </button>
          ) : !isAuthenticated() && !showPanelButtons ? (
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
          ) : isAuthenticated() ? (
            <>
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
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default LandingHeader;