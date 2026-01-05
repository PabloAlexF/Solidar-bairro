import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from '../components/LogoutButton';
import '../styles/pages/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load notifications
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem('solidar-notifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    };
    
    loadNotifications();

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
    
    window.addEventListener('notificationAdded', loadNotifications);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('notificationAdded', loadNotifications);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  // Geolocalização
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
          setLocationError(error.message);
          console.log('Erro de geolocalização:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    } else {
      setLocationError('Geolocalização não suportada pelo navegador');
    }
  }, []);

  const handleExploreRequests = () => {
    navigate('/painel-social');
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
  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial;

  return (
    <div className="landing-wrapper">
      <div className="bg-mesh" />

      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="section-container nav-container">
          <div className="logo" onClick={() => navigate('/')}>
            <i className="fi fi-rr-heart logo-icon"></i>
            <span>SolidarBairro</span>
          </div>
          <div className="nav-links">
            <a href="#features">Funcionalidades</a>
            <a href="#how-it-works">Como Funciona</a>
            <a href="#about">Missão</a>
            
            {!isAuthenticated() ? (
              <div className="auth-buttons">
                <button className="btn-nav-secondary" onClick={() => navigate('/login')}>
                  Entrar
                </button>
                <button className="btn-nav" onClick={() => navigate('/cadastro')}>
                  Cadastrar
                </button>
              </div>
            ) : (
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
                      {userName?.substring(0, 2).toUpperCase()}
                    </div>
                    {user?.isVerified && <span className="verified-badge">✓</span>}
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
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-mesh-bg">
          <div className="mesh-circle mesh-1"></div>
          <div className="mesh-circle mesh-2"></div>
          <div className="mesh-circle mesh-3"></div>
        </div>
        
        <div className="section-container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <div className="badge-pulse"></div>
              <i className="fi fi-rr-star"></i>
              <span>Conectando Vizinhos Próximos</span>
            </div>
            
            <div className="hero-text-wrapper">
              <h1>
                Solidar<span className="text-gradient">Bairro</span>
              </h1>
              
              <div className="hero-title-sub-wrapper">
                <div className="sub-line"></div>
                <p className="hero-title-sub">A rede de ajuda da sua vizinhança</p>
              </div>
            </div>
            
            <p className="hero-description">
              Conecte-se com vizinhos, ofereça ou receba ajuda, e fortaleça os laços da sua comunidade. 
              Criamos pontes onde antes existiam apenas muros.
            </p>
            
            <div className="hero-actions">
              <button 
                className="btn-primary-lg" 
                onClick={handleExploreRequests}
              >
                <span className="btn-shine"></span>
                Explorar Plataforma <i className="fi fi-rr-arrow-right arrow-icon"></i>
              </button>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-num">500+</span>
                  <span className="stat-label">Vizinhos</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-num">{location ? '2km' : '100%'}</span>
                  <span className="stat-label">{location ? 'Raio' : 'Seguro'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="image-composition-v2">
            <div className="main-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000" 
                alt="Comunidade unida" 
                className="main-image-v2"
              />
              <div className="image-overlay"></div>
            </div>
            
            <div className="glass-card floating-glass-1">
              <div className="glass-icon-box teal">
                <i className="fi fi-rr-heart"></i>
              </div>
              <div className="glass-content">
                <span className="glass-label">Impacto Social</span>
                <span className="glass-value">+1.2k Ajudas</span>
              </div>
            </div>

            <div className="glass-card floating-glass-2">
              <div className="glass-icon-box orange">
                <i className="fi fi-rr-navigation"></i>
              </div>
              <div className="glass-content">
                <span className="glass-label">{location ? 'Sua Localização' : 'Proximidade'}</span>
                <span className="glass-value">{location ? 'Detectada' : 'Raio de 2km'}</span>
              </div>
            </div>

            <div className="floating-blob"></div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span>Role para explorar</span>
        </div>
      </header>

      {/* Main Action Cards */}
      <section className="action-cards-section">
        <div className="section-container">
          <div className="cards-grid">
              <div className="action-card teal-theme">
                <div className="card-decoration"></div>
                <div className="card-icon-wrapper teal">
                  <i className="fi fi-rr-heart"></i>
                </div>
                <span className="card-subtitle">Solidariedade</span>
                <h2>Quero ajudar</h2>
                <p>Descubra pessoas próximas que precisam da sua ajuda. Seja a diferença na vida de alguém com pequenos gestos.</p>
                <button className="btn-card" onClick={() => navigate('/painel-social')}>
                  Ver oportunidades <i className="fi fi-rr-angle-right"></i>
                </button>
              </div>

              <div className="action-card orange-theme">
                <div className="card-decoration"></div>
                <div className="card-icon-wrapper orange">
                  <i className="fi fi-rr-hand-holding-heart"></i>
                </div>
                <span className="card-subtitle">Comunidade</span>
                <h2>Preciso de Ajuda</h2>
                <p>Compartilhe sua necessidade com vizinhos dispostos a ajudar. Você não está sozinho nesta jornada.</p>
                <button className="btn-card btn-card-alt" onClick={() => navigate('/painel-social')}>
                  Acessar plataforma <i className="fi fi-rr-angle-right"></i>
                </button>
              </div>
          </div>
        </div>
      </section>

      {/* Geolocation Showcase Section */}
      <section className="geo-showcase">
        <div className="section-container geo-container">
          <div className="geo-visual">
            <div className="map-mockup">
              {/* Ondas de Radar (Pulse) */}
              <div className="pulse-radius"></div>
              <div className="pulse-radius delay-1"></div>
              <div className="pulse-radius delay-2"></div>
              
              {/* Pin Central */}
              <i className="fi fi-rr-marker center-pin"></i>
              
              {/* Vizinhos Detectados (Avatares) */}
              <div className="neighbor-avatar av-1">
                <img src="https://i.pravatar.cc/150?u=1" alt="Vizinho" />
                <div className="help-bubble">Preciso de ajuda com compras</div>
              </div>
              
              <div className="neighbor-avatar av-2">
                <img src="https://i.pravatar.cc/150?u=2" alt="Vizinho" />
                <div className="help-bubble bubble-right">Posso ajudar com pets</div>
              </div>
              
              <div className="neighbor-avatar av-3">
                <img src="https://i.pravatar.cc/150?u=3" alt="Vizinho" />
              </div>
            </div>
          </div>
          
          <div className="geo-content">
            <div className="icon-tag teal"><i className="fi fi-rr-marker"></i></div>
            <h2>Geolocalização Inteligente</h2>
            <p>O SolidarBairro utiliza tecnologia de geofencing para garantir que você veja apenas o que realmente importa: <strong>sua vizinhança direta</strong>.</p>
            
            <ul className="geo-list">
              <li>
                <div className="li-icon"><i className="fi fi-rr-search"></i></div>
                <span>Busca automática por raio de distância (1km a 5km)</span>
              </li>
              <li>
                <div className="li-icon"><i className="fi fi-rr-navigation"></i></div>
                <span>Privacidade garantida: localização aproximada para segurança</span>
              </li>
              <li>
                <div className="li-icon"><i className="fi fi-rr-map"></i></div>
                <span>Filtros por bairro e proximidade imediata</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <div className="header-badge">O Caminho</div>
            <h2>Como o SolidarBairro funciona?</h2>
            <p>Uma jornada simples para fortalecer sua comunidade local.</p>
          </div>
          
          <div className="steps-grid">
            <div className="flow-line"></div>
            
            <div className="step-card teal">
              <div className="step-glass-bg"></div>
              <div className="step-number-bg">01</div>
              <div className="step-content">
                <div className="step-icon-wrapper">
                  <i className="fi fi-rr-marker"></i>
                </div>
                <div className="step-text">
                  <h3>Localização</h3>
                  <p>{location ? 
                    'Sua localização foi detectada! Encontramos vizinhos em um raio de até 5km.' : 
                    'O app identifica sua posição e encontra vizinhos em um raio de até 5km.'
                  }</p>
                </div>
              </div>
            </div>
            
            <div className="step-card orange">
              <div className="step-glass-bg"></div>
              <div className="step-number-bg">02</div>
              <div className="step-content">
                <div className="step-icon-wrapper">
                  <i className="fi fi-rr-hand-holding-heart"></i>
                </div>
                <div className="step-text">
                  <h3>Conexão</h3>
                  <p>Você navega pelos pedidos de ajuda ou publica a sua própria necessidade.</p>
                </div>
              </div>
            </div>
            
            <div className="step-card purple">
              <div className="step-glass-bg"></div>
              <div className="step-number-bg">03</div>
              <div className="step-content">
                <div className="step-icon-wrapper">
                  <i className="fi fi-rr-users"></i>
                </div>
                <div className="step-text">
                  <h3>Ação Real</h3>
                  <p>A ajuda acontece no mundo físico. Vizinhos se encontram e se ajudam.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Por que o SolidarBairro?</h2>
            <p style={{ fontSize: '1.4rem', maxWidth: '800px', margin: '0 auto' }}>
              Criamos uma plataforma que resgata o valor da vizinhança e do apoio mútuo em tempos digitais.
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon"><i className="fi fi-rr-bolt"></i></div>
              <h3>Simples</h3>
              <p>Interface intuitiva e direta, pensada para que qualquer pessoa consiga usar sem dificuldades.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="fi fi-rr-marker"></i></div>
              <h3>Próximo</h3>
              <p>Foque em quem está a poucos metros de você, transformando seu bairro em uma rede real.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="fi fi-rr-shield-check"></i></div>
              <h3>Seguro</h3>
              <p>Ambiente moderado e focado exclusivamente em pedidos de ajuda e solidariedade local.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="fi fi-rr-users"></i></div>
              <h3>Humano</h3>
              <p>Sem algoritmos de engajamento. Apenas conexões reais entre pessoas que moram perto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card">
            <h2>Pronto para ser um vizinho solidário?</h2>
            <p>Junte-se a centenas de pessoas que já estão transformando seus bairros em comunidades mais unidas.</p>
            <button className="btn-primary-lg" onClick={() => navigate('/painel-social')}>
              Começar Agora Gratuitamente <i className="fi fi-rr-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="landing-footer">
        <div className="section-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="logo">
                <i className="fi fi-rr-heart logo-icon"></i>
                <span style={{ fontSize: '2.5rem' }}>SolidarBairro</span>
              </div>
              <p className="footer-tagline">
                Transformando ruas em comunidades e vizinhos em amigos através da ajuda mútua.
              </p>
            </div>
            
            <div className="footer-grid">
              <div className="footer-col">
                <h4>Nossa missão</h4>
                <p>Conectamos vizinhos para criar uma rede de apoio mútuo local. Ajudamos moradores a encontrar e oferecer ajuda em suas comunidades, fortalecendo laços através da solidariedade.</p>
              </div>
              <div className="footer-col">
                <h4>O que fazemos</h4>
                <p>Conectamos necessidades reais com pessoas dispostas a ajudar. Nossa tecnologia serve apenas como ponte para o encontro humano.</p>
              </div>
              <div className="footer-col">
                <h4>Para quem</h4>
                <p>Moradores locais que querem fazer a diferença ou que precisam de um apoio em momentos de necessidade.</p>
              </div>
              <div className="footer-col">
                <h4>Nossa visão</h4>
                <p>Plataforma simples, segura e focada na sua vizinhança. Um bairro solidário é um bairro mais forte.</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 SolidarBairro. Inspirando solidariedade local.</p>
            <div style={{ display: 'flex', gap: '32px' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Termos</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacidade</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;