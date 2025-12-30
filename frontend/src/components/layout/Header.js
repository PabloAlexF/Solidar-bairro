import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import '../../styles/responsive/header-responsive.css';


const Header = ({ showLoginButton = true }) => {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Carregar usuário do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('solidar-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao parsear usuário do localStorage:', error);
        localStorage.removeItem('solidar-user');
      }
    }

    // Load notifications from localStorage
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem('solidar-notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    };
    
    loadNotifications();

    // Listen for custom login event from Home page
    const handleOpenLogin = () => {
      setIsAuthOpen(true);
    };
    
    // Listen for new notifications
    const handleNotificationAdded = () => {
      loadNotifications();
    };
    
    // Listen for user updates
    const handleUserUpdated = () => {
      const savedUser = localStorage.getItem('solidar-user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Erro ao parsear usuário do localStorage:', error);
          localStorage.removeItem('solidar-user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
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
    
    window.addEventListener('openLogin', handleOpenLogin);
    window.addEventListener('notificationAdded', handleNotificationAdded);
    window.addEventListener('userUpdated', handleUserUpdated);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('openLogin', handleOpenLogin);
      window.removeEventListener('notificationAdded', handleNotificationAdded);
      window.removeEventListener('userUpdated', handleUserUpdated);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (name && phone) {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        phone,
        userType: 'cidadao',
        isVerified: false,
        helpedCount: 0,
        receivedHelpCount: 0,
        badges: [],
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('solidar-user', JSON.stringify(newUser));
      window.dispatchEvent(new CustomEvent('userUpdated'));
      setIsAuthOpen(false);
      setIsVerifyOpen(true);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (verificationCode === '1234') {
      const verifiedUser = { ...user, isVerified: true };
      setUser(verifiedUser);
      localStorage.setItem('solidar-user', JSON.stringify(verifiedUser));
      window.dispatchEvent(new CustomEvent('userUpdated'));
      setIsVerifyOpen(false);
      setVerificationCode('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('solidar-user');
    window.dispatchEvent(new CustomEvent('userUpdated'));
    setName('');
    setPhone('');
    setShowUserMenu(false);
    navigate('/');
  };

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

  return (
    <>
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

            {showLoginButton && !user && (
              <div style={{ display: 'none' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsAuthOpen(true)}
                >
                  Entrar
                </button>
              </div>
            )}

            {user && (user.nome || user.nomeCompleto || user.name || user.nomeFantasia || user.razaoSocial) && (
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
                      {(user.name || user.nomeCompleto || user.nomeFantasia || user.razaoSocial || '??').substring(0, 2).toUpperCase()}
                    </div>
                    {user.isVerified && <span className="verified-badge">✓</span>}
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <div className="user-avatar-large">
                          {(user.name || user.nomeCompleto || user.nomeFantasia || user.razaoSocial || '??').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="user-details">
                          <div className="user-name">
                            {user.name || user.nomeCompleto || user.nomeFantasia || user.razaoSocial || 'Usuário'}
                            {user.isVerified && (
                              <span className="verified-text">Verificado</span>
                            )}
                          </div>
                          <div className="user-phone">{user.phone || user.telefone || 'Telefone não informado'}</div>
                        </div>
                      </div>

                      <div className="user-stats">
                        <div className="stat">
                          <div className="stat-number">{user.helpedCount}</div>
                          <div className="stat-label">Pessoas ajudadas</div>
                        </div>
                        <div className="stat">
                          <div className="stat-number">{user.receivedHelpCount}</div>
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
                        
                        {!user.isVerified && (
                          <button 
                            className="menu-item verify-btn"
                            onClick={() => {
                              setIsVerifyOpen(true);
                              setShowUserMenu(false);
                            }}
                          >
                            🛡️ Verificar telefone
                          </button>
                        )}
                        
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
                          onClick={handleLogout}
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

      {/* Modal de Login */}
      {isAuthOpen && (
        <div className="modal-overlay auth-modal" onClick={() => setIsAuthOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">🚀</div>
              <h2>Bem-vindo!</h2>
              <p>Conecte-se à nossa plataforma de solidariedade comunitária.</p>
            </div>
            
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Seu nome</label>
                <input
                  type="text"
                  placeholder="Ex: Maria Silva"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Telefone / WhatsApp</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary btn-lg">
                Iniciar jornada
              </button>
              
              <div className="auth-footer">
                <span>Novo por aqui? </span>
                <button 
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setIsAuthOpen(false);
                    navigate('/cadastro');
                  }}
                >
                  Criar conta
                </button>
              </div>
            </form>
            
            <button 
              className="modal-close"
              onClick={() => setIsAuthOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modal de Verificação */}
      {isVerifyOpen && (
        <div className="modal-overlay verify-modal" onClick={() => setIsVerifyOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon verify-icon">🛡️</div>
              <h2>Verificação</h2>
              <p>Código enviado para {user?.phone || phone}. Digite para confirmar.</p>
            </div>
            
            <form onSubmit={handleVerify} className="verify-form">
              <div className="form-group">
                <label>Código de verificação</label>
                <input
                  type="text"
                  placeholder="1234"
                  className="form-input code-input"
                  maxLength={4}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  required
                />
                <p className="code-hint">Para teste, use: <strong>1234</strong></p>
              </div>
              
              <button type="submit" className="btn btn-success btn-lg">
                Ativar conta
              </button>
            </form>
            
            <div className="verify-info">
              <span className="verify-icon">✓</span>
              <p>Contas verificadas têm maior credibilidade na plataforma.</p>
            </div>
            
            <button 
              className="modal-close"
              onClick={() => setIsVerifyOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;