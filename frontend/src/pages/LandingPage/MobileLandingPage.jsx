import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import chatNotificationService from '../../services/chatNotificationService';
import ReusableHeader from '../../components/layout/ReusableHeader';
import {
  Heart,
  HandHelping,
  MapPin,
  Navigation,
  ArrowRight,
  ChevronRight,
  Zap,
  Sparkles,
  Home,
  PlusCircle,
  MessageSquare,
  User,
  Coffee,
  Key,
  Instagram,
  Twitter,
  Facebook
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
  const { addChatNotification } = useNotifications();

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

  const isAdmin = user?.role === 'admin' ||
                  user?.isAdmin ||
                  user?.tipo === 'admin' ||
                  user?.email === 'admin@solidarbairro.com';

  return (
    <div className="mobile-landing-exclusive">
      <ReusableHeader 
        currentPage="landing"
        showLoginButton={true}
        showAdminButtons={true}
        showPainelSocial={true}
        mobileLoginOnly={true}
      />
      
      <header className="mobile-hero" style={{ paddingTop: '80px' }}>

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
    </div>
  );
};
