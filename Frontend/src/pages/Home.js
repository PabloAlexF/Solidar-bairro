import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('solidar-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Listen for user state changes
    const handleUserChange = () => {
      const updatedUser = localStorage.getItem('solidar-user');
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      } else {
        setUser(null);
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleUserChange);
    
    // Listen for custom user update events
    window.addEventListener('userUpdated', handleUserChange);
    
    return () => {
      window.removeEventListener('storage', handleUserChange);
      window.removeEventListener('userUpdated', handleUserChange);
    };
  }, []);

  const handleCardClick = (route) => {
    // Always check fresh user data from localStorage
    const currentUser = localStorage.getItem('solidar-user');
    const userData = currentUser ? JSON.parse(currentUser) : null;
    
    if (userData && userData.isVerified) {
      navigate(route);
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="home">
      <Header showLoginButton={false} />

      <main className="home-main">
        <section className="hero-section">
          <div className="container">
            <div className="hero-badge">
              <span className="badge-text">✨ Conectando comunidades</span>
            </div>
            
            <div className="hero-content">
              <h1 className="hero-title">
                Ajuda que <span className="text-primary">mora ao lado</span>
              </h1>
              <p className="hero-subtitle">
                Conecte-se com vizinhos. Ofereça ou receba ajuda. Fortaleça sua comunidade.
              </p>
            </div>

            <div className="options-grid">
              <div className="option-card" onClick={() => handleCardClick('/quero-ajudar')}>
                <div className="option-icon primary">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h2 className="option-title">Quero Ajudar</h2>
                <p className="option-description">
                  Veja quem precisa de ajuda no seu bairro
                </p>
                <button className="option-button primary">
                  Ver pedidos
                </button>
              </div>

              <div className="option-card" onClick={() => handleCardClick('/preciso-de-ajuda')}>
                <div className="option-icon secondary">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h2 className="option-title">Preciso de Ajuda</h2>
                <p className="option-description">
                  Publique sua necessidade para a comunidade
                </p>
                <button className="option-button secondary">
                  Pedir ajuda
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
            
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="info-number">01</div>
                <h3>Próximo</h3>
                <p>Apenas pessoas da sua cidade</p>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <div className="info-number">02</div>
                <h3>Simples</h3>
                <p>Conectar e ajudar em poucos cliques</p>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div className="info-number">03</div>
                <h3>Seguro</h3>
                <p>Comunidade verificada e confiável</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="container">
            <div className="about-content">
              <div className="about-badge">
                <span className="about-badge-text">🤝 Nossa missão</span>
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
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3>Para quem</h3>
                  <p>Moradores locais que querem fazer a diferença em sua comunidade</p>
                </div>
                
                <div className="about-card">
                  <div className="about-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <h3>O que fazemos</h3>
                  <p>Conectamos necessidades com pessoas dispostas a ajudar</p>
                </div>
                
                <div className="about-card">
                  <div className="about-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </div>
                  <h3>Como</h3>
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