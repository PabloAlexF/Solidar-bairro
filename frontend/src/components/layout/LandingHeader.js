import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, Bell } from 'lucide-react';

const LandingHeader = ({ showNavLinks = false }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = typeof window !== 'undefined' ? localStorage.getItem('solidar-notifications') : null;
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch (error) {
          console.error('Error parsing notifications:', error);
          setNotifications([]);
        }
      }
    };
    
    loadNotifications();

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
    
    window.addEventListener('notificationAdded', loadNotifications);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('notificationAdded', loadNotifications);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('solidar-notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('solidar-notifications');
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('solidar-notifications', JSON.stringify(updatedNotifications));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial || "Vizinho";

  return (
    <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className={`section-container nav-container`}>
        <div className="logo-wrapper" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <Heart fill="white" size={24} />
          </div>
          <span className="logo-text">Solidar<span className="logo-accent">Bairro</span></span>
        </div>
        
        <div className="nav-menu">
          {showNavLinks && (
            <>
              <a href="#features" className="nav-link">
                Funcionalidades
                <span className="link-underline" />
              </a>
              <a href="#how-it-works" className="nav-link">
                Como Funciona
                <span className="link-underline" />
              </a>
              <a href="#about" className="nav-link">
                Missão
                <span className="link-underline" />
              </a>
            </>
          )}
          
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
                            onClick={clearAllNotifications}
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
                            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                            onClick={() => !notification.read && markAsRead(notification.id)}
                          >
                            <div className="notification-content">
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