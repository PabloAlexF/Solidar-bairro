"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Shirt, 
  Receipt, 
  Pill, 
  Plus, 
  Check, 
  Smartphone, 
  PhoneCall, 
  MessageSquare, 
  MapPin, 
  Users, 
  Building2,
  ChevronLeft,
  ArrowRight,
  Heart,
  ShieldCheck,
  Zap,
  Coffee,
  Calendar,
  AlertTriangle,
  RefreshCcw,
  Footprints,
  Briefcase,
  Bath,
  Sofa,
  Tv,
  Car,
  Layers,
  Maximize2,
  User,
  X,
  Sparkles,
  Lightbulb,
  PenTool,
  Mic,
  MicOff,
  Volume2,
  Map as MapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './novo-pedido.css';

const CATEGORIES = [
  { id: 'Alimentos', label: 'Alimentos', icon: <ShoppingCart size={24} />, color: '#f97316' },
  { id: 'Roupas', label: 'Roupas', icon: <Shirt size={24} />, color: '#3b82f6' },
  { id: 'Calçados', label: 'Calçados', icon: <Footprints size={24} />, color: '#6366f1' },
  { id: 'Medicamentos', label: 'Medicamentos', icon: <Pill size={24} />, color: '#10b981' },
  { id: 'Higiene', label: 'Higiene', icon: <Bath size={24} />, color: '#14b8a6' },
  { id: 'Contas', label: 'Contas', icon: <Receipt size={24} />, color: '#ef4444' },
  { id: 'Emprego', label: 'Emprego', icon: <Briefcase size={24} />, color: '#8b5cf6' },
  { id: 'Móveis', label: 'Móveis', icon: <Sofa size={24} />, color: '#f59e0b' },
  { id: 'Eletrodomésticos', label: 'Eletrodomésticos', icon: <Tv size={24} />, color: '#475569' },
  { id: 'Transporte', label: 'Transporte', icon: <Car size={24} />, color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', icon: <Plus size={24} />, color: '#94a3b8' },
];

const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato à saúde ou vida', icon: <AlertTriangle size={24} />, color: '#ef4444', time: 'Imediato' },
  { id: 'urgente', label: 'URGENTE', desc: 'Necessário para as próximas 24h', icon: <Zap size={24} />, color: '#f97316', time: '24 horas' },
  { id: 'moderada', label: 'MODERADA', desc: 'Pode aguardar alguns dias', icon: <Calendar size={24} />, color: '#f59e0b', time: '3-5 dias' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem prazo rígido', icon: <Coffee size={24} />, color: '#10b981', time: 'Sem pressa' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Necessidade mensal constante', icon: <RefreshCcw size={24} />, color: '#6366f1', time: 'Mensal' },
];

const VISIBILITY_OPTIONS = [
  { id: 'bairro', label: 'Meu Bairro', desc: 'Até 2km de distância', icon: <MapPin size={32} />, color: '#10b981' },
  { id: 'proximos', label: 'Região Próxima', desc: 'Até 10km de distância', icon: <Users size={32} />, color: '#3b82f6' },
  { id: 'cidade', label: 'Toda a Cidade', desc: 'Sem limite de distância', icon: <Building2 size={32} />, color: '#f97316' },
  { id: 'ongs', label: 'ONGs Parceiras', desc: 'Visível para instituições', icon: <Building2 size={32} />, color: '#6366f1' },
];

const STORY_TEMPLATES = [
  {
    id: 'familia',
    label: 'Família',
    icon: <Users size={14} />,
    text: 'Preciso de ajuda com alimentos para minha família de [X] pessoas. Estamos passando por um momento difícil e qualquer contribuição de cesta básica seria muito bem-vinda.'
  },
  {
    id: 'saude',
    label: 'Saúde',
    icon: <Pill size={14} />,
    text: 'Estou precisando de ajuda para adquirir o medicamento [Nome] para uso contínuo. Não estou conseguindo arcar com os custos este mês devido a [Motivo].'
  },
  {
    id: 'emprego',
    label: 'Emprego',
    icon: <Briefcase size={14} />,
    text: 'Estou em busca de recolocação profissional e precisaria de ajuda com passagens de ônibus para comparecer a entrevistas ou ajuda para imprimir currículos.'
  }
];

const STEP_LABELS = ['Categoria', 'Detalhes', 'História', 'Urgência', 'Visibilidade', 'Confirmação'];
const TOTAL_STEPS = 6;

export default function NovoPedidoWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    subCategory: [],
    size: '',
    style: '',
    subQuestionAnswers: {},
    description: '',
    urgency: '',
    visibility: [],
    isPublic: true,
    radius: 5
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [templateUsed, setTemplateUsed] = useState(null);

  const nextStep = useCallback(() => setStep(s => Math.min(s + 1, TOTAL_STEPS)), []);
  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const updateData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const toggleArrayItem = useCallback((array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
  }, []);

  const isDescriptionValid = useMemo(() => {
    if (formData.description.length < 10) return false;
    if (templateUsed) {
      const hasBrackets = /\[.*?\]/.test(formData.description);
      const isIdentical = formData.description === templateUsed;
      if (hasBrackets || isIdentical) return false;
    }
    return true;
  }, [formData.description, templateUsed]);

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1: return formData.category !== '';
      case 2: return formData.subCategory.length > 0;
      case 3: return isDescriptionValid;
      case 4: return formData.urgency !== '';
      case 5: return formData.visibility.length > 0;
      default: return true;
    }
  }, [step, formData, isDescriptionValid]);

  const handlePublish = useCallback(() => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/painel');
    }, 2000);
  }, [router]);

  const selectedCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === formData.category), 
    [formData.category]
  );

  const selectedUrgency = useMemo(() => 
    URGENCY_OPTIONS.find(o => o.id === formData.urgency),
    [formData.urgency]
  );

  const renderCategoryStep = () => (
    <div className="compact-step">
      <div className="step-intro">
        <span className="step-badge">Passo 01</span>
        <h2>Qual ajuda você precisa?</h2>
        <p>Selecione a categoria principal do seu pedido.</p>
      </div>
      <div className="categories-grid-compact">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateData({ category: cat.id, subCategory: [], size: '', style: '' })}
            className={`cat-item ${formData.category === cat.id ? 'active' : ''}`}
            style={{ '--cat-color': cat.color }}
          >
            <div className="cat-icon-box">{cat.icon}</div>
            <span className="cat-text">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="compact-step centered">
      <div className="skip-box">
        <div className="skip-icon-wrapper" style={{ background: selectedCategory?.color }}>
          <Layers size={32} color="white" />
        </div>
        <h3>Categoria: {formData.category}</h3>
        <p>Esta categoria não possui sub-escolhas. Clique em próximo para continuar.</p>
      </div>
    </div>
  );

  const renderDescriptionStep = () => (
    <div className="compact-step">
      <div className="step-intro">
        <span className="step-badge">Passo 03</span>
        <h2>Conte sua história</h2>
        <p>Dê detalhes para que as pessoas entendam como ajudar.</p>
      </div>

      <div className="story-layout-v3">
        <div className="story-main">
          <div className="input-group">
            <textarea
              placeholder="Ex: Preciso de ajuda com alimentos para meus 3 filhos este mês. Estamos passando por um momento difícil..."
              value={formData.description}
              onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
              className={`compact-textarea v3 ${templateUsed && !isDescriptionValid ? 'warning' : ''}`}
            />
            <div className={`count-tag ${isDescriptionValid ? 'valid' : ''}`}>
              {formData.description.length}/500
            </div>
          </div>

          {templateUsed && !isDescriptionValid && (
            <div className="template-warning">
              <AlertTriangle size={16} />
              <span>Por favor, altere os dados entre colchetes [ ] com suas informações reais.</span>
            </div>
          )}

          <div className="story-templates-box">
            <span className="section-subtitle">Ou use um modelo (lembre-se de editar):</span>
            <div className="templates-grid-v3">
              {STORY_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  className={`template-btn-v3 ${templateUsed === t.text ? 'active' : ''}`}
                  onClick={() => {
                    updateData({ description: t.text });
                    setTemplateUsed(t.text);
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="story-sidebar-v3">
          <div className="tips-box-v3">
            <div className="tips-header-v3">
              <Lightbulb size={18} className="tip-icon-v3" />
              <strong>Dicas de Ouro</strong>
            </div>
            <div className="tips-list-v3">
              <div className="tip-item-v3">
                <div className="tip-bullet-v3"><Sparkles size={16} /></div>
                <p>Seja claro e objetivo sobre o que precisa.</p>
              </div>
              <div className="tip-item-v3">
                <div className="tip-bullet-v3"><PenTool size={16} /></div>
                <p>Explique brevemente o motivo da necessidade.</p>
              </div>
              <div className="tip-item-v3">
                <div className="tip-bullet-v3"><Lightbulb size={16} /></div>
                <p>Mencione se é para você ou para outra pessoa.</p>
              </div>
            </div>
          </div>

          <div className="privacy-alert-v3">
            <ShieldCheck size={18} />
            <p>Seus dados sensíveis nunca são expostos publicamente.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUrgencyStep = () => (
    <div className="compact-step">
      <div className="step-intro">
        <span className="step-badge">Passo 04</span>
        <h2>Qual o nível de urgência?</h2>
        <p>Isso ajuda a priorizar os pedidos mais críticos na comunidade.</p>
      </div>
      <div className="urgency-grid-v2">
        {URGENCY_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateData({ urgency: opt.id })}
            className={`urgency-card-v2 ${formData.urgency === opt.id ? 'active' : ''}`}
            style={{ '--urg-color': opt.color }}
          >
            <div className="urg-icon-v2">{opt.icon}</div>
            <div className="urg-body-v2">
              <div className="urg-header-v2">
                <strong>{opt.label}</strong>
                <span className="urg-time-badge">{opt.time}</span>
              </div>
              <span>{opt.desc}</span>
            </div>
            <div className="urg-check-v2">
              {formData.urgency === opt.id && <Check size={20} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderVisibilityStep = () => (
    <div className="compact-step">
      <div className="step-intro">
        <span className="step-badge">Passo 05</span>
        <h2>Quem deve ver seu pedido?</h2>
        <p>Defina o alcance geográfico da sua solicitação.</p>
      </div>
      <div className="visibility-layout-v2">
        <div className="vis-grid-v2">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateData({ visibility: toggleArrayItem(formData.visibility, opt.id) })}
              className={`vis-card-v2 ${formData.visibility.includes(opt.id) ? 'active' : ''}`}
              style={{ '--vis-color': opt.color }}
            >
              <div className="vis-icon-v2">{opt.icon}</div>
              <div className="vis-text-v2">
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="radius-control-v2">
          <div className="control-top">
            <div className="control-label">
              <strong>Alcance: {formData.radius}km</strong>
              <p>Defina o raio de busca para encontrar doadores</p>
            </div>
            <label className="switch-v2">
              <input 
                type="checkbox" 
                checked={formData.isPublic} 
                onChange={(e) => updateData({ isPublic: e.target.checked })} 
              />
              <span className="slider-v2"></span>
              <span className="label-text-v2">{formData.isPublic ? 'Público' : 'Privado'}</span>
            </label>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={formData.radius} 
            onChange={(e) => updateData({ radius: parseInt(e.target.value) })}
            className="range-input-v2" 
          />
          
          <div className="map-placeholder-v2">
            <div className="map-overlay-v2">
              <MapIcon size={40} className="map-icon-v2" />
              <p>O mapa será exibido aqui com seu local e raio de alcance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => {
    const catColor = selectedCategory?.color;
    
    return (
      <div className="compact-step">
        <div className="finish-header-v2">
          <div className="finish-check-v2">
            <Check size={32} />
          </div>
          <h2>Confirme seus dados</h2>
          <p>Veja como seu pedido aparecerá para os vizinhos.</p>
        </div>

        <div className="review-card-v2">
          <div className="review-main">
            <div className="review-tags">
              <span className="tag-v2" style={{ background: catColor + '15', color: catColor }}>
                {formData.category}
              </span>
              {selectedUrgency && (
                <span className="tag-v2" style={{ background: selectedUrgency.color + '15', color: selectedUrgency.color }}>
                  {selectedUrgency.icon} {formData.urgency.toUpperCase()}
                </span>
              )}
            </div>
            <div className="review-quote">
              <p>&ldquo;{formData.description}&rdquo;</p>
            </div>
          </div>
          <div className="review-meta">
            <div className="meta-item-v2">
              <MessageSquare size={16} />
              <span>Contato via Chat do App</span>
            </div>
            <div className="meta-item-v2">
              <MapPin size={16} />
              <span>{formData.radius}km de alcance</span>
            </div>
            <div className="trust-badge-v2">
              <ShieldCheck size={16} />
              <span>Ambiente Seguro</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: return renderCategoryStep();
      case 2: return renderDetailsStep();
      case 3: return renderDescriptionStep();
      case 4: return renderUrgencyStep();
      case 5: return renderVisibilityStep();
      case 6: return renderConfirmationStep();
      default: return null;
    }
  };

  return (
    <div className="novo-pedido-container">
      <div className="bg-blobs">
        <div className="blob blob-orange" />
        <div className="blob blob-blue" />
      </div>

      <div className="wizard-box-v2">
        <div className="wizard-sidebar-v2">
          <div className="sidebar-header-v2">
            <Heart size={24} className="logo-icon-v2" fill="#f97316" color="#f97316" />
            <div className="sidebar-brand-v2">
              <h3>Solidar</h3>
              <span>Criação de Pedido</span>
            </div>
          </div>
          
          <div className="sidebar-steps-v2">
            {STEP_LABELS.map((label, i) => (
              <div 
                key={i} 
                className={`step-indicator-v3 ${i + 1 === step ? 'active' : i + 1 < step ? 'completed' : ''}`}
              >
                <div className="indicator-dot-v3">
                  {i + 1 < step ? <Check size={18} /> : i + 1}
                </div>
                <div className="indicator-info-v3">
                  <span className="indicator-step-v3">Passo {i + 1}</span>
                  <span className="indicator-label-v3">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer-v2">
            <div className="progress-info-v2">
              <span>Status</span>
              <strong>{Math.round((step / TOTAL_STEPS) * 100)}%</strong>
            </div>
            <div className="progress-bar-v2">
              <div className="progress-fill-v2" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="wizard-content-v2">
          <div className="content-body-v2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="step-container-v2"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="content-actions-v2">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="btn-v2 btn-ghost"
            >
              <ChevronLeft size={18} /> Voltar
            </button>
            
            {step < TOTAL_STEPS ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid}
                className="btn-v2 btn-primary"
              >
                Continuar <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="btn-v2 btn-publish"
              >
                {isSubmitting ? 'Finalizando...' : 'Publicar Pedido'} {!isSubmitting && <Check size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}