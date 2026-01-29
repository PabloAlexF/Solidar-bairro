import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, X, Shield, MapPin, Heart, Search, 
  ArrowRight, CheckCircle, Users, Building2,
  Instagram, Facebook, Twitter, Mail, Phone
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Impede o scroll do body quando o menu está aberto
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  return (
    <div className="landing-page">
      <header className={`landing-header ${scrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="header-container">
          <div className="logo-area" onClick={() => navigate('/')}>
            <div className="logo-icon-wrapper">
              <Shield className="logo-icon" size={28} strokeWidth={2.5} />
            </div>
            <span className="logo-text">SolidarBairro</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <a href="#como-funciona" className="nav-link">Como Funciona</a>
            <a href="#funcionalidades" className="nav-link">Funcionalidades</a>
            <a href="#comunidade" className="nav-link">Comunidade</a>
            <div className="header-actions">
              <button className="btn-login" onClick={() => navigate('/login')}>Entrar</button>
              <button className="btn-register" onClick={() => navigate('/cadastro')}>Cadastrar</button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <div className={`mobile-dropdown ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <a href="#como-funciona" onClick={toggleMenu}>Como Funciona</a>
            <a href="#funcionalidades" onClick={toggleMenu}>Funcionalidades</a>
            <a href="#comunidade" onClick={toggleMenu}>Comunidade</a>
            <div className="mobile-divider" />
            <div className="header-actions mobile">
              <button className="btn-login mobile" onClick={() => navigate('/login')}>Entrar</button>
              <button className="btn-register mobile" onClick={() => navigate('/cadastro')}>Criar Conta</button>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              Conectando vizinhos
            </div>
            <h1>Solidariedade que<br/>transforma seu bairro</h1>
            <p>A plataforma que une quem quer ajudar a quem precisa de ajuda, criando uma rede de apoio local segura e eficiente.</p>
            
            <div className="hero-actions">
              <button className="cta-primary" onClick={() => navigate('/quero-ajudar')}>
                Quero Ajudar <Heart size={20} />
              </button>
              <button className="cta-secondary" onClick={() => navigate('/preciso-de-ajuda')}>
                Preciso de Ajuda
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <strong>+1.2k</strong>
                <span>Famílias</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>+500</strong>
                <span>Doações</span>
              </div>
            </div>
          </div>
        </section>
        {/* Outras seções viriam aqui */}
      </main>

      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo-area footer-logo">
              <div className="logo-icon-wrapper small">
                <Shield className="logo-icon" size={20} strokeWidth={2.5} />
              </div>
              <span className="logo-text">SolidarBairro</span>
            </div>
            <p>Conectando comunidades e fortalecendo laços de solidariedade em todo o Brasil. Junte-se a nós nessa missão.</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            </div>
          </div>

          <div className="footer-links">
            <div className="link-group">
              <h4>Plataforma</h4>
              <a href="#como-funciona">Como Funciona</a>
              <a href="#funcionalidades">Funcionalidades</a>
              <a href="#seguranca">Segurança</a>
            </div>
            <div className="link-group">
              <h4>Comunidade</h4>
              <a href="#voluntarios">Voluntários</a>
              <a href="#parceiros">Parceiros</a>
              <a href="#blog">Blog</a>
            </div>
            <div className="link-group">
              <h4>Contato</h4>
              <a href="mailto:contato@solidarbairro.com.br" className="contact-link">
                <Mail size={16} /> contato@solidarbairro.com.br
              </a>
              <a href="tel:+5511999999999" className="contact-link">
                <Phone size={16} /> (11) 99999-9999
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SolidarBairro. Todos os direitos reservados.</p>
          <div className="legal-links">
            <a href="/termos">Termos de Uso</a>
            <a href="/privacidade">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}