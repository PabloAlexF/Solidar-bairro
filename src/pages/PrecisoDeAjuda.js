import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/PrecisoDeAjuda.css';
import '../styles/pages/PrecisoDeAjudaWizard.css';

const categories = [
  { id: 'food', label: 'Alimentos', icon: <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="alimentos" width="36" height="36" />, desc: 'Comida, cesta básica', color: '#f59e0b' },
  { id: 'clothes', label: 'Roupas', icon: <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png" alt="roupas" width="36" height="36" />, desc: 'Roupas, calçados', color: '#8b5cf6' },
  { id: 'hygiene', label: 'Higiene', icon: <img src="https://cdn-icons-png.flaticon.com/512/2553/2553642.png" alt="higiene" width="36" height="36" />, desc: 'Produtos de limpeza', color: '#06b6d4' },
  { id: 'meds', label: 'Medicamentos', icon: <img src="https://cdn-icons-png.flaticon.com/512/883/883356.png" alt="medicamentos" width="36" height="36" />, desc: 'Remédios, consultas', color: '#ef4444' },
  { id: 'bills', label: 'Contas', icon: <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="contas" width="36" height="36" />, desc: 'Água, luz, aluguel', color: '#10b981' },
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
  { id: 'neighborhood', label: 'Apenas meu bairro', desc: 'Mais próximo', icon: <img src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="bairro" width="24" height="24" /> },
  { id: 'nearby', label: 'Bairros próximos', desc: 'Área expandida', icon: <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="mundo" width="24" height="24" /> },
  { id: 'ngos', label: 'ONGs parceiras', desc: 'Organizações', icon: <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="parceiros" width="24" height="24" /> },
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

  const totalSteps = 4;

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
        timestamp: new Date().toISOString()
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
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''}`}>
                  <div className="step-circle">{step}</div>
                  <div className="step-label">
                    {step === 1 && 'Categoria'}
                    {step === 2 && 'Detalhes'}
                    {step === 3 && 'Preferências'}
                    {step === 4 && 'Confirmação'}
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
                    
                    <div className="urgency-selector">
                      <h4>Quando você precisa dessa ajuda?</h4>
                      <p className="urgency-subtitle">Isso nos ajuda a priorizar e conectar você com quem pode ajudar</p>
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
                </div>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <div className="step-content">
                  <h3>Preferências de contato</h3>
                  <div className="preferences-grid">
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

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
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
                    disabled={(currentStep === 1 && !selectedCat) || (currentStep === 2 && !description.trim())}
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