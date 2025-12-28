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
    const loadPedidos = () => {
      const savedPedidos = localStorage.getItem('solidar-pedidos');
      if (savedPedidos) {
        setPedidos(JSON.parse(savedPedidos));
      }
    };
    
    loadPedidos();
    
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

  return (
    <div className="quero-ajudar">
      <Header showLoginButton={false} />
      
      <main className="main-content">
        <div className="container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-badge">
              <i className="fi fi-rr-heart"></i>
              <span>Solidariedade em ação</span>
            </div>
            <h1 className="hero-title">
              Encontre quem precisa da sua <span className="text-primary">ajuda</span>
            </h1>
            <p className="hero-subtitle">
              Conecte-se com vizinhos que precisam de apoio. Cada gesto conta para fortalecer nossa comunidade.
            </p>
          </section>

          {/* Filtros */}
          <section className="filters-section">
            <div className="filters-header">
              <h3>Filtrar por categoria</h3>
              <p>Encontre exatamente o tipo de ajuda que você pode oferecer</p>
            </div>
            <div className="filters-container">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  <i className={`fi fi-rr-${filter === 'Todos' ? 'apps' : filter === 'Alimentos' ? 'apple' : filter === 'Roupas' ? 'shirt' : filter === 'Medicamentos' ? 'medicine' : filter === 'Contas' ? 'calculator' : 'briefcase'}`}></i>
                  {filter}
                </button>
              ))}
            </div>
          </section>

          {/* Lista de Pedidos */}
          <section className="pedidos-section">
            <div className="section-header">
              <h2>Pedidos próximos a você</h2>
              <div className="header-actions">
                <span className="pedidos-count">{filteredPedidos.length} pedidos</span>
                <button className="refresh-btn">
                  <i className="fi fi-rr-refresh"></i>
                </button>
              </div>
            </div>

            <div className="pedidos-grid">
              {filteredPedidos.length === 0 ? (
                <div className="no-pedidos">
                  <div className="no-pedidos-icon">
                    <i className="fi fi-rr-search-heart"></i>
                  </div>
                  <h3>Nenhum pedido encontrado</h3>
                  <p>Quando alguém precisar de ajuda na sua região, os pedidos aparecerão aqui.</p>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/preciso-de-ajuda')}
                  >
                    <i className="fi fi-rr-plus"></i>
                    Fazer um pedido
                  </button>
                </div>
              ) : (
                filteredPedidos.map((pedido) => (
                  <div key={pedido.id} className="pedido-card">
                    <div className="card-header">
                      <div className="category-badge">
                        <i className={`fi fi-rr-${pedido.tipo === 'Alimentos' ? 'apple' : pedido.tipo === 'Roupas' ? 'shirt' : pedido.tipo === 'Medicamentos' ? 'medicine' : pedido.tipo === 'Contas' ? 'calculator' : 'briefcase'}`}></i>
                        <span>{pedido.tipo}</span>
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
                          <i className="fi fi-rr-marker"></i>
                          <span>{pedido.distancia || '500m'}</span>
                        </div>
                        <div className="meta-item">
                          <i className="fi fi-rr-clock"></i>
                          <span>{pedido.tempo || '2h atrás'}</span>
                        </div>
                        <div className="meta-item">
                          <i className="fi fi-rr-user"></i>
                          <span>{pedido.usuario || 'Usuário'}</span>
                          {pedido.verificado && <i className="fi fi-rr-badge-check verified"></i>}
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => navigate(`/necessidade/${pedido.id}`)}
                      >
                        <i className="fi fi-rr-eye"></i>
                        Ver detalhes
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => navigate(`/necessidade/${pedido.id}`)}
                      >
                        <i className="fi fi-rr-heart"></i>
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
              <div className="cta-icon">
                <i className="fi fi-rr-bell"></i>
              </div>
              <h3>Receba notificações de novos pedidos</h3>
              <p>Seja avisado quando surgirem pedidos de ajuda na sua região.</p>
              <button className="btn-cta">
                <i className="fi fi-rr-bell-ring"></i>
                Ativar notificações
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default QueroAjudar;