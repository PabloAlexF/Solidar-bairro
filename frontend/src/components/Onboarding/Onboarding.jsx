import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MessageCircle,
  ArrowUp,
  ArrowLeft
} from 'lucide-react';
import './Onboarding.css';

// ==================================
//      MOCK UI COMPONENTS (v5)
// ==================================

const MockHelpCard = ({ item, onClick, isSelected }) => (
  <motion.button
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
    whileTap={{ scale: 0.98 }}
    className={`sb-mock-card help ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
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
  </motion.button>
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
  <motion.button
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
    whileTap={{ scale: 0.98 }}
    className={`sb-mock-card lost-found ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
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
  </motion.button>
);

const Confetti = () => (
  <div className="sb-confetti-wrapper">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="sb-confetti-particle"
        initial={{ y: -50, x: Math.random() * 100 + "%", opacity: 0, rotate: 0 }}
        animate={{
          y: "120vh",
          opacity: [0, 1, 1, 0],
          rotate: 720,
        }}
        transition={{
          duration: Math.random() * 2 + 2,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 3
        }}
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'][Math.floor(Math.random() * 5)],
          width: Math.random() * 8 + 6 + 'px',
          height: Math.random() * 8 + 6 + 'px',
        }}
      />
    ))}
  </div>
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
  setSelectedLostFoundItem,
  interactionsComplete,
  steps,
  currentStep
}) => {
  const Icon = step.icon; // Assign to a capitalized variable

  const renderInteraction = () => {
    if (!step.interaction) return null;
    const { interaction } = step;

    if (interaction.type === 'help_creation_flow') {
      return (
        <div className="sb-interaction-panel">
          <motion.h5
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="sb-interaction-title"
          >
            {interaction.prompt}
          </motion.h5>
          <div className="sb-mock-ui-container help-categories">
            {interaction.categories.map((category, idx) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'var(--bg-hover)' }}
                  whileTap={{ scale: 0.95 }}
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
                </motion.div>
              );
            })}
          </div>

          {/* Mini Modal for Details */}
          <AnimatePresence>
          {helpCreationStep === 'details' && selectedCategory && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="sb-mini-modal-overlay" onClick={() => setHelpCreationStep(null)}
            >
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="sb-mini-modal" onClick={(e) => e.stopPropagation()}>
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
                      handleInteraction('need-help', 'completed');
                    }}
                  >
                    Publicar Pedido
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* Success Modal */}
          <AnimatePresence>
          {helpCreationStep === 'published' && selectedCategory && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="sb-mini-modal-overlay" onClick={() => {
              setHelpCreationStep(null);
              setSelectedCategory(null);
              setHelpDescription('');
              handleInteraction('help', 'completed');
            }}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="sb-mini-modal success" onClick={(e) => e.stopPropagation()}
              >
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
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>

        </div>
      );
    }

    return (
      <div className="sb-interaction-panel">
        <motion.h5 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sb-interaction-title">{interaction.prompt}</motion.h5>
        <div className={`sb-mock-ui-container ${interaction.renderer?.name === 'MockLostFoundCard' ? 'lost-found-grid' : ''}`}>
          {interaction.items?.map(item => {
            const Renderer = interaction.renderer;
            const isSelected = interactionsComplete[steps[currentStep].id] === item.id;
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
        <AnimatePresence>
        {lostFoundModal && selectedLostFoundItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="sb-mini-modal-overlay" onClick={() => setLostFoundModal(false)}
          >
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sb-help-modal" onClick={(e) => e.stopPropagation()}>
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
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
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
      <div className="sb-step-content-body">
        {renderInteraction()}
        {/* Choice Indicator */}
        {(step.id === 'help' || step.id === 'lost-found') && !isStepInteractionComplete && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="sb-choice-indicator"
          >
            <motion.div
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="sb-choice-arrow"
            >
              <ArrowLeft size={24} />
            </motion.div>
            <p className="sb-choice-text">Escolha uma opção à esquerda para continuar</p>
          </motion.div>
        )}
      </div>
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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');

    const preventScroll = (e) => {
      e.preventDefault();
    };

    // Prevent scroll events on window
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }
    });

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
          e.preventDefault();
        }
      });
    };
  }, []);

  const handleInteraction = (stepId, value) => {
    if (interactionsComplete[stepId] === value) return;
    setInteractionsComplete(prev => ({ ...prev, [stepId]: value }));
  };

  const steps = useMemo(() => [
     {
      id: 'welcome',
      navLabel: 'Bem-vindo',
      navDesc: 'Início da jornada',
      icon: PartyPopper,
      title: 'Oi! Bem-vindo ao SolidarBairro',
      description: 'Aqui, vizinhos se ajudam. Vamos te mostrar como é fácil conectar e fazer a diferença. Pronto para começar?',
    },
    {
      id: 'help',
      navLabel: 'Quero Ajudar',
      navDesc: 'Faça a diferença',
      icon: HandHelping,
      color: 'teal',
      title: 'Ajude quem precisa',
      description: 'Veja pedidos reais de vizinhos próximos. Um pequeno gesto pode mudar vidas. Toque em um para simular.',
      interaction: {
        type: 'ui_simulation',
        prompt: 'Toque em um card abaixo para ver como é fácil oferecer ajuda.',
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
          }
        ],
        renderer: MockHelpCard
      }
    },
    {
      id: 'need-help',
      navLabel: 'Preciso de Ajuda',
      navDesc: 'Conte com apoio',
      icon: HandHelping,
      color: 'purple',
      title: 'Precisa de uma mão?',
      description: 'Conte com a comunidade. Publique seu pedido com dignidade – é corajoso pedir ajuda. Escolha uma categoria abaixo.',
      interaction: {
        type: 'help_creation_flow',
        prompt: 'Escolha uma categoria abaixo para simular um pedido:',
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
          },
          {
            id: 'saude',
            name: 'Saúde',
            icon: Heart,
            color: '#ef4444',
            description: 'Medicamentos, consultas médicas, cuidados de saúde'
          },
          {
            id: 'educacao',
            name: 'Educação',
            icon: BookOpen,
            color: '#8b5cf6',
            description: 'Materiais escolares, cursos, apoio educacional'
          }
        ]
      }
    },
    {
      id: 'lost-found',
      navLabel: 'Achados e Perdidos',
      navDesc: 'Recupere itens',
      icon: Package,
      color: 'pink',
      title: 'Achados e Perdidos',
      description: 'Perdeu algo ou encontrou? A comunidade ajuda a reunir. Clique para ver detalhes e conectar.',
      interaction: {
        type: 'ui_simulation',
        prompt: 'Clique em um item para ver detalhes e iniciar o contato.',
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
      title: 'Pronto para explorar!',
      description: 'Você conhece o básico. Agora, ajude, peça apoio e fortaleça o bairro. Vamos lá!',
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
      {steps[currentStep].id === 'start' && <Confetti />}
      <div className="sb-onboarding-container">
        <button className="sb-onboarding-close-modal" onClick={() => onSkip(dontShowAgain)}>
          <X size={20} />
        </button>
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
          <div className="sb-progress-bar" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin="1" aria-valuemax={steps.length} aria-label="Progresso do onboarding">
            <div className="sb-progress-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
            <span className="sb-progress-text">Passo {currentStep + 1} de {steps.length}</span>
          </div>
          <div className="sb-main-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ width: '100%', height: '100%' }}
              >
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
                  interactionsComplete={interactionsComplete}
                  steps={steps}
                  currentStep={currentStep}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="sb-main-footer">
            <div className="sb-dont-show-again"><input type="checkbox" id="dontShowAgainV5" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} /><label htmlFor="dontShowAgainV5">Não mostrar novamente</label></div>
            <button className={`sb-btn sb-btn-primary ${glow ? 'glow' : ''}`} onClick={handleNext} disabled={!isStepInteractionComplete}>
              Continuar <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;