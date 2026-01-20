import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  HandHelping,
  Sparkles,
  PartyPopper,
  CheckCircle2,
  Circle,
  ChevronRight,
  X,
  MapPin,
  Clock,
  BookOpen,
  ArrowRight,
  User,
  Car,
  Coffee,
  Package,
  Search,
  Camera,
  MessageCircle,
  Zap,
  Shield,
  Users,
  Gift,
  Globe,
  Eye,
  Lock,
  BadgeCheck,
  Building2,
  UserCheck,
  FileCheck,
  Navigation,
  Star,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import './Onboarding.css';

const FeatureHighlight = ({ icon: Icon, title, description, color }) => (
  <motion.div 
    className="onb-feature-highlight"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2 }}
  >
    <div className="onb-feature-icon" style={{ background: color }}>
      <Icon size={20} />
    </div>
    <div className="onb-feature-content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </motion.div>
);

const SecurityBadge = ({ icon: Icon, text }) => (
  <div className="onb-security-badge">
    <Icon size={14} />
    <span>{text}</span>
  </div>
);

const MockHelpCard = ({ item, onClick, isSelected }) => (
  <motion.button
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className={`onb-card onb-card-help ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    <div className="onb-card-content">
      <div className="onb-card-header">
        <div className="onb-card-category">
          <span className="onb-card-category-icon" style={{ backgroundColor: item.categoryColor }}>
            <item.categoryIcon size={16} />
          </span>
          <span className="onb-card-category-name">{item.category}</span>
        </div>
        <div className="onb-card-time">
          <Clock size={12} />
          {item.time}
        </div>
      </div>
      <p className="onb-card-desc">{item.request}</p>
      <div className="onb-card-footer">
        <div className="onb-card-user">
          <div className="onb-card-avatar">
            <User size={14} />
          </div>
          <span className="onb-card-user-name">{item.user}</span>
        </div>
        <div className="onb-card-location">
          <Navigation size={13} />
          <span>{item.distance}</span>
        </div>
      </div>
    </div>
    {isSelected && (
      <motion.div 
        className="onb-card-selected-badge"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        <CheckCircle2 size={18} />
      </motion.div>
    )}
  </motion.button>
);

const MockLostFoundCard = ({ item, onClick, isSelected, onChatClick }) => (
  <motion.button
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className={`onb-card onb-card-lostfound ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    <div className="onb-card-image">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="onb-card-img" />
      ) : (
        <div className="onb-card-placeholder">
          <Camera size={28} strokeWidth={1.5} />
        </div>
      )}
      <div className={`onb-type-badge ${item.type}`}>
        {item.type === 'lost' ? (
          <span><Search size={10} /> PERDIDO</span>
        ) : (
          <span><CheckCircle2 size={10} /> ACHADO</span>
        )}
      </div>
      {item.verified && (
        <div className="onb-verified-badge">
          <Shield size={10} />
        </div>
      )}
    </div>

    <div className="onb-card-body">
      <div className="onb-card-header">
        <span className="onb-card-category-tag">{item.category}</span>
        <span className="onb-card-date">
          <Clock size={11} />
          {item.date_occurrence ? new Date(item.date_occurrence).toLocaleDateString('pt-BR') : 'Recente'}
        </span>
      </div>

      <h3 className="onb-card-title">{item.title || 'Novo Item'}</h3>
      <p className="onb-card-desc">{item.description || 'Descrição do item...'}</p>

      <div className="onb-card-meta">
        <div className="onb-card-meta-item">
          <Navigation size={13} />
          <span>{item.distance || '500m de você'}</span>
        </div>
        {item.reward && item.type === 'lost' && (
          <div className="onb-card-meta-item reward">
            <Gift size={13} />
            <span>{item.reward}</span>
          </div>
        )}
      </div>
    </div>

    <div className="onb-card-action">
      <button 
        className="onb-chat-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onChatClick(item);
        }}
      >
        <MessageCircle size={14} />
        Entrar em Contato
      </button>
    </div>

    {isSelected && (
      <motion.div 
        className="onb-card-selected-badge"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
      >
        <CheckCircle2 size={18} />
      </motion.div>
    )}
  </motion.button>
);

const Confetti = () => (
  <div className="onb-confetti">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="onb-confetti-piece"
        initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
        animate={{
          y: "110vh",
          opacity: [0, 1, 1, 0],
          rotate: 720,
        }}
        transition={{
          duration: Math.random() * 2.5 + 2,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 3
        }}
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#6C5CE7', '#00B894'][Math.floor(Math.random() * 8)],
          width: Math.random() * 10 + 6 + 'px',
          height: Math.random() * 10 + 6 + 'px',
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }}
      />
    ))}
  </div>
);

const ProgressRing = ({ progress, size = 60, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="onb-progress-ring">
      <circle
        className="onb-progress-ring-bg"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        className="onb-progress-ring-fill"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          strokeDasharray: circumference,
          transformOrigin: "center",
          transform: "rotate(-90deg)",
        }}
      />
    </svg>
  );
};

const InteractionHint = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="onb-interaction-hint"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="onb-hint-icon"
        >
          <ThumbsUp size={16} />
        </motion.div>
        <span>Clique em um card acima para continuar</span>
      </motion.div>
    )}
  </AnimatePresence>
);

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
  const Icon = step.icon;

  const renderWelcomeContent = () => (
    <div className="onb-welcome-content">
      <div className="onb-welcome-features">
        <FeatureHighlight
          icon={Globe}
          title="Geolocalização Inteligente"
          description="Encontre pedidos e oportunidades de ajuda próximos a você em tempo real"
          color="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
        />
        <FeatureHighlight
          icon={Shield}
          title="Ambiente Seguro e Moderado"
          description="Todos os pedidos são analisados antes de serem publicados por nossa equipe"
          color="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
        />
        <FeatureHighlight
          icon={Users}
          title="Comunidade Verificada"
          description="Usuários passam por verificação para garantir a segurança de todos"
          color="linear-gradient(135deg, #a855f7 0%, #9333ea 100%)"
        />
        <FeatureHighlight
          icon={Building2}
          title="Administradores Locais"
          description="Cada bairro tem administradores dedicados para ajudar a comunidade"
          color="linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
        />
      </div>
      <div className="onb-welcome-stats">
        <div className="onb-stat">
          <span className="onb-stat-value">10k+</span>
          <span className="onb-stat-label">Vizinhos Conectados</span>
        </div>
        <div className="onb-stat">
          <span className="onb-stat-value">5k+</span>
          <span className="onb-stat-label">Pedidos Atendidos</span>
        </div>
        <div className="onb-stat">
          <span className="onb-stat-value">98%</span>
          <span className="onb-stat-label">Satisfação</span>
        </div>
      </div>
    </div>
  );

  const renderFinalContent = () => (
    <div className="onb-final-content">
      <div className="onb-final-checklist">
        <h4>O que você pode fazer agora:</h4>
        <div className="onb-checklist-item">
          <CheckCircle2 size={20} />
          <span>Explorar pedidos de ajuda na sua região</span>
        </div>
        <div className="onb-checklist-item">
          <CheckCircle2 size={20} />
          <span>Publicar seus próprios pedidos com segurança</span>
        </div>
        <div className="onb-checklist-item">
          <CheckCircle2 size={20} />
          <span>Encontrar ou reportar itens perdidos</span>
        </div>
        <div className="onb-checklist-item">
          <CheckCircle2 size={20} />
          <span>Conectar-se com vizinhos verificados</span>
        </div>
        <div className="onb-checklist-item">
          <CheckCircle2 size={20} />
          <span>Contribuir para uma comunidade mais unida</span>
        </div>
      </div>
      <div className="onb-final-trust">
        <div className="onb-trust-badges">
          <SecurityBadge icon={Lock} text="Dados Protegidos" />
          <SecurityBadge icon={Eye} text="Moderação 24h" />
          <SecurityBadge icon={Shield} text="100% Seguro" />
        </div>
      </div>
    </div>
  );

  const renderInteraction = () => {
    if (!step.interaction) {
      if (step.id === 'welcome') return renderWelcomeContent();
      if (step.id === 'start') return renderFinalContent();
      return null;
    }
    const { interaction } = step;

    if (interaction.type === 'help_creation_flow') {
      return (
        <div className="onb-interaction-panel">
          <div className="onb-security-notice">
            <Shield size={18} />
            <div>
              <strong>Ambiente Seguro</strong>
              <p>Todos os pedidos passam por análise da nossa equipe de moderação antes de serem publicados.</p>
            </div>
          </div>
          
          <motion.h5
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="onb-interaction-title"
          >
            {interaction.prompt}
          </motion.h5>
          <div className="onb-categories-grid">
            {interaction.categories.map((category, idx) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="onb-category-card"
                  onClick={() => {
                    setSelectedCategory(category);
                    setHelpCreationStep('details');
                  }}
                >
                  <div className="onb-category-icon" style={{ backgroundColor: category.color }}>
                    <IconComponent size={22} />
                  </div>
                  <div className="onb-category-content">
                    <h4>{category.name}</h4>
                    <p>{category.description}</p>
                  </div>
                  <ChevronRight size={18} className="onb-category-arrow" />
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {helpCreationStep === 'details' && selectedCategory && (
              <div 
                className="onb-modal-overlay" 
                onClick={() => setHelpCreationStep(null)}
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20, opacity: 0 }} 
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  className="onb-modal" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="onb-modal-header">
                    <div className="onb-modal-header-icon" style={{ backgroundColor: selectedCategory.color }}>
                      <selectedCategory.icon size={20} />
                    </div>
                    <h3>Novo Pedido - {selectedCategory.name}</h3>
                    <button className="onb-modal-close" onClick={() => setHelpCreationStep(null)}>
                      <X size={18} />
                    </button>
                  </div>
                  <div className="onb-modal-body">
                    <label className="onb-modal-label">
                      Descreva seu problema ou necessidade:
                    </label>
                    <textarea
                      className="onb-modal-textarea"
                      placeholder="Ex: Família com 3 crianças precisa de cesta básica urgente..."
                      value={helpDescription}
                      onChange={(e) => setHelpDescription(e.target.value)}
                      rows={4}
                    />
                    <div className="onb-modal-info-box">
                      <div className="onb-info-item">
                        <FileCheck size={16} />
                        <span>Seu pedido será analisado em até 2h</span>
                      </div>
                      <div className="onb-info-item">
                        <UserCheck size={16} />
                        <span>Administradores locais podem ajudar diretamente</span>
                      </div>
                      <div className="onb-info-item">
                        <Navigation size={16} />
                        <span>Vizinhos próximos serão notificados</span>
                      </div>
                    </div>
                    <button
                      className="onb-modal-btn primary"
                      disabled={!helpDescription.trim()}
                      onClick={() => {
                        setHelpCreationStep('published');
                        handleInteraction('need-help', 'completed');
                      }}
                    >
                      <Sparkles size={16} />
                      Enviar para Análise
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {helpCreationStep === 'published' && selectedCategory && (
              <div
                className="onb-modal-overlay" 
                onClick={() => {
                  setHelpCreationStep(null);
                  setSelectedCategory(null);
                  setHelpDescription('');
                  handleInteraction('help', 'completed');
                }}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="onb-modal success" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="onb-modal-body success">
                    <motion.div 
                      className="onb-success-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                    >
                      <CheckCircle2 size={48} />
                    </motion.div>
                    <h3>Pedido Enviado!</h3>
                    <p>Seu pedido foi enviado para análise. Nossa equipe de moderação irá verificar e aprovar em até 2 horas.</p>
                    <div className="onb-success-info">
                      <Shield size={16} />
                      <span>Você receberá uma notificação quando for aprovado</span>
                    </div>
                    <button
                      className="onb-modal-btn success"
                      onClick={() => {
                        setHelpCreationStep(null);
                        setSelectedCategory(null);
                        setHelpDescription('');
                        handleInteraction('help', 'completed');
                      }}
                    >
                      Continuar
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div className="onb-interaction-panel">
        {step.id === 'help' && (
          <div className="onb-geo-notice">
            <Navigation size={16} />
            <span>Mostrando pedidos a até 2km de você</span>
          </div>
        )}
        
        <motion.h5 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="onb-interaction-title"
        >
          {interaction.prompt}
        </motion.h5>
        <div className={`onb-cards-container ${interaction.renderer?.name === 'MockLostFoundCard' ? 'grid' : ''}`}>
          {interaction.items?.map((item, idx) => {
            const Renderer = interaction.renderer;
            const isSelected = interactionsComplete[steps[currentStep].id] === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Renderer
                  item={item}
                  onClick={() => onInteraction(item.id)}
                  onChatClick={(selectedItem) => {
                    setSelectedLostFoundItem(selectedItem);
                    setLostFoundModal(true);
                  }}
                  isSelected={isSelected}
                />
              </motion.div>
            );
          })}
        </div>

        <InteractionHint show={!isStepInteractionComplete} />

        <AnimatePresence>
          {lostFoundModal && selectedLostFoundItem && (
            <div 
              className="onb-modal-overlay" 
              onClick={() => setLostFoundModal(false)}
            >
              <motion.div 
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: 50, opacity: 0 }}
                className="onb-modal help-modal" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="onb-modal-header">
                  <h3>Confirmar Contato</h3>
                  <button className="onb-modal-close" onClick={() => setLostFoundModal(false)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="onb-modal-body">
                  <h2 className="onb-help-modal-title">
                    Você deseja ajudar {selectedLostFoundItem.type === 'lost' ? 'a encontrar' : 'a devolver'} este item?
                  </h2>

                  <div className="onb-help-modal-preview">
                    <div className="onb-help-modal-image">
                      {selectedLostFoundItem.image_url ? (
                        <img src={selectedLostFoundItem.image_url} alt={selectedLostFoundItem.title} />
                      ) : (
                        <div className="onb-help-modal-placeholder">
                          <Camera size={24} strokeWidth={1.5} />
                        </div>
                      )}
                      <div className={`onb-help-modal-badge ${selectedLostFoundItem.type}`}>
                        {selectedLostFoundItem.type === 'lost' ? 'PERDIDO' : 'ACHADO'}
                      </div>
                    </div>
                    <div className="onb-help-modal-info">
                      <h3>{selectedLostFoundItem.title}</h3>
                      <p>{selectedLostFoundItem.description}</p>
                      <div className="onb-help-modal-meta">
                        <span><Navigation size={14} /> {selectedLostFoundItem.distance || '500m de você'}</span>
                        {selectedLostFoundItem.reward && selectedLostFoundItem.type === 'lost' && (
                          <span className="reward"><Gift size={14} /> {selectedLostFoundItem.reward}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="onb-help-modal-message">
                    <Shield size={18} />
                    <p>Chat seguro e moderado. Suas informações pessoais ficam protegidas até você decidir compartilhar.</p>
                  </div>

                  <div className="onb-help-modal-actions">
                    <button
                      className="onb-modal-btn secondary"
                      onClick={() => setLostFoundModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="onb-modal-btn primary"
                      onClick={() => {
                        setLostFoundModal(false);
                        setSelectedLostFoundItem(null);
                        handleInteraction('lost-found', 'completed');
                      }}
                    >
                      <MessageCircle size={16} />
                      Iniciar Chat Seguro
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="onb-step-content">
      <div className="onb-step-header">
        <motion.div 
          className={`onb-step-icon ${step.color || 'blue'}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Icon size={32} />
        </motion.div>
        <div className="onb-step-text">
          <motion.h2 
            className="onb-step-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {step.title}
          </motion.h2>
          <motion.p 
            className="onb-step-desc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {step.description}
          </motion.p>
          {step.badges && (
            <motion.div 
              className="onb-step-badges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {step.badges.map((badge, idx) => (
                <SecurityBadge key={idx} icon={badge.icon} text={badge.text} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <div className="onb-step-body">
        {renderInteraction()}
      </div>
    </div>
  );
};

const Onboarding = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [interactionsComplete, setInteractionsComplete] = useState({});
  const [helpCreationStep, setHelpCreationStep] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [helpDescription, setHelpDescription] = useState('');
  const [lostFoundModal, setLostFoundModal] = useState(false);
  const [selectedLostFoundItem, setSelectedLostFoundItem] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    document.body.classList.add('onb-modal-open');
    return () => {
      document.body.classList.remove('onb-modal-open');
    };
  }, []);

  const handleInteraction = useCallback((stepId, value) => {
    if (interactionsComplete[stepId] === value) return;
    setInteractionsComplete(prev => ({ ...prev, [stepId]: value }));
  }, [interactionsComplete]);

  const steps = useMemo(() => [
    {
      id: 'welcome',
      navLabel: 'Bem-vindo',
      navDesc: 'Conheça a plataforma',
      icon: PartyPopper,
      color: 'orange',
      title: 'Bem-vindo ao SolidarBairro!',
      description: 'Uma plataforma segura onde vizinhos se conectam para ajudar uns aos outros. Descubra como transformar sua comunidade.',
    },
    {
      id: 'help',
      navLabel: 'Quero Ajudar',
      navDesc: 'Faça a diferença',
      icon: HandHelping,
      color: 'teal',
      title: 'Ajude quem está perto de você',
      description: 'Encontre pedidos verificados de vizinhos próximos usando geolocalização. Todos os pedidos passam por análise antes de serem publicados.',
      badges: [
        { icon: Shield, text: 'Pedidos Verificados' },
        { icon: Navigation, text: 'Geolocalização' }
      ],
      interaction: {
        type: 'ui_simulation',
        prompt: 'Veja como são os pedidos reais na plataforma:',
        items: [
          {
            type: 'help',
            id: 1,
            user: 'Maria Santos',
            request: 'Preciso de ajuda com transporte para consulta médica amanhã às 14h. Sou idosa e moro sozinha, não tenho como ir por conta própria.',
            category: 'Transporte',
            categoryColor: '#0ea5e9',
            categoryIcon: Car,
            location: 'Centro',
            distance: '800m',
            time: '2h atrás',
            urgency: 'high',
            verified: true
          },
          {
            type: 'help',
            id: 2,
            user: 'João Silva',
            request: 'Família com 3 crianças pequenas precisa de cesta básica. Estamos passando por um momento difícil após perda de emprego.',
            category: 'Alimentos',
            categoryColor: '#f97316',
            categoryIcon: Coffee,
            location: 'Vila Nova',
            distance: '1.2km',
            time: '5h atrás',
            urgency: 'normal',
            verified: true
          }
        ],
        renderer: MockHelpCard
      }
    },
    {
      id: 'need-help',
      navLabel: 'Preciso de Ajuda',
      navDesc: 'Peça apoio seguro',
      icon: Heart,
      color: 'purple',
      title: 'Precisa de ajuda? Estamos aqui!',
      description: 'Publique seu pedido com total segurança. Nossa equipe de moderação analisa cada solicitação, e administradores locais podem ajudar diretamente.',
      badges: [
        { icon: FileCheck, text: 'Análise em 2h' },
        { icon: UserCheck, text: 'Moderação Ativa' }
      ],
      interaction: {
        type: 'help_creation_flow',
        prompt: 'Escolha uma categoria para simular um pedido:',
        categories: [
          {
            id: 'alimentos',
            name: 'Alimentos',
            icon: Coffee,
            color: '#f97316',
            description: 'Cesta básica, refeições, suprimentos'
          },
          {
            id: 'transporte',
            name: 'Transporte',
            icon: Car,
            color: '#0ea5e9',
            description: 'Deslocamento, consultas médicas'
          },
          {
            id: 'saude',
            name: 'Saúde',
            icon: Heart,
            color: '#ef4444',
            description: 'Medicamentos, cuidados, apoio'
          },
          {
            id: 'educacao',
            name: 'Educação',
            icon: BookOpen,
            color: '#8b5cf6',
            description: 'Material escolar, cursos, aulas'
          }
        ]
      }
    },
    {
      id: 'lost-found',
      navLabel: 'Achados e Perdidos',
      navDesc: 'Recupere seus itens',
      icon: Package,
      color: 'pink',
      title: 'Achados e Perdidos da Comunidade',
      description: 'Perdeu algo ou encontrou um item? Nossa comunidade usa geolocalização para reunir objetos perdidos com seus donos de forma segura.',
      badges: [
        { icon: Globe, text: 'Mapa Interativo' },
        { icon: Lock, text: 'Chat Protegido' }
      ],
      interaction: {
        type: 'ui_simulation',
        prompt: 'Veja itens reportados próximos a você:',
        items: [
          {
            type: 'lost',
            id: 1,
            title: 'Carteira de couro marrom',
            description: 'Contém documentos importantes, cartões e fotos de família. Perdi ontem à noite.',
            category: 'Carteiras',
            location: 'Savassi',
            distance: '300m',
            date_occurrence: '2024-01-15',
            reward: 'R$ 150,00',
            verified: true,
            image_url: null
          },
          {
            type: 'found',
            id: 2,
            title: 'Chaves com chaveiro vermelho',
            description: 'Encontrei esse conjunto de chaves na praça. Chaveiro vermelho com formato de coração.',
            category: 'Chaves',
            location: 'Praça Sete',
            distance: '1.5km',
            date_occurrence: '2024-01-14',
            reward: null,
            verified: true,
            image_url: null
          }
        ],
        renderer: MockLostFoundCard
      }
    },
    {
      id: 'start',
      navLabel: 'Tudo Pronto!',
      navDesc: 'Comece sua jornada',
      icon: Sparkles,
      color: 'green',
      title: 'Você está pronto para fazer a diferença!',
      description: 'Agora você conhece o SolidarBairro. Uma comunidade mais unida e solidária começa com você.',
    },
  ], []);

  const isStepInteractionComplete = useMemo(() => {
    const currentInteraction = steps[currentStep].interaction;
    if (!currentInteraction) return true;
    return !!interactionsComplete[steps[currentStep].id];
  }, [currentStep, steps, interactionsComplete]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(dontShowAgain);
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [currentStep, steps.length, onComplete, dontShowAgain, isAnimating]);

  const handleSkip = useCallback(() => {
    onSkip(dontShowAgain);
  }, [onSkip, dontShowAgain]);

  return (
    <div className="onb-overlay">
      {steps[currentStep].id === 'start' && <Confetti />}
      
      <motion.div 
        className="onb-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button className="onb-close" onClick={handleSkip} title="Fechar">
          <X size={20} />
        </button>

        <aside className="onb-sidebar">
          <div className="onb-sidebar-header">
            <div className="onb-logo">
              <Heart size={24} />
            </div>
            <span className="onb-logo-text">SolidarBairro</span>
          </div>
          
          <nav className="onb-nav">
            {steps.map((step, index) => {
              const isCompleted = currentStep > index;
              const isActive = currentStep === index;
              const StepIcon = step.icon;
              
              return (
                <div 
                  key={step.id} 
                  className={`onb-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="onb-nav-icon">
                    {isCompleted ? (
                      <CheckCircle2 size={20} />
                    ) : isActive ? (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <StepIcon size={20} />
                      </motion.div>
                    ) : (
                      <Circle size={20} />
                    )}
                  </div>
                  <div className="onb-nav-content">
                    <h4>{step.navLabel}</h4>
                    <p>{step.navDesc}</p>
                  </div>
                  {isActive && (
                    <motion.div 
                      className="onb-nav-indicator"
                      layoutId="activeIndicator"
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="onb-sidebar-footer">
            <div className="onb-progress-info">
              <ProgressRing progress={progress} size={48} strokeWidth={4} />
              <div className="onb-progress-text">
                <span className="onb-progress-label">Progresso</span>
                <span className="onb-progress-value">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="onb-main">
          <div className="onb-main-progress">
            <div className="onb-progress-bar">
              <motion.div 
                className="onb-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="onb-progress-steps">
              Passo {currentStep + 1} de {steps.length}
            </span>
          </div>

          <div className="onb-main-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="onb-content-wrapper"
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

          <footer className="onb-footer">
            <label className="onb-checkbox">
              <input 
                type="checkbox" 
                checked={dontShowAgain} 
                onChange={(e) => setDontShowAgain(e.target.checked)} 
              />
              <span className="onb-checkbox-mark"></span>
              <span>Não mostrar novamente</span>
            </label>
            
            <motion.button 
              className={`onb-btn-primary ${!isStepInteractionComplete ? 'disabled' : ''}`}
              onClick={handleNext}
              disabled={!isStepInteractionComplete || isAnimating}
              whileHover={isStepInteractionComplete ? { scale: 1.02 } : {}}
              whileTap={isStepInteractionComplete ? { scale: 0.98 } : {}}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Começar a Explorar
                  <Sparkles size={18} />
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </footer>
        </main>
      </motion.div>
    </div>
  );
};

export default Onboarding;