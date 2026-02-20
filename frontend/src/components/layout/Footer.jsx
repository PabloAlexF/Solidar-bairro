import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import marca from '../../assets/images/marca.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="about" className="landing-footer">
      <div className="section-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="logo-wrapper">
              <div className="logo-icon" style={{ width: '48px', height: '48px', position: 'relative', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={marca} alt="SolidarBrasil" style={{ width: '80px', height: '80px', objectFit: 'contain', position: 'absolute', top: '60%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              </div>
              <span className="logo-text">Solidar<span className="logo-accent">Brasil</span></span>
            </div>
            <p className="footer-tagline">
              Plataforma de solidariedade comunitária que conecta pessoas que precisam de ajuda com aquelas que podem ajudar.
            </p>
          </div>
          
          <div className="footer-info-grid">
            <div className="footer-column">
              <h4 className="column-title">Nossa Missão</h4>
              <p className="column-text">
                Conectar vizinhos e fortalecer os laços da comunidade através de uma rede de apoio mútuo, promovendo solidariedade e segurança local.
              </p>
            </div>
            
            <div className="footer-column">
              <h4 className="column-title">Contato</h4>
              <p className="column-text">
                📧 Email: <a href="mailto:contato@solidarbrasil.com">contato@solidarbrasil.com</a><br/>
                📱 Telefone: <a href="tel:+5531925383871">(31) 9253-8371</a>
              </p>
            </div>
            
            <div className="footer-column">
              <h4 className="column-title">Tecnologia</h4>
              <p className="column-text">
                React.js • Node.js • Firebase • Geolocalização em tempo real • Design responsivo mobile-first
              </p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Link to="/politica-privacidade" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
              Política de Privacidade
            </Link>
            <Link to="/termos-uso" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
              Termos de Uso
            </Link>
          </div>
          <p className="copyright">
            &copy; {new Date().getFullYear()} SolidarBrasil. Conectando comunidades, transformando vidas. 💚
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;