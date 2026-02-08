import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, X, Clock, CheckCircle, AlertCircle, MessageCircle, Heart, Settings, Shield, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/apiService';
import { getSocket } from '../services/socketService';
import marca from '../assets/images/marca.png';

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

const SharedHeader = ({ currentPage = '' }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Load notifications on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
    }
  }, [isAuthenticated, user]);

  const loadNotifications = async () => {
    try {
      const response = await ApiService.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const renderNavigationLinks = () => {
    if (currentPage === 'landing') {
      return (
        <nav className="header-nav">
          <Link to="/quero-ajudar" className="nav-link">Quero Ajudar</Link>
          <Link to="/achados-e-perdidos" className="nav-link">Achados e Perdidos</Link>
          <Link to="/preciso-de-ajuda" className="nav-link">Preciso de Ajuda</Link>
        </nav>
      );
    } else if (currentPage === 'quero-ajudar') {
      return (
        <nav className="header-nav">
          <Link to="/preciso-de-ajuda" className="nav-link">Preciso de Ajuda</Link>
          <Link to="/perfil" className="nav-link">Perfil</Link>
          <Link to="/conversas" className="nav-link">Conversas</Link>
        </nav>
      );
    }
    return null;
  };

  return (
    <header className="shared-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/">
            <img src={marca} alt="SolidarBairro" className="logo-image" />
          </Link>
        </div>

        {/* Navigation Links */}
        {renderNavigationLinks()}

        {/* Right Section */}
        <div className="header-right">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="notification-wrapper">
                <button
                  className="notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="notification-badge">{notifications.length}</span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h3>Notificações</h3>
                      {notifications.length > 0 && (
                        <button
                          className="clear-btn"
                          onClick={() => setNotifications([])}
                        >
                          Limpar
                        </button>
                      )}
                    </div>
                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="no-notifications">Nenhuma notificação</div>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification.id} className="notification-item">
                            <div className="notification-icon">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                              <p className="notification-title">{notification.title}</p>
                              <p className="notification-message">{notification.message}</p>
                              <span className="notification-time">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="user-menu-wrapper">
                <button
                  className="user-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User size={20} />
                </button>

                {showUserMenu && (
                  <div className="user-menu-dropdown">
                    <div className="user-info">
                      <span className="user-name">{user?.nome || 'Usuário'}</span>
                      <span className="user-email">{user?.email}</span>
                    </div>
                    <div className="menu-items">
                      <button onClick={() => navigate('/perfil')}>
                        <User size={16} />
                        Perfil
                      </button>
                      <button onClick={() => navigate('/conversas')}>
                        <MessageCircle size={16} />
                        Conversas
                      </button>
                      <button onClick={handleLogout}>
                        <LogOut size={16} />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">Entrar</Link>
              <Link to="/cadastro" className="auth-link primary">Cadastrar</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SharedHeader;
