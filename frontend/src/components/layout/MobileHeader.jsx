import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { SecurityUtils } from '../../utils/security';
import logo from '../../assets/images/marca.png';
import { 
  Menu, 
  X, 
  Heart, 
  ArrowRight, 
  User, 
  HandHelping, 
  MapPin,
  Home,
  MessageSquare,
  Settings,
  Bell,
  Clock,
  Globe
} from 'lucide-react';
import './MobileHeader.css';

const MobileHeader = ({ title = "SolidarBrasil", showBackButton = false, backPath = "/" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, clearNotifications, getUnreadCount } = useNotifications();
  const unreadCount = getUnreadCount();

  // Verificar se é administrador
  const isAdmin = user?.role === 'admin' || user?.isAdmin || user?.tipo === 'admin';

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className={`mob-header-overlay ${mobileMenuOpen ? "mob-active" : ""}`} onClick={() => setMobileMenuOpen(false)} />
      
      <aside className={`mob-sidebar ${mobileMenuOpen ? "mob-open" : ""}`}>
        <div className="mob-sidebar-header">
          <div className="mob-logo">
            <img src={logo} alt="SolidarBrasil" style={{ width: '40px', height: '40px' }} />
            <span>SolidarBrasil</span>
          </div>
        </div>
        <nav className="mob-sidebar-nav">
          <button className="mob-nav-btn" onClick={() => handleNavigation('/')}>
            <Home size={20} />
            <span>Início</span>
          </button>
          {isAdmin && (
            <button className="mob-nav-btn" onClick={() => handleNavigation('/admin')}>
              <Settings size={20} />
              <span>Dashboard Admin</span>
            </button>
          )}
          <button className="mob-nav-btn" onClick={() => handleNavigation('/perfil')}>
            <User size={20} />
            <span>Meu Perfil</span>
          </button>
          <button className="mob-nav-btn" onClick={() => handleNavigation('/quero-ajudar')}>
            <HandHelping size={20} />
            <span>Quero Ajudar</span>
          </button>
          <button className="mob-nav-btn" onClick={() => handleNavigation('/preciso-de-ajuda')}>
            <Heart size={20} />
            <span>Preciso de Ajuda</span>
          </button>
          <button className="mob-nav-btn" onClick={() => handleNavigation('/achados-e-perdidos')}>
            <MapPin size={20} />
            <span>Achados e Perdidos</span>
          </button>
          <button className="mob-nav-btn" onClick={() => handleNavigation('/conversas')}>
            <MessageSquare size={20} />
            <span>Conversas</span>
          </button>
          <button className="mob-nav-btn" onClick={() => handleNavigation('/')}>
            <Globe size={20} />
            <span>Voltar ao Site</span>
          </button>
        </nav>
        <button className="mob-logout-btn" onClick={() => {
          SecurityUtils.clearUserSession();
          handleNavigation('/login');
        }}>
          <ArrowRight size={20} />
          <span>Sair</span>
        </button>
      </aside>

      <header className="mob-header">
        <button className="mob-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="mob-header-title">
          {title === "SolidarBrasil" ? (
            <img src={logo} alt="SolidarBrasil" style={{ height: '36px' }} />
          ) : (
            <h1>{title}</h1>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => setShowNotifications(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '4px'
            }}
          >
            <Bell size={24} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: '#ef4444',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                minWidth: '16px',
                height: '16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid white'
              }}>{unreadCount}</span>
            )}
          </button>
          {showBackButton && (
            <button className="mob-back-btn" onClick={() => navigate(backPath)}>
              <ArrowRight size={22} />
            </button>
          )}
        </div>
      </header>

      {showNotifications && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backdropFilter: 'blur(8px)',
          animation: 'modalFadeIn 0.3s ease-out'
        }} onClick={() => setShowNotifications(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '340px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fff'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: '700' }}>Notificações</h3>
              {notifications.length > 0 && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={markAllAsRead} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#0d9488', fontSize: '0.9rem', fontWeight: '600' }}>Lidas</button>
                  <button onClick={clearNotifications} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.9rem', fontWeight: '600' }}>Limpar</button>
                </div>
              )}
            </div>

            <div style={{ overflowY: 'auto', padding: '0', flex: 1 }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ marginBottom: '12px', fontSize: '24px' }}>🔕</div>
                  <p style={{ margin: 0 }}>Nenhuma notificação no momento</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} 
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.type === 'chat' && n.conversationId) {
                        navigate(`/chat/${n.conversationId}`);
                        setShowNotifications(false);
                      }
                    }}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: n.read ? 'white' : '#f0fdfa',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        minWidth: '36px', 
                        height: '36px', 
                        borderRadius: '10px', 
                        background: n.type === 'chat' ? '#e0f2fe' : '#f1f5f9',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}>
                        {n.type === 'chat' ? '💬' : '🔔'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: n.read ? '500' : '700', color: '#1e293b', fontSize: '0.95rem', marginBottom: '4px' }}>{n.title}</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.4' }}>{n.message}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={10} />
                          {new Date(n.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0d9488', marginTop: '6px' }} />}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' }}>
               <button onClick={() => setShowNotifications(false)} style={{
                 background: 'white', 
                 border: '1px solid #e2e8f0', 
                 color: '#64748b', 
                 fontWeight: '600', 
                 padding: '12px', 
                 width: '100%',
                 borderRadius: '12px',
                 cursor: 'pointer'
               }}>Fechar</button>
            </div>

          </div>
        </div>
      )}
      <style>
        {`
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalPop {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default MobileHeader;