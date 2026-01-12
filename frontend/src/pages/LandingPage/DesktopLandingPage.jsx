import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInView } from 'react-intersection-observer';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import createGlobe from 'cobe';
import { 
  Heart, 
  HandHelping, 
  Search, 
  MapPin, 
  Navigation, 
  Bell, 
  User, 
  MessageSquare, 
  LogOut, 
  ArrowRight, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Users,
  Locate,
  Info,
  ExternalLink,
  Sparkles,
  Copy,
  Share2
} from 'lucide-react';

import './styles.css';

const ActionCard = ({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onClick, 
  color, 
  delay 
}) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  
  return (
    <div
      ref={ref}
      className={`action-card ${color}`}
      style={{
        animation: inView ? `fadeInUp 0.8s ease-out ${delay}s both` : 'none',
        transform: 'translateY(30px)',
        opacity: inView ? 1 : 0
      }}
      onMouseEnter={(e) => e.target.style.transform = 'translateY(-15px)'}
      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
      data-tooltip-id={`card-${color}`}
      data-tooltip-content={`Clique para ${buttonText.toLowerCase()}`}
    >
      <div className="action-card-gradient" />
      
      <div className="action-card-body">
        <div className="action-card-icon">
          {icon}
        </div>
        
        <h3 className="action-card-title">
          {title}
        </h3>
        
        <p className="action-card-description">
          {description}
        </p>
        
        <button 
          onClick={onClick}
          className="action-card-button"
        >
          {buttonText}
          <ChevronRight size={22} className="button-icon" />
        </button>
      </div>
      
      <div className="action-card-sparkle">
        <Sparkles size={40} />
      </div>
      
      <Tooltip id={`card-${color}`} place="top" />
    </div>
  );
};

const Globe = () => {
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const [globeError, setGlobeError] = useState(false);

  useEffect(() => {
    let phi = 0;

    const initGlobe = () => {
      if (!canvasRef.current) return;

      try {
        if (globeRef.current) {
          globeRef.current.destroy();
        }

        globeRef.current = createGlobe(canvasRef.current, {
          devicePixelRatio: 2,
          width: 600,
          height: 600,
          phi: 0,
          theta: 0.3,
          dark: 0,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: [0.3, 0.3, 0.3],
          markerColor: [0.1, 0.8, 0.5],
          glowColor: [1, 1, 1],
          markers: [
            { location: [-23.5505, -46.6333], size: 0.08 },
            { location: [-22.9068, -43.1729], size: 0.06 },
            { location: [-15.7975, -47.8919], size: 0.05 },
            { location: [40.7128, -74.0060], size: 0.03 },
            { location: [48.8566, 2.3522], size: 0.03 },
            { location: [-34.6037, -58.3816], size: 0.04 },
          ],
          onRender: (state) => {
            state.phi = phi;
            phi += 0.005;
          },
        });
        setGlobeError(false);
      } catch (error) {
        console.warn('Globe initialization failed:', error);
        setGlobeError(true);
      }
    };

    const timer = setTimeout(initGlobe, 100);

    return () => {
      clearTimeout(timer);
      if (globeRef.current) {
        try {
          globeRef.current.destroy();
        } catch (error) {
          console.warn('Globe cleanup failed:', error);
        }
      }
    };
  }, []);

  if (globeError) {
    return (
      <div className="globe-wrapper">
        <div className="globe-fallback">
          <div className="fallback-circle">
            <div className="fallback-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
            </div>
            <div className="fallback-center">
              <MapPin size={48} className="fallback-icon" />
            </div>
          </div>
          <div className="fallback-text">
            <h4>Conectando Vizinhança</h4>
            <p>Mapeando sua região...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="globe-wrapper globe-canvas">
      <div className="globe-decoration">
        <div className="radar-ring-1" />
        <div className="radar-ring-2" />
        <div className="scan-line" />
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        height: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          style={{ 
            width: '100%', 
            height: '100%',
            maxWidth: '700px',
            maxHeight: '700px',
            display: 'block'
          }}
        />
      </div>
      <div className="globe-fade-overlay"></div>
    </div>
  );
};

export default function DesktopLandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.log('Erro de geolocalização:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  }, []);

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

  const shareContent = async () => {
    const shareData = {
      title: 'SolidarBairro - Conectando Vizinhos',
      text: 'Descubra a rede de ajuda da sua vizinhança!',
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Compartilhado com sucesso!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copiado!'))
      .catch(() => toast.error('Erro ao copiar link'));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial || "Vizinho";

  return (
    <div className="landing-wrapper">
      <div className="bg-mesh" />

      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className={`section-container nav-container`}>
          <div className="logo-wrapper" onClick={() => navigate('/')}>
            <div className="logo-icon">
              <Heart fill="white" size={24} />
            </div>
            <span className="logo-text">Solidar<span className="logo-accent">Bairro</span></span>
          </div>
          
          <div className="nav-menu">
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

      {/* Hero Section */}
      <header className="hero-section" ref={heroRef}>
        <div className="hero-atmosphere">
          <div 
            className="mesh-blob teal"
            style={{
              animation: 'meshFloat 15s infinite ease-in-out'
            }}
          />
          <div 
            className="mesh-blob orange"
            style={{
              animation: 'meshFloat 18s infinite ease-in-out 2s'
            }}
          />
        </div>
        
        <div className="section-container hero-grid">
          <div 
            style={{
              animation: heroInView ? 'fadeInUp 1.2s ease-out' : 'none',
              opacity: heroInView ? 1 : 0
            }}
          >
            <div
              className="hero-badge"
              style={{
                animation: heroInView ? 'fadeInScale 0.8s ease-out 0.3s both' : 'none'
              }}
            >
              <Sparkles size={14} className="badge-icon" />
              <span>TRANSFORMANDO VIZINHANÇAS</span>
            </div>

            {isLoading ? (
              <Skeleton height={120} className="hero-title-skeleton" />
            ) : (
              <h1 className="hero-title">
                Solidar<span className="title-accent">Bairro</span>
              </h1>
            )}
            
            <div className="hero-subtitle">
              <div className="subtitle-line" />
              {isLoading ? (
                <Skeleton height={40} width={300} />
              ) : (
                <p className="subtitle-text">
                  A rede de ajuda da <span className="text-highlight">sua vizinhança</span>
                </p>
              )}
            </div>
            
            {isLoading ? (
              <Skeleton height={60} count={2} />
            ) : (
              <p className="hero-description">
                Conecte-se com vizinhos, ofereça ou receba ajuda, e fortaleça os laços da sua comunidade. 
                <span className="description-quote">Criamos pontes onde antes existiam apenas muros.</span>
              </p>
            )}
            
            <div className="hero-cta-wrapper">
              <button 
                className="hero-btn-primary"
                onClick={() => {
                  toast.success('Redirecionando para o painel!');
                  navigate('/painel-social');
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05) translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) translateY(0)';
                }}
                data-tooltip-id="hero-btn"
                data-tooltip-content="Explore todas as funcionalidades da plataforma"
              >
                Explorar Plataforma
                <div className="btn-icon-wrapper">
                  <ArrowRight size={24} className="btn-arrow" />
                </div>
              </button>
              
              <button
                onClick={shareContent}
                className="share-btn"
                data-tooltip-id="share-btn"
                data-tooltip-content="Compartilhar SolidarBairro"
              >
                <Share2 size={20} />
              </button>
              
              <div className="hero-stats-group">
                <div className="stat-item">
                  <span className="stat-value">500+</span>
                  <span className="stat-desc">Vizinhos</span>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <span className="stat-value">{location ? '2km' : '100%'}</span>
                  <span className="stat-desc">{location ? 'Raio Ativo' : 'Seguro'}</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="hero-image-wrapper"
            style={{
              animation: heroInView ? 'fadeInScale 1.4s ease-out' : 'none',
              opacity: heroInView ? 1 : 0
            }}
          >
            <div className="main-image-frame group">
              {isLoading ? (
                <Skeleton height="100%" />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000" 
                  alt="Comunidade unida" 
                  className="hero-img"
                  loading="lazy"
                />
              )}
              <div className="image-overlay" />
              
              <div className="image-caption">
                <p className="caption-text">
                  "A solidariedade é o que nos mantém próximos, mesmo em tempos difíceis."
                </p>
              </div>
            </div>
            
            <div 
              className="floating-card impact-card"
              style={{
                animation: 'floatUp 5s infinite ease-in-out'
              }}
              data-tooltip-id="impact-card"
              data-tooltip-content="Veja o impacto real da nossa comunidade"
            >
              <div className="card-icon impact">
                <Heart size={20} fill="white" />
              </div>
              <div>
                <p className="card-label">Impacto Real</p>
                <p className="card-value">+1.2k <span className="accent">Ajudas</span></p>
              </div>
            </div>

            <div 
              className="floating-card geo-card"
              style={{
                animation: 'floatDown 6s infinite ease-in-out 1s'
              }}
              data-tooltip-id="geo-card"
              data-tooltip-content={location ? 'Sua localização está sendo monitorada com segurança' : 'Ative a localização para melhor experiência'}
            >
              <div className="card-icon geo">
                <Navigation size={20} fill="white" />
              </div>
              <div>
                <p className="card-label">{location ? 'Geo-Monitoramento' : 'Proximidade'}</p>
                <p className="card-value">{location ? 'Ativo' : 'Raio 2km'}</p>
              </div>
            </div>

            <div className="decoration-ring outer" />
            <div className="decoration-ring inner" />
          </div>
        </div>
        
        <Tooltip id="hero-btn" place="top" />
        <Tooltip id="share-btn" place="top" />
        <Tooltip id="impact-card" place="top" />
        <Tooltip id="geo-card" place="top" />
      </header>

      {/* Action Cards */}
      <section className="action-cards-section">
        <div className="section-container">
          <div className="cards-grid">
            <ActionCard 
              icon={<Heart size={40} />}
              title="Quero ajudar"
              description="Descubra pessoas próximas que precisam da sua ajuda. Seja a diferença na vida de alguém com pequenos gestos."
              buttonText="Ver oportunidades"
              onClick={() => navigate('/quero-ajudar')}
              color="teal"
              delay={0.1}
            />

            <ActionCard 
              icon={<HandHelping size={40} />}
              title="Preciso de Ajuda"
              description="Compartilhe sua necessidade com vizinhos dispostos a ajudar. Você não está sozinho nesta jornada."
              buttonText="Pedir ajuda"
              onClick={() => navigate('/preciso-de-ajuda')}
              color="orange"
              delay={0.2}
            />

            <ActionCard 
              icon={<Search size={40} />}
              title="Achados e Perdidos"
              description="Localize documentos, veículos or bens perdidos na sua vizinhança. Ajude a devolver o que foi perdido."
              buttonText="Ver itens"
              onClick={() => navigate('/achados-e-perdidos')}
              color="purple"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Geolocation Section */}
      <section className="geo-showcase">
        <div className="section-container geo-grid">
          <div className="geo-visual-wrapper">
            <div 
              className="geo-visual-display group"
              style={{
                animation: 'fadeInScale 1s ease-out'
              }}
            >
              <div className="geo-atmosphere" />
              
              <div className="globe-container">
                <div className="globe-center-wrapper">
                  <div className="globe-final-wrapper">
                    <Globe />
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="geo-btn-security"
              onClick={() => navigate('/saiba-mais')}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05) translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) translateY(0)';
              }}
            >
              <span>Privacidade & Segurança</span>
              <div className="btn-icon">
                <ShieldCheck size={28} />
              </div>
            </button>
          </div>
          
          <div
            className="geo-text-content"
            style={{
              animation: 'slideInRight 1s ease-out'
            }}
          >
            <div className="geo-badge">
              <Zap size={20} className="fill-teal-700" />
              <span>Tecnologia de Proximidade</span>
            </div>
            
            <h2 className="geo-title">
              Sua vizinhança na <span className="text-gradient">palma da mão</span>
            </h2>
            
            <p className="geo-description">
              O SolidarBairro foi desenhado para ser intuitivo. Seja você um jovem tech ou um idoso buscando auxílio, nossa plataforma ajusta a experiência para o que está acontecendo <strong>realmente perto de você</strong>.
            </p>
            
            <div className="geo-features-list">
              <div className="list-divider" />
              
              <div className="features-stack">
                {[
                  { 
                    icon: <Search size={32} />, 
                    title: "Busca Amigável", 
                    desc: "Encontre ajuda ou vizinhos sem complicações.",
                    color: "teal"
                  },
                  { 
                    icon: <ShieldCheck size={32} />, 
                    title: "Dados Protegidos", 
                    desc: "Sua localização nunca é exposta publicamente.",
                    color: "orange"
                  },
                  { 
                    icon: <Navigation size={32} />, 
                    title: "Raio Personalizado", 
                    desc: "Veja apenas o que importa no seu bairro.",
                    color: "purple"
                  }
                ].map((item, i) => (
                  <div 
                    key={i}
                    className={`geo-feature-card ${item.color}`}
                    style={{
                      animation: `slideInRight 0.6s ease-out ${i * 0.15}s both`
                    }}
                  >
                    <div className="card-icon-wrapper">
                      {item.icon}
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-text">{item.desc}</p>
                    </div>
                    <div className="card-index">0{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="geo-bg-gradient" />
        <div className="geo-bg-blob" />
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <div
              className="header-badge"
              style={{
                animation: 'fadeInScale 1s ease-out'
              }}
            >
              <Zap size={16} className="fill-teal-700" />
              <span>Jornada do Vizinho</span>
            </div>
            
            <h2 
              className="section-title"
              style={{
                animation: 'fadeInUp 1s ease-out'
              }}
            >
              Simples como um <span className="text-gradient">bom dia</span>
            </h2>
            
            <p 
              className="section-description"
              style={{
                animation: 'fadeInUp 1s ease-out 0.1s both'
              }}
            >
              Transformamos a solidariedade em algo natural e cotidiano. 
              Veja como é fácil começar a fazer parte dessa rede.
            </p>
          </div>
          
          <div className="steps-wrapper">
            <div className="steps-connector" />
            
            <div className="steps-grid">
              {[
                {
                  icon: <MapPin size={32} />,
                  title: "Localização Inteligente",
                  desc: "O SolidarBairro detecta sua vizinhança e mostra o que está acontecendo em um raio seguro de 2km.",
                  num: "01",
                  color: "teal"
                },
                {
                  icon: <HandHelping size={32} />,
                  title: "Conexão de Impacto",
                  desc: "Escolha entre ajudar alguém próximo ou pedir um auxílio. Nossa interface facilita o primeiro contato.",
                  num: "02",
                  color: "orange"
                },
                {
                  icon: <Users size={32} />,
                  title: "Comunidade Viva",
                  desc: "A ajuda sai do digital para o presencial. Vizinhos se conhecem, se ajudam e o bairro se fortalece.",
                  num: "03",
                  color: "purple"
                }
              ].map((step, i) => (
                <div 
                  key={i}
                  className={`step-card ${step.color}`}
                  style={{
                    animation: `fadeInUp 0.8s ease-out ${i * 0.2}s both`
                  }}
                >
                  <div className="step-bg-gradient" />
                  
                  <div className="step-header">
                    <div className="step-icon-frame">
                      {step.icon}
                    </div>
                    <span className="step-number">{step.num}</span>
                  </div>
                  
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-text">{step.desc}</p>
                  
                  <div className="step-footer">
                    <div className="footer-tag">
                      <div className="tag-line" />
                      <span>{step.color === 'teal' ? 'Proximidade' : step.color === 'orange' ? 'Diálogo' : 'União'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="step-bg-blob left" />
        <div className="step-bg-blob right" />
      </section>

      {/* Features */}
      <section id="features" className="features-section" ref={featuresRef}>
        <div className="features-bg-decoration">
          <div className="bg-blob-teal" />
          <div className="bg-blob-orange" />
        </div>

        <div className="section-container">
          <div className="features-header">
            <div className="header-left">
              <div
                className="features-badge"
                style={{
                  animation: featuresInView ? 'slideInLeft 1s ease-out' : 'none'
                }}
              >
                <div className="badge-dot" />
                <span>POR QUE NÓS?</span>
              </div>
              <h2 
                className="features-title"
                style={{
                  animation: featuresInView ? 'fadeInUp 1s ease-out' : 'none'
                }}
              >
                A essência do <br />
                <span className="title-accent">SolidarBairro</span>
              </h2>
            </div>
            <p 
              className="features-intro"
              style={{
                animation: featuresInView ? 'fadeInUp 1s ease-out 0.1s both' : 'none'
              }}
            >
              Unimos tecnologia e empatia para resgatar o valor da vizinhança.
            </p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: <Zap size={36} />,
                title: "Simples",
                desc: "Interface que acolhe. Uma experiência intuitiva para que vizinhos de todas as idades se conectem sem barreiras.",
                color: "teal",
                tooltip: "Design pensado para todos os usuários"
              },
              {
                icon: <MapPin size={36} />,
                title: "Próximo",
                desc: "Foco no que importa. Priorizamos pedidos e ofertas em um raio de 2km, fortalecendo os laços da sua própria rua.",
                color: "orange",
                tooltip: "Conecte-se com vizinhos próximos"
              },
              {
                icon: <ShieldCheck size={36} />,
                title: "Seguro",
                desc: "Privacidade total. Seus dados e localização exata nunca são expostos. Construímos confiança através de segurança.",
                color: "purple",
                tooltip: "Seus dados estão protegidos"
              },
              {
                icon: <Users size={36} />,
                title: "Humano",
                desc: "Pessoas ajudando pessoas. Resgatamos o calor das conexões reais e a satisfação de fazer o bem para quem está perto.",
                color: "dark",
                tooltip: "Conexões reais entre vizinhos"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className={`feature-card ${feature.color}`}
                style={{
                  animation: featuresInView ? `fadeInUp 0.8s ease-out ${i * 0.1}s both` : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-15px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                }}
                data-tooltip-id={`feature-${i}`}
                data-tooltip-content={feature.tooltip}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-text">{feature.desc}</p>
                <div className="feature-card-footer">
                  <div className="footer-dot" />
                  {feature.title}
                </div>
                <Tooltip id={`feature-${i}`} place="top" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="landing-footer">
        <div className="section-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="logo-wrapper">
                <Heart className="heart-icon" fill="#0d9488" size={32} />
                <span className="logo-name">SolidarBairro</span>
              </div>
              <p className="footer-tagline">Transformando ruas em comunidades.</p>
            </div>
            <div className="footer-info-grid">
              <div className="footer-column">
                <h4 className="column-title">Nossa missão</h4>
                <p className="column-text">Conectamos vizinhos para criar uma rede de apoio mútuo local.</p>
              </div>
              <div className="footer-column">
                <h4 className="column-title">Visão</h4>
                <p className="column-text">Um bairro solidário é um bairro mais forte e seguro.</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">&copy; 2024 SolidarBairro. Inspirando solidariedade local.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}