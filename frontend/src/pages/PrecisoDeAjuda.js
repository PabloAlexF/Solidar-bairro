import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PrecisoDeAjudaClean.css';

const categories = [
  { id: 'food', label: 'Alimentos', icon: <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="alimentos" width="36" height="36" />, desc: 'Comida, cesta básica' },
  { id: 'clothes', label: 'Roupas', icon: <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png" alt="roupas" width="36" height="36" />, desc: 'Roupas, calçados' },
  { id: 'hygiene', label: 'Higiene', icon: <img src="https://cdn-icons-png.flaticon.com/512/2553/2553642.png" alt="higiene" width="36" height="36" />, desc: 'Produtos de limpeza' },
  { id: 'meds', label: 'Medicamentos', icon: <img src="https://cdn-icons-png.flaticon.com/512/883/883356.png" alt="medicamentos" width="36" height="36" />, desc: 'Remédios, consultas' },
  { id: 'bills', label: 'Contas', icon: <img src="https://cdn-icons-png.flaticon.com/512/1611/1611179.png" alt="contas" width="36" height="36" />, desc: 'Água, luz, aluguel' },
  { id: 'work', label: 'Emprego', icon: <img src="https://cdn-icons-png.flaticon.com/512/1077/1077976.png" alt="emprego" width="36" height="36" />, desc: 'Trabalho, renda' },
  { id: 'other', label: 'Outros', icon: <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="outros" width="36" height="36" />, desc: 'Outras necessidades' },
];

const contactOptions = [
  { id: 'whatsapp', label: 'WhatsApp', icon: <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="whatsapp" width="24" height="24" />, desc: 'Mais rápido' },
  { id: 'phone', label: 'Ligação', icon: <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" alt="telefone" width="24" height="24" />, desc: 'Tradicional' },
  { id: 'chat', label: 'Chat Interno', icon: <img src="https://cdn-icons-png.flaticon.com/512/2040/2040946.png" alt="chat" width="24" height="24" />, desc: 'Na plataforma' },
];

const PrecisoDeAjuda = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCat, setSelectedCat] = useState(null);
  const [urgency, setUrgency] = useState('media');
  const [description, setDescription] = useState('');
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [isPublished, setIsPublished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

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
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsPublished(true);
      }, 2000);
    }
  };

  if (isPublished) {
    return (
      <div className="preciso-ajuda">
        <div className="container">
          <div className="success-content animate-fade-in">
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
                className="btn btn-primary btn-lg"
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
        {/* Step Progress */}
        <div className="step-progress">
          <div className="step-indicator">
            {[
              { num: 1, label: 'Categoria' },
              { num: 2, label: 'Descrição' },
              { num: 3, label: 'Urgência' },
              { num: 4, label: 'Contato' },
              { num: 5, label: 'Revisão' }
            ].map((step, index) => (
              <React.Fragment key={step.num}>
                <div className="step-item">
                  <div className={`step-dot ${
                    step.num === currentStep ? 'active' : 
                    step.num < currentStep ? 'completed' : 'pending'
                  }`}>
                    {step.num < currentStep ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    ) : (
                      <span className="step-number">{step.num}</span>
                    )}
                  </div>
                  <div className="step-label">{step.label}</div>
                </div>
                {index < 4 && (
                  <div className={`step-connector ${
                    step.num < currentStep ? 'completed' : 'pending'
                  }`}>
                    <div className="step-line" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="step-progress-bar">
            <div 
              className="step-progress-fill"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">
          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="step-header">
                <h1 className="step-title">Qual tipo de ajuda você precisa?</h1>
                <p className="step-subtitle">
                  Selecione a categoria que melhor descreve sua necessidade
                </p>
              </div>

              <div className="categories-grid">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`category-card hover-lift ${
                      selectedCat === category.id ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedCat(category.id)}
                  >
                    <div className="category-header">
                      <div className="category-icon">
                        {category.icon}
                      </div>
                      <div className="category-info">
                        <h3>{category.label}</h3>
                        <p>{category.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.category && (
                <div className="form-error">{errors.category}</div>
              )}
            </div>
          )}

          {/* Step 2: Description */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <div className="step-header">
                <h1 className="step-title">Descreva sua situação</h1>
                <p className="step-subtitle">
                  Conte mais detalhes sobre o que você precisa. Seja específico para receber a ajuda mais adequada.
                </p>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label className="form-label form-label-required">Descrição da necessidade</label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    placeholder="Ex: Preciso de uma cesta básica para minha família de 4 pessoas. Estou desempregado há 2 meses e as reservas acabaram..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="form-help">
                    {description.length}/500 caracteres • Mínimo 20 caracteres
                  </div>
                  {errors.description && (
                    <div className="form-error">{errors.description}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Urgency */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              <div className="step-header">
                <h1 className="step-title">Qual a urgência?</h1>
                <p className="step-subtitle">
                  Isso ajuda as pessoas a priorizarem as ajudas mais urgentes
                </p>
              </div>

              <div className="urgency-options">
                <div
                  className={`urgency-option alta hover-lift ${
                    urgency === 'alta' ? 'selected' : ''
                  }`}
                  onClick={() => setUrgency('alta')}
                >
                  <div className="urgency-label" style={{ color: 'var(--danger)' }}>🚨 Alta</div>
                  <div className="urgency-desc">Preciso hoje ou amanhã</div>
                </div>
                <div
                  className={`urgency-option media hover-lift ${
                    urgency === 'media' ? 'selected' : ''
                  }`}
                  onClick={() => setUrgency('media')}
                >
                  <div className="urgency-label" style={{ color: 'var(--warning)' }}>⏰ Média</div>
                  <div className="urgency-desc">Preciso esta semana</div>
                </div>
                <div
                  className={`urgency-option baixa hover-lift ${
                    urgency === 'baixa' ? 'selected' : ''
                  }`}
                  onClick={() => setUrgency('baixa')}
                >
                  <div className="urgency-label" style={{ color: 'var(--success)' }}>📅 Flexível</div>
                  <div className="urgency-desc">Quando possível</div>
                </div>
              </div>

              {errors.urgency && (
                <div className="form-error">{errors.urgency}</div>
              )}
            </div>
          )}

          {/* Step 4: Contact */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <div className="step-header">
                <h1 className="step-title">Como prefere ser contatado?</h1>
                <p className="step-subtitle">
                  Escolha a forma mais fácil para as pessoas entrarem em contato
                </p>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Método de contato</h3>
                <div className="contact-methods">
                  {contactOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`contact-method hover-lift ${
                        contactMethod === option.id ? 'selected' : ''
                      }`}
                      onClick={() => setContactMethod(option.id)}
                    >
                      <div className="contact-icon">
                        {option.icon}
                      </div>
                      <div className="contact-info">
                        <h4>{option.label}</h4>
                        <p>{option.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {errors.contact && (
                <div className="form-error">{errors.contact}</div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="animate-fade-in">
              <div className="step-header">
                <h1 className="step-title">Revisar e publicar</h1>
                <p className="step-subtitle">
                  Confira os dados antes de publicar sua solicitação
                </p>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    {categories.find(c => c.id === selectedCat)?.label} - 
                    {urgency === 'alta' ? ' Urgente' : urgency === 'media' ? ' Moderada' : ' Flexível'}
                  </h3>
                  <div className={`badge badge-${
                    urgency === 'alta' ? 'danger' : urgency === 'media' ? 'warning' : 'success'
                  }`}>
                    {urgency === 'alta' ? 'Alta Prioridade' : urgency === 'media' ? 'Prioridade Média' : 'Flexível'}
                  </div>
                </div>
                
                <div className="card-body">
                  <p><strong>Descrição:</strong></p>
                  <p>{description}</p>
                  <p><strong>Contato:</strong> {contactOptions.find(c => c.id === contactMethod)?.label}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="step-navigation">
          <div>
            {currentStep > 1 && (
              <button 
                className="btn btn-secondary"
                onClick={prevStep}
              >
                ← Voltar
              </button>
            )}
          </div>
          
          <div className="nav-buttons">
            {currentStep < totalSteps ? (
              <button 
                className="btn btn-primary"
                onClick={nextStep}
              >
                Continuar →
              </button>
            ) : (
              <button 
                className={`btn btn-success btn-lg ${
                  isSubmitting ? 'btn-loading' : ''
                }`}
                onClick={handlePublish}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publicando...' : '🚀 Publicar pedido'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrecisoDeAjuda;