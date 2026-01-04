import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/QueroAjudar.css';

const QueroAjudar = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [selectedUrgencies, setSelectedUrgencies] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);

  const filters = ['Todos', 'Alimentos', 'Roupas', 'Medicamentos', 'Contas', 'Trabalho', 'Higiene', 'Serviços', 'Outros'];

  // Category-specific options
  const categoryOptions = {
    'Roupas': {
      title: 'Detalhes da Roupa Necessária',
      fields: [
        { type: 'select', name: 'tamanho', label: 'Tamanho', options: ['PP', 'P', 'M', 'G', 'GG', 'XG'] },
        { type: 'select', name: 'tipo', label: 'Tipo de Peça', options: ['Camiseta', 'Calça', 'Vestido', 'Sapato', 'Casaco', 'Roupa Íntima', 'Uniforme'] },
        { type: 'select', name: 'idade', label: 'Para quem?', options: ['Adulto', 'Criança (0-5 anos)', 'Criança (6-12 anos)', 'Adolescente'] },
        { type: 'select', name: 'genero', label: 'Gênero', options: ['Masculino', 'Feminino', 'Unissex'] },
        { type: 'select', name: 'condicao', label: 'Condição', options: ['Nova', 'Seminova', 'Usada (bom estado)'] }
      ]
    },
    'Alimentos': {
      title: 'Detalhes dos Alimentos',
      fields: [
        { type: 'select', name: 'tipo', label: 'Tipo de Alimento', options: ['Cesta Básica', 'Alimentos Infantis', 'Dieta Específica', 'Produtos Frescos'] },
        { type: 'select', name: 'quantidade', label: 'Quantidade', options: ['Para 1 pessoa', 'Para 2-3 pessoas', 'Para 4-5 pessoas', 'Para família grande (6+)'] },
        { type: 'section', name: 'preferencias_section', label: 'Preferências de entrega' },
        { type: 'textarea', name: 'observacoes', placeholder: 'Ex: Sem glúten, diabético, etc.' }
      ]
    },
    'Higiene': {
      title: 'Itens de Higiene Necessários',
      fields: [
        { type: 'checkbox', name: 'itens', label: 'Itens Necessários', options: ['Fraldas', 'Sabonete', 'Shampoo', 'Pasta de dente', 'Absorvente', 'Papel higiênico', 'Desodorante'] },
        { type: 'select', name: 'urgencia', label: 'Urgência', options: ['Imediata', 'Esta semana', 'Este mês'] }
      ]
    },
    'Medicamentos': {
      title: 'Informações do Medicamento',
      fields: [
        { type: 'text', name: 'nome', label: 'Nome do Medicamento', placeholder: 'Ex: Paracetamol' },
        { type: 'text', name: 'dosagem', label: 'Dosagem', placeholder: 'Ex: 500mg' },
        { type: 'select', name: 'uso', label: 'Tipo de Uso', options: ['Uso Contínuo', 'Emergencial', 'Tratamento Temporário'] },
        { type: 'textarea', name: 'observacoes', label: 'Observações', placeholder: 'Prescrição médica, alergias, etc.' }
      ]
    },
    'Contas': {
      title: 'Detalhes da Conta',
      fields: [
        { type: 'select', name: 'tipo', label: 'Tipo de Conta', options: ['Água', 'Luz', 'Aluguel', 'Gás', 'Internet', 'Telefone'] },
        { type: 'text', name: 'valor', label: 'Valor Aproximado', placeholder: 'Ex: R$ 150,00' },
        { type: 'select', name: 'urgencia', label: 'Urgência', options: ['Vencida', 'Vence esta semana', 'Vence este mês'] }
      ]
    },
    'Trabalho': {
      title: 'Oportunidade de Emprego',
      fields: [
        { type: 'select', name: 'tipo', label: 'Tipo de Vaga', options: ['CLT', 'Freelancer', 'Meio Período', 'Temporário', 'Estágio'] },
        { type: 'section', name: 'area_section', label: 'Área de Interesse' },
        { type: 'text', name: 'area', placeholder: 'Ex: Vendas, Limpeza, Cozinha, Atendimento, Construção' },
        { type: 'section', name: 'horario_section', label: 'Horário' },
        { type: 'select', name: 'disponibilidade', label: 'Disponibilidade', options: ['Manhã (6h-12h)', 'Tarde (12h-18h)', 'Noite (18h-24h)', 'Fins de semana', 'Período integral', 'Horário flexível'] }
      ]
    },
    'Serviços': {
      title: 'Tipo de Serviço',
      fields: [
        { type: 'select', name: 'tipo', label: 'Tipo de Serviço', options: ['Reforma/Reparo', 'Transporte', 'Cuidado (idoso/criança)', 'Limpeza', 'Jardinagem', 'Técnico'] },
        { type: 'textarea', name: 'descricao', label: 'Descrição do Serviço', placeholder: 'Descreva o que precisa ser feito' },
        { type: 'select', name: 'urgencia', label: 'Urgência', options: ['Imediata', 'Esta semana', 'Este mês', 'Flexível'] }
      ]
    },
    'Outros': {
      title: 'Outras Necessidades',
      fields: [
        { type: 'textarea', name: 'descricao', label: 'Descreva sua necessidade', placeholder: 'Conte-nos o que você precisa' },
        { type: 'select', name: 'urgencia', label: 'Urgência', options: ['Alta', 'Média', 'Baixa'] }
      ]
    }
  };

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
                          className={`urgency-option ${urgency.toLowerCase()} ${selectedUrgencies.includes(urgency) ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedUrgencies(prev => 
                              prev.includes(urgency)
                                ? prev.filter(u => u !== urgency)
                                : [...prev, urgency]
                            );
                          }}
                        >
                          {urgency}
                          <span className={`urgency-dot ${urgency.toLowerCase()}`}></span>
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
                        onClick={() => {
                          setSelectedPedido(pedido);
                          setShowCategoryDetails(true);
                        }}
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

      {/* Category Details Modal */}
      {showCategoryDetails && selectedPedido && (
        <div className="modal-overlay" onClick={() => setShowCategoryDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalhes da Necessidade</h3>
              <button 
                className="modal-close"
                onClick={() => setShowCategoryDetails(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="need-summary">
                <div className="need-category">
                  <span className="category-icon">{getCategoryIcon(selectedPedido.tipo)}</span>
                  <span className="category-name">{selectedPedido.tipo}</span>
                </div>
                <h4>{selectedPedido.titulo}</h4>
                <p>{selectedPedido.descricao}</p>
              </div>

              {categoryOptions[selectedPedido.tipo] && (
                <div className="category-details">
                  <h5>{categoryOptions[selectedPedido.tipo].title}</h5>
                  <div className="details-form">
                    {categoryOptions[selectedPedido.tipo].fields.map((field, index) => (
                      <div key={index} className="detail-field">
                        {field.type === 'section' && (
                          <h6 className="section-title">{field.label}</h6>
                        )}
                        {field.type !== 'section' && field.label && (
                          <label>{field.label}</label>
                        )}
                        {field.type === 'select' && (
                          <select className="form-select">
                            <option value="">Selecione uma opção</option>
                            {field.options.map((option, optIndex) => (
                              <option key={optIndex} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                        {field.type === 'text' && (
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder={field.placeholder}
                          />
                        )}
                        {field.type === 'textarea' && (
                          <textarea 
                            className="form-textarea" 
                            placeholder={field.placeholder}
                            rows="3"
                          />
                        )}
                        {field.type === 'checkbox' && (
                          <div className="checkbox-group">
                            {field.options.map((option, optIndex) => (
                              <label key={optIndex} className="checkbox-item">
                                <input type="checkbox" />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="contact-info">
                <h5>Informações de Contato</h5>
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-label">Distância:</span>
                    <span>{selectedPedido.distancia}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Publicado:</span>
                    <span>{selectedPedido.tempo}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Usuário:</span>
                    <span>{selectedPedido.usuario} {selectedPedido.verificado && '✓'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowCategoryDetails(false)}
              >
                Fechar
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowCategoryDetails(false);
                  navigate(`/necessidade/${selectedPedido.id}`);
                }}
              >
                Quero ajudar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueroAjudar;