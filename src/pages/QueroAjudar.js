import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/QueroAjudar.css';

const QueroAjudar = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filters = ['Todos', 'Alimentos', 'Roupas', 'Medicamentos', 'Contas', 'Trabalho'];

  const pedidos = [
    {
      id: 1,
      tipo: 'Alimentos',
      titulo: 'Cesta básica para família',
      descricao: 'Família com 4 pessoas, incluindo 2 crianças, sem renda há 2 meses.',
      distancia: '0.8 km',
      urgencia: 'Alta',
      tempo: '2h atrás',
      usuario: 'Maria S.',
      verificado: true
    },
    {
      id: 2,
      tipo: 'Contas',
      titulo: 'Conta de luz em atraso',
      descricao: 'Preciso de ajuda para pagar conta de energia elétrica no valor de R$ 180.',
      distancia: '1.2 km',
      urgencia: 'Média',
      tempo: '4h atrás',
      usuario: 'João M.',
      verificado: false
    },
    {
      id: 3,
      tipo: 'Medicamentos',
      titulo: 'Remédio para pressão alta',
      descricao: 'Idoso precisa de medicamento Losartana 50mg para controle da pressão.',
      distancia: '0.5 km',
      urgencia: 'Alta',
      tempo: '1h atrás',
      usuario: 'Ana L.',
      verificado: true
    },
    {
      id: 4,
      tipo: 'Roupas',
      titulo: 'Roupas de inverno infantil',
      descricao: 'Roupas para criança de 8 anos, especialmente casacos e calças.',
      distancia: '2.1 km',
      urgencia: 'Baixa',
      tempo: '6h atrás',
      usuario: 'Carlos R.',
      verificado: true
    }
  ];

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
      <Header />
      
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
              {filteredPedidos.map((pedido) => (
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
              ))}
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