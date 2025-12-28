import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/QueroAjudar.css';

const QueroAjudar = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [selectedUrgencies, setSelectedUrgencies] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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
    : pedidos.filter(p => {
        const matchesCategory = p.tipo === selectedFilter;
        const matchesUrgency = selectedUrgencies.length === 0 || selectedUrgencies.includes(p.urgencia);
        return matchesCategory && matchesUrgency;
      });

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
      case 'Alimentos': return <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="alimentos" width="20" height="20" />;
      case 'Roupas': return <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png" alt="roupas" width="20" height="20" />;
      case 'Medicamentos': return <img src="https://cdn-icons-png.flaticon.com/512/883/883356.png" alt="medicamentos" width="20" height="20" />;
      case 'Contas': return <img src="https://cdn-icons-png.flaticon.com/512/1611/1611179.png" alt="contas" width="20" height="20" />;
      case 'Trabalho': return <img src="https://cdn-icons-png.flaticon.com/512/1077/1077976.png" alt="trabalho" width="20" height="20" />;
      default: return <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="outros" width="20" height="20" />;
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

          {/* Lista de Pedidos */}
          <section className="pedidos-section">
            <div className="section-header">
              <h2>Pedidos próximos a você</h2>
              <div className="header-actions">
                <span className="pedidos-count">{filteredPedidos.length} pedidos encontrados</span>
                <button 
                  className="filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="fi fi-rr-filter"></i>
                  Filtrar
                </button>
              </div>
            </div>

            {/* Dropdown de Filtros */}
            {showFilters && (
              <div className="filters-dropdown">
                <div className="filters-grid">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      className={`filter-option ${selectedFilter === filter ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setSelectedUrgencies([]);
                        if (filter === 'Todos') {
                          setShowFilters(false);
                        }
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                {/* Filtros de Urgência */}
                {selectedFilter !== 'Todos' && (
                  <div className="urgency-filters">
                    <h4>Nível de urgência:</h4>
                    <div className="urgency-options">
                      {['Alta', 'Média', 'Baixa'].map((urgency) => (
                        <button
                          key={urgency}
                          className={`urgency-option ${selectedUrgencies.includes(urgency) ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedUrgencies(prev => 
                              prev.includes(urgency)
                                ? prev.filter(u => u !== urgency)
                                : [...prev, urgency]
                            );
                          }}
                        >
                          <span className={`urgency-dot ${urgency.toLowerCase()}`}></span>
                          {urgency}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pedidos-grid">
              {filteredPedidos.length === 0 ? (
                <div className="no-pedidos">
                  <div className="no-pedidos-icon">
                    <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="sem pedidos" width="64" height="64" />
                  </div>
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
                          <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="localização" width="16" height="16" className="meta-icon" />
                          <span>{pedido.distancia}</span>
                        </div>
                        <div className="meta-item">
                          <img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="tempo" width="16" height="16" className="meta-icon" />
                          <span>{pedido.tempo}</span>
                        </div>
                        <div className="meta-item">
                          <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="usuário" width="16" height="16" className="meta-icon" />
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