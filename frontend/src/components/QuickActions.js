import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/QuickActions.css';

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <section className="quick-actions">
      <div className="container">
        <div className="actions-grid">
          <div className="action-card ask-help" onClick={() => navigate('/cadastro-familia')}>
            <div className="action-header">
              <div className="action-icon">+</div>
              <h3>Cadastrar família</h3>
            </div>
            <p>Registre uma nova família no sistema</p>
          </div>
          
          <div className="action-card offer-help" onClick={() => navigate('/painel-social')}>
            <div className="action-header">
              <div className="action-icon">📊</div>
              <h3>Painel social</h3>
            </div>
            <p>Visualize dados e famílias do bairro</p>
          </div>
          
          <div className="action-card view-map">
            <div className="action-header">
              <div className="action-icon">○</div>
              <h3>Ver no mapa</h3>
            </div>
            <p>Enxergue as ajudas ao seu redor</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;