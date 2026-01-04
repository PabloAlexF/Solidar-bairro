import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChatDemo from '../components/ChatDemo';
import '../styles/pages/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;
  const [mobileScrollIndex, setMobileScrollIndex] = useState(0);

  useEffect(() => {
    // Auto-slide carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [totalSlides]);

  const handleCardClick = (route) => {
    if (isAuthenticated()) {
      navigate(route);
    } else {
      navigate('/login');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Handle mobile scroll detection
  const handleMobileScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = 260; // 240px card + 20px gap
    const newIndex = Math.round(scrollLeft / cardWidth);
    setMobileScrollIndex(newIndex);
  };

  // Calculate transform based on card width
  const getTransform = () => {
    return `translateX(-${currentSlide * 300}px)`;
  };

  return (
    <div className="home">
      <main className="home-main">
        <section className="hero-section">
          <div className="container">
            <div className="hero-badge">
              <span className="badge-text">✨ Plataforma de Solidariedade</span>
            </div>
            
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="brand-name">SolidarBairro</span>
                <span className="main-headline">A rede de ajuda da sua <span className="text-primary">vizinhança</span></span>
              </h1>
              <p className="hero-subtitle">
                Conecte-se com vizinhos, ofereça ou receba ajuda, e fortaleça os laços da sua comunidade. Juntos somos mais fortes.
              </p>
            </div>

            <div className="options-grid">
              <div className="option-card" onClick={() => handleCardClick('/quero-ajudar')}>
                <div className="option-icon primary">
                  <i className="fi fi-rr-heart"></i>
                </div>
                <div className="option-badge">Solidariedade</div>
                <h2 className="option-title">Quero Ajudar</h2>
                <p className="option-description">
                  Descubra pessoas próximas que precisam da sua ajuda. Seja a diferença na vida de alguém.
                </p>
                <div className="option-stats">
                  <span className="stat-item"><i className="fi fi-rr-marker"></i> No seu bairro</span>
                  <span className="stat-item"><i className="fi fi-rr-bolt"></i> Tempo real</span>
                </div>
                <button className="option-button primary">
                  <span>Ver pedidos</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <div className="option-card" onClick={() => handleCardClick('/preciso-de-ajuda')}>
                <div className="option-icon secondary">
                  <i className="fi fi-rr-hand-holding-heart"></i>
                </div>
                <div className="option-badge">Comunidade</div>
                <h2 className="option-title">Preciso de Ajuda</h2>
                <p className="option-description">
                  Compartilhe sua necessidade com vizinhos dispostos a ajudar. Você não está sozinho.
                </p>
                <div className="option-stats">
                  <span className="stat-item"><i className="fi fi-rr-shield-check"></i> Seguro</span>
                  <span className="stat-item"><i className="fi fi-rr-badge-check"></i> Verificado</span>
                </div>
                <button className="option-button secondary">
                  <span>Pedir ajuda</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="hero-decorations">
            <div className="decoration decoration-1"></div>
            <div className="decoration decoration-2"></div>
            <div className="decoration decoration-3"></div>
          </div>
        </section>

        <section className="info-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Por que escolher o SolidarBairro?</h2>
              <p className="section-subtitle">Simples, seguro e eficiente</p>
            </div>
            
            <div className="info-grid" onScroll={handleMobileScroll}>
              <div className="info-item">
                <div className="info-icon">
                  <i className="fi fi-rr-marker"></i>
                </div>
                <div className="info-number">01</div>
                <h3>Próximo</h3>
                <p>Pessoas e ajudas<br />próximas à sua<br />localização</p>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fi fi-rr-bolt"></i>
                </div>
                <div className="info-number">02</div>
                <h3>Simples</h3>
                <p>Publique ou responda<br />em poucos cliques</p>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fi fi-rr-shield-check"></i>
                </div>
                <div className="info-number">03</div>
                <h3>Seguro</h3>
                <p>Perfis e ações<br />verificadas pela<br />comunidade</p>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fi fi-rr-map"></i>
                </div>
                <div className="info-number">04</div>
                <h3>Mapa em tempo real</h3>
                <p>Visualize pedidos com<br />localização ao vivo<br />no mapa</p>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fi fi-rr-bell"></i>
                </div>
                <div className="info-number">05</div>
                <h3>Notificações</h3>
                <p>Receba alertas quando<br />surgirem pedidos<br />perto de você</p>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fi fi-rr-comment"></i>
                </div>
                <div className="info-number">06</div>
                <h3>Contato direto</h3>
                <p>Converse com quem<br />publicou — WhatsApp,<br />telefone ou chat interno</p>
              </div>
            </div>
            
            <div className="mobile-carousel-dots">
              {[...Array(6)].map((_, index) => (
                <span 
                  key={index}
                  className={`mobile-dot ${mobileScrollIndex === index ? 'active' : ''}`}
                ></span>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-content">
              <div className="about-badge">
                <span className="about-badge-text"><i className="fi fi-rr-handshake"></i> Nossa missão</span>
              </div>
              
              <h2 className="about-title">Sobre nós</h2>
              <p className="about-description">
                Conectamos vizinhos para criar uma rede de apoio mútuo local. 
                Ajudamos moradores a encontrar e oferecer ajuda em suas comunidades, 
                fortalecendo laços através da solidariedade.
              </p>
              
              <div className="about-grid">
                <div className="about-card">
                  <div className="about-icon">
                    <i className="fi fi-rr-users"></i>
                  </div>
                  <h3>Para quem</h3>
                  <p>Moradores locais que querem fazer a diferença em sua comunidade</p>
                </div>
                
                <div className="about-card">
                  <div className="about-icon">
                    <i className="fi fi-rr-heart"></i>
                  </div>
                  <h3>O que fazemos</h3>
                  <p>Conectamos necessidades com pessoas dispostas a ajudar</p>
                </div>
                
                <div className="about-card">
                  <div className="about-icon">
                    <i className="fi fi-rr-star"></i>
                  </div>
                  <h3>Nossa tecnologia</h3>
                  <p>Plataforma simples, segura e focada na sua vizinhança</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="container">
          <p>© 2025 SolidarBairro. Criando impacto social perto de casa.</p>
        </div>
      </footer>

      {/* Demo do Chat - apenas para desenvolvimento */}
      <ChatDemo />

      {/* Modal de Login */}
      {isAuthOpen && (
        <div className="modal-overlay login-required-modal" onClick={() => setIsAuthOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">🔐</div>
              <h2>Acesso Restrito</h2>
              <p>Para continuar, você precisa estar conectado à plataforma.</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => {
                  setIsAuthOpen(false);
                  window.dispatchEvent(new CustomEvent('openLogin'));
                }}
              >
                Conectar-se
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => setIsAuthOpen(false)}
              >
                Voltar
              </button>
            </div>
            
            <button 
              className="modal-close"
              onClick={() => setIsAuthOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;