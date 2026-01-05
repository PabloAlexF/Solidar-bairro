import React, { useState } from 'react';
import '../styles/pages/QueroAjudar.css';

const CATEGORIES = ["Alimentos", "Roupas", "Calçados", "Contas", "Emprego", "Higiene", "Medicamentos", "Móveis", "Eletrodomésticos", "Material Escolar", "Transporte"];
const URGENCIES = ["Alta", "Média", "Baixa"];

const INITIAL_PEDIDOS = [
  {
    id: 1,
    userName: "Maria Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    distance: "450m de distância",
    helpType: "Cesta básica",
    category: "Alimentos",
    familyInfo: "Família com 2 crianças",
    urgency: "Alta",
    description: "Estou desempregada há 3 meses, preciso de alimentos para meus filhos. Qualquer ajuda é bem-vinda.",
    history: [
      { date: "15/10/2023", help: "Recebeu agasalhos" },
      { date: "02/09/2023", help: "Recebeu kit higiene" }
    ]
  },
  {
    id: 2,
    userName: "João Santos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    distance: "1,2km",
    helpType: "Conta de luz atrasada",
    category: "Contas",
    familyInfo: "Situação: Sem renda fixa",
    urgency: "Alta",
    description: "Preciso de ajuda com a conta de luz deste mês para não cortar. O valor é R$ 145,00.",
    history: []
  },
  {
    id: 3,
    userName: "Carla Menezes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carla",
    distance: "800m",
    helpType: "Roupas de inverno",
    category: "Roupas",
    familyInfo: "1 idoso e 1 adulto",
    urgency: "Média",
    description: "Estamos precisando de cobertores e casacos para o frio que está chegando.",
    history: [
      { date: "12/11/2023", help: "Recebeu cesta básica" }
    ]
  },
  {
    id: 4,
    userName: "Pedro Costa",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    distance: "600m",
    helpType: "Sapatos para trabalho",
    category: "Calçados",
    familyInfo: "Adulto desempregado",
    urgency: "Alta",
    description: "Consegui uma entrevista de emprego mas não tenho sapatos adequados. Preciso urgente para não perder a oportunidade.",
    history: []
  },
  {
    id: 5,
    userName: "Ana Souza",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    distance: "1,5km",
    helpType: "Material escolar",
    category: "Material Escolar",
    familyInfo: "Mãe de 2 estudantes",
    urgency: "Média",
    description: "Meus filhos vão voltar às aulas e preciso de cadernos, lápis e mochila para eles.",
    history: [
      { date: "20/01/2024", help: "Recebeu uniforme escolar" }
    ]
  }
];

const QueroAjudar = () => {
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUrgencies, setSelectedUrgencies] = useState([]);

  const filteredPedidos = INITIAL_PEDIDOS.filter(pedido => {
    const advancedCategoryMatch = selectedCategories.length === 0 || selectedCategories.includes(pedido.category);
    const urgencyMatch = selectedUrgencies.length === 0 || selectedUrgencies.includes(pedido.urgency);
    return advancedCategoryMatch && urgencyMatch;
  });

  const handleConfirmHelp = () => {
    setIsSuccess(true);
  };

  const closeSuccess = () => {
    setIsSuccess(false);
    setSelectedPedido(null);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleUrgency = (urgency) => {
    setSelectedUrgencies(prev => 
      prev.includes(urgency) 
        ? prev.filter(u => u !== urgency)
        : [...prev, urgency]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedUrgencies([]);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Alimentos': return <i className="fi fi-rr-shopping-basket"></i>;
      case 'Roupas': return <i className="fi fi-rr-shirt"></i>;
      case 'Calçados': return <i className="fi fi-rr-shoe-prints"></i>;
      case 'Contas': return <i className="fi fi-rr-lightbulb"></i>;
      case 'Emprego': return <i className="fi fi-rr-briefcase"></i>;
      case 'Higiene': return <i className="fi fi-rr-soap"></i>;
      case 'Medicamentos': return <i className="fi fi-rr-pills"></i>;
      case 'Móveis': return <i className="fi fi-rr-chair"></i>;
      case 'Eletrodomésticos': return <i className="fi fi-rr-tv"></i>;
      case 'Material Escolar': return <i className="fi fi-rr-book"></i>;
      case 'Transporte': return <i className="fi fi-rr-bus"></i>;
      default: return <i className="fi fi-rr-heart"></i>;
    }
  };

  return (
    <div className="pedidos-wrapper">
      <div className="container">
        <header className="pedidos-header">
          <h1>Pedidos perto de você</h1>
          <p>Veja quem está precisando no seu bairro e escolha quem ajudar.</p>
        </header>

        {/* Filters */}
        <div className="filters-bar">
          <button 
            className={`filter-toggle-btn ${showFilters || selectedCategories.length > 0 || selectedUrgencies.length > 0 ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="fi fi-rr-settings-sliders"></i>
            Filtrar
            {(selectedCategories.length > 0 || selectedUrgencies.length > 0) && (
              <span className="filter-count">
                {selectedCategories.length + selectedUrgencies.length}
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-content">
              <div className="filter-group">
                <h3>Categorias</h3>
                <div className="filter-options">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      className={`chip-btn ${selectedCategories.includes(cat) ? 'active' : ''}`}
                      onClick={() => toggleCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h3>Nível de Urgência</h3>
                <div className="filter-options">
                  {URGENCIES.map(urg => (
                    <button 
                      key={urg}
                      className={`chip-btn urgency-chip-${urg.toLowerCase()} ${selectedUrgencies.includes(urg) ? 'active' : ''}`}
                      onClick={() => toggleUrgency(urg)}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filters-actions">
                <button className="clear-filters-btn" onClick={clearFilters}>Limpar Filtros</button>
                <button className="apply-filters-btn" onClick={() => setShowFilters(false)}>Aplicar</button>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="results-info">
          Mostrando {filteredPedidos.length} pedido{filteredPedidos.length !== 1 ? 's' : ''} de ajuda
        </div>

        {/* Grid */}
        <div className="pedidos-grid">
          {filteredPedidos.length === 0 ? (
            <div className="no-results">
              <i className="fi fi-rr-search no-results-icon"></i>
              <h3>Nenhum pedido encontrado</h3>
              <p>Tente ajustar os filtros ou verificar novamente mais tarde.</p>
            </div>
          ) : (
            filteredPedidos.map((pedido) => (
              <div key={pedido.id} className="pedido-card">
                <div className="card-header">
                  <div className="user-meta">
                    <img src={pedido.avatar} alt={pedido.userName} className="user-avatar" />
                    <div>
                      <span className="user-name">{pedido.userName}</span>
                      <span className="distance">{pedido.distance}</span>
                    </div>
                  </div>
                  <span className={`urgency-badge urgency-${pedido.urgency.toLowerCase()}`}>
                    Urgência: {pedido.urgency}
                  </span>
                </div>

                <div className="card-body">
                  <div className="help-type">
                    {getCategoryIcon(pedido.category)}
                    {pedido.helpType}
                  </div>
                  <div className="family-info">
                    <i className="fi fi-rr-users"></i> {pedido.familyInfo}
                  </div>
                  <p className="description">{pedido.description}</p>
                </div>

                <div className="card-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedPedido(pedido)}>
                    <i className="fi fi-rr-eye"></i> Ver detalhes
                  </button>
                  <button className="btn btn-primary" onClick={() => setSelectedPedido(pedido)}>
                    <i className="fi fi-rr-hand-heart"></i> Ajudar agora
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Details */}
      {selectedPedido && (
        <div className="modal-overlay">
          <div className="modal-content">
            {!isSuccess ? (
              <>
                <button className="modal-close" onClick={() => setSelectedPedido(null)}>
                  <i className="fi fi-rr-cross"></i>
                </button>

                <div className="modal-section" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <img src={selectedPedido.avatar} alt="" className="user-avatar" style={{ width: 64, height: 64 }} />
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedPedido.userName}</h2>
                    <span className="distance">{selectedPedido.distance} • {selectedPedido.familyInfo}</span>
                  </div>
                </div>

                <div className="modal-section" style={{ background: 'var(--sb-teal-soft)', padding: 20, borderRadius: 20 }}>
                  <h3>Necessidade Específica</h3>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <i className="fi fi-rr-exclamation text-teal" style={{ marginTop: 2 }}></i>
                    <p style={{ fontWeight: 600, color: 'var(--sb-text)' }}>
                      {selectedPedido.description}
                    </p>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Histórico de Apoio</h3>
                  {selectedPedido.history.length > 0 ? (
                    selectedPedido.history.map((h, i) => (
                      <div key={i} className="history-item">
                        <i className="fi fi-rr-time-past"></i>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{h.date} — {h.help}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: '0.9rem', color: 'var(--sb-text-light)' }}>Nenhuma ajuda anterior registrada.</p>
                  )}
                </div>

                <button className="btn btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }} onClick={handleConfirmHelp}>
                  Confirmar ajuda a esta pessoa
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 80, height: 80, background: '#f0fdfa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <i className="fi fi-rr-check-circle" style={{ fontSize: '48px', color: 'var(--sb-teal)' }}></i>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>Iniciando Ajuda!</h2>
                <p style={{ color: 'var(--sb-text-light)', marginBottom: 24 }}>
                  Obrigado por se voluntariar! Você será conectado com {selectedPedido.userName} para finalizar os detalhes.
                </p>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={closeSuccess}>
                  Voltar para a lista
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueroAjudar;