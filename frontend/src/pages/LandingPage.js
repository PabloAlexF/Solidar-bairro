import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Users 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock user and auth - replace with your actual auth context
  const user = null; // Replace with actual user from context
  const isAuthenticated = () => false; // Replace with actual auth check

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

      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="section-container nav-container">
          <div className="logo cursor-pointer" onClick={() => navigate('/')}>
            <Heart className="logo-icon text-[#0d9488]" fill="#0d9488" size={28} />
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
                          </div>
                          <div className="user-phone">{user?.email || "Vizinho Solidário"}</div>
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
                          <User size={18} /> Ver perfil
                        </button>
                        
                        <button 
                          className="menu-item"
                          onClick={() => {
                            navigate('/conversas');
                            setShowUserMenu(false);
                          }}
                        >
                          <MessageSquare size={18} /> Minhas conversas
                        </button>
                        
                        <button className="menu-item logout-btn">
                          <LogOut size={18} /> Sair
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
      <header className="hero">
        <div className="hero-mesh-bg">
          <div className="mesh-circle mesh-1"></div>
          <div className="mesh-circle mesh-2"></div>
          <div className="mesh-circle mesh-3"></div>
        </div>
        
        <div className="section-container hero-container">
          <div className="hero-content">
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
                onClick={() => navigate('/painel-social')}
              >
                Explorar Plataforma <ArrowRight className="ml-2" />
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
            </div>
            
            <div className="glass-card floating-glass-1">
              <div className="glass-icon-box teal">
                <Heart size={20} />
              </div>
              <div className="glass-content">
                <span className="glass-label">Impacto Social</span>
                <span className="glass-value">+1.2k Ajudas</span>
              </div>
            </div>

            <div className="glass-card floating-glass-2">
              <div className="glass-icon-box orange">
                <Navigation size={20} />
              </div>
              <div className="glass-content">
                <span className="glass-label">{location ? 'Sua Localização' : 'Proximidade'}</span>
                <span className="glass-value">{location ? 'Detectada' : 'Raio de 2km'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Action Cards */}
      <section className="action-cards-section">
        <div className="section-container">
          <div className="cards-grid">
              <div className="action-card teal-theme">
                <div className="card-icon-wrapper teal">
                  <Heart size={40} />
                </div>
                <h2>Quero ajudar</h2>
                <p>Descubra pessoas próximas que precisam da sua ajuda. Seja a diferença na vida de alguém com pequenos gestos.</p>
                <button className="btn-card" onClick={() => navigate('/quero-ajudar')}>
                  Ver oportunidades <ChevronRight size={18} />
                </button>
              </div>

              <div className="action-card orange-theme">
                <div className="card-icon-wrapper orange">
                  <HandHelping size={40} />
                </div>
                <h2>Preciso de Ajuda</h2>
                <p>Compartilhe sua necessidade com vizinhos dispostos a ajudar. Você não está sozinho nesta jornada.</p>
                <button className="btn-card" onClick={() => navigate('/preciso-de-ajuda')}>
                  Pedir ajuda <ChevronRight size={18} />
                </button>
              </div>

              <div className="action-card purple-theme">
                <div className="card-icon-wrapper purple">
                  <Search size={40} />
                </div>
                <h2>Achados e Perdidos</h2>
                <p>Localize documentos, veículos ou bens perdidos na sua vizinhança. Ajude a devolver o que foi perdido.</p>
                <button className="btn-card" style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }} onClick={() => navigate('/achados-e-perdidos')}>
                  Ver itens <ChevronRight size={18} />
                </button>
              </div>
          </div>
        </div>
      </section>

      {/* Geolocation Section */}
      <section className="geo-showcase">
        <div className="section-container geo-container">
          <div className="geo-visual">
            <div className="flex items-center justify-center h-full">
              <MapPin size={100} className="text-[#0d9488]" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-64 h-64 border-2 border-[#0d9488]/20 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
          
          <div className="geo-content">
            <div className="icon-tag teal"><MapPin size={32} /></div>
            <h2>Geolocalização Inteligente</h2>
            <p>O SolidarBairro utiliza tecnologia para garantir que você veja apenas o que realmente importa: <strong>sua vizinhança direta</strong>.</p>
            
            <ul className="geo-list">
              <li><div className="li-icon"><Search size={20} /></div><span>Busca por raio de até 5km</span></li>
              <li><div className="li-icon"><Navigation size={20} /></div><span>Privacidade garantida</span></li>
              <li><div className="li-icon"><MapPin size={20} /></div><span>Filtros por bairro</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <h2>Como o SolidarBairro funciona?</h2>
            <p>Uma jornada simples para fortalecer sua comunidade local.</p>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon-wrapper"><MapPin size={32} /></div>
              <h3>Localização</h3>
              <p>O app identifica sua posição e encontra vizinhos próximos.</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon-wrapper"><HandHelping size={32} /></div>
              <h3>Conexão</h3>
              <p>Você navega pelos pedidos de ajuda ou publica a sua própria necessidade.</p>
            </div>
            
            <div className="step-card">
              <div className="step-icon-wrapper"><Users size={32} /></div>
              <h3>Ação Real</h3>
              <p>A ajuda acontece no mundo físico. Vizinhos se encontram e se ajudam.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Por que o SolidarBairro?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <Zap className="mb-4 text-[#0d9488]" />
              <h3>Simples</h3>
              <p>Interface intuitiva e direta para todos.</p>
            </div>
            <div className="feature-item">
              <MapPin className="mb-4 text-[#0d9488]" />
              <h3>Próximo</h3>
              <p>Foque em quem está a poucos metros de você.</p>
            </div>
            <div className="feature-item">
              <ShieldCheck className="mb-4 text-[#0d9488]" />
              <h3>Seguro</h3>
              <p>Ambiente focado em solidariedade local.</p>
            </div>
            <div className="feature-item">
              <Users className="mb-4 text-[#0d9488]" />
              <h3>Humano</h3>
              <p>Conexões reais entre vizinhos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="landing-footer">
        <div className="section-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="logo">
                <Heart className="text-[#0d9488]" fill="#0d9488" size={32} />
                <span>SolidarBairro</span>
              </div>
              <p className="footer-tagline">Transformando ruas em comunidades.</p>
            </div>
            <div className="footer-grid">
              <div className="footer-col">
                <h4>Nossa missão</h4>
                <p>Conectamos vizinhos para criar uma rede de apoio mútuo local.</p>
              </div>
              <div className="footer-col">
                <h4>Visão</h4>
                <p>Um bairro solidário é um bairro mais forte e seguro.</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SolidarBairro. Inspirando solidariedade local.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;