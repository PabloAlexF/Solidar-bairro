import React from 'react';
import { Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="about" className="landing-footer">
      <div className="section-container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="logo-wrapper">
              <Heart className="heart-icon" fill="#0d9488" size={32} />
              <span className="logo-name">SolidarBrasil</span>
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
                📧 Email: <a href="mailto:solidarbrasil@gmail.com">solidarbrasil@gmail.com</a><br/>
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
          <p className="copyright">
            &copy; {new Date().getFullYear()} SolidarBrasil. Conectando comunidades, transformando vidas. 💚
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;