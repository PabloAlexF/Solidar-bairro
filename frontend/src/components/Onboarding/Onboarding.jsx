import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  HandHelping,
  Building2,
  Bell,
  Sparkles,
  PartyPopper,
  CheckCircle2,
  Circle,
  MousePointerClick,
  ChevronRight,
  X,
  MapPin,
  Clock,
  Award,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  Users,
  ArrowRight,
  User,
  Car,
  Coffee,
  Briefcase,
  Package,
  Search,
  Camera,
  Tag,
  Phone,
  MessageCircle
} from 'lucide-react';
import './Onboarding.css';

// ==================================
//      MOCK UI COMPONENTS (v5)
// ==================================

const MockHelpCard = ({ item, onClick, isSelected }) => (
  <button className={`sb-mock-card help ${isSelected ? 'selected' : ''}`} onClick={onClick}>
    <div className="sb-mock-card-header">
      <div className="sb-mock-card-category">
        <span className="sb-mock-card-category-icon" style={{ backgroundColor: item.categoryColor }}>
          <item.categoryIcon size={16} />
        </span>
        <span className="sb-mock-card-category-name">{item.category}</span>
      </div>
      <div className="sb-mock-card-time-info">
        <Clock size={12} />
        {item.time}
      </div>
    </div>
    <p className="sb-mock-card-desc">{item.request}</p>
    <div className="sb-mock-card-footer">
      <div className="sb-mock-card-user">
        <User size={18} />
        <span>{item.user}</span>
      </div>
      <div className="sb-mock-card-location">
        <MapPin size={18} />
        <span>{item.location}</span>
      </div>
    </div>
  </button>
);

const MockCommerceCard = ({ item, onClick, isSelected }) => (
  <button className={`sb-mock-card commerce ${isSelected ? 'selected' : ''}`} onClick={onClick}>
    <div className="sb-mock-card-header">
      <span className="sb-mock-card-title">{item.name}</span>
      {item.isPartner && <span className="sb-mock-card-partner"><Award size={12} /> Parceiro</span>}
    </div>
    <p className="sb-mock-card-desc">{item.category}</p>
    <div className="sb-mock-card-footer">
      <div className="sb-mock-card-tag commerce-tag">{item.rating} ★</div>
      <div className="sb-mock-card-location"><MapPin size={12} /> {item.location}</div>
    </div>
  </button>
);

const MockInterestItem = ({ item, onClick, isSelected }) => (
  <button className={`sb-mock-interest-item ${isSelected ? 'selected' : ''}`} onClick={onClick}>
    <div className="sb-mock-interest-icon"><item.icon size={20} /></div>
    <span className="sb-mock-interest-label">{item.label}</span>
    <div className="sb-mock-interest-toggle">
      {isSelected ? <ToggleRight size={24} className="toggled" /> : <ToggleLeft size={24} />}
    </div>
  </button>
);

const MockLostFoundCard = ({ item, onClick, isSelected, onChatClick }) => (
  <button className={`sb-mock-card lost-found ${isSelected ? 'selected' : ''}`} onClick={onClick}>
    <div className="sb-mock-card-image">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="sb-mock-card-img" />
      ) : (
        <div className="sb-mock-card-placeholder">
          <Camera size={32} strokeWidth={1} />
        </div>
      )}
      <div className={`sb-mock-type-badge ${item.type}`}>
        {item.type === 'lost' ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Search size={12} /> PERDIDO</span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> ACHADO</span>
        )}
      </div>
    </div>

    <div className="sb-mock-card-body">
      <div className="sb-mock-card-header">
        <span className="sb-mock-card-category-tag">{item.category}</span>
        <span className="sb-mock-card-date">
          <Clock size={12} />
          {item.date_occurrence ? new Date(item.date_occurrence).toLocaleDateString('pt-BR') : 'Recentemente'}
        </span>
      </div>

      <h3 className="sb-mock-card-title">
        {item.title || 'Novo Item'}
      </h3>
      <p className="sb-mock-card-desc" style={{ whiteSpace: 'pre-wrap' }}>{item.description || 'Descreva os detalhes importantes aqui...'}</p>

      <div className="sb-mock-card-meta">
        <div className="sb-mock-card-meta-item">
          <MapPin size={14} />
          <span>{item.location || 'Local a definir'}</span>
        </div>
        {item.reward && item.type === 'lost' && (
          <div className="sb-mock-card-meta-item reward">
            <Package size={14} />
            <span>Recompensa: {item.reward}</span>
          </div>
        )}
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="sb-mock-card-tags">
          {item.tags.map((tag, i) => (
            <span key={i} className="sb-mock-tag">#{tag}</span>
          ))}
        </div>
      )}
    </div>

    <div className="sb-mock-card-footer">
      <button className="sb-mock-chat-btn sb-mock-chat-btn-centered" onClick={() => onChatClick(item)}>
        ABRIR CHAT
      </button>
    </div>
  </button>
);

// Corrected Step Content Component
const OnboardingStepContent = ({
  step,
  isStepInteractionComplete,
  onInteraction,
  helpCreationStep,
  setHelpCreationStep,
  selectedCategory,
  setSelectedCategory,
  helpDescription,
  setHelpDescription,
  handleInteraction,
  lostFoundModal,
  setLostFoundModal,
  selectedLostFoundItem,
  setSelectedLostFoundItem
}) => {
  const Icon = step.icon; // Assign to a capitalized variable

  const renderInteraction = () => {
    if (!step.interaction) return null;
    const { interaction } = step;

    if (interaction.type === 'help_creation_flow') {
      return (
        <div className="sb-interaction-panel">
          <h5 className="sb-interaction-title">{interaction.prompt}</h5>
          <div className="sb-mock-ui-container help-categories">
            {interaction.categories.map(category => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.id}
                  className="sb-help-category-card"
                  onClick={() => {
                    setSelectedCategory(category);
                    setHelpCreationStep('details');
                  }}
                >
                  <div className="sb-help-category-icon" style={{ backgroundColor: category.color }}>
                    <IconComponent size={24} />
                  </div>
                  <div className="sb-help-category-content">
                    <h4>{category.name}</h4>
                    <p>{category.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mini Modal for Details */}
          {helpCreationStep === 'details' && selectedCategory && (
            <div className="sb-mini-modal-overlay" onClick={() => setHelpCreationStep(null)}>
              <div className="sb-mini-modal" onClick={(e) => e.stopPropagation()}>
                <div className="sb-mini-modal-header">
                  <h3>Detalhes do Pedido - {selectedCategory.name}</h3>
                  <button className="sb-mini-modal-close" onClick={() => setHelpCreationStep(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="sb-mini-modal-body">
                  <label className="sb-mini-modal-label">
                    Descreva seu problema ou necessidade:
                  </label>
                  <textarea
                    className="sb-mini-modal-textarea"
                    placeholder="Ex: Família com 3 crianças precisa de cesta básica urgente..."
                    value={helpDescription}
                    onChange={(e) => setHelpDescription(e.target.value)}
                  />
                  <button
                    className="sb-mini-modal-btn"
                    disabled={!helpDescription.trim()}
                    onClick={() => {
                      setHelpCreationStep('published');
                    }}
                  >
                    Publicar Pedido
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Modal */}
          {helpCreationStep === 'published' && selectedCategory && (
            <div className="sb-mini-modal-overlay" onClick={() => {
              setHelpCreationStep(null);
              setSelectedCategory(null);
              setHelpDescription('');
              handleInteraction('help', 'completed');
            }}>
              <div className="sb-mini-modal success" onClick={(e) => e.stopPropagation()}>
                <div className="sb-mini-modal-body">
                  <CheckCircle2 size={48} className="sb-success-icon" />
                  <h3>Pedido Publicado!</h3>
                  <p>Seu pedido de ajuda foi publicado com sucesso e agora está visível para toda a comunidade.</p>
                  <button
                    className="sb-mini-modal-btn success"
                    onClick={() => {
                      setHelpCreationStep(null);
                      setSelectedCategory(null);
                      setHelpDescription('');
                      handleInteraction('help', 'completed');
                    }}
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="sb-interaction-panel">
        <h5 className="sb-interaction-title">{interaction.prompt}</h5>
        <div className={`sb-mock-ui-container ${interaction.renderer?.name === 'MockLostFoundCard' ? 'lost-found-grid' : ''}`}>
          {interaction.items?.map(item => {
            const Renderer = interaction.renderer;
            const isSelected = isStepInteractionComplete === item.id;
            return (
              <Renderer
                key={item.id}
                item={item}
                onClick={() => onInteraction(item.id)}
                onChatClick={(selectedItem) => {
                  setSelectedLostFoundItem(selectedItem);
                  setLostFoundModal(true);
                }}
                isSelected={isSelected}
              />
            );
          })}
        </div>

        {/* Lost & Found Help Modal */}
        {lostFoundModal && selectedLostFoundItem && (
          <div className="sb-mini-modal-overlay" onClick={() => setLostFoundModal(false)}>
            <div className="sb-help-modal" onClick={(e) => e.stopPropagation()}>
              <div className="sb-help-modal-header">
                <button className="sb-help-modal-close" onClick={() => setLostFoundModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="sb-help-modal-body">
                <h2 className="sb-help-modal-title">
                  Você deseja ajudar {selectedLostFoundItem.type === 'lost' ? 'a encontrar' : 'a devolver'} este item?
                </h2>

                <div className="sb-help-modal-item-preview">
                  <div className="sb-help-modal-item-image">
                    {selectedLostFoundItem.image_url ? (
                      <img src={selectedLostFoundItem.image_url} alt={selectedLostFoundItem.title} />
                    ) : (
                      <div className="sb-help-modal-placeholder">
                        <Camera size={24} strokeWidth={1} />
                      </div>
                    )}
                    <div className={`sb-help-modal-badge ${selectedLostFoundItem.type}`}>
                      {selectedLostFoundItem.type === 'lost' ? 'PERDIDO' : 'ACHADO'}
                    </div>
                  </div>
                  <div className="sb-help-modal-item-info">
                    <h3>{selectedLostFoundItem.title}</h3>
                    <p>{selectedLostFoundItem.description}</p>
                    <div className="sb-help-modal-item-meta">
                      <span><MapPin size={14} /> {selectedLostFoundItem.location}</span>
                      {selectedLostFoundItem.reward && selectedLostFoundItem.type === 'lost' && (
                        <span className="reward">Recompensa: {selectedLostFoundItem.reward}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sb-help-modal-message">
                  <MessageCircle size={20} />
                  <p>Você está prestes a iniciar um chat com a pessoa que {selectedLostFoundItem.type === 'lost' ? 'perdeu' : 'encontrou'} este item.</p>
                </div>

                <div className="sb-help-modal-actions">
                  <button
                    className="sb-help-modal-btn sb-help-modal-btn-secondary"
                    onClick={() => setLostFoundModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="sb-help-modal-btn sb-help-modal-btn-primary"
                    onClick={() => {
                      setLostFoundModal(false);
                      setSelectedLostFoundItem(null);
                      handleInteraction('lost-found', 'completed');
                    }}
                  >
                    <MessageCircle size={16} />
                    Iniciar Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sb-onboarding-step-content">
      <div className="sb-step-content-header">
        <div className={`sb-step-content-icon ${step.color || 'blue'}`}>
          <Icon size={32} />
        </div>
        <div className="sb-step-content-text">
          <h2 className="sb-step-content-title">{step.title}</h2>
          <p className="sb-step-content-desc">{step.description}</p>
        </div>
      </div>
      {renderInteraction()}
    </div>
  );
};


// ==================================
//      MAIN ONBOARDING (v5)
// ==================================

const Onboarding = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [interactionsComplete, setInteractionsComplete] = useState({});
  const [helpCreationStep, setHelpCreationStep] = useState(null); // null, 'category', 'details', 'published'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [helpDescription, setHelpDescription] = useState('');
  const [lostFoundModal, setLostFoundModal] = useState(false);
  const [selectedLostFoundItem, setSelectedLostFoundItem] = useState(null);

  const handleInteraction = (stepId, value) => {
    if (interactionsComplete[stepId] === value) return;
    setInteractionsComplete(prev => ({ ...prev, [stepId]: value }));
  };

  const steps = useMemo(() => [
     {
      id: 'welcome',
      navLabel: 'Bem-vindo',
      navDesc: 'Introdução ao SolidarBairro',
      icon: PartyPopper,
      title: 'Bem-vindo ao SolidarBairro! 🌟',
      description: 'Uma comunidade onde vizinhos se ajudam. Vamos mostrar como é fácil conectar e fazer a diferença no seu bairro. Clique nos próximos passos para descobrir!',
    },
    {
      id: 'help',
      navLabel: 'Quero Ajudar',
      navDesc: 'Encontre pedidos de ajuda',
      icon: HandHelping,
      color: 'teal',
      title: 'Descubra quem precisa de ajuda no seu bairro',
      description: 'Veja pedidos reais de vizinhos próximos. Cada ajuda faz a diferença! Clique em um pedido para ver como funciona.',
      interaction: {
        type: 'ui_simulation',
        prompt: 'Simule sua escolha clicando em um dos pedidos para continuar.',
        items: [
          {
            type: 'help',
            id: 1,
            user: 'Ana Silva',
            request: 'Preciso de ajuda com transporte para consulta médica amanhã. Sou idosa e não tenho como ir sozinha.',
            category: 'Transporte',
            categoryColor: '#0ea5e9',
            categoryIcon: Car,
            location: 'Centro, Belo Horizonte',
            time: '2h atrás'
          },
          {
            type: 'help',
            id: 2,
            user: 'Carlos Mendes',
            request: 'Família precisa de cesta básica urgente. Temos 3 crianças pequenas e a situação está crítica.',
            category: 'Alimentos',
            categoryColor: '#f97316',
            categoryIcon: Coffee,
            location: 'Vila Nova, Belo Horizonte',
            time: '5h atrás'
          },
          {
            type: 'help',
            id: 3,
            user: 'Mariana Costa',
            request: 'Procurando emprego como auxiliar de limpeza. Tenho experiência e disponibilidade imediata.',
            category: 'Emprego',
            categoryColor: '#8b5cf6',
            categoryIcon: Briefcase,
            location: 'Savassi, Belo Horizonte',
            time: '1 dia atrás'
          }
        ],
        renderer: MockHelpCard
      }
    },
    {
      id: 'need-help',
      navLabel: 'Preciso de Ajuda',
      navDesc: 'Publique seu pedido',
      icon: HandHelping,
      color: 'purple',
      title: 'Peça ajuda quando precisar',
      description: 'Precisa de uma mão? Publique seu pedido e receba ajuda da comunidade. Vamos simular como criar um pedido de ajuda.',
      interaction: {
        type: 'help_creation_flow',
        prompt: 'Clique em uma categoria para simular a criação de um pedido de ajuda.',
        categories: [
          {
            id: 'alimentos',
            name: 'Alimentos',
            icon: Coffee,
            color: '#f97316',
            description: 'Cesta básica, refeições, doações de alimentos'
          },
          {
            id: 'transporte',
            name: 'Transporte',
            icon: Car,
            color: '#0ea5e9',
            description: 'Ajuda com deslocamento, consultas médicas, transporte'
          }
        ]
      }
    },
    {
      id: 'lost-found',
      navLabel: 'Achados e Perdidos',
      navDesc: 'Ajude a reencontrar objetos',
      icon: Package,
      color: 'pink',
      title: 'Reúna objetos perdidos com seus donos',
      description: 'Publique itens perdidos ou encontrados na seção "Achados e Perdidos". Adicione fotos, localização precisa e detalhes únicos para facilitar o reencontro com a ajuda da comunidade.',
      interaction: {
        type: 'ui_simulation',
        prompt: 'Simule clicando em um item para ver os detalhes e opções de contato.',
        items: [
          {
            type: 'lost',
            id: 1,
            title: 'Carteira de couro marrom',
            description: 'Carteira masculina em couro marrom, contém documentos, cartões e dinheiro.',
            category: 'Carteiras',
            location: 'Savassi, BH',
            date_occurrence: '2024-01-15',
            contact_info: '(31) 99999-8888',
            reward: 'R$ 100,00',
            tags: ['carteira', 'documentos'],
            image_url: null
          },
          {
            type: 'found',
            id: 2,
            title: 'Chaves com chaveiro vermelho',
            description: 'Conjunto de chaves encontrado na Praça Sete. Chaveiro vermelho.',
            category: 'Chaves',
            location: 'Praça Sete, BH',
            date_occurrence: '2024-01-14',
            contact_info: '(31) 98888-7777',
            reward: null,
            tags: ['chaves', 'vermelho'],
            image_url: null
          }
        ],
        renderer: MockLostFoundCard
      }
    },
    {
      id: 'start',
      navLabel: 'Tudo Pronto!',
      navDesc: 'Comece a usar o app',
      icon: Sparkles,
      color: 'green',
      title: 'Agora você está pronto para ajudar! 🎉',
      description: 'Parabéns! Você aprendeu como usar o SolidarBairro. Comece a explorar, ajudar vizinhos e fazer seu bairro ainda melhor.',
    },
  ], []);

  const isStepInteractionComplete = useMemo(() => {
    const currentInteraction = steps[currentStep].interaction;
    if (!currentInteraction) return true;
    return !!interactionsComplete[steps[currentStep].id];
  }, [currentStep, steps, interactionsComplete]);

  const [glow, setGlow] = useState(false);
  useEffect(() => {
    if (isStepInteractionComplete) {
      setGlow(true);
      const timer = setTimeout(() => setGlow(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isStepInteractionComplete, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else onComplete(dontShowAgain);
  };

  return (
    <div className="sb-onboarding-overlay v5">
      <button className="sb-onboarding-skip-overlay" onClick={() => onSkip(dontShowAgain)}>
        <X size={20} />
      </button>
      <div className="sb-onboarding-container">
        <div className="sb-onboarding-nav">
          <div className="sb-nav-header"><Heart size={24} className="sb-logo-icon" /><span className="sb-nav-title">Simulação</span></div>
          <div className="sb-nav-steps">
            {steps.map((step, index) => {
              const isCompleted = currentStep > index, isActive = currentStep === index;
              let statusIcon = <Circle size={20} className="sb-nav-icon-pending" />;
              if (isActive) statusIcon = <MousePointerClick size={20} className="sb-nav-icon-active" />;
              if (isCompleted) statusIcon = <CheckCircle2 size={20} className="sb-nav-icon-completed" />;
              return (
                <button key={step.id} className={`sb-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} disabled>
                  <div className="sb-nav-item-icon">{statusIcon}</div>
                  <div className="sb-nav-item-content">
                    <h4 className="sb-nav-item-title">{step.navLabel}</h4>
                    {step.navDesc && <p className="sb-nav-item-desc">{step.navDesc}</p>}
                  </div>
                  {isActive && <ChevronRight size={20} className="sb-nav-active-indicator" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sb-onboarding-main">
          <div className="sb-main-content">
            <OnboardingStepContent
              step={steps[currentStep]}
              isStepInteractionComplete={isStepInteractionComplete}
              onInteraction={(value) => handleInteraction(steps[currentStep].id, value)}
              helpCreationStep={helpCreationStep}
              setHelpCreationStep={setHelpCreationStep}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              helpDescription={helpDescription}
              setHelpDescription={setHelpDescription}
              handleInteraction={handleInteraction}
              lostFoundModal={lostFoundModal}
              setLostFoundModal={setLostFoundModal}
              selectedLostFoundItem={selectedLostFoundItem}
              setSelectedLostFoundItem={setSelectedLostFoundItem}
            />
          </div>
          <div className="sb-main-footer">
            <div className="sb-dont-show-again"><input type="checkbox" id="dontShowAgainV5" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} /><label htmlFor="dontShowAgainV5">Não mostrar novamente</label></div>
            <button className={`sb-btn sb-btn-primary ${glow ? 'glow' : ''}`} onClick={handleNext} disabled={!isStepInteractionComplete}>
              {currentStep === steps.length - 1 ? 'Começar a Explorar' : 'Próximo'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;