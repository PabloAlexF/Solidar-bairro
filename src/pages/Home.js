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
  }, []);

  const handleCardClick = (route) => {
    if (user && user.isVerified) {
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
          </div>
        </section>

        <section className="info-section">
          <div className="container">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-number">01</div>
                <h3>Próximo</h3>
                <p>Apenas vizinhos do seu bairro</p>
              </div>
              <div className="info-item">
                <div className="info-number">02</div>
                <h3>Simples</h3>
                <p>Conectar e ajudar em poucos cliques</p>
              </div>
              <div className="info-item">
                <div className="info-number">03</div>
                <h3>Seguro</h3>
                <p>Comunidade verificada e confiável</p>
              </div>
            </div>
          </div>
        </section>

        <section className="join-section">
          <div className="container">
            <div className="join-content">
              <h2 className="join-title">Junte-se ao SolidarBairro</h2>
              <p className="join-subtitle">Faça parte de uma comunidade que se importa</p>
              
              <div className="join-features">
                <div className="feature">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9,22 9,12 15,12 15,22"></polyline>
                    </svg>
                  </div>
                  <span>Vizinhança conectada</span>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon>
                    </svg>
                  </div>
                  <span>Ajuda instantânea</span>
                </div>
                <div className="feature">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <circle cx="12" cy="16" r="1"></circle>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                  <span>100% seguro</span>
                </div>
              </div>
              
              <button 
                className="join-button"
                onClick={() => {
                  if (user && user.isVerified) {
                    navigate('/quero-ajudar');
                  } else {
                    window.dispatchEvent(new CustomEvent('openLogin'));
                  }
                }}
              >
                Começar agora
              </button>
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