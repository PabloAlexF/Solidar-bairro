import React, { useState } from 'react';
import '../styles/components/NearbyHelps.css';

const NearbyHelps = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  
  const filters = ['Todos', 'Pedidos', 'Ofertas', 'Urgentes'];
  
  const helps = [
    {
      id: 1,
      type: 'pedido',
      name: 'Maria Silva',
      distance: '450m',
      category: 'Alimentos',
      description: 'Preciso de cesta básica para minha família (2 adultos e 2 crianças)',
      avatar: 'M'
    },
    {
      id: 2,
      type: 'oferta',
      name: 'João Santos',
      distance: '800m',
      category: 'Roupas',
      description: 'Roupas de bebê de 0 a 1 ano, em bom estado. Entrega combinada',
      avatar: 'J'
    }
  ];

  return (
    <section className="nearby-helps">
      <div className="container">
        <div className="section-header">
          <h2>Ajudas perto de você</h2>
          <div className="filters">
            {filters.map(filter => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="helps-list">
          {helps.map(help => (
            <div key={help.id} className="help-card">
              <div className="help-header">
                <div className="help-info">
                  <div className="help-avatar">{help.avatar}</div>
                  <div className="help-details">
                    <h3>{help.name}</h3>
                    <div className="help-meta">
                      {help.distance} • {help.category}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="help-description">
                {help.description}
              </div>
              
              <div className="help-actions">
                <button className="btn btn-secondary">
                  {help.type === 'pedido' ? 'Ver detalhes' : 'Ajudar agora'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearbyHelps;