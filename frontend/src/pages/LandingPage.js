import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (route) => {
    if (isAuthenticated()) {
      navigate(route);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="bg-mesh"></div>
      
      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container section-container">
          <div className="logo">
            <i className="fi fi-rr-heart logo-icon"></i>
            <span>SolidarBairro</span>
          </div>
          <div className="nav-links">
            <a href="#features">Por que nós?</a>
            <a href="#about">Sobre</a>
            <button className="btn-nav" onClick={() => handleNavigation('/quero-ajudar')}>
              Entrar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-container section-container">
          <div className="hero-content">
            <span className="hero-badge">Comunidade Local</span>
            <h1>SolidarBairro</h1>
            <p className="hero-title-sub">A rede de ajuda da sua vizinhança</p>
            <p className="hero-description">
              Conecte-se com vizinhos, ofereça ou receba ajuda, e fortaleça os laços da sua comunidade. 
              Juntos somos mais fortes.
            </p>
            <div className="hero-actions">
              <button className="btn-primary-lg" onClick={() => handleNavigation('/quero-ajudar')}>
                Começar Agora <i className="fi fi-rr-arrow-right"></i>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-blob">
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800" alt="Solidariedade" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Action Cards */}
      <section className="action-cards-section">
        <div className="section-container">
          <div className="cards-grid">
            {/* Card 1: Quero Ajudar */}
            <div className="action-card">
              <div className="card-icon-wrapper teal">
                <i className="fi fi-rr-heart"></i>
              </div>
              <span className="card-subtitle">Solidariedade</span>
              <h2>Quero ajudar</h2>
              <p>Descubra pessoas próximas que precisam da sua ajuda. Seja a diferença na vida de alguém.</p>
              <button className="btn-card" onClick={() => handleNavigation('/quero-ajudar')}>
                Ver pedidos <i className="fi fi-rr-angle-right"></i>
              </button>
            </div>

            {/* Card 2: Preciso de Ajuda */}
            <div className="action-card">
              <div className="card-icon-wrapper orange">
                <i className="fi fi-rr-hand-holding-heart"></i>
              </div>
              <span className="card-subtitle">Comunidade</span>
              <h2>Preciso de Ajuda</h2>
              <p>Compartilhe sua necessidade com vizinhos dispostos a ajudar. Você não está sozinho.</p>
              <button className="btn-card btn-card-alt" onClick={() => handleNavigation('/preciso-de-ajuda')}>
                Pedir ajuda <i className="fi fi-rr-angle-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Por que escolher o SolidarBairro?</h2>
            <p>Criamos uma plataforma focada no que realmente importa: as pessoas ao seu lado.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon"><i className="fi fi-rr-bolt"></i></div>
              <h3>Simples</h3>
              <p>Interface intuitiva e direta, pensada para todas as idades.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="fi fi-rr-marker"></i></div>
              <h3>Próximo</h3>
              <p>Foque em quem está a poucos metros de você, facilitando a logística.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="fi fi-rr-shield-check"></i></div>
              <h3>Seguro</h3>
              <p>Verificações básicas e histórico de ajuda para maior confiança.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><i className="fi fi-rr-users"></i></div>
              <h3>Focado</h3>
              <p>Sem distrações de redes sociais comuns, foco total em apoio mútuo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="landing-footer">
        <div className="footer-container section-container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="logo">
                <i className="fi fi-rr-heart logo-icon"></i>
                <span>SolidarBairro</span>
              </div>
              <p className="footer-tagline">Transformando bairros em verdadeiras comunidades.</p>
            </div>
            
            <div className="footer-grid">
              <div className="footer-col">
                <h4>Nossa missão</h4>
                <p>Conectamos vizinhos para criar uma rede de apoio mútuo local. Ajudamos moradores a encontrar e oferecer ajuda em suas comunidades, fortalecendo laços através da solidariedade.</p>
              </div>
              <div className="footer-col">
                <h4>Para quem</h4>
                <p>Moradores locais que querem fazer a diferença em sua comunidade.</p>
              </div>
              <div className="footer-col">
                <h4>O que fazemos</h4>
                <p>Conectamos necessidades com pessoas dispostas a ajudar.</p>
              </div>
              <div className="footer-col">
                <h4>Nossa tecnologia</h4>
                <p>Plataforma simples, segura e focada na sua vizinhança.</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 SolidarBairro. Feito com amor para o seu bairro.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;