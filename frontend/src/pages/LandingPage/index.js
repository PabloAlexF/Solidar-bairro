import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -15 }}
      className={`action-card ${color}`}
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
    </motion.div>
  );
};

const Globe = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 550 * 2,
      height: 550 * 2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 1.8,
      mapSamples: 20000,
      mapBrightness: 8,
      baseColor: [0.8, 0.7, 0.5],
      markerColor: [0.2, 0.8, 0.4],
      glowColor: [0.2, 0.8, 0.9],
      markers: [
        { location: [-23.5505, -46.6333], size: 0.12 },
        { location: [-22.9068, -43.1729], size: 0.08 },
        { location: [-15.7975, -47.8919], size: 0.08 },
        { location: [40.7128, -74.0060], size: 0.04 },
        { location: [48.8566, 2.3522], size: 0.04 },
        { location: [-34.6037, -58.3816], size: 0.06 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.007;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="globe-wrapper">
      <div className="globe-decoration">
        <div className="radar-ring-1" />
        <div className="radar-ring-2" />
        <div className="scan-line" />
      </div>

      <canvas
        ref={canvasRef}
        style={{ width: 550, height: 550, maxWidth: "100%", aspectRatio: "1" }}
        className="globe-canvas"
      />
      <div className="globe-fade-overlay"></div>
    </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useState(null);
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
                            // Implementar logout
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
      <header className="hero-section">
        {/* Animated Background Mesh */}
        <div className="hero-atmosphere">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="mesh-blob teal"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.08, 0.12, 0.08],
              x: [0, -40, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="mesh-blob orange"
          />
        </div>
        
        <div className="section-container hero-grid">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hero-badge"
            >
              <Sparkles size={14} className="badge-icon" />
              <span>TRANSFORMANDO VIZINHANÇAS</span>
            </motion.div>

            <h1 className="hero-title">
              Solidar<span className="title-accent">Bairro</span>
            </h1>
            
            <div className="hero-subtitle">
              <div className="subtitle-line" />
              <p className="subtitle-text">
                A rede de ajuda da <span className="text-highlight">sua vizinhança</span>
              </p>
            </div>
            
            <p className="hero-description">
              Conecte-se com vizinhos, ofereça ou receba ajuda, e fortaleça os laços da sua comunidade. 
              <span className="description-quote">Criamos pontes onde antes existiam apenas muros.</span>
            </p>
            
            <div className="hero-cta-wrapper">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="hero-btn-primary"
                onClick={() => navigate('/painel-social')}
              >
                Explorar Plataforma
                <div className="btn-icon-wrapper">
                  <ArrowRight size={24} className="btn-arrow" />
                </div>
              </motion.button>
              
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
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hero-image-wrapper"
          >
            <div className="main-image-frame group">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000" 
                alt="Comunidade unida" 
                className="hero-img"
              />
              <div className="image-overlay" />
              
              {/* Image Caption/Badge */}
              <div className="image-caption">
                <p className="caption-text">
                  "A solidariedade é o que nos mantém próximos, mesmo em tempos difíceis."
                </p>
              </div>
            </div>
            
            {/* Enhanced Floating Elements */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="floating-card impact-card"
            >
              <div className="card-icon impact">
                <Heart size={20} fill="white" />
              </div>
              <div>
                <p className="card-label">Impacto Real</p>
                <p className="card-value">+1.2k <span className="accent">Ajudas</span></p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="floating-card geo-card"
            >
              <div className="card-icon geo">
                <Navigation size={20} fill="white" />
              </div>
              <div>
                <p className="card-label">{location ? 'Geo-Monitoramento' : 'Proximidade'}</p>
                <p className="card-value">{location ? 'Ativo' : 'Raio 2km'}</p>
              </div>
            </motion.div>

            {/* Background Decorative Rings */}
            <div className="decoration-ring outer" />
            <div className="decoration-ring inner" />
          </motion.div>
        </div>
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
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="geo-visual-display group"
            >
              <div className="geo-atmosphere" />
              
              <div className="globe-container">
                <div className="globe-inner">
                  <Globe />
                  
                  <div className="geo-info-tag-wrapper">
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="geo-info-tag animate-bounce-slow"
                    >
                      <div className="geo-info-icon">
                        <Locate size={32} />
                      </div>
                      <div>
                        <p className="geo-info-title">Geo-Proteção Ativa</p>
                        <p className="geo-info-text">Sua rua, seu refúgio seguro.</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="geo-btn-security"
              onClick={() => navigate('/saiba-mais')}
            >
              <span>Privacidade & Segurança</span>
              <div className="btn-icon">
                <ShieldCheck size={28} />
              </div>
            </motion.button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="geo-text-content"
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
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    className={`geo-feature-card ${item.color}`}
                  >
                    <div className="card-icon-wrapper">
                      {item.icon}
                    </div>
                    <div className="card-body">
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-text">{item.desc}</p>
                    </div>
                    <div className="card-index">0{i + 1}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="geo-bg-gradient" />
        <div className="geo-bg-blob" />
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="header-badge"
            >
              <Zap size={16} className="fill-teal-700" />
              <span>Jornada do Vizinho</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-title"
            >
              Simples como um <span className="text-gradient">bom dia</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-description"
            >
              Transformamos a solidariedade em algo natural e cotidiano. 
              Veja como é fácil começar a fazer parte dessa rede.
            </motion.p>
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
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className={`step-card ${step.color}`}
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="step-bg-blob left" />
        <div className="step-bg-blob right" />
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="features-bg-decoration">
          <div className="bg-blob-teal" />
          <div className="bg-blob-orange" />
        </div>

        <div className="section-container">
          <div className="features-header">
            <div className="header-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="features-badge"
              >
                <div className="badge-dot" />
                <span>POR QUE NÓS?</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="features-title"
              >
                A essência do <br />
                <span className="title-accent">SolidarBairro</span>
              </motion.h2>
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="features-intro"
            >
              Unimos tecnologia e empatia para resgatar o valor da vizinhança.
            </motion.p>
          </div>

          <div className="features-grid">
            {[
              {
                icon: <Zap size={36} />,
                title: "Simples",
                desc: "Interface que acolhe. Uma experiência intuitiva para que vizinhos de todas as idades se conectem sem barreiras.",
                color: "teal"
              },
              {
                icon: <MapPin size={36} />,
                title: "Próximo",
                desc: "Foco no que importa. Priorizamos pedidos e ofertas em um raio de 2km, fortalecendo os laços da sua própria rua.",
                color: "orange"
              },
              {
                icon: <ShieldCheck size={36} />,
                title: "Seguro",
                desc: "Privacidade total. Seus dados e localização exata nunca são expostos. Construímos confiança através de segurança.",
                color: "purple"
              },
              {
                icon: <Users size={36} />,
                title: "Humano",
                desc: "Pessoas ajudando pessoas. Resgatamos o calor das conexões reais e a satisfação de fazer o bem para quem está perto.",
                color: "dark"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className={`feature-card ${feature.color}`}
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
              </motion.div>
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