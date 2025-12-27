import React from 'react';
import '../styles/components/UserImpact.css';

const UserImpact = () => {
  return (
    <section className="user-impact">
      <div className="container">
        <div className="impact-card">
          <h3>Seu impacto no bairro</h3>
          
          <div className="impact-stats">
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Famílias ajudadas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Itens doados</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Avaliação</span>
            </div>
          </div>
          
          <button className="btn impact-btn">
            Ver histórico
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserImpact;