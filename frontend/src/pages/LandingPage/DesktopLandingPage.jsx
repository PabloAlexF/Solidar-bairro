import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInView } from 'react-intersection-observer';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import createGlobe from 'cobe';
import GlobeFeatureSection from './GlobeFeatureSection';
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
  Share2,
  Settings,
  Shield
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

  const navigateToTop = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
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
    <div className="landing-wrapper">
      <div className="bg-mesh" />

      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className={`section-container nav-container`}>
          <div className="logo-wrapper" onClick={() => navigateToTop('/')}>
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
                  onClick={() => navigateToTop('/login')}
                >
                  Entrar
                </button>
                <button
                  className="auth-btn-register"
                  onClick={() => navigateToTop('/cadastro')}
                >
                  Cadastrar
                </button>
              </div>
            ) : (
              <div className="user-section">
                {isAdmin && (
                  <>
                    <button
                      className="admin-dashboard-btn"
                      onClick={() => navigateToTop('/admin')}
                      title="Dashboard Admin"
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        border: 'none',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        marginRight: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                      }}
                    >
                      <Settings size={20} />
                    </button>
                    <button
                      className="admin-dashboard-btn"
                      onClick={() => navigateToTop('/painel-social')}
                      title="Painel Social"
                      style={{
                        background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                        border: 'none',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
                        marginRight: '1rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(13, 148, 136, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(13, 148, 136, 0.3)';
                      }}
                    >
                      <Shield size={20} />
                    </button>
                  </>
                )}
                
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
                      {user?.fotoPerfil ? (
                        <img 
                          src={user.fotoPerfil} 
                          alt="Foto do perfil" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          onError={(e) => {
                            console.log('Erro ao carregar imagem:', user.fotoPerfil);
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = userName?.substring(0, 2).toUpperCase();
                          }}
                        />
                      ) : (
                        userName?.substring(0, 2).toUpperCase()
                      )}
                    </div>
                  </button>
                  
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <div className="user-avatar-large">
                          {user?.fotoPerfil ? (
                            <img 
                              src={user.fotoPerfil} 
                              alt="Foto do perfil" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
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
                        </button>
                        
                        {isAdmin && (
                          <button 
                            className="menu-item"
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
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section" ref={heroRef} style={{ paddingTop: '10rem' }}>
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
                  if (isAdmin) {
                    toast.success('Redirecionando para o painel!');
                    navigateToTop('/painel-social');
                  } else {
                    toast.error('Acesso restrito a administradores');
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05) translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) translateY(0)';
                }}
                data-tooltip-id="hero-btn"
                data-tooltip-content={isAdmin ? "Explore todas as funcionalidades da plataforma" : "Acesso restrito a administradores"}
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
              onClick={() => navigateToTop('/quero-ajudar')}
              color="teal"
              delay={0.1}
            />

            <ActionCard
              icon={<HandHelping size={40} />}
              title="Preciso de Ajuda"
              description="Compartilhe sua necessidade com vizinhos dispostos a ajudar. Você não está sozinho nesta jornada."
              buttonText="Pedir ajuda"
              onClick={() => navigateToTop('/preciso-de-ajuda')}
              color="orange"
              delay={0.2}
            />

            <ActionCard
              icon={<Search size={40} />}
              title="Achados e Perdidos"
              description="Localize documentos, veículos or bens perdidos na sua vizinhança. Ajude a devolver o que foi perdido."
              buttonText="Ver itens"
              onClick={() => navigateToTop('/achados-e-perdidos')}
              color="purple"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      <GlobeFeatureSection />

      {/* Footer */}
      <footer id="about" className="landing-footer">
        <div className="section-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="logo-wrapper">
                <Heart className="heart-icon" fill="#0d9488" size={32} />
                <span className="logo-name">SolidarBairro</span>
              </div>
              <p className="footer-tagline">Plataforma de solidariedade comunitária que conecta pessoas que precisam de ajuda com aquelas que podem ajudar.</p>
            </div>
            <div className="footer-info-grid">
              <div className="footer-column">
                <h4 className="column-title">Missão</h4>
                <p className="column-text">Conectar vizinhos e fortalecer os laços da comunidade através de uma rede de apoio mútuo, promovendo solidariedade e segurança local.</p>
              </div>
              <div className="footer-column">
                <h4 className="column-title">Tecnologia</h4>
                <p className="column-text">React.js • Node.js • Firebase • Geolocalização em tempo real • Design responsivo mobile-first</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">&copy; {new Date().getFullYear()} SolidarBairro. Conectando comunidades, transformando vidas. 💚</p>
          </div>
        </div>
      </footer>
    </div>
  );
}