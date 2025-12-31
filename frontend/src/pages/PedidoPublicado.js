import React from 'react';
import Header from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PedidoPublicado.css';

const PedidoPublicado = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="pedido-publicado-container">
        <div className="pedido-publicado-content">
          
          {/* Layout Mobile */}
          <div className="mobile-version">
            <div className="success-icon">
              <div className="check-circle">
                <span>✓</span>
              </div>
            </div>
            
            <h1 className="success-title">Pedido publicado com sucesso!</h1>
            <p className="success-message">
              Sua solicitação já está visível para a comunidade. 
              Você receberá notificações quando alguém quiser ajudar.
            </p>

            <div className="mobile-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/quero-ajudar')}
              >
                Ajudar outras pessoas
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Voltar ao início
              </button>
            </div>
          </div>

          {/* Layout Desktop */}
          <div className="desktop-version">
            
            {/* Coluna Esquerda */}
            <div className="left-column">
              <div className="status-badge">
                <div className="status-dot"></div>
                <span>Pedido Ativo</span>
              </div>
              
              <div className="success-header">
                <div className="success-icon-desktop">
                  <span>✓</span>
                </div>
                <h1 className="desktop-title">
                  Seu pedido foi <span className="highlight">publicado!</span>
                </h1>
                <p className="desktop-subtitle">
                  Pronto! Sua solicitação já está visível para vizinhos próximos 
                  que estão prontos para ajudar.
                </p>
              </div>

              <div className="notification-card">
                <div className="card-icon">📱</div>
                <div className="card-content">
                  <h3>Notificações em tempo real</h3>
                  <p>Fique atento ao seu celular. Você receberá um aviso assim que alguém se candidatar para te ajudar.</p>
                </div>
              </div>

              <div className="security-info">
                <span className="security-icon">🔒</span>
                <span>Suas informações estão 100% seguras</span>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="right-column">
              <div className="cta-header">
                <div className="cta-icon">⚡</div>
                <span className="cta-label">ENQUANTO ESPERA</span>
              </div>
              
              <h2 className="cta-title">
                Que tal retribuir ajudando alguém? 🤝
              </h2>
              <p className="cta-text">
                Fortalecemos nossa comunidade quando nos ajudamos mutuamente. 
                Existem vizinhos precisando de você agora!
              </p>

              <div className="cta-actions">
                <button 
                  className="btn-primary-desktop"
                  onClick={() => navigate('/quero-ajudar')}
                >
                  <span className="btn-icon">⭐</span>
                  Descobrir como posso ajudar
                </button>

                <button 
                  className="btn-secondary-desktop"
                  onClick={() => navigate('/')}
                >
                  <span className="btn-arrow">←</span>
                  Voltar ao início
                </button>
              </div>

              <div className="impact-cards">
                <div className="impact-card">
                  <div className="mini-card-icon">❤️</div>
                  <div className="mini-card-content">
                    <h4>IMPACTO</h4>
                    <p>Pequenos gestos mudam o dia de alguém</p>
                  </div>
                </div>
                <div className="union-card">
                  <div className="mini-card-icon">👥</div>
                  <div className="mini-card-content">
                    <h4>UNIÃO</h4>
                    <p>Mais de 500 ajudas esta semana</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PedidoPublicado;