import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CustomSelect from '../components/CustomSelect';
import '../styles/pages/PrecisoDeAjuda.css';
import '../styles/pages/PrecisoDeAjudaWizard.css';

const categories = [
  { id: 'food', label: 'Alimentos', icon: <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="alimentos" width="36" height="36" />, desc: 'Comida, cesta básica', color: '#f59e0b' },
  { id: 'clothes', label: 'Roupas', icon: <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png" alt="roupas" width="36" height="36" />, desc: 'Roupas, calçados', color: '#8b5cf6' },
  { id: 'hygiene', label: 'Higiene', icon: <img src="https://cdn-icons-png.flaticon.com/512/2553/2553642.png" alt="higiene" width="36" height="36" />, desc: 'Produtos de limpeza', color: '#06b6d4' },
  { id: 'meds', label: 'Medicamentos', icon: <img src="https://cdn-icons-png.flaticon.com/512/883/883356.png" alt="medicamentos" width="36" height="36" />, desc: 'Remédios, consultas', color: '#ef4444' },
  { id: 'bills', label: 'Contas', icon: <img src="https://cdn-icons-png.flaticon.com/512/1611/1611179.png" alt="contas" width="36" height="36" />, desc: 'Água, luz, aluguel', color: '#10b981' },
  { id: 'work', label: 'Emprego', icon: <img src="https://cdn-icons-png.flaticon.com/512/1077/1077976.png" alt="emprego" width="36" height="36" />, desc: 'Trabalho, renda', color: '#f97316' },
  { id: 'serv', label: 'Serviços', icon: <img src="https://cdn-icons-png.flaticon.com/512/3039/3039386.png" alt="serviços" width="36" height="36" />, desc: 'Reparos, ajuda técnica', color: '#6366f1' },
  { id: 'other', label: 'Outros', icon: <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="outros" width="36" height="36" />, desc: 'Outras necessidades', color: '#64748b' },
];

const contactOptions = [
  { id: 'whatsapp', label: 'WhatsApp', icon: <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="whatsapp" width="24" height="24" />, desc: 'Mais rápido', color: '#22c55e' },
  { id: 'phone', label: 'Ligação', icon: <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" alt="telefone" width="24" height="24" />, desc: 'Tradicional', color: '#3b82f6' },
  { id: 'chat', label: 'Chat Interno', icon: <img src="https://cdn-icons-png.flaticon.com/512/2040/2040946.png" alt="chat" width="24" height="24" />, desc: 'Na plataforma', color: '#8b5cf6' },
];

const visibilityOptions = [
  { id: 'neighborhood', label: 'Apenas meu bairro', desc: 'Mais próximo', icon: <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="bairro" width="24" height="24" /> },
  { id: 'nearby', label: 'Bairros próximos', desc: 'Área expandida', icon: <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="mundo" width="24" height="24" /> },
  { id: 'ngos', label: 'ONGs parceiras', desc: 'Organizações', icon: <img src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png" alt="parceiros" width="24" height="24" /> },
];

const PrecisoDeAjuda = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCat, setSelectedCat] = useState(null);
  const [urgency, setUrgency] = useState('media');
  const [description, setDescription] = useState('');
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [visibility, setVisibility] = useState('neighborhood');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New fields for detailed information
  const [familySize, setFamilySize] = useState('');
  const [children, setChildren] = useState('');
  const [specificItems, setSpecificItems] = useState([]);
  const [preferredTime, setPreferredTime] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [observations, setObservations] = useState('');

  const foodItems = [
    'Arroz (5kg)', 'Feijão (2kg)', 'Óleo de soja', 'Açúcar (2kg)',
    'Leite em pó', 'Fraldas', 'Produtos de higiene', 'Macarrão',
    'Farinha de trigo', 'Café', 'Sal', 'Molho de tomate'
  ];

  const timeOptions = [
    { value: 'manha', label: 'Manhã (8h às 12h)' },
    { value: 'tarde', label: 'Tarde (12h às 18h)' },
    { value: 'noite', label: 'Noite (18h às 22h)' },
    { value: 'qualquer', label: 'Qualquer horário' }
  ];

  const toggleItem = (item) => {
    setSpecificItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (selectedCat && description.trim()) {
      setIsSubmitting(true);
      
      // Criar o pedido
      const newPedido = {
        id: Date.now(),
        tipo: categories.find(c => c.id === selectedCat)?.label,
        titulo: `${categories.find(c => c.id === selectedCat)?.label} - ${urgency === 'alta' ? 'Urgente' : urgency === 'media' ? 'Moderada' : 'Flexível'}`,
        descricao: description,
        distancia: '0.2 km',
        urgencia: urgency === 'alta' ? 'Alta' : urgency === 'media' ? 'Média' : 'Baixa',
        tempo: 'Agora',
        usuario: 'Você',
        verificado: true,
        timestamp: new Date().toISOString(),
        detalhes: {
          pessoas: parseInt(familySize) || 1,
          criancas: parseInt(children) || 0,
          idosos: 0,
          situacao: "Necessidade atual",
          itensEspecificos: specificItems.length > 0 ? specificItems : [],
          preferencias: {
            horario: preferredTime || "Qualquer horário",
            local: preferredLocation || "A combinar",
            observacoes: observations || "Sem observações especiais"
          }
        }
      };
      
      // Salvar no localStorage
      const existingPedidos = JSON.parse(localStorage.getItem('solidar-pedidos') || '[]');
      existingPedidos.unshift(newPedido);
      localStorage.setItem('solidar-pedidos', JSON.stringify(existingPedidos));
      
      // Disparar evento para atualizar outras páginas
      window.dispatchEvent(new CustomEvent('pedidoAdded'));
      
      // Simulate API call
      setTimeout(() => {
        // Add notification to localStorage for header to pick up
        const notification = {
          id: Date.now(),
          title: 'Pedido publicado com sucesso!',
          message: 'Sua solicitação foi enviada para a comunidade.',
          read: false,
          timestamp: new Date().toISOString()
        };
        
        const existingNotifications = JSON.parse(localStorage.getItem('solidar-notifications') || '[]');
        existingNotifications.unshift(notification);
        localStorage.setItem('solidar-notifications', JSON.stringify(existingNotifications));
        
        // Dispatch event to update header notifications
        window.dispatchEvent(new CustomEvent('notificationAdded'));
        
        setIsSubmitting(false);
        setIsPublished(true);
      }, 2000);
    }
  };

  if (isPublished) {
    return (
      <div className="preciso-ajuda">
        <Header />
        <main className="success-content">
          <div className="success-animation">
            <div className="success-icon">
              <div className="check-circle">
                ✓
              </div>
              <div className="sparkles">
                <span className="sparkle sparkle-1">✨</span>
                <span className="sparkle sparkle-2">⭐</span>
                <span className="sparkle sparkle-3">💫</span>
              </div>
            </div>
          </div>
          
          <h2>Seu pedido foi publicado!</h2>
          <p className="success-message">
            As pessoas do seu bairro agora podem ver sua necessidade. Fique atento às notificações ou ao seu WhatsApp.
          </p>

          <div className="success-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <span className="stat-number">Em breve</span>
              <span className="stat-label">pessoas cadastradas</span>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <span className="stat-number">Crescendo</span>
              <span className="stat-label">nossa comunidade</span>
            </div>
          </div>

          <div className="success-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/quero-ajudar')}
            >
              Ver ajudas disponíveis perto de mim
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Voltar para o início
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="preciso-ajuda">
      <Header />

      <main className="form-content">
        <div className="container-wide">
          <div className="wizard-container">
            {currentStep === 1 && (
              <div className="page-intro">
                <h2>Preciso de Ajuda</h2>
                <p>Conte ao seu bairro como podemos te ajudar. Juntos somos mais fortes.</p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="progress-bar">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
                  <div className="step-circle">{step}</div>
                  <div className="step-label">
                    {step === 1 && 'Categoria'}
                    {step === 2 && 'Detalhes'}
                    {step === 3 && 'Urgência'}
                    {step === 4 && 'Preferências'}
                    {step === 5 && 'Confirmação'}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handlePublish} className="wizard-form">
              {/* Step 1: Category Selection */}
              {currentStep === 1 && (
                <div className="step-content">
                  <h3>O que você está precisando?</h3>
                  <div className="categories-carousel">
                    {categories.map((cat) => {
                      const isSelected = selectedCat === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCat(cat.id)}
                          className={`category-card ${isSelected ? 'selected' : ''}`}
                          style={{
                            '--category-color': cat.color,
                            '--category-color-light': cat.color + '20'
                          }}
                        >
                          <div className="category-icon">{cat.icon}</div>
                          <h4>{cat.label}</h4>
                          <p>{cat.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="step-content">
                  <h3>Descreva sua situação</h3>
                  <p className="step-subtitle">Conte-nos mais sobre o que você está precisando para que possamos te conectar com a ajuda certa</p>
                  <div className="details-section">
                    <textarea 
                      value={description}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          setDescription(e.target.value);
                        }
                      }}
                      placeholder="Descreva sua necessidade... Exemplo: Preciso de cesta básica para minha família de 4 pessoas. Estou desempregado há 2 meses."
                      className="form-textarea"
                      rows="6"
                      required
                    />
                    <div className={`char-counter ${description.length >= 500 ? 'limit-reached' : ''}`}>
                      {description.length}/500
                      {description.length >= 500 && <span className="limit-message"> - Limite atingido</span>}
                    </div>
                    
                    {/* Additional fields for all categories */}
                    {selectedCat && selectedCat !== 'other' && (
                      <div className="additional-details">
                        {selectedCat === 'food' && (
                          <>
                            <h4>Informações da família</h4>
                            <div className="family-info-cards">
                              <div className="info-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="família" width="24" height="24" />
                                </div>
                                <div className="card-content">
                                  <label>Quantas pessoas na família?</label>
                                  <input
                                    type="number"
                                    value={familySize}
                                    onChange={(e) => setFamilySize(e.target.value)}
                                    placeholder="Ex: 4"
                                    min="1"
                                    max="20"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                              <div className="info-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="crianças" width="24" height="24" />
                                </div>
                                <div className="card-content">
                                  <label>Quantas crianças?</label>
                                  <input
                                    type="number"
                                    value={children}
                                    onChange={(e) => setChildren(e.target.value)}
                                    placeholder="Ex: 2"
                                    min="0"
                                    max="10"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedCat === 'clothes' && (
                          <>
                            <h4>Detalhes da Roupa</h4>
                            <div className="preferences-cards">
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/1611/1611179.png" alt="tamanho" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Tamanho</label>
                                  <select className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="PP">PP</option>
                                    <option value="P">P</option>
                                    <option value="M">M</option>
                                    <option value="G">G</option>
                                    <option value="GG">GG</option>
                                  </select>
                                </div>
                              </div>
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png" alt="roupa" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Tipo de Peça</label>
                                  <select className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="camiseta">Camiseta</option>
                                    <option value="calca">Calça</option>
                                    <option value="sapato">Sapato</option>
                                    <option value="casaco">Casaco</option>
                                  </select>
                                </div>
                              </div>
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="pessoa" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Para quem?</label>
                                  <select className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="adulto">Adulto</option>
                                    <option value="crianca">Criança</option>
                                    <option value="adolescente">Adolescente</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedCat === 'meds' && (
                          <>
                            <h4>Informações do Medicamento</h4>
                            <div className="preferences-cards">
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/883/883356.png" alt="medicamento" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Nome do Medicamento</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Paracetamol"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/3039/3039386.png" alt="dosagem" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Dosagem</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: 500mg"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                              <div className="pref-card full-width">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="uso" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Tipo de Uso</label>
                                  <select className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="continuo">Uso Contínuo</option>
                                    <option value="emergencial">Emergencial</option>
                                    <option value="temporario">Tratamento Temporário</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedCat === 'bills' && (
                          <>
                            <h4>Detalhes da Conta</h4>
                            <div className="preferences-cards">
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/1611/1611179.png" alt="conta" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Tipo de Conta</label>
                                  <select className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="agua">Água</option>
                                    <option value="luz">Luz</option>
                                    <option value="aluguel">Aluguel</option>
                                    <option value="gas">Gás</option>
                                  </select>
                                </div>
                              </div>
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="dinheiro" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Valor Aproximado</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: R$ 150,00"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedCat === 'work' && (
                          <>
                            <h4>Oportunidade de Emprego</h4>
                            <div className="preferences-cards">
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/1077/1077976.png" alt="trabalho" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Área de Interesse</label>
                                  <input
                                    type="text"
                                    placeholder="Ex: Vendas, Limpeza, Cozinha"
                                    className="form-input"
                                  />
                                </div>
                              </div>
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="horário" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Disponibilidade</label>
                                  <select className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="manha">Manhã</option>
                                    <option value="tarde">Tarde</option>
                                    <option value="noite">Noite</option>
                                    <option value="integral">Integral</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedCat === 'serv' && (
                          <>
                            <h4>Tipo de Serviço</h4>
                            <div className="preferences-cards">
                              <div className="pref-card">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/3039/3039386.png" alt="serviço" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Tipo de Serviço</label>
                                  <select className="form-select">
                                    <option value="">Selecione</option>
                                    <option value="reforma">Reforma/Reparo</option>
                                    <option value="transporte">Transporte</option>
                                    <option value="cuidado">Cuidado</option>
                                    <option value="limpeza">Limpeza</option>
                                  </select>
                                </div>
                              </div>
                              <div className="pref-card full-width">
                                <div className="card-icon">
                                  <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="descrição" width="20" height="20" />
                                </div>
                                <div className="card-content">
                                  <label>Descrição do Serviço</label>
                                  <textarea
                                    placeholder="Descreva o que precisa ser feito"
                                    className="form-textarea"
                                    rows="3"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedCat === 'hygiene' && (
                          <>
                            <h4>Itens de Higiene</h4>
                            <div className="items-section">
                              <p className="items-subtitle">Selecione os itens que precisa</p>
                              <div className="items-grid">
                                {['Fraldas', 'Sabonete', 'Shampoo', 'Pasta de dente', 'Absorvente', 'Papel higiênico'].map((item) => (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => toggleItem(item)}
                                    className={`item-tag ${specificItems.includes(item) ? 'selected' : ''}`}
                                  >
                                    <span>{item}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        
                        {selectedCat === 'food' && (
                          <>
                            <div className="items-section">
                              <h4>Itens específicos necessários</h4>
                              <p className="items-subtitle">Selecione os itens que mais precisa (opcional)</p>
                              <div className="items-grid">
                                {foodItems.map((item) => (
                                  <button
                                    key={item}
                                    type="button"
                                    onClick={() => toggleItem(item)}
                                    className={`item-tag ${specificItems.includes(item) ? 'selected' : ''}`}
                                  >
                                    <span>{item}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="delivery-preferences">
                              <h4>Preferências de entrega</h4>
                              
                              <div className="delivery-grid">
                                <div className="delivery-field">
                                  <label className="field-label">Melhor horário para receber</label>
                                  <div className="input-wrapper">
                                    <div className="input-icon">
                                      <img src="https://cdn-icons-png.flaticon.com/512/2784/2784403.png" alt="horário" width="18" height="18" />
                                    </div>
                                    <CustomSelect
                                      options={timeOptions}
                                      value={preferredTime}
                                      onChange={setPreferredTime}
                                      placeholder="Selecione um horário"
                                    />
                                  </div>
                                </div>

                                <div className="delivery-field">
                                  <label className="field-label">Local preferido para encontro</label>
                                  <div className="input-wrapper">
                                    <div className="input-icon">
                                      <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="localização" width="18" height="18" />
                                    </div>
                                    <input
                                      type="text"
                                      value={preferredLocation}
                                      onChange={(e) => setPreferredLocation(e.target.value)}
                                      placeholder="Ex: Próximo ao mercado central"
                                      className="form-input enhanced"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="observations-section">
                                <label className="field-label">Observações especiais</label>
                                <div className="input-wrapper">
                                  <div className="input-icon">
                                    <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="observações" width="18" height="18" />
                                  </div>
                                  <textarea
                                    value={observations}
                                    onChange={(e) => setObservations(e.target.value)}
                                    placeholder="Ex: Prefere receber aos finais de semana"
                                    className="form-textarea enhanced"
                                    rows="3"
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Urgency */}
              {currentStep === 3 && (
                <div className="step-content">
                  <h3>Quando você precisa dessa ajuda?</h3>
                  <p className="urgency-subtitle">Isso nos ajuda a priorizar e conectar você com quem pode ajudar</p>
                  
                  <div className="urgency-selector">
                    <div className="urgency-options">
                      {[
                        { id: 'alta', label: 'Urgente', desc: 'Preciso esta semana', color: '#ef4444', bgColor: '#fef2f2' },
                        { id: 'media', label: 'Moderada', desc: 'Posso aguardar até 30 dias', color: '#f59e0b', bgColor: '#fffbeb' },
                        { id: 'baixa', label: 'Flexível', desc: 'Quando for possível', color: '#22c55e', bgColor: '#f0fdf4' }
                      ].map((level) => (
                        <label key={level.id} className={`urgency-card ${urgency === level.id ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="urgency"
                            value={level.id}
                            checked={urgency === level.id}
                            onChange={(e) => setUrgency(e.target.value)}
                          />
                          <div 
                            className="urgency-content"
                            style={{
                              '--urgency-color': level.color,
                              '--urgency-bg': level.bgColor
                            }}
                          >
                            <span className="urgency-dot"></span>
                            <span className="urgency-label">{level.label}</span>
                            <span className="urgency-desc">{level.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Preferences */}
              {currentStep === 4 && (
                <div className="step-content">
                  <h3>Preferências de contato</h3>
                  <div className="preferences-layout">
                    <div className="contact-section">
                      <h4>Como prefere ser contatado?</h4>
                      <div className="contact-options">
                        {contactOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setContactMethod(option.id)}
                            className={`contact-card ${contactMethod === option.id ? 'selected' : ''}`}
                            style={{ '--contact-color': option.color }}
                          >
                            <span className="contact-icon">{option.icon}</span>
                            <span className="contact-label">{option.label}</span>
                            <span className="contact-desc">{option.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="visibility-section">
                      <h4>Quem pode ver seu pedido?</h4>
                      <div className="visibility-options">
                        {visibilityOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setVisibility(option.id)}
                            className={`visibility-card ${visibility === option.id ? 'selected' : ''}`}
                          >
                            <span className="visibility-icon">{option.icon}</span>
                            <span className="visibility-label">{option.label}</span>
                            <span className="visibility-desc">{option.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="privacy-toggle">
                    <label className="toggle-option">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <div className="toggle-content">
                        <span className="toggle-label">Manter anônimo</span>
                        <span className="toggle-desc">Seu nome não aparecerá publicamente</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 5: Confirmation */}
              {currentStep === 5 && (
                <div className="step-content">
                  <h3>Confirme seus dados</h3>
                  <div className="confirmation-summary">
                    <div className="summary-card">
                      <h4>Resumo do seu pedido</h4>
                      <div className="summary-item">
                        <strong>Categoria:</strong> {categories.find(c => c.id === selectedCat)?.label}
                      </div>
                      <div className="summary-item">
                        <strong>Urgência:</strong> {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                      </div>
                      <div className="summary-item">
                        <strong>Contato:</strong> {contactOptions.find(c => c.id === contactMethod)?.label}
                      </div>
                      <div className="summary-item">
                        <strong>Visibilidade:</strong> {visibilityOptions.find(v => v.id === visibility)?.label}
                      </div>
                      <div className="summary-item">
                        <strong>Descrição:</strong>
                        <p className="description-preview">{description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="wizard-navigation">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="btn btn-secondary">
                    Voltar
                  </button>
                )}
                
                {currentStep < totalSteps ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    disabled={(currentStep === 1 && !selectedCat) || (currentStep === 2 && !description.trim()) || (currentStep === 3 && !urgency)}
                    className="btn btn-primary"
                  >
                    Próximo
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary btn-large ${isSubmitting ? 'submitting' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="btn-spinner"></div>
                        Publicando...
                      </>
                    ) : (
                      'Publicar pedido'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrecisoDeAjuda;