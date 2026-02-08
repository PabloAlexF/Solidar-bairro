'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
  Play,
  MousePointerClick
} from 'lucide-react';
import './OnboardingDesktop.css';

/* ========================================
   SUB-COMPONENTS
   ======================================== */

const FeatureHighlight = ({ icon: Icon, title, description, color, delay = 0 }) => (
  <motion.div
    className="onbd-feature-highlight"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.4 }}
    whileHover={{ scale: 1.03, y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
  >
    <div className="onbd-feature-icon" style={{ background: color }}>
      <Icon size={20} />
    </div>
    <div className="onbd-feature-content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </motion.div>
);

const SecurityBadge = ({ icon: Icon, text }) => (
  <div className="onbd-security-badge">
    <Icon size={14} />
    <span>{text}</span>
  </div>
);

const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    setHasAnimated(true);
    const numericVal = parseInt(value.replace(/\D/g, ''), 10);
    const duration = 1200;
    const steps = 40;
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

  const displayVal = value.includes('k') ? `${(count / 1000).toFixed(count >= 1000 ? 0 : 0)}k` : 
                     value.includes('%') ? `${count}%` : count.toLocaleString();

  return <span className="onbd-stat-value">{count === 0 ? '0' : displayVal}{suffix}</span>;
};

const TypewriterText = ({ text, speed = 30, onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="onbd-typewriter-cursor">|</span>}
    </span>
  );
};

const MockHelpCard = ({ item, onClick, isSelected, index }) => (
  <motion.button
    layout
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: index * 0.15, type: 'spring', stiffness: 300, damping: 25 }}
    whileHover={{ scale: 1.02, y: -6, boxShadow: '0 16px 32px rgba(0,0,0,0.12)' }}
    whileTap={{ scale: 0.98 }}
    className={`onbd-card onbd-card-help ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    <div className="onbd-card-content">
      <div className="onbd-card-header">
        <div className="onbd-card-category">
          <span className="onbd-card-category-icon" style={{ backgroundColor: item.categoryColor }}>
            <item.categoryIcon size={16} />
          </span>
          <span className="onbd-card-category-name">{item.category}</span>
        </div>
        <div className="onbd-card-time">
          <Clock size={12} />
          {item.time}
        </div>
      </div>
      <p className="onbd-card-desc">{item.request}</p>
      <div className="onbd-card-footer">
        <div className="onbd-card-user">
          <div className="onbd-card-avatar">
            <User size={14} />
          </div>
          <span className="onbd-card-user-name">{item.user}</span>
          {item.verified && (
            <BadgeCheck size={14} className="onbd-verified-user" />
          )}
        </div>
        <div className="onbd-card-location">
          <Navigation size={13} />
          <span>{item.distance}</span>
        </div>
      </div>
      {item.urgency === 'high' && (
        <div className="onbd-urgency-bar">
          <Zap size={12} />
          <span>Urgente</span>
        </div>
      )}
    </div>
    <AnimatePresence>
      {isSelected && (
        <motion.div
          className="onbd-card-selected-badge"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <CheckCircle2 size={18} />
        </motion.div>
      )}
    </AnimatePresence>
    {!isSelected && (
      <div className="onbd-card-hover-hint">
        <MousePointerClick size={14} />
        <span>Clique para selecionar</span>
      </div>
    )}
  </motion.button>
);

const MockLostFoundCard = ({ item, onClick, isSelected, onChatClick, index }) => (
  <motion.button
    layout
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: index * 0.15, type: 'spring', stiffness: 300, damping: 25 }}
    whileHover={{ scale: 1.03, y: -6, boxShadow: '0 16px 32px rgba(0,0,0,0.12)' }}
    whileTap={{ scale: 0.98 }}
    className={`onbd-card onbd-card-lostfound ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    <div className="onbd-card-image">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="onbd-card-img" />
      ) : (
        <div className="onbd-card-placeholder">
          <Camera size={28} strokeWidth={1.5} />
          <span>Sem foto</span>
        </div>
      )}
      <div className={`onbd-type-badge ${item.type}`}>
        {item.type === 'lost' ? (
          <span><Search size={10} /> PERDIDO</span>
        ) : (
          <span><CheckCircle2 size={10} /> ACHADO</span>
        )}
      </div>
      {item.verified && (
        <div className="onbd-verified-badge">
          <Shield size={10} />
        </div>
      )}
    </div>

    <div className="onbd-card-body">
      <div className="onbd-card-header">
        <span className="onbd-card-category-tag">{item.category}</span>
        <span className="onbd-card-date">
          <Clock size={11} />
          {item.date_occurrence ? new Date(item.date_occurrence).toLocaleDateString('pt-BR') : 'Recente'}
        </span>
      </div>

      <h3 className="onbd-card-title">{item.title || 'Novo Item'}</h3>
      <p className="onbd-card-desc">{item.description || 'Descricao do item...'}</p>

      <div className="onbd-card-meta">
        <div className="onbd-card-meta-item">
          <Navigation size={13} />
          <span>{item.distance || '500m de voce'}</span>
        </div>
        {item.reward && item.type === 'lost' && (
          <div className="onbd-card-meta-item reward">
            <Gift size={13} />
            <span>{item.reward}</span>
          </div>
        )}
      </div>
    </div>

    <div className="onbd-card-action">
      <button
        className="onbd-chat-btn"
        onClick={(e) => {
          e.stopPropagation();
          onChatClick(item);
        }}
      >
        <MessageCircle size={14} />
        Entrar em Contato
      </button>
    </div>

    <AnimatePresence>
      {isSelected && (
        <motion.div
          className="onbd-card-selected-badge"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <CheckCircle2 size={18} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

const Confetti = () => (
  <div className="onbd-confetti">
    {[...Array(60)].map((_, i) => (
      <motion.div
        key={i}
        className="onbd-confetti-piece"
        initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
        animate={{
          y: '110vh',
          opacity: [0, 1, 1, 0],
          rotate: 720 + Math.random() * 360,
        }}
        transition={{
          duration: Math.random() * 2.5 + 2,
          repeat: Infinity,
          ease: 'linear',
          delay: Math.random() * 3,
        }}
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#6C5CE7', '#00B894'][
            Math.floor(Math.random() * 8)
          ],
          width: Math.random() * 10 + 6 + 'px',
          height: Math.random() * 10 + 6 + 'px',
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        }}
      />
    ))}
  </div>
);

const ProgressRing = ({ progress, size = 56, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="onbd-progress-ring">
      <circle
        className="onbd-progress-ring-bg"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        className="onbd-progress-ring-fill"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          strokeDasharray: circumference,
          transformOrigin: 'center',
          transform: 'rotate(-90deg)',
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
        className="onbd-interaction-hint"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="onbd-hint-icon"
        >
          <MousePointerClick size={16} />
        </motion.div>
        <span>Selecione um card acima para continuar</span>
      </motion.div>
    )}
  </AnimatePresence>
);

const PulseOrb = ({ color, size = 8, delay = 0 }) => (
  <motion.div
    className="onbd-pulse-orb"
    style={{ width: size, height: size, backgroundColor: color }}
    animate={{
      scale: [1, 1.5, 1],
      opacity: [0.6, 1, 0.6],
    }}
    transition={{ duration: 2, repeat: Infinity, delay }}
  />
);

/* ========================================
   STEP CONTENT
   ======================================== */

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
  currentStep,
}) => {
  const Icon = step.icon;

  const renderWelcomeContent = () => (
    <div className="onbd-welcome-content">
      <div className="onbd-welcome-features">
        {[
          { icon: Globe, title: 'Geolocalizacao Inteligente', description: 'Encontre pedidos e oportunidades de ajuda proximos a voce em tempo real', color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' },
          { icon: Shield, title: 'Ambiente Seguro e Moderado', description: 'Todos os pedidos sao analisados antes de serem publicados por nossa equipe', color: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' },
          { icon: Users, title: 'Comunidade Verificada', description: 'Usuarios passam por verificacao para garantir a seguranca de todos', color: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)' },
          { icon: Building2, title: 'Administradores Locais', description: 'Cada bairro tem administradores dedicados para ajudar a comunidade', color: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
        ].map((f, i) => (
          <FeatureHighlight key={i} {...f} delay={i} />
        ))}
      </div>
      <motion.div
        className="onbd-welcome-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="onbd-stat">
          <AnimatedCounter value="10000" />
          <span className="onbd-stat-suffix">+</span>
          <span className="onbd-stat-label">Vizinhos Conectados</span>
        </div>
        <div className="onbd-stat-divider" />
        <div className="onbd-stat">
          <AnimatedCounter value="5000" />
          <span className="onbd-stat-suffix">+</span>
          <span className="onbd-stat-label">Pedidos Atendidos</span>
        </div>
        <div className="onbd-stat-divider" />
        <div className="onbd-stat">
          <AnimatedCounter value="98" />
          <span className="onbd-stat-suffix">%</span>
          <span className="onbd-stat-label">Satisfacao</span>
        </div>
      </motion.div>
    </div>
  );

  const renderFinalContent = () => (
    <div className="onbd-final-content">
      <div className="onbd-final-checklist">
        <h4>O que voce pode fazer agora:</h4>
        {[
          'Explorar pedidos de ajuda na sua regiao',
          'Publicar seus proprios pedidos com seguranca',
          'Encontrar ou reportar itens perdidos',
          'Conectar-se com vizinhos verificados',
          'Contribuir para uma comunidade mais unida',
        ].map((text, idx) => (
          <motion.div
            key={idx}
            className="onbd-checklist-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.12, type: 'spring', stiffness: 300 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.12 + 0.1, type: 'spring', stiffness: 400 }}
            >
              <CheckCircle2 size={20} />
            </motion.div>
            <span>{text}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="onbd-final-trust"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="onbd-trust-badges">
          <SecurityBadge icon={Lock} text="Dados Protegidos" />
          <SecurityBadge icon={Eye} text="Moderacao 24h" />
          <SecurityBadge icon={Shield} text="100% Seguro" />
        </div>
      </motion.div>
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
        <div className="onbd-interaction-panel">
          <motion.div
            className="onbd-security-notice"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield size={18} />
            <div>
              <strong>Ambiente Seguro</strong>
              <p>Todos os pedidos passam por analise da nossa equipe de moderacao antes de serem publicados.</p>
            </div>
          </motion.div>

          <motion.h5
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="onbd-interaction-title"
          >
            {interaction.prompt}
          </motion.h5>
          <div className="onbd-categories-grid">
            {interaction.categories.map((category, idx) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.04, y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.97 }}
                  className="onbd-category-card"
                  onClick={() => {
                    setSelectedCategory(category);
                    setHelpCreationStep('details');
                  }}
                >
                  <div className="onbd-category-icon" style={{ backgroundColor: category.color }}>
                    <IconComponent size={22} />
                  </div>
                  <div className="onbd-category-content">
                    <h4>{category.name}</h4>
                    <p>{category.description}</p>
                  </div>
                  <ChevronRight size={18} className="onbd-category-arrow" />
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {helpCreationStep === 'details' && selectedCategory && (
              <motion.div
                className="onbd-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setHelpCreationStep(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 30, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 30, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="onbd-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="onbd-modal-header">
                    <div className="onbd-modal-header-icon" style={{ backgroundColor: selectedCategory.color }}>
                      <selectedCategory.icon size={20} />
                    </div>
                    <h3>Novo Pedido - {selectedCategory.name}</h3>
                    <button className="onbd-modal-close" onClick={() => setHelpCreationStep(null)}>
                      <X size={18} />
                    </button>
                  </div>
                  <div className="onbd-modal-body">
                    <label className="onbd-modal-label">Descreva seu problema ou necessidade:</label>
                    <textarea
                      className="onbd-modal-textarea"
                      placeholder="Ex: Familia com 3 criancas precisa de cesta basica urgente..."
                      value={helpDescription}
                      onChange={(e) => setHelpDescription(e.target.value)}
                      rows={4}
                      autoFocus
                    />
                    <div className="onbd-char-count">
                      <span className={helpDescription.length > 0 ? 'active' : ''}>{helpDescription.length}</span> / 500
                    </div>
                    <div className="onbd-modal-info-box">
                      <div className="onbd-info-item">
                        <FileCheck size={16} />
                        <span>Seu pedido sera analisado em ate 2h</span>
                      </div>
                      <div className="onbd-info-item">
                        <UserCheck size={16} />
                        <span>Administradores locais podem ajudar diretamente</span>
                      </div>
                      <div className="onbd-info-item">
                        <Navigation size={16} />
                        <span>Vizinhos proximos serao notificados</span>
                      </div>
                    </div>
                    <motion.button
                      className="onbd-modal-btn primary"
                      disabled={!helpDescription.trim()}
                      onClick={() => {
                        setHelpCreationStep('published');
                        handleInteraction('need-help', 'completed');
                      }}
                      whileHover={helpDescription.trim() ? { scale: 1.02 } : {}}
                      whileTap={helpDescription.trim() ? { scale: 0.98 } : {}}
                    >
                      <Sparkles size={16} />
                      Enviar para Analise
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {helpCreationStep === 'published' && selectedCategory && (
              <motion.div
                className="onbd-modal-overlay"
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
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                  className="onbd-modal success"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="onbd-modal-body success">
                    <motion.div
                      className="onbd-success-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                    >
                      <CheckCircle2 size={48} />
                    </motion.div>
                    <h3>Pedido Enviado!</h3>
                    <p>Seu pedido foi enviado para analise. Nossa equipe de moderacao ira verificar e aprovar em ate 2 horas.</p>
                    <div className="onbd-success-info">
                      <Shield size={16} />
                      <span>Voce recebera uma notificacao quando for aprovado</span>
                    </div>
                    <motion.button
                      className="onbd-modal-btn success"
                      onClick={() => {
                        setHelpCreationStep(null);
                        setSelectedCategory(null);
                        setHelpDescription('');
                        handleInteraction('help', 'completed');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continuar
                      <ArrowRight size={16} />
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
      <div className="onbd-interaction-panel">
        {step.id === 'help' && (
          <motion.div
            className="onbd-geo-notice"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <PulseOrb color="#fff" size={8} />
            <Navigation size={16} />
            <span>Mostrando pedidos a ate 2km de voce</span>
          </motion.div>
        )}

        <motion.h5
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="onbd-interaction-title"
        >
          {interaction.prompt}
        </motion.h5>
        <div className={`onbd-cards-container ${interaction.renderer?.name === 'MockLostFoundCard' ? 'grid' : ''}`}>
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

        <InteractionHint show={!isStepInteractionComplete} />

        <AnimatePresence>
          {lostFoundModal && selectedLostFoundItem && (
            <motion.div
              className="onbd-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLostFoundModal(false)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="onbd-modal help-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="onbd-modal-header">
                  <h3>Confirmar Contato</h3>
                  <button className="onbd-modal-close" onClick={() => setLostFoundModal(false)}>
                    <X size={18} />
                  </button>
                </div>

                <div className="onbd-modal-body">
                  <h2 className="onbd-help-modal-title">
                    Voce deseja ajudar {selectedLostFoundItem.type === 'lost' ? 'a encontrar' : 'a devolver'} este item?
                  </h2>

                  <div className="onbd-help-modal-preview">
                    <div className="onbd-help-modal-image">
                      {selectedLostFoundItem.image_url ? (
                        <img src={selectedLostFoundItem.image_url} alt={selectedLostFoundItem.title} />
                      ) : (
                        <div className="onbd-help-modal-placeholder">
                          <Camera size={24} strokeWidth={1.5} />
                        </div>
                      )}
                      <div className={`onbd-help-modal-badge ${selectedLostFoundItem.type}`}>
                        {selectedLostFoundItem.type === 'lost' ? 'PERDIDO' : 'ACHADO'}
                      </div>
                    </div>
                    <div className="onbd-help-modal-info">
                      <h3>{selectedLostFoundItem.title}</h3>
                      <p>{selectedLostFoundItem.description}</p>
                      <div className="onbd-help-modal-meta">
                        <span><Navigation size={14} /> {selectedLostFoundItem.distance || '500m de voce'}</span>
                        {selectedLostFoundItem.reward && selectedLostFoundItem.type === 'lost' && (
                          <span className="reward"><Gift size={14} /> {selectedLostFoundItem.reward}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="onbd-help-modal-message">
                    <Shield size={18} />
                    <p>Chat seguro e moderado. Suas informacoes pessoais ficam protegidas ate voce decidir compartilhar.</p>
                  </div>

                  <div className="onbd-help-modal-actions">
                    <motion.button
                      className="onbd-modal-btn secondary"
                      onClick={() => setLostFoundModal(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      className="onbd-modal-btn primary"
                      onClick={() => {
                        setLostFoundModal(false);
                        setSelectedLostFoundItem(null);
                        handleInteraction('lost-found', 'completed');
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MessageCircle size={16} />
                      Iniciar Chat Seguro
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
    <div className="onbd-step-content">
      <div className="onbd-step-header">
        <motion.div
          className={`onbd-step-icon ${step.color || 'blue'}`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon size={32} />
        </motion.div>
        <div className="onbd-step-text">
          <motion.h2
            className="onbd-step-title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {step.title}
          </motion.h2>
          <motion.p
            className="onbd-step-desc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {step.description}
          </motion.p>
          {step.badges && (
            <motion.div
              className="onbd-step-badges"
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
      <div className="onbd-step-body">{renderInteraction()}</div>
    </div>
  );
};

/* ========================================
   MAIN COMPONENT
   ======================================== */

const OnboardingDesktop = ({ onComplete, onSkip }) => {
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
    document.body.classList.add('onbd-modal-open');
    return () => {
      document.body.classList.remove('onbd-modal-open');
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isStepInteractionComplete && !isAnimating) {
          handleNext();
        }
      }
      if (e.key === 'ArrowLeft') {
        if (currentStep > 0 && !isAnimating) {
          handlePrev();
        }
      }
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isAnimating]);

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
        navDesc: 'Conheca a plataforma',
        icon: PartyPopper,
        color: 'orange',
        title: 'Bem-vindo ao SolidarBairro!',
        description:
          'Uma plataforma segura onde vizinhos se conectam para ajudar uns aos outros. Descubra como transformar sua comunidade.',
      },
      {
        id: 'help',
        navLabel: 'Quero Ajudar',
        navDesc: 'Faca a diferenca',
        icon: HandHelping,
        color: 'teal',
        title: 'Ajude quem esta perto de voce',
        description:
          'Encontre pedidos verificados de vizinhos proximos usando geolocalizacao. Todos os pedidos passam por analise antes de serem publicados.',
        badges: [
          { icon: Shield, text: 'Pedidos Verificados' },
          { icon: Navigation, text: 'Geolocalizacao' },
        ],
        interaction: {
          type: 'ui_simulation',
          prompt: 'Veja como sao os pedidos reais na plataforma:',
          items: [
            {
              type: 'help',
              id: 1,
              user: 'Maria Santos',
              request:
                'Preciso de ajuda com transporte para consulta medica amanha as 14h. Sou idosa e moro sozinha, nao tenho como ir por conta propria.',
              category: 'Transporte',
              categoryColor: '#0ea5e9',
              categoryIcon: Car,
              location: 'Centro',
              distance: '800m',
              time: '2h atras',
              urgency: 'high',
              verified: true,
            },
            {
              type: 'help',
              id: 2,
              user: 'Joao Silva',
              request:
                'Familia com 3 criancas pequenas precisa de cesta basica. Estamos passando por um momento dificil apos perda de emprego.',
              category: 'Alimentos',
              categoryColor: '#f97316',
              categoryIcon: Coffee,
              location: 'Vila Nova',
              distance: '1.2km',
              time: '5h atras',
              urgency: 'normal',
              verified: true,
            },
          ],
          renderer: MockHelpCard,
        },
      },
      {
        id: 'need-help',
        navLabel: 'Preciso de Ajuda',
        navDesc: 'Peca apoio seguro',
        icon: Heart,
        color: 'purple',
        title: 'Precisa de ajuda? Estamos aqui!',
        description:
          'Publique seu pedido com total seguranca. Nossa equipe de moderacao analisa cada solicitacao, e administradores locais podem ajudar diretamente.',
        badges: [
          { icon: FileCheck, text: 'Analise em 2h' },
          { icon: UserCheck, text: 'Moderacao Ativa' },
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
              description: 'Cesta basica, refeicoes, suprimentos',
            },
            {
              id: 'transporte',
              name: 'Transporte',
              icon: Car,
              color: '#0ea5e9',
              description: 'Deslocamento, consultas medicas',
            },
            {
              id: 'saude',
              name: 'Saude',
              icon: Heart,
              color: '#ef4444',
              description: 'Medicamentos, cuidados, apoio',
            },
            {
              id: 'educacao',
              name: 'Educacao',
              icon: BookOpen,
              color: '#8b5cf6',
              description: 'Material escolar, cursos, aulas',
            },
          ],
        },
      },
      {
        id: 'lost-found',
        navLabel: 'Achados e Perdidos',
        navDesc: 'Recupere seus itens',
        icon: Package,
        color: 'pink',
        title: 'Achados e Perdidos da Comunidade',
        description:
          'Perdeu algo ou encontrou um item? Nossa comunidade usa geolocalizacao para reunir objetos perdidos com seus donos de forma segura.',
        badges: [
          { icon: Globe, text: 'Mapa Interativo' },
          { icon: Lock, text: 'Chat Protegido' },
        ],
        interaction: {
          type: 'ui_simulation',
          prompt: 'Veja itens reportados proximos a voce:',
          items: [
            {
              type: 'lost',
              id: 1,
              title: 'Carteira de couro marrom',
              description:
                'Contem documentos importantes, cartoes e fotos de familia. Perdi ontem a noite.',
              category: 'Carteiras',
              location: 'Savassi',
              distance: '300m',
              date_occurrence: '2024-01-15',
              reward: 'R$ 150,00',
              verified: true,
              image_url: null,
            },
            {
              type: 'found',
              id: 2,
              title: 'Chaves com chaveiro vermelho',
              description:
                'Encontrei esse conjunto de chaves na praca. Chaveiro vermelho com formato de coracao.',
              category: 'Chaves',
              location: 'Praca Sete',
              distance: '1.5km',
              date_occurrence: '2024-01-14',
              reward: null,
              verified: true,
              image_url: null,
            },
          ],
          renderer: MockLostFoundCard,
        },
      },
      {
        id: 'start',
        navLabel: 'Tudo Pronto!',
        navDesc: 'Comece sua jornada',
        icon: Sparkles,
        color: 'green',
        title: 'Voce esta pronto para fazer a diferenca!',
        description:
          'Agora voce conhece o SolidarBairro. Uma comunidade mais unida e solidaria comeca com voce.',
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

    setTimeout(() => setIsAnimating(false), 400);
  }, [currentStep, steps.length, onComplete, dontShowAgain, isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating || currentStep === 0) return;
    setIsAnimating(true);
    setDirection(-1);
    setCurrentStep(currentStep - 1);
    setTimeout(() => setIsAnimating(false), 400);
  }, [currentStep, isAnimating]);

  const handleSkip = useCallback(() => {
    onSkip?.(dontShowAgain);
  }, [onSkip, dontShowAgain]);

  const handleNavClick = useCallback(
    (index) => {
      if (isAnimating) return;
      // Only allow going to completed steps or the next available step
      if (index <= currentStep) {
        setIsAnimating(true);
        setDirection(index > currentStep ? 1 : -1);
        setCurrentStep(index);
        setTimeout(() => setIsAnimating(false), 400);
      }
    },
    [currentStep, isAnimating]
  );

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="onbd-overlay">
      {steps[currentStep].id === 'start' && <Confetti />}

      <motion.div
        className="onbd-container"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
      >
        <button className="onbd-close" onClick={handleSkip} title="Fechar (Esc)">
          <X size={20} />
        </button>

        {/* SIDEBAR */}
        <aside className="onbd-sidebar">
          <div className="onbd-sidebar-header">
            <div className="onbd-logo">
              <Heart size={22} />
            </div>
            <span className="onbd-logo-text">SolidarBairro</span>
          </div>

          <nav className="onbd-nav">
            {steps.map((step, index) => {
              const isCompleted = currentStep > index;
              const isActive = currentStep === index;
              const StepIcon = step.icon;

              return (
                <motion.div
                  key={step.id}
                  className={`onbd-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${
                    index <= currentStep ? 'clickable' : ''
                  }`}
                  onClick={() => handleNavClick(index)}
                  whileHover={index <= currentStep ? { x: 4 } : {}}
                >
                  <div className="onbd-nav-icon">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <CheckCircle2 size={20} />
                      </motion.div>
                    ) : isActive ? (
                      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <StepIcon size={20} />
                      </motion.div>
                    ) : (
                      <Circle size={20} />
                    )}
                  </div>
                  <div className="onbd-nav-content">
                    <h4>{step.navLabel}</h4>
                    <p>{step.navDesc}</p>
                  </div>
                  {isActive && <motion.div className="onbd-nav-indicator" layoutId="activeNavIndicator" />}
                </motion.div>
              );
            })}
          </nav>

          <div className="onbd-sidebar-footer">
            <div className="onbd-progress-info">
              <ProgressRing progress={progress} size={48} strokeWidth={4} />
              <div className="onbd-progress-text">
                <span className="onbd-progress-label">Progresso</span>
                <span className="onbd-progress-value">{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="onbd-keyboard-hints">
              <span><kbd>←</kbd><kbd>→</kbd> Navegar</span>
              <span><kbd>Esc</kbd> Fechar</span>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="onbd-main">
          <div className="onbd-main-progress">
            <div className="onbd-progress-bar">
              <motion.div
                className="onbd-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <div className="onbd-step-dots">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  className={`onbd-step-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                  animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>
            <span className="onbd-progress-steps">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          <div className="onbd-main-content">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="onbd-content-wrapper"
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

          <footer className="onbd-footer">
            <label className="onbd-checkbox">
              <input type="checkbox" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} />
              <span className="onbd-checkbox-mark"></span>
              <span>Nao mostrar novamente</span>
            </label>

            <div className="onbd-footer-actions">
              {currentStep > 0 && (
                <motion.button
                  className="onbd-btn-secondary"
                  onClick={handlePrev}
                  disabled={isAnimating}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft size={16} />
                  Voltar
                </motion.button>
              )}
              <motion.button
                className={`onbd-btn-primary ${!isStepInteractionComplete ? 'disabled' : ''}`}
                onClick={handleNext}
                disabled={!isStepInteractionComplete || isAnimating}
                whileHover={isStepInteractionComplete ? { scale: 1.03, y: -2 } : {}}
                whileTap={isStepInteractionComplete ? { scale: 0.98 } : {}}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Comecar a Explorar
                    <Sparkles size={18} />
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </div>
          </footer>
        </main>
      </motion.div>
    </div>
  );
};

export default OnboardingDesktop;
