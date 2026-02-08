'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
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
  ArrowLeft,
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
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Play,
  MousePointerClick
} from 'lucide-react';
import './OnboardingMobile.css';

/* ========================================
   SUB-COMPONENTS (Mobile-optimized)
   ======================================== */

const FeatureHighlightMobile = ({ icon: Icon, title, description, color, delay = 0 }) => (
  <motion.div
    className="onbm-feature-highlight"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.08, duration: 0.35 }}
  >
    <div className="onbm-feature-icon" style={{ background: color }}>
      <Icon size={18} />
    </div>
    <div className="onbm-feature-content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </motion.div>
);

const SecurityBadgeMobile = ({ icon: Icon, text }) => (
  <div className="onbm-security-badge">
    <Icon size={12} />
    <span>{text}</span>
  </div>
);

const AnimatedCounterMobile = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    setHasAnimated(true);
    const numericVal = parseInt(value.replace(/\D/g, ''), 10);
    const duration = 1000;
    const steps = 30;
    const increment = numericVal / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numericVal);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, hasAnimated]);

  const displayVal = value.includes('k') ? `${(count / 1000).toFixed(0)}k` :
                     value.includes('%') ? `${count}%` : count.toLocaleString();

  return <span className="onbm-stat-value">{count === 0 ? '0' : displayVal}{suffix}</span>;
};

const MockHelpCardMobile = ({ item, onClick, isSelected, index }) => (
  <motion.button
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`onbm-card onbm-card-help ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    <div className="onbm-card-content">
      <div className="onbm-card-header">
        <div className="onbm-card-category">
          <span className="onbm-card-category-icon" style={{ backgroundColor: item.categoryColor }}>
            <item.categoryIcon size={14} />
          </span>
          <span className="onbm-card-category-name">{item.category}</span>
        </div>
        <div className="onbm-card-time">
          <Clock size={11} />
          {item.time}
        </div>
      </div>
      <p className="onbm-card-desc">{item.request}</p>
      <div className="onbm-card-footer">
        <div className="onbm-card-user">
          <div className="onbm-card-avatar">
            <User size={12} />
          </div>
          <span className="onbm-card-user-name">{item.user}</span>
          {item.verified && <BadgeCheck size={12} className="onbm-verified-user" />}
        </div>
        <div className="onbm-card-location">
          <Navigation size={11} />
          <span>{item.distance}</span>
        </div>
      </div>
      {item.urgency === 'high' && (
        <div className="onbm-urgency-bar">
          <Zap size={10} />
          <span>Urgente</span>
        </div>
      )}
    </div>
    <AnimatePresence>
      {isSelected && (
        <motion.div
          className="onbm-card-selected-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <CheckCircle2 size={16} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

const MockLostFoundCardMobile = ({ item, onClick, isSelected, onChatClick, index }) => (
  <motion.button
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`onbm-card onbm-card-lostfound ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    <div className="onbm-card-image">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="onbm-card-img" />
      ) : (
        <div className="onbm-card-placeholder">
          <Camera size={22} strokeWidth={1.5} />
          <span>Sem foto</span>
        </div>
      )}
      <div className={`onbm-type-badge ${item.type}`}>
        {item.type === 'lost' ? (
          <span><Search size={9} /> PERDIDO</span>
        ) : (
          <span><CheckCircle2 size={9} /> ACHADO</span>
        )}
      </div>
      {item.verified && (
        <div className="onbm-verified-badge">
          <Shield size={9} />
        </div>
      )}
    </div>

    <div className="onbm-card-body">
      <div className="onbm-card-header">
        <span className="onbm-card-category-tag">{item.category}</span>
        <span className="onbm-card-date">
          <Clock size={10} />
          {item.date_occurrence ? new Date(item.date_occurrence).toLocaleDateString('pt-BR') : 'Recente'}
        </span>
      </div>

      <h3 className="onbm-card-title">{item.title || 'Novo Item'}</h3>
      <p className="onbm-card-desc">{item.description || 'Descricao do item...'}</p>

      <div className="onbm-card-meta">
        <div className="onbm-card-meta-item">
          <Navigation size={11} />
          <span>{item.distance || '500m de voce'}</span>
        </div>
        {item.reward && item.type === 'lost' && (
          <div className="onbm-card-meta-item reward">
            <Gift size={11} />
            <span>{item.reward}</span>
          </div>
        )}
      </div>
    </div>

    <div className="onbm-card-action">
      <button
        className="onbm-chat-btn"
        onClick={(e) => {
          e.stopPropagation();
          onChatClick(item);
        }}
      >
        <MessageCircle size={13} />
        Entrar em Contato
      </button>
    </div>

    <AnimatePresence>
      {isSelected && (
        <motion.div
          className="onbm-card-selected-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <CheckCircle2 size={16} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

const ConfettiMobile = () => (
  <div className="onbm-confetti">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="onbm-confetti-piece"
        initial={{ y: -10, x: 0, opacity: 0, rotate: 0 }}
        animate={{
          y: '110vh',
          opacity: [0, 1, 1, 0],
          rotate: 720 + Math.random() * 360,
        }}
        transition={{
          duration: Math.random() * 2 + 1.5,
          repeat: Infinity,
          ease: 'linear',
          delay: Math.random() * 2,
        }}
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#6C5CE7', '#00B894'][
            Math.floor(Math.random() * 8)
          ],
          width: Math.random() * 8 + 4 + 'px',
          height: Math.random() * 8 + 4 + 'px',
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }}
      />
    ))}
  </div>
);

/* ========================================
   STEP CONTENT (Mobile)
   ======================================== */

const OnboardingStepContentMobile = ({
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
  currentStep,
}) => {
  const Icon = step.icon;

  const renderWelcomeContent = () => (
    <div className="onbm-welcome-content">
      <div className="onbm-welcome-features">
        {[
          { icon: Globe, title: 'Geolocalizacao Inteligente', description: 'Encontre pedidos proximos a voce em tempo real', color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
          { icon: Shield, title: 'Ambiente Seguro', description: 'Pedidos analisados antes de serem publicados', color: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },
          { icon: Users, title: 'Comunidade Verificada', description: 'Usuarios passam por verificacao de seguranca', color: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' },
          { icon: Building2, title: 'Administradores Locais', description: 'Cada bairro tem administradores dedicados', color: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
        ].map((f, i) => (
          <FeatureHighlightMobile key={i} {...f} delay={i} />
        ))}
      </div>
      <motion.div
        className="onbm-welcome-stats"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="onbm-stat">
          <AnimatedCounterMobile value="10000" />
          <span className="onbm-stat-suffix">+</span>
          <span className="onbm-stat-label">Vizinhos</span>
        </div>
        <div className="onbm-stat-divider" />
        <div className="onbm-stat">
          <AnimatedCounterMobile value="5000" />
          <span className="onbm-stat-suffix">+</span>
          <span className="onbm-stat-label">Atendidos</span>
        </div>
        <div className="onbm-stat-divider" />
        <div className="onbm-stat">
          <AnimatedCounterMobile value="98" />
          <span className="onbm-stat-suffix">%</span>
          <span className="onbm-stat-label">Satisfacao</span>
        </div>
      </motion.div>
    </div>
  );

  const renderFinalContent = () => (
    <div className="onbm-final-content">
      <div className="onbm-final-checklist">
        <h4>O que voce pode fazer agora:</h4>
        {[
          'Explorar pedidos de ajuda na sua regiao',
          'Publicar seus proprios pedidos',
          'Encontrar ou reportar itens perdidos',
          'Conectar-se com vizinhos verificados',
          'Contribuir para uma comunidade unida',
        ].map((text, idx) => (
          <motion.div
            key={idx}
            className="onbm-checklist-item"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <CheckCircle2 size={18} />
            <span>{text}</span>
          </motion.div>
        ))}
      </div>
      <div className="onbm-trust-badges">
        <SecurityBadgeMobile icon={Lock} text="Dados Protegidos" />
        <SecurityBadgeMobile icon={Eye} text="Moderacao 24h" />
        <SecurityBadgeMobile icon={Shield} text="100% Seguro" />
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
        <div className="onbm-interaction-panel">
          <motion.div
            className="onbm-security-notice"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield size={16} />
            <div>
              <strong>Ambiente Seguro</strong>
              <p>Todos os pedidos passam por analise antes de serem publicados.</p>
            </div>
          </motion.div>

          <h5 className="onbm-interaction-title">{interaction.prompt}</h5>
          <div className="onbm-categories-grid">
            {interaction.categories.map((category, idx) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="onbm-category-card"
                  onClick={() => {
                    setSelectedCategory(category);
                    setHelpCreationStep('details');
                  }}
                >
                  <div className="onbm-category-icon" style={{ backgroundColor: category.color }}>
                    <IconComponent size={20} />
                  </div>
                  <div className="onbm-category-content">
                    <h4>{category.name}</h4>
                    <p>{category.description}</p>
                  </div>
                  <ChevronRight size={16} className="onbm-category-arrow" />
                </motion.div>
              );
            })}
          </div>

          {/* Details modal */}
          <AnimatePresence>
            {helpCreationStep === 'details' && selectedCategory && (
              <motion.div
                className="onbm-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setHelpCreationStep(null)}
              >
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="onbm-modal onbm-modal-sheet"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="onbm-modal-handle" />
                  <div className="onbm-modal-header">
                    <div className="onbm-modal-header-icon" style={{ backgroundColor: selectedCategory.color }}>
                      <selectedCategory.icon size={18} />
                    </div>
                    <h3>{selectedCategory.name}</h3>
                    <button className="onbm-modal-close" onClick={() => setHelpCreationStep(null)}>
                      <X size={16} />
                    </button>
                  </div>
                  <div className="onbm-modal-body">
                    <label className="onbm-modal-label">Descreva seu problema:</label>
                    <textarea
                      className="onbm-modal-textarea"
                      placeholder="Ex: Familia com 3 criancas precisa de cesta basica urgente..."
                      value={helpDescription}
                      onChange={(e) => setHelpDescription(e.target.value)}
                      rows={3}
                      autoFocus
                    />
                    <div className="onbm-char-count">
                      <span className={helpDescription.length > 0 ? 'active' : ''}>{helpDescription.length}</span> / 500
                    </div>
                    <div className="onbm-modal-info-box">
                      <div className="onbm-info-item">
                        <FileCheck size={14} />
                        <span>Analise em ate 2h</span>
                      </div>
                      <div className="onbm-info-item">
                        <UserCheck size={14} />
                        <span>Administradores podem ajudar</span>
                      </div>
                      <div className="onbm-info-item">
                        <Navigation size={14} />
                        <span>Vizinhos proximos notificados</span>
                      </div>
                    </div>
                    <motion.button
                      className="onbm-modal-btn primary"
                      disabled={!helpDescription.trim()}
                      onClick={() => {
                        setHelpCreationStep('published');
                        handleInteraction('need-help', 'completed');
                      }}
                      whileTap={helpDescription.trim() ? { scale: 0.97 } : {}}
                    >
                      <Sparkles size={14} />
                      Enviar para Analise
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Published success modal */}
          <AnimatePresence>
            {helpCreationStep === 'published' && selectedCategory && (
              <motion.div
                className="onbm-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setHelpCreationStep(null);
                  setSelectedCategory(null);
                  setHelpDescription('');
                  handleInteraction('help', 'completed');
                }}
              >
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="onbm-modal onbm-modal-sheet success"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="onbm-modal-handle" />
                  <div className="onbm-modal-body success">
                    <motion.div
                      className="onbm-success-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                    >
                      <CheckCircle2 size={40} />
                    </motion.div>
                    <h3>Pedido Enviado!</h3>
                    <p>Seu pedido foi enviado para analise. Nossa equipe ira verificar em ate 2 horas.</p>
                    <div className="onbm-success-info">
                      <Shield size={14} />
                      <span>Voce recebera uma notificacao quando for aprovado</span>
                    </div>
                    <motion.button
                      className="onbm-modal-btn success"
                      onClick={() => {
                        setHelpCreationStep(null);
                        setSelectedCategory(null);
                        setHelpDescription('');
                        handleInteraction('help', 'completed');
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Continuar
                      <ArrowRight size={14} />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div className="onbm-interaction-panel">
        {step.id === 'help' && (
          <motion.div
            className="onbm-geo-notice"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Navigation size={14} />
            <span>Pedidos a ate 2km de voce</span>
          </motion.div>
        )}

        <h5 className="onbm-interaction-title">{interaction.prompt}</h5>
        <div className={`onbm-cards-container ${interaction.renderer?.name === 'MockLostFoundCardMobile' ? 'grid' : ''}`}>
          {interaction.items?.map((item, idx) => {
            const Renderer = interaction.renderer;
            const isSelected = interactionsComplete[steps[currentStep].id] === item.id;
            return (
              <Renderer
                key={item.id}
                item={item}
                index={idx}
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

        {!isStepInteractionComplete && (
          <motion.div
            className="onbm-interaction-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>Toque em um card para continuar</span>
          </motion.div>
        )}

        {/* Lost/Found contact modal */}
        <AnimatePresence>
          {lostFoundModal && selectedLostFoundItem && (
            <motion.div
              className="onbm-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLostFoundModal(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="onbm-modal onbm-modal-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="onbm-modal-handle" />
                <div className="onbm-modal-header">
                  <h3>Confirmar Contato</h3>
                  <button className="onbm-modal-close" onClick={() => setLostFoundModal(false)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="onbm-modal-body">
                  <h2 className="onbm-help-modal-title">
                    {selectedLostFoundItem.type === 'lost' ? 'Ajudar a encontrar' : 'Ajudar a devolver'} este item?
                  </h2>

                  <div className="onbm-help-modal-preview">
                    <div className="onbm-help-modal-image">
                      {selectedLostFoundItem.image_url ? (
                        <img src={selectedLostFoundItem.image_url} alt={selectedLostFoundItem.title} />
                      ) : (
                        <div className="onbm-help-modal-placeholder">
                          <Camera size={20} strokeWidth={1.5} />
                        </div>
                      )}
                      <div className={`onbm-help-modal-badge ${selectedLostFoundItem.type}`}>
                        {selectedLostFoundItem.type === 'lost' ? 'PERDIDO' : 'ACHADO'}
                      </div>
                    </div>
                    <div className="onbm-help-modal-info">
                      <h3>{selectedLostFoundItem.title}</h3>
                      <p>{selectedLostFoundItem.description}</p>
                      <div className="onbm-help-modal-meta">
                        <span><Navigation size={12} /> {selectedLostFoundItem.distance || '500m'}</span>
                        {selectedLostFoundItem.reward && selectedLostFoundItem.type === 'lost' && (
                          <span className="reward"><Gift size={12} /> {selectedLostFoundItem.reward}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="onbm-help-modal-message">
                    <Shield size={16} />
                    <p>Chat seguro e moderado. Suas informacoes ficam protegidas.</p>
                  </div>

                  <div className="onbm-help-modal-actions">
                    <motion.button
                      className="onbm-modal-btn secondary"
                      onClick={() => setLostFoundModal(false)}
                      whileTap={{ scale: 0.97 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      className="onbm-modal-btn primary"
                      onClick={() => {
                        setLostFoundModal(false);
                        setSelectedLostFoundItem(null);
                        handleInteraction('lost-found', 'completed');
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <MessageCircle size={14} />
                      Chat Seguro
                    </motion.button>
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
    <div className="onbm-step-content">
      <div className="onbm-step-header">
        <motion.div
          className={`onbm-step-icon ${step.color || 'blue'}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon size={24} />
        </motion.div>
        <div className="onbm-step-text">
          <motion.h2
            className="onbm-step-title"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {step.title}
          </motion.h2>
          <motion.p
            className="onbm-step-desc"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {step.description}
          </motion.p>
          {step.badges && (
            <motion.div
              className="onbm-step-badges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {step.badges.map((badge, idx) => (
                <SecurityBadgeMobile key={idx} icon={badge.icon} text={badge.text} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <div className="onbm-step-body">{renderInteraction()}</div>
    </div>
  );
};

/* ========================================
   MAIN MOBILE COMPONENT
   ======================================== */

const OnboardingMobile = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [interactionsComplete, setInteractionsComplete] = useState({});
  const [helpCreationStep, setHelpCreationStep] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [helpDescription, setHelpDescription] = useState('');
  const [lostFoundModal, setLostFoundModal] = useState(false);
  const [selectedLostFoundItem, setSelectedLostFoundItem] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    document.body.classList.add('onbm-modal-open');
    return () => document.body.classList.remove('onbm-modal-open');
  }, []);

  const handleInteraction = useCallback(
    (stepId, value) => {
      if (interactionsComplete[stepId] === value) return;
      setInteractionsComplete((prev) => ({ ...prev, [stepId]: value }));
    },
    [interactionsComplete]
  );

  const steps = useMemo(
    () => [
      {
        id: 'welcome',
        navLabel: 'Bem-vindo',
        icon: PartyPopper,
        color: 'orange',
        title: 'Bem-vindo ao SolidarBairro!',
        description: 'Uma plataforma segura onde vizinhos se conectam para ajudar uns aos outros.',
      },
      {
        id: 'help',
        navLabel: 'Ajudar',
        icon: HandHelping,
        color: 'teal',
        title: 'Ajude quem esta perto',
        description: 'Encontre pedidos verificados de vizinhos proximos usando geolocalizacao.',
        badges: [
          { icon: Shield, text: 'Verificados' },
          { icon: Navigation, text: 'Geolocalizacao' },
        ],
        interaction: {
          type: 'ui_simulation',
          prompt: 'Pedidos reais na plataforma:',
          items: [
            {
              type: 'help', id: 1, user: 'Maria Santos',
              request: 'Preciso de ajuda com transporte para consulta medica amanha as 14h. Sou idosa e moro sozinha.',
              category: 'Transporte', categoryColor: '#0ea5e9', categoryIcon: Car,
              location: 'Centro', distance: '800m', time: '2h atras',
              urgency: 'high', verified: true,
            },
            {
              type: 'help', id: 2, user: 'Joao Silva',
              request: 'Familia com 3 criancas precisa de cesta basica. Passando por momento dificil apos perda de emprego.',
              category: 'Alimentos', categoryColor: '#f97316', categoryIcon: Coffee,
              location: 'Vila Nova', distance: '1.2km', time: '5h atras',
              urgency: 'normal', verified: true,
            },
          ],
          renderer: MockHelpCardMobile,
        },
      },
      {
        id: 'need-help',
        navLabel: 'Pedir',
        icon: Heart,
        color: 'purple',
        title: 'Precisa de ajuda?',
        description: 'Publique seu pedido com seguranca. Nossa equipe analisa cada solicitacao.',
        badges: [
          { icon: FileCheck, text: 'Analise em 2h' },
          { icon: UserCheck, text: 'Moderacao' },
        ],
        interaction: {
          type: 'help_creation_flow',
          prompt: 'Escolha uma categoria:',
          categories: [
            { id: 'alimentos', name: 'Alimentos', icon: Coffee, color: '#f97316', description: 'Cesta basica, refeicoes' },
            { id: 'transporte', name: 'Transporte', icon: Car, color: '#0ea5e9', description: 'Deslocamento, consultas' },
            { id: 'saude', name: 'Saude', icon: Heart, color: '#ef4444', description: 'Medicamentos, cuidados' },
            { id: 'educacao', name: 'Educacao', icon: BookOpen, color: '#8b5cf6', description: 'Material escolar, aulas' },
          ],
        },
      },
      {
        id: 'lost-found',
        navLabel: 'Achados',
        icon: Package,
        color: 'pink',
        title: 'Achados e Perdidos',
        description: 'Use geolocalizacao para reunir objetos perdidos com seus donos.',
        badges: [
          { icon: Globe, text: 'Mapa' },
          { icon: Lock, text: 'Chat Protegido' },
        ],
        interaction: {
          type: 'ui_simulation',
          prompt: 'Itens reportados proximos:',
          items: [
            {
              type: 'lost', id: 1, title: 'Carteira de couro marrom',
              description: 'Contem documentos importantes, cartoes e fotos. Perdi ontem a noite.',
              category: 'Carteiras', location: 'Savassi', distance: '300m',
              date_occurrence: '2024-01-15', reward: 'R$ 150,00', verified: true, image_url: null,
            },
            {
              type: 'found', id: 2, title: 'Chaves com chaveiro vermelho',
              description: 'Encontrei na praca. Chaveiro vermelho com formato de coracao.',
              category: 'Chaves', location: 'Praca Sete', distance: '1.5km',
              date_occurrence: '2024-01-14', reward: null, verified: true, image_url: null,
            },
          ],
          renderer: MockLostFoundCardMobile,
        },
      },
      {
        id: 'start',
        navLabel: 'Pronto!',
        icon: Sparkles,
        color: 'green',
        title: 'Tudo pronto!',
        description: 'Agora voce conhece o SolidarBairro. Uma comunidade mais unida comeca com voce.',
      },
    ],
    []
  );

  const isStepInteractionComplete = useMemo(() => {
    const currentInteraction = steps[currentStep].interaction;
    if (!currentInteraction) return true;
    return !!interactionsComplete[steps[currentStep].id];
  }, [currentStep, steps, interactionsComplete]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(dontShowAgain);
    }
    setTimeout(() => setIsAnimating(false), 350);
  }, [currentStep, steps.length, onComplete, dontShowAgain, isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating || currentStep === 0) return;
    setIsAnimating(true);
    setDirection(-1);
    setCurrentStep(currentStep - 1);
    setTimeout(() => setIsAnimating(false), 350);
  }, [currentStep, isAnimating]);

  const handleSkip = useCallback(() => {
    onSkip?.(dontShowAgain);
  }, [onSkip, dontShowAgain]);

  // Swipe navigation
  const handleDragEnd = useCallback(
    (event, info) => {
      const threshold = 50;
      if (info.offset.x < -threshold && isStepInteractionComplete && currentStep < steps.length - 1) {
        handleNext();
      } else if (info.offset.x > threshold && currentStep > 0) {
        handlePrev();
      }
    },
    [handleNext, handlePrev, isStepInteractionComplete, currentStep, steps.length]
  );

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="onbm-overlay">
      {steps[currentStep].id === 'start' && <ConfettiMobile />}

      <motion.div
        className="onbm-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* TOP BAR */}
        <div className="onbm-topbar">
          <div className="onbm-topbar-left">
            <div className="onbm-logo">
              <Heart size={16} />
            </div>
            <span className="onbm-logo-text">SolidarBairro</span>
          </div>
          <button className="onbm-close" onClick={handleSkip}>
            <X size={18} />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="onbm-progress-section">
          <div className="onbm-progress-bar">
            <motion.div
              className="onbm-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="onbm-step-indicators">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`onbm-step-indicator ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
              >
                {i < currentStep ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="onbm-main-content">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="onbm-content-wrapper"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
            >
              <OnboardingStepContentMobile
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

        {/* FOOTER */}
        <div className="onbm-footer">
          <label className="onbm-checkbox">
            <input type="checkbox" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} />
            <span className="onbm-checkbox-mark"></span>
            <span>Nao mostrar novamente</span>
          </label>

          <div className="onbm-footer-actions">
            {currentStep > 0 && (
              <motion.button
                className="onbm-btn-secondary"
                onClick={handlePrev}
                disabled={isAnimating}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={14} />
              </motion.button>
            )}
            <motion.button
              className={`onbm-btn-primary ${!isStepInteractionComplete ? 'disabled' : ''}`}
              onClick={handleNext}
              disabled={!isStepInteractionComplete || isAnimating}
              whileTap={isStepInteractionComplete ? { scale: 0.97 } : {}}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Comecar
                  <Sparkles size={16} />
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingMobile;
