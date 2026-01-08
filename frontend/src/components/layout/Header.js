import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import LogoutButton from '../LogoutButton';
import './Header.css';

const Header = ({ showLoginButton = false }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userStats, setUserStats] = useState({ helpedCount: 0, receivedHelpCount: 0 });

  useEffect(() => {
    // Load notifications from localStorage
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem('solidar-notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    };
    
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
    
    loadNotifications();
    if (isAuthenticated()) {
      loadUserStats();
    }

    // Listen for new notifications
    const handleNotificationAdded = () => {
      loadNotifications();
    };
    
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
    
    window.addEventListener('notificationAdded', handleNotificationAdded);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('notificationAdded', handleNotificationAdded);
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
  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <div className="logo-icon">
              <i className="fi fi-rr-heart"></i>
            </div>
            <span className="logo-text">
              Solidar<span className="logo-accent">Bairro</span>
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

              {/* Menu do usuário */}
              <div className="user-menu-wrapper">
                <button 
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {userName.substring(0, 2).toUpperCase()}
                  </div>
                  {user?.isVerified && <span className="verified-badge">✓</span>}
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-avatar-large">
                        {userName.substring(0, 2).toUpperCase()}
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