import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import chatNotificationService from '../../services/chatNotificationService';
import marca from '../../assets/images/marca.png';
import {
  Heart,
  HandHelping,
  Search,
  MapPin,
  Navigation,
  Bell,
  User,
  ArrowRight,
  ChevronRight,
  Zap,
  Sparkles,
  Home,
  PlusCircle,
  MessageSquare,
  Coffee,
  Key,
  Instagram,
  Twitter,
  Facebook,
  Settings,
  Shield,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

import './mobile.css';

const NeighborhoodRadar = ({ size = "normal" }) => {
  return (
    <div className={`radar-container ${size}`}>
      <div className="radar-circle">
        <div
          className="radar-ping"
          style={{
            animation: 'radarPing 4s infinite ease-out'
          }}
        />
        <div
          className="radar-ping"
          style={{
            animation: 'radarPing 4s infinite ease-out 2s'
          }}
        />
        <div className="radar-center">
          <Navigation size={size === "small" ? 16 : 20} fill="currentColor" />
        </div>

        {[
          { top: '20%', left: '30%', delay: 0.5 },
          { top: '60%', left: '20%', delay: 1.2 },
          { top: '40%', left: '80%', delay: 0.8 },
          { top: '75%', left: '65%', delay: 2.1 },
          { top: '15%', left: '70%', delay: 1.5 },
        ].map((pos, i) => (
          <div
            key={i}
            className="neighbor-dot"
            style={{
              top: pos.top,
              left: pos.left,
              animation: `neighborDot 3s infinite ease-in-out ${pos.delay}s`
            }}
          >
            <div className="dot-core" />
          </div>
        ))}
      </div>

      {size === "normal" && (
        <div className="radar-info">
          <div className="info-badge">
            <MapPin size={12} />
            <span>Bairro de Pinheiros</span>
          </div>
          <h4>12 Vizinhos online</h4>
        </div>
      )}
    </div>
  );
};

const PulseFeed = () => {
  const activities = [
    { name: "Maria", action: "ajudou com compras", time: "2 min", color: "#0d9488", icon: <Zap size={16} /> },
    { name: "João", action: "precisa de furadeira", time: "5 min", color: "#f97316", icon: <Coffee size={16} /> },
    { name: "Ana", action: "encontrou chaves", time: "10 min", color: "#8b5cf6", icon: <Key size={16} /> }
  ];

  return (
    <div className="mobile-pulse-feed">
      <div className="feed-header">
        <Sparkles size={16} />
        <span>Acontecendo Agora</span>
      </div>
      {activities.map((act, i) => (
        <div
          key={i}
          className="pulse-card"
          style={{
            animation: `slideInLeft 0.5s ease-out ${i * 0.1}s both`
          }}
        >
          <div className="pulse-avatar" style={{ background: act.color }}>
            {act.icon}
          </div>
          <div className="pulse-info">
            <h5>{act.name}</h5>
            <p>{act.action}</p>
          </div>
          <div className="pulse-time">{act.time}</div>
        </div>
      ))}
    </div>
  );
};

const MobileNav = () => {
  const navigate = useNavigate();

  const navItems = [
    { icon: <Home size={22} />, label: 'Início', path: '/' },
    { icon: <HandHelping size={22} />, label: 'Ajuda', path: '/quero-ajudar' },
    { icon: <PlusCircle size={28} />, label: 'Criar', path: '/preciso-de-ajuda', fab: true },
    { icon: <MessageSquare size={22} />, label: 'Chat', path: '/conversas' },
    { icon: <User size={22} />, label: 'Perfil', path: '/perfil' },
  ];

  return (
    <div
      className="mobile-nav-bar"
      style={{
        animation: 'slideUp 0.5s ease-out'
      }}
    >
      {navItems.map((item, idx) => (
        <button
          key={idx}
          onClick={() => navigate(item.path)}
          className={`mobile-nav-item ${item.fab ? 'mobile-nav-fab' : ''}`}
        >
          <div className={item.fab ? 'fab-inner' : ''}>
            {item.icon}
          </div>
          {!item.fab && <span>{item.label}</span>}
        </button>
      ))}
    </div>
  );
};

export default function MobileLandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications, markAsRead, markAllAsRead, clearNotifications, getUnreadCount, addChatNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = getUnreadCount();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  // Monitoramento de notificações e som
  useEffect(() => {
    let monitoringInterval = null;

    const startChatMonitoring = () => {
      if (isAuthenticated() && (user?.uid || user?.id)) {
        const userId = user.uid || user.id;
        
        const handleNewChatMessage = (conversationId, senderName, message) => {
          addChatNotification(conversationId, senderName, message);
          
          // Feedback sonoro e tátil
          try {
            // Tenta tocar o som (certifique-se de ter um arquivo notification.mp3 na pasta public)
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => console.log('Reprodução de áudio bloqueada pelo navegador', e));
            
            // Vibração (funciona na maioria dos Androids via Chrome/Firefox)
            if (navigator.vibrate) {
              navigator.vibrate(200);
            }
          } catch (error) {
            console.error('Erro ao notificar:', error);
          }
        };
        
        monitoringInterval = chatNotificationService.startGlobalMessageMonitoring(
          userId, 
          handleNewChatMessage
        );
      }
    };
    
    if (isAuthenticated()) {
      startChatMonitoring();
    }

    return () => {
      if (monitoringInterval) clearInterval(monitoringInterval);
      chatNotificationService.cleanup();
    };
  }, [isAuthenticated, user, addChatNotification]);

  // Atualizar Favicon com badge de notificações
  useEffect(() => {
    const updateFavicon = () => {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);

      // Salvar favicon original na primeira execução
      if (!window.originalFaviconHref) {
        window.originalFaviconHref = link.href;
      }

      if (unreadCount === 0) {
        if (window.originalFaviconHref) link.href = window.originalFaviconHref;
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = marca; // Usar logo do app como base

      img.onload = () => {
        ctx.clearRect(0, 0, 32, 32);
        ctx.drawImage(img, 0, 0, 32, 32);
        
        // Desenhar badge
        ctx.beginPath();
        ctx.arc(24, 8, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        link.href = canvas.toDataURL('image/png');
      };
    };

    updateFavicon();
  }, [unreadCount]);

  // Verificar se é administrador
  const isAdmin = user?.role === 'admin' ||
                  user?.isAdmin ||
                  user?.tipo === 'admin' ||
                  user?.email === 'admin@solidarbairro.com';

  return (
    <div className="mobile-landing-exclusive">
      <header className="mobile-hero">
        <div className="mobile-header-top">
          <div className="logo-wrapper" onClick={() => navigate('/')}>
            <div className="logo-icon" style={{ width: '40px', height: '40px', position: 'relative', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={marca} alt="SolidarBrasil" style={{ width: '60px', height: '60px', objectFit: 'contain', position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            </div>
            <span className="logo-text">Solidar<span className="logo-accent">Brasil</span></span>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px' }}>
            {!isAuthenticated() ? (
              <div className="auth-buttons">
                <button
                  className="header-login"
                  onClick={() => navigate('/login')}
                  style={{ background: 'linear-gradient(135deg, #0d9488, #14b8a6)', border: 'none', color: 'white', padding: '8px 20px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <User size={16} />
                  Entrar
                </button>
              </div>
            ) : isAdmin ? (
              <>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)' }}
                  >
                    <Settings size={20} />
                  </button>
                  {showAdminMenu && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setShowAdminMenu(false)} />
                      <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', padding: '8px', minWidth: '200px', zIndex: 99, border: '1px solid #f1f5f9', animation: 'modalFadeIn 0.2s ease-out' }}>
                        <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>Menu Admin</span>
                        </div>
                        <button onClick={() => navigate('/admin')} className="admin-menu-item">
                          <div style={{ background: '#f3e8ff', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                            <LayoutDashboard size={18} color="#7c3aed" />
                          </div>
                          Dashboard
                        </button>
                        <button onClick={() => navigate('/painel-social')} className="admin-menu-item">
                          <div style={{ background: '#ccfbf1', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                            <Shield size={18} color="#0d9488" />
                          </div>
                          Painel Social
                        </button>
                        <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                        <button onClick={() => setShowLogoutModal(true)} className="admin-menu-item logout">
                          <div style={{ background: '#fee2e2', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                            <LogOut size={18} color="#ef4444" />
                          </div>
                          Sair
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(true)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '6px', right: '6px', background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', minWidth: '16px', height: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #f8fafc' }}>{unreadCount}</span>
                  )}
                </button>
                <button
                  className="user-avatar-btn"
                  onClick={() => navigate('/perfil')}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)', padding: 0 }}
                >
                  {(user?.nome || user?.nomeCompleto || 'U').substring(0, 2).toUpperCase()}
                </button>
              </>
            ) : (
              <div className="user-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%' }}>
                <button
                  onClick={() => setShowNotifications(true)}
                  style={{ background: 'transparent', border: 'none', color: '#64748b', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: '6px', right: '6px', background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', minWidth: '16px', height: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #f8fafc' }}>{unreadCount}</span>
                  )}
                </button>
                <button
                  className="user-avatar-btn"
                  onClick={() => navigate('/perfil')}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #0d9488, #14b8a6)', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)', padding: 0 }}
                >
                  {(user?.nome || user?.nomeCompleto || 'U').substring(0, 2).toUpperCase()}
                </button>
                <button
                  className="logout-btn"
                  onClick={() => setShowLogoutModal(true)}
                  style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)', padding: 0 }}
                  title="Sair"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

        </div>

        <div className="hero-content">
          <div
            className="hero-tag"
            style={{
              animation: 'fadeInUp 0.5s ease-out'
            }}
          >
            <Zap size={14} fill="currentColor" />
            <span>NO SEU BAIRRO AGORA</span>
          </div>

          <h1
            style={{
              animation: 'fadeInUp 0.5s ease-out 0.1s both'
            }}
          >
            Solidariedade <br /><span>a poucos passos.</span>
          </h1>

            <div className="quick-actions-grid">
              <div className="quick-card teal" onClick={() => navigate('/quero-ajudar')}>
                <div className="card-top">
                  <div className="card-icon-badge">
                    <Heart size={20} fill="white" />
                  </div>
                  <Sparkles size={16} className="sparkle-icon" />
                </div>
                <div className="card-body" style={{ color: 'white' }}>
                  <h3 style={{ color: 'white' }}>Quero Ajudar</h3>
                  <p style={{ color: 'white' }}>Encontre vizinhos que precisam de você hoje.</p>
                </div>
                <div className="card-footer-btn">
                  Ver pedidos <ChevronRight size={14} />
                </div>
              </div>

              <div className="quick-card orange" onClick={() => navigate('/preciso-de-ajuda')}>
                <div className="card-top">
                  <div className="card-icon-badge">
                    <HandHelping size={20} fill="white" />
                  </div>
                </div>
                <div className="card-body" style={{ color: 'white' }}>
                  <h3 style={{ color: 'white' }}>Pedir Ajuda</h3>
                  <p style={{ color: 'white' }}>Precisa de algo? Sua rede está aqui por você.</p>
                </div>
                <div className="card-footer-btn">
                  Solicitar <ChevronRight size={14} />
                </div>
              </div>
            </div>

            <div className="quick-card purple" onClick={() => navigate('/achados-e-perdidos')} style={{ marginTop: '1rem' }}>
              <div className="card-top">
                <div className="card-icon-badge">
                  <MapPin size={20} fill="white" />
                </div>
              </div>
              <div className="card-body" style={{ color: 'white' }}>
                <h3 style={{ color: 'white' }}>Achados e Perdidos</h3>
                <p style={{ color: 'white' }}>Encontre ou reporte itens perdidos na vizinhança.</p>
              </div>
              <div className="card-footer-btn">
                Ver itens <ChevronRight size={14} />
              </div>
            </div>
        </div>
      </header>

      <section className="mobile-radar-section">
        <NeighborhoodRadar size="normal" />
      </section>

      <section className="mobile-pulse-section">
        <PulseFeed />
      </section>

        <section className="mobile-cta-section">
          {isAuthenticated() ? (
            isAdmin ? (
              <div className="cta-card" onClick={() => navigate('/painel-social')}>
                <div className="cta-text">
                  <h3>Explorar Plataforma</h3>
                  <p>Acesse o painel administrativo</p>
                </div>
                <div className="cta-icon">
                  <ArrowRight size={24} />
                </div>
              </div>
            ) : (
              <div className="cta-card" onClick={() => navigate('/quero-ajudar')}>
                <div className="cta-text">
                  <h3>Comece ajudando o próximo</h3>
                  <p>Veja quem precisa de você</p>
                </div>
                <div className="cta-icon">
                  <ArrowRight size={24} />
                </div>
              </div>
            )
          ) : (
            <div className="cta-card" onClick={() => navigate('/cadastro')}>
              <div className="cta-text">
                <h3>Faça parte da rede</h3>
                <p>Junte-se a +2k vizinhos</p>
              </div>
              <div className="cta-icon">
                <ArrowRight size={24} />
              </div>
            </div>
          )}
        </section>

        <footer className="landing-footer mobile-footer" style={{
          background: '#0f172a',
          color: '#f8fafc',
          padding: '48px 24px 120px',
          marginTop: '40px',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '-50px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%'
          }} />
          
          <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '32px' }}>
              
              {/* Brand Section */}
              <div className="footer-brand" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="logo-wrapper" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <div className="logo-icon" style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <Heart fill="#0d9488" color="#0d9488" size={20} />
                  </div>
                  <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', letterSpacing: '-0.5px' }}>
                    Solidar<span style={{ color: '#0d9488' }}>Brasil</span>
                  </span>
                </div>
                <p className="footer-tagline" style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '300px', lineHeight: '1.6' }}>
                  Conectando vizinhos, fortalecendo comunidades e transformando vidas através da solidariedade local.
                </p>
              </div>

              {/* Social Icons */}
              <div className="footer-social-group" style={{ display: 'flex', gap: '20px' }}>
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="social-btn" style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#cbd5e1',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <Icon size={22} />
                  </a>
                ))}
              </div>

              {/* Quick Links Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '20px', 
                width: '100%', 
                maxWidth: '300px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>Plataforma</h4>
                  <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Como funciona</a>
                  <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Segurança</a>
                  <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Ajuda</a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>Contato</h4>
                  <a href="mailto:contato@solidarbrasil.com" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Email</a>
                  <a href="tel:+5531925383871" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>WhatsApp</a>
                  <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Imprensa</a>
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

              {/* Bottom Section */}
              <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <p className="copyright" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  &copy; {new Date().getFullYear()} SolidarBrasil. Feito com 💚 para todos.
                </p>
                <div className="footer-bottom-links" style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                  <a href="#" className="footer-bottom-link" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.8rem' }}>Privacidade</a>
                  <a href="#" className="footer-bottom-link" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.8rem' }}>Termos de Uso</a>
                </div>
              </div>

            </div>
          </div>
        </footer>

        <MobileNav />

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
                        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '8px' }}>
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

      {showLogoutModal && (
        <>
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
        }} onClick={() => setShowLogoutModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '24px',
            width: '100%',
            maxWidth: '320px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            animation: 'modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '1.25rem' }}>Sair da conta?</h3>
            <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Você precisará fazer login novamente para acessar sua conta.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    await logout();
                    setShowLogoutModal(false);
                    navigate('/');
                  } catch (error) {
                    console.error('Erro ao fazer logout:', error);
                    navigate('/');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#ef4444',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};
