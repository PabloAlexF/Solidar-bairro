import React from 'react';
import Header from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PedidoPublicado.css';

const PedidoPublicado = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="success-page">
        <div className="success-container">
          <div className="success-content">
            
            {/* Coluna Esquerda */}
            <div className="success-left">
              <div className="success-icon">
                <span>✓</span>
              </div>
              
              <h1 className="success-title">
                Seu pedido foi <span className="highlight">publicado!</span>
              </h1>
              
              <p className="success-description">
                Pronto! Sua solicitação já está visível para vizinhos próximos 
                que estão prontos para ajudar.
              </p>

              <div className="notification-card">
                <div className="card-icon">📱</div>
                <div className="card-content">
                  <h3>Notificações em tempo real</h3>
                  <p>Fique atento ao seu celular. Você receberá um aviso assim que alguém se candidatar para te ajudar.</p>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="success-right">
              <div className="cta-section">
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

                <button 
                  className="btn-primary"
                  onClick={() => navigate('/quero-ajudar')}
                >
                  <span className="btn-icon">⭐</span>
                  Descobrir como posso ajudar
                </button>

                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/')}
                >
                  <span className="btn-arrow">←</span>
                  Voltar ao início
                </button>
              </div>

              <div className="impact-cards">
                <div className="impact-card">
                  <div className="mini-icon">❤️</div>
                  <div className="mini-content">
                    <h4>IMPACTO</h4>
                    <p>Pequenos gestos mudam o dia de alguém</p>
                  </div>
                </div>
                <div className="impact-card">
                  <div className="mini-icon">👥</div>
                  <div className="mini-content">
                    <h4>UNIÃO</h4>
                    <p>Mais de 500 ajudas esta semana</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
};

export default PedidoPublicado;