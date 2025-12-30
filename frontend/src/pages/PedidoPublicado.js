import React from 'react';
import Header from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
const PedidoPublicado = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="pedido-publicado">
        <div className="container">
          <div className="success-content">
            <div className="success-icon">
              <div className="check-circle">
                <span>✓</span>
              </div>
            </div>
            
            <h1>Pedido publicado com sucesso!</h1>
            <p className="success-message">
              Seu pedido de ajuda foi publicado e já está visível para toda a comunidade. 
              Pessoas próximas a você receberão notificações e poderão entrar em contato.
            </p>

            <div className="next-steps">
              <h3>O que acontece agora?</h3>
              <div className="steps-grid">
                <div className="step-item">
                  <div className="step-icon">📱</div>
                  <div className="step-content">
                    <h4>Aguarde contato</h4>
                    <p>Pessoas da comunidade entrarão em contato via WhatsApp</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-icon">🤝</div>
                  <div className="step-content">
                    <h4>Combine detalhes</h4>
                    <p>Converse sobre como e quando receber a ajuda</p>
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-icon">❤️</div>
                  <div className="step-content">
                    <h4>Receba apoio</h4>
                    <p>A comunidade está aqui para te ajudar</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tips-section">
              <h3>💡 Dicas importantes</h3>
              <ul className="tips-list">
                <li>Mantenha seu WhatsApp disponível para receber mensagens</li>
                <li>Seja específico sobre suas necessidades ao conversar</li>
                <li>Combine encontros em locais seguros e públicos</li>
                <li>Agradeça sempre quem se dispuser a ajudar</li>
                <li>Atualize seu pedido quando não precisar mais</li>
              </ul>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/')}
              >
                Ver outros pedidos de ajuda
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
              >
                Voltar ao início
              </button>
            </div>

            <div className="contact-support">
              <p>Precisa de ajuda ou tem dúvidas?</p>
              <p>Entre em contato: <strong>(31) 99999-0000</strong></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PedidoPublicado;