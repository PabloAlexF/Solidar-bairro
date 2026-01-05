import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Pedidos.css';

// Função para obter cores de categoria
const getCategoryColor = (category) => {
  const colors = {
    'Alimentos': '#f97316',
    'Roupas': '#a855f7',
    'Contas': '#f59e0b',
    'Servicos': '#3b82f6',
    'Higiene': '#06b6d4',
    'Medicamentos': '#ef4444'
  };
  return colors[category] || '#64748b';
};

// Função para obter cores de urgência
const getUrgencyColor = (urgency) => {
  const colors = {
    'alta': '#ef4444',
    'media': '#f59e0b',
    'baixa': '#22c55e'
  };
  return colors[urgency] || '#64748b';
};

const Pedidos = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Todos');
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [step, setStep] = useState(1);
  const [acceptedRules, setAcceptedRules] = useState(false);

  const filters = ['Todos', 'Alimentos', 'Roupas', 'Contas', 'Servicos', 'Outros'];
  
  const allCategories = [
    { name: 'Alimentos', icon: '🛒', color: '#ff6b35' },
    { name: 'Roupas', icon: '👕', color: '#8b5cf6' },
    { name: 'Calçados', icon: '👟', color: '#06b6d4' },
    { name: 'Contas', icon: '🧾', color: '#f59e0b' },
    { name: 'Servicos', icon: '🔧', color: '#3b82f6' },
    { name: 'Higiene', icon: '🧼', color: '#10b981' },
    { name: 'Medicamentos', icon: '💊', color: '#ef4444' },
    { name: 'Móveis', icon: '🪑', color: '#84cc16' },
    { name: 'Eletrodomésticos', icon: '📺', color: '#6366f1' },
    { name: 'Material Escolar', icon: '📚', color: '#ec4899' },
    { name: 'Transporte', icon: '🚌', color: '#14b8a6' },
    { name: 'Outros', icon: '❤️', color: '#64748b' }
  ];

  const pedidos = [
    {
      id: 1,
      userName: 'Maria Silva',
      isAnonymous: false,
      category: 'Alimentos',
      description: 'Familia com 4 pessoas, incluindo 2 criancas, sem renda ha 2 meses. Precisamos urgentemente de cesta basica.',
      distance: '0.8 km',
      profile: 'Cidadao',
      urgency: 'alta',
      status: 'aberto'
    },
    {
      id: 2,
      userName: 'Anonimo',
      isAnonymous: true,
      category: 'Contas',
      description: 'Preciso de ajuda para pagar conta de luz que esta em atraso. Valor: R$ 180,00.',
      distance: '1.2 km',
      profile: 'Cidadao',
      urgency: 'alta',
      status: 'aberto'
    },
    {
      id: 3,
      userName: 'Joao Santos',
      isAnonymous: false,
      category: 'Roupas',
      description: 'Roupas de inverno para 3 criancas (idades 5, 8 e 12 anos). Qualquer peca ajuda muito.',
      distance: '2.1 km',
      profile: 'Cidadao',
      urgency: 'media',
      status: 'aberto'
    }
  ];

  const filteredPedidos = filter === 'Todos' 
    ? pedidos 
    : pedidos.filter(p => p.category === filter);

  const getCategoryIcon = (category) => {
    const categoryData = allCategories.find(cat => cat.name === category);
    return categoryData ? categoryData.icon : '❤️';
  };

  const handleFilterClick = (filterName) => {
    if (filterName === 'Outros') {
      setShowCategoriesModal(true);
    } else {
      setFilter(filterName);
    }
  };

  const handleCategorySelect = (categoryName) => {
    setFilter(categoryName);
    setShowCategoriesModal(false);
  };

  const handleAjudar = (pedido) => {
    setSelectedPedido(pedido);
    setShowModal(true);
    setStep(1);
  };

  const handleConfirmHelp = () => {
    setStep(3);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPedido(null);
    setStep(1);
    setAcceptedRules(false);
  };

  return (
    <div className="pedidos">
      <header className="page-header">
        <div className="container">
          <div className="header-content">
            <button className="back-btn" onClick={() => navigate('/quero-ajudar')}>
              ← Voltar
            </button>
            <h1>Pedidos no seu bairro</h1>
          </div>
        </div>
      </header>

      <main className="pedidos-content">
        <div className="container">
          <div className="page-intro">
            <h2>Pedidos no seu bairro</h2>
            <p>Veja quem está precisando de uma mãozinha agora.</p>
          </div>

          <div className="filters">
            {filters.map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => handleFilterClick(f)}
                style={{
                  backgroundColor: filter === f ? getCategoryColor(f) : 'white',
                  borderColor: filter === f ? getCategoryColor(f) : '#e2e8f0',
                  color: filter === f ? 'white' : '#64748b'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="pedidos-grid">
            {filteredPedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-card">
                <div className="card-header">
                  <div className="location-info">
                    <span className="location-icon">📍</span>
                    <span>{pedido.distance} • {pedido.profile}</span>
                  </div>
                  <div className="badges">
                    <span className="status-badge open">Aberto</span>
                    <span 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(pedido.urgency) }}
                    >
                      {pedido.urgency}
                    </span>
                  </div>
                </div>

                <div className="card-content">
                  <div className="pedido-info">
                    <div 
                      className="category-icon"
                      style={{ 
                        backgroundColor: `${getCategoryColor(pedido.category)}20`,
                        borderColor: `${getCategoryColor(pedido.category)}40`
                      }}
                    >
                      {getCategoryIcon(pedido.category)}
                    </div>
                    <div className="pedido-details">
                      <h3 className="pedido-title">
                        {pedido.isAnonymous ? 'Anonimo' : pedido.userName}
                      </h3>
                      <p className="pedido-description">{pedido.description}</p>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn btn-secondary">Ver detalhes</button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAjudar(pedido)}
                  >
                    Ajudar agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showCategoriesModal && (
        <div className="modal-overlay" onClick={() => setShowCategoriesModal(false)}>
          <div className="categories-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="categories-header">
              <div>
                <h3>Escolha uma categoria</h3>
                <p>Selecione a categoria que melhor descreve sua necessidade.</p>
              </div>
              <button className="close-btn" onClick={() => setShowCategoriesModal(false)}>
                ×
              </button>
            </div>
            
            <div className="categories-grid">
              {allCategories.map((category) => (
                <button
                  key={category.name}
                  className={`category-option ${filter === category.name ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category.name)}
                  style={{
                    borderColor: filter === category.name ? category.color : '#f4f4f5',
                    backgroundColor: filter === category.name ? `${category.color}10` : 'white'
                  }}
                >
                  <div 
                    className="category-icon"
                    style={{ 
                      backgroundColor: filter === category.name ? category.color : '#f8f9fa',
                      color: filter === category.name ? 'white' : '#6b7280'
                    }}
                  >
                    {category.icon}
                  </div>
                  <span style={{
                    color: filter === category.name ? category.color : '#18181b'
                  }}>
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showModal && selectedPedido && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {step === 1 && (
              <div className="modal-step">
                <div className="modal-header">
                  <div 
                    className="modal-icon"
                    style={{ 
                      backgroundColor: `${getCategoryColor(selectedPedido.category)}20`,
                      borderColor: `${getCategoryColor(selectedPedido.category)}40`
                    }}
                  >
                    {getCategoryIcon(selectedPedido.category)}
                  </div>
                  <h3>Pedido de {selectedPedido.isAnonymous ? 'Anonimo' : selectedPedido.userName}</h3>
                  <p>{selectedPedido.profile} • {selectedPedido.distance} de voce</p>
                </div>

                <div className="modal-body">
                  <div className="necessity-info">
                    <h4>Necessidade</h4>
                    <p>{selectedPedido.description}</p>
                  </div>
                  
                  <div className="info-note">
                    <span className="info-icon">ℹ️</span>
                    <p>Ao confirmar, voce abrira um chat para combinar os detalhes da ajuda.</p>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn btn-primary btn-large" onClick={() => setStep(2)}>
                    Quero ajudar
                  </button>
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Voltar
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="modal-step">
                <div className="modal-header">
                  <div className="modal-icon" style={{ backgroundColor: '#3b82f620' }}>🛡️</div>
                  <h3>Regras de Respeito</h3>
                  <p>Para garantir uma experiencia segura para todos:</p>
                </div>

                <div className="modal-body">
                  <ul className="rules-list">
                    <li className="rule-item forbidden">
                      <span className="rule-icon">❌</span>
                      <span><strong>Proibido</strong> cobrar valores ou exigir algo em troca.</span>
                    </li>
                    <li className="rule-item forbidden">
                      <span className="rule-icon">❌</span>
                      <span><strong>Proibido</strong> discriminacao de qualquer tipo.</span>
                    </li>
                    <li className="rule-item forbidden">
                      <span className="rule-icon">❌</span>
                      <span><strong>Proibido</strong> assedio ou comportamento inadequado.</span>
                    </li>
                    <li className="rule-item allowed">
                      <span className="rule-icon">✅</span>
                      <span>A ajuda deve ser <strong>voluntaria e gratuita</strong>.</span>
                    </li>
                  </ul>

                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={acceptedRules}
                      onChange={(e) => setAcceptedRules(e.target.checked)}
                    />
                    <span className="checkbox-text">
                      Li e concordo com as regras de respeito e seguranca do SolidarBairro.
                    </span>
                  </label>
                </div>

                <div className="modal-actions">
                  <button 
                    className="btn btn-success btn-large"
                    disabled={!acceptedRules}
                    onClick={handleConfirmHelp}
                  >
                    Confirmar e ajudar
                  </button>
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>
                    Voltar
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="modal-step success">
                <div className="success-animation">
                  <div className="success-icon">
                    ✓
                  </div>
                </div>
                <h3>Que alegria!</h3>
                <p>
                  Voce se prontificou a ajudar <strong>{selectedPedido.userName}</strong>. 
                  Agora combine os detalhes pelo chat.
                </p>
                <div className="modal-actions">
                  <button className="btn btn-success btn-large">
                    Abrir chat
                  </button>
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Fechar
                  </button>
                </div>
              </div>
            )}

            <button className="modal-close" onClick={closeModal}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos;