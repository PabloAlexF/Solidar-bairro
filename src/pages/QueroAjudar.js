import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/QueroAjudar.css';

const QueroAjudar = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [pedidos, setPedidos] = useState([]);

  const filters = ['Todos', 'Alimentos', 'Roupas', 'Medicamentos', 'Contas', 'Trabalho'];

  useEffect(() => {
    // Carregar pedidos reais do localStorage
    const loadPedidos = () => {
      const savedPedidos = localStorage.getItem('solidar-pedidos');
      if (savedPedidos) {
        setPedidos(JSON.parse(savedPedidos));
      }
    };
    
    loadPedidos();
    
    // Escutar por novos pedidos
    const handleNewPedido = () => {
      loadPedidos();
    };
    
    window.addEventListener('pedidoAdded', handleNewPedido);
    
    return () => {
      window.removeEventListener('pedidoAdded', handleNewPedido);
    };
  }, []);

  const filteredPedidos = selectedFilter === 'Todos' 
    ? pedidos 
    : pedidos.filter(p => p.tipo === selectedFilter);

  const getUrgencyColor = (urgencia) => {
    switch(urgencia) {
      case 'Alta': return '#ef4444';
      case 'Média': return '#f59e0b';
      case 'Baixa': return '#22c55e';
      default: return '#64748b';
    }
  };

  const getCategoryIcon = (tipo) => {
    switch(tipo) {
      case 'Alimentos': return '🛒';
      case 'Roupas': return '👕';
      case 'Medicamentos': return '💊';
      case 'Contas': return '💡';
      case 'Trabalho': return '💼';
      default: return '❤️';
    }
  };

  return (
    <div className="quero-ajudar">
      <Header showLoginButton={false} />
      
      <main className="main-content">
        <div className="container">
          {/* Hero Section */}
          <section className="hero-section">
            <h1 className="hero-title">Como você gostaria de ajudar?</h1>
            <p className="hero-subtitle">
              Encontre pessoas no seu bairro que precisam de uma mãozinha. 
              Cada gesto de solidariedade fortalece nossa comunidade.
            </p>
          </section>

          {/* Filtros */}
          <section className="filters-section">
            <div className="filters-container">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </section>

          {/* Lista de Pedidos */}
          <section className="pedidos-section">
            <div className="section-header">
              <h2>Pedidos próximos a você</h2>
              <span className="pedidos-count">{filteredPedidos.length} pedidos encontrados</span>
            </div>

            <div className="pedidos-grid">
              {filteredPedidos.length === 0 ? (
                <div className="no-pedidos">
                  <div className="no-pedidos-icon">💝</div>
                  <h3>Nenhum pedido de ajuda ainda</h3>
                  <p>Quando alguém precisar de ajuda na sua região, os pedidos aparecerão aqui.</p>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/preciso-de-ajuda')}
                  >
                    Fazer um pedido
                  </button>
                </div>
              ) : (
                filteredPedidos.map((pedido) => (
                  <div key={pedido.id} className="pedido-card">
                    <div className="card-header">
                      <div className="category-badge">
                        <span className="category-icon">{getCategoryIcon(pedido.tipo)}</span>
                        <span className="category-text">{pedido.tipo}</span>
                      </div>
                      <div className="urgency-badge" style={{ backgroundColor: getUrgencyColor(pedido.urgencia) }}>
                        {pedido.urgencia}
                      </div>
                    </div>

                    <div className="card-content">
                      <h3 className="pedido-titulo">{pedido.titulo}</h3>
                      <p className="pedido-descricao">{pedido.descricao}</p>
                      
                      <div className="pedido-meta">
                        <div className="meta-item">
                          <span className="meta-icon">📍</span>
                          <span>{pedido.distancia}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">⏰</span>
                          <span>{pedido.tempo}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-icon">👤</span>
                          <span>{pedido.usuario}</span>
                          {pedido.verificado && <span className="verified-icon">✓</span>}
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => navigate(`/necessidade/${pedido.id}`)}
                      >
                        Ver detalhes
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => navigate(`/necessidade/${pedido.id}`)}
                      >
                        Quero ajudar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Call to Action */}
          <section className="cta-section">
            <div className="cta-card">
              <h3>Não encontrou como ajudar?</h3>
              <p>Cadastre-se para receber notificações de novos pedidos na sua região.</p>
              <button className="btn-cta">Receber notificações</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default QueroAjudar;