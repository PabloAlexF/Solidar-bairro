import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../components/ui/CustomSelect';
import '../styles/pages/PrecisoDeAjudaClean.css';

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
  const [errors, setErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);
  
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

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!selectedCat) {
          newErrors.category = 'Por favor, selecione uma categoria';
        }
        break;
      case 2:
        if (!description.trim()) {
          newErrors.description = 'Por favor, descreva sua situação';
        } else if (description.trim().length < 20) {
          newErrors.description = 'Descrição muito curta. Mínimo 20 caracteres';
        }
        break;
      case 3:
        if (!urgency) {
          newErrors.urgency = 'Por favor, selecione o nível de urgência';
        }
        break;
      case 4:
        if (!contactMethod) {
          newErrors.contact = 'Por favor, selecione um método de contato';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = () => {
    if (selectedCat && description.trim()) {
      setIsSubmitting(true);
      
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
      
      const existingPedidos = JSON.parse(localStorage.getItem('solidar-pedidos') || '[]');
      existingPedidos.unshift(newPedido);
      localStorage.setItem('solidar-pedidos', JSON.stringify(existingPedidos));
      
      window.dispatchEvent(new CustomEvent('pedidoAdded'));
      
      setTimeout(() => {
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
        
        window.dispatchEvent(new CustomEvent('notificationAdded'));
        
        setIsSubmitting(false);
        setIsPublished(true);
      }, 2000);
    }
  };

  if (isPublished) {
    return (
      <div className="preciso-ajuda">
        <div className="container">
          <div className="success-content">
            <div className="success-animation">
              <div className="success-icon">
                <div className="check-circle">✓</div>
              </div>
            </div>
            
            <h2>Seu pedido foi publicado!</h2>
            <p className="success-message">
              As pessoas do seu bairro agora podem ver sua necessidade. Fique atento às notificações ou ao seu WhatsApp.
            </p>

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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preciso-ajuda">
      <div className="container">
        <div className="wizard-container">
          {currentStep === 1 && (
            <div className="page-intro">
              <h2>Preciso de Ajuda</h2>
              <p>Conte ao seu bairro como podemos te ajudar. Juntos somos mais fortes.</p>
            </div>
          )}

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

          <div className="wizard-form">
            {currentStep === 1 && (
              <div className="step-content">
                <h3>O que você está precisando?</h3>
                <p className="step-description">Selecione a categoria que melhor descreve sua necessidade</p>
                
                {errors.category && (
                  <div className="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {errors.category}
                  </div>
                )}
                
                <div className="categories-carousel">
                  {categories.map((cat) => {
                    const isSelected = selectedCat === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCat(cat.id);
                          setErrors(prev => ({ ...prev, category: null }));
                        }}
                        className={`category-card ${isSelected ? 'selected' : ''} ${errors.category ? 'error' : ''}`}
                        onMouseEnter={() => setShowTooltip(cat.id)}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <div className="category-icon">{cat.icon}</div>
                        <h4 className="category-label">{cat.label}</h4>
                        <p className="category-desc">{cat.desc}</p>
                        {showTooltip === cat.id && (
                          <div className="category-tooltip">
                            Clique para selecionar {cat.label.toLowerCase()}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <h3>Descreva sua situação</h3>
                <p className="step-description">Conte-nos mais sobre o que você está precisando</p>
                
                {errors.description && (
                  <div className="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {errors.description}
                  </div>
                )}
                
                <div className="form-group">
                  <textarea 
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setDescription(e.target.value);
                        setErrors(prev => ({ ...prev, description: null }));
                      }
                    }}
                    placeholder="Descreva sua necessidade... Exemplo: Preciso de cesta básica para minha família de 4 pessoas."
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    rows="6"
                    required
                  />
                  <div className="char-counter">
                    <span className="char-count">{description.length}/500</span>
                    {description.length >= 20 && description.length < 500 && (
                      <span className="success-message"> ✓ Descrição adequada</span>
                    )}
                  </div>
                </div>

                {selectedCat === 'food' && (
                  <div className="form-grid">
                    <div className="form-group">
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
                    <div className="form-group">
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
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <h3>Quando você precisa dessa ajuda?</h3>
                <p className="step-description">Isso nos ajuda a priorizar e conectar você com quem pode ajudar</p>
                
                {errors.urgency && (
                  <div className="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                    {errors.urgency}
                  </div>
                )}
                
                <div className="urgency-options">
                  {[
                    { id: 'alta', label: 'Urgente', desc: 'Preciso esta semana', icon: '🚨' },
                    { id: 'media', label: 'Moderada', desc: 'Posso aguardar até 30 dias', icon: '⏰' },
                    { id: 'baixa', label: 'Flexível', desc: 'Quando for possível', icon: '📅' }
                  ].map((level) => (
                    <label key={level.id} className={`urgency-card ${urgency === level.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="urgency"
                        value={level.id}
                        checked={urgency === level.id}
                        onChange={(e) => {
                          setUrgency(e.target.value);
                          setErrors(prev => ({ ...prev, urgency: null }));
                        }}
                      />
                      <div className="urgency-content">
                        <div className="urgency-icon">{level.icon}</div>
                        <span className="urgency-label">{level.label}</span>
                        <span className="urgency-desc">{level.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

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
              </div>
            )}

            {currentStep === 5 && (
              <div className="step-content">
                <h3>Confirmação</h3>
                <div className="confirmation-summary">
                  <div className="summary-card">
                    <h4>Resumo do seu pedido</h4>
                    
                    <div className="summary-section">
                      <h5>Informações Básicas</h5>
                      <div className="summary-grid">
                        <div className="summary-row">
                          <span className="summary-label">Categoria:</span>
                          <span className="summary-value">{categories.find(c => c.id === selectedCat)?.label || 'Não informado'}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Descrição:</span>
                          <span className="summary-value">{description || 'Não informado'}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Urgência:</span>
                          <span className="summary-value">{urgency ? (urgency.charAt(0).toUpperCase() + urgency.slice(1)) : 'Não informado'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="summary-section">
                      <h5>Preferências de Contato</h5>
                      <div className="summary-grid">
                        <div className="summary-row">
                          <span className="summary-label">Método de contato:</span>
                          <span className="summary-value">{contactOptions.find(c => c.id === contactMethod)?.label || 'Não informado'}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Visibilidade:</span>
                          <span className="summary-value">{visibilityOptions.find(v => v.id === visibility)?.label || 'Não informado'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  className="btn btn-primary"
                >
                  <span>Próximo</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"/>
                  </svg>
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className={`btn btn-primary btn-large ${isSubmitting ? 'submitting' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                        <path d="M2 2l7.586 7.586"/>
                        <circle cx="11" cy="11" r="2"/>
                      </svg>
                      <span>Publicar pedido</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisoDeAjuda;