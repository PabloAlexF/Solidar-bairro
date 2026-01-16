import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
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
  Shield
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
    { icon: <MessageSquare size={22} />, label: 'Chat', path: '/chat' },
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

export const MobileLandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Verificar se é administrador
  const storedUser = JSON.parse(localStorage.getItem('solidar-user') || '{}');
  const isAdmin = user?.role === 'admin' || 
                  user?.isAdmin || 
                  user?.tipo === 'admin' || 
                  user?.email === 'admin@solidarbairro.com' ||
                  storedUser?.role === 'admin' || 
                  storedUser?.isAdmin || 
                  storedUser?.tipo === 'admin' ||
                  storedUser?.email === 'admin@solidarbairro.com';

  return (
    <div className="mobile-landing-exclusive">
      <header className="mobile-hero">
        <div className="mobile-header-top">
          <div className="logo-small">
            <Heart fill="var(--sb-teal)" size={20} />
            <span>Solidar<b>Bairro</b></span>
          </div>
          <div className="header-actions">
            {isAdmin && (
              <>
                <button 
                  onClick={() => navigate('/admin')}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    color: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    marginRight: '8px',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <Settings size={18} />
                </button>
                <button 
                  onClick={() => navigate('/painel-social')}
                  style={{
                    background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                    border: 'none',
                    color: 'white',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    marginRight: '8px',
                    boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
                  }}
                >
                  <Shield size={18} />
                </button>
              </>
            )}
            {!isAuthenticated() ? (
              <button className="header-cta" onClick={() => navigate('/cadastro')}>
                Cadastrar
              </button>
            ) : (
              <button 
                className="user-avatar-btn" 
                onClick={() => navigate('/perfil')}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
                }}
              >
                {(user?.nome || user?.nomeCompleto || 'U').substring(0, 2).toUpperCase()}
              </button>
            )}
            <NotificationDropdown />
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

        <footer className="landing-footer mobile-footer">
          <div className="section-container">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="logo-wrapper" onClick={() => navigate('/')}>
                  <div className="logo-icon">
                    <Heart fill="white" size={20} />
                  </div>
                  <span className="logo-text">Solidar<span className="logo-accent">Bairro</span></span>
                </div>
                <p className="footer-tagline">
                  Transformando vizinhanças através da colaboração local.
                </p>
                <div className="footer-social-group">
                  <a href="#" className="social-btn"><Instagram size={18} /></a>
                  <a href="#" className="social-btn"><Twitter size={18} /></a>
                  <a href="#" className="social-btn"><Facebook size={18} /></a>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
              <div className="footer-bottom-container">
                <p className="copyright">&copy; 2024 SolidarBairro.</p>
                <div className="footer-bottom-links">
                  <a href="#" className="footer-bottom-link">Privacidade</a>
                  <a href="#" className="footer-bottom-link">Termos</a>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <MobileNav />

    </div>
  );
};