import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyzingModal, InconsistentModal, SuccessModal } from '../modals';
import MapaAlcance from '../MapaAlcance';
import AnimatedParticles from '../AnimatedParticles';
import LandingHeader from '../../../components/layout/LandingHeader';
import MobileHeader from '../../../components/layout/MobileHeader';
import { 
  ShoppingCart, 
  Shirt, 
  Receipt, 
  Pill, 
  Plus, 
  Check, 
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
  X,
  Sparkles,
  Lightbulb,
  PenTool,
  Mic,
  MicOff,
  Globe,
  Rocket
} from 'lucide-react';
import './styles.css';

const CATEGORIES = [
  { id: 'Alimentos', label: 'Alimentos', icon: <ShoppingCart size={20} />, color: '#f97316' },
  { id: 'Roupas', label: 'Roupas', icon: <Shirt size={20} />, color: '#3b82f6' },
  { id: 'Calçados', label: 'Calçados', icon: <Footprints size={20} />, color: '#6366f1' },
  { id: 'Medicamentos', label: 'Medicamentos', icon: <Pill size={20} />, color: '#10b981' },
  { id: 'Higiene', label: 'Higiene', icon: <Bath size={20} />, color: '#14b8a6' },
  { id: 'Contas', label: 'Contas', icon: <Receipt size={20} />, color: '#ef4444' },
  { id: 'Emprego', label: 'Emprego', icon: <Briefcase size={20} />, color: '#8b5cf6' },
  { id: 'Móveis', label: 'Móveis', icon: <Sofa size={20} />, color: '#f59e0b' },
  { id: 'Eletrodomésticos', label: 'Eletro', icon: <Tv size={20} />, color: '#475569' },
  { id: 'Transporte', label: 'Transporte', icon: <Car size={20} />, color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', icon: <Plus size={20} />, color: '#94a3b8' },
];

const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato', icon: <AlertTriangle size={20} />, color: '#ef4444', time: 'Imediato' },
  { id: 'urgente', label: 'URGENTE', desc: 'Próximas 24h', icon: <Zap size={20} />, color: '#f97316', time: '24h' },
  { id: 'moderada', label: 'MODERADA', desc: 'Alguns dias', icon: <Calendar size={20} />, color: '#f59e0b', time: '3-5 dias' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem prazo', icon: <Coffee size={20} />, color: '#10b981', time: 'Flexível' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Mensal', icon: <RefreshCcw size={20} />, color: '#6366f1', time: 'Mensal' },
];

const VISIBILITY_OPTIONS = [
  { id: 'bairro', label: 'Bairro', icon: <MapPin size={24} />, color: '#10b981' },
  { id: 'proximos', label: 'Região', icon: <Users size={24} />, color: '#3b82f6' },
  { id: 'todos', label: 'Cidade', icon: <Globe size={24} />, color: '#f97316' },
  { id: 'ongs', label: 'ONGs', icon: <Building2 size={24} />, color: '#6366f1' },
];

const CATEGORY_DETAILS = {
  Alimentos: {
    options: [
      { id: 'cesta', label: 'Cesta Básica', desc: 'Arroz, feijão, óleo', color: '#f97316', contextInfo: 'Cesta básica alimenta família de 4 por ~15 dias.' },
      { id: 'proteinas', label: 'Proteínas', desc: 'Carne, ovos, frango', color: '#ef4444' },
      { id: 'frescos', label: 'Hortifruti', desc: 'Frutas e verduras', color: '#10b981' },
      { id: 'padaria', label: 'Padaria', desc: 'Pão, leite, queijo', color: '#f59e0b' },
      { id: 'infantil', label: 'Bebês', desc: 'Fórmulas, papinhas', color: '#6366f1' },
      { id: 'prontas', label: 'Marmitas', desc: 'Refeições prontas', color: '#f43f5e' },
    ]
  },
  Roupas: {
    options: [
      { id: 'agasalhos', label: 'Agasalhos', desc: 'Casacos, blusas', color: '#1e40af' },
      { id: 'escolar', label: 'Uniforme', desc: 'Escolar', color: '#6366f1' },
      { id: 'calcados', label: 'Calçados', desc: 'Tênis, sapatos', color: '#2563eb' },
      { id: 'enxoval', label: 'Enxoval Bebê', desc: 'Body, mantas', color: '#ec4899' },
      { id: 'intimas', label: 'Íntimas', desc: 'Meias, cuecas', color: '#f43f5e' },
      { id: 'profissional', label: 'Profissional', desc: 'Social, trabalho', color: '#475569' },
    ]
  },
  Medicamentos: {
    options: [
      { id: 'pressao', label: 'Pressão Alta', desc: 'Losartana etc.', color: '#ef4444' },
      { id: 'diabetes', label: 'Diabetes', desc: 'Metformina etc.', color: '#dc2626' },
      { id: 'analgesicos', label: 'Analgésicos', desc: 'Dipirona etc.', color: '#10b981' },
      { id: 'bombinhas', label: 'Asma', desc: 'Bombinhas', color: '#0ea5e9' },
    ]
  },
  Higiene: {
    options: [
      { id: 'kit_banho', label: 'Kit Banho', desc: 'Sabonete, shampoo', color: '#14b8a6' },
      { id: 'saude_bucal', label: 'Bucal', desc: 'Pasta, escova', color: '#0d9488' },
      { id: 'fraldas_infantis', label: 'Fraldas', desc: 'Infantis', color: '#6366f1' },
      { id: 'limpeza_casa', label: 'Limpeza', desc: 'Detergente etc.', color: '#059669' },
    ]
  },
  Contas: {
    options: [
      { id: 'conta_luz', label: 'Luz', desc: 'Conta de luz', color: '#ef4444' },
      { id: 'conta_agua', label: 'Água', desc: 'Conta de água', color: '#3b82f6' },
      { id: 'gas_cozinha', label: 'Gás', desc: 'Botijão', color: '#f97316' },
      { id: 'apoio_aluguel', label: 'Aluguel', desc: 'Apoio', color: '#dc2626' },
    ]
  },
  Emprego: {
    options: [
      { id: 'curriculo', label: 'Currículo', desc: 'Elaboração', color: '#8b5cf6' },
      { id: 'qualificacao', label: 'Cursos', desc: 'Qualificação', color: '#7c3aed' },
      { id: 'epis_uniforme', label: 'EPIs', desc: 'Uniforme', color: '#059669' },
    ]
  },
  Móveis: {
    options: [
      { id: 'cama_solteiro', label: 'Cama Solteiro', desc: 'Ou colchão', color: '#f59e0b' },
      { id: 'cama_casal', label: 'Cama Casal', desc: 'Ou colchão', color: '#d97706' },
      { id: 'armario_cozinha', label: 'Armário', desc: 'Cozinha', color: '#059669' },
    ]
  },
  Eletrodomésticos: {
    options: [
      { id: 'geladeira', label: 'Geladeira', desc: 'Fundamental', color: '#475569' },
      { id: 'fogao', label: 'Fogão', desc: 'Refeições', color: '#334155' },
      { id: 'maquina_lavar', label: 'Lavadora', desc: 'Roupas', color: '#0ea5e9' },
    ]
  },
  Transporte: {
    options: [
      { id: 'passagens', label: 'Passagens', desc: 'Ônibus/trem', color: '#0ea5e9' },
      { id: 'bicicleta', label: 'Bicicleta', desc: 'Trabalho/escola', color: '#10b981' },
    ]
  },
  Calçados: {
    options: [
      { id: 'tenis', label: 'Tênis', desc: 'Esportivo', color: '#10b981' },
      { id: 'sapato', label: 'Sapato', desc: 'Social', color: '#475569' },
      { id: 'chinelos', label: 'Chinelos', desc: 'Casual', color: '#f59e0b' },
    ]
  },
  Outros: {
    options: [
      { id: 'outros_ajuda', label: 'Outro', desc: 'Especifique', color: '#94a3b8' }
    ]
  }
};

const STORY_TEMPLATES = [
  { id: 'familia', label: 'Família', icon: <Users size={14} />, text: 'Preciso de ajuda com alimentos para minha família de [X] pessoas.' },
  { id: 'saude', label: 'Saúde', icon: <Pill size={14} />, text: 'Preciso de ajuda para adquirir o medicamento [Nome].' },
  { id: 'emprego', label: 'Emprego', icon: <Briefcase size={14} />, text: 'Estou buscando emprego e preciso de ajuda com [especifique].' },
];

const STEP_LABELS = ['Categoria', 'Detalhes', 'História', 'Urgência', 'Alcance', 'Confirmar'];
const TOTAL_STEPS = 6;

export function PrecisoDeAjudaMobile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSubModal, setSelectedSubModal] = useState(null);
  const [templateUsed, setTemplateUsed] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [isInconsistent, setIsInconsistent] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const stages = ['Verificando dados', 'Analisando urgência', 'Validando', 'Finalizando'];

  const [formData, setFormData] = useState({
    category: '',
    subCategory: [],
    description: '',
    urgency: '',
    visibility: [],
    isPublic: true,
    radius: 5,
    userLocation: null,
    locationString: '',
    city: '',
    neighborhood: ''
  });

  const nextStep = useCallback(() => setStep(s => Math.min(s + 1, TOTAL_STEPS)), []);
  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const updateData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&zoom=18`
            );
            const data = await response.json();
            
            if (data?.address) {
              const bairro = data.address.suburb || data.address.neighbourhood || '';
              const cidade = data.address.city || data.address.town || '';
              
              updateData({ 
                userLocation: coords,
                locationString: `${bairro}, ${cidade}`,
                city: cidade,
                neighborhood: bairro
              });
            }
          } catch {
            setLocationError('Erro ao obter endereço');
          }
        },
        () => {
          setLocationError('Localização não disponível');
          updateData({ 
            userLocation: { lat: -23.5505, lng: -46.6333 },
            locationString: 'São Paulo, SP',
            city: 'São Paulo',
            neighborhood: 'Centro'
          });
        }
      );
    }
  }, [updateData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'pt-BR';

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript.trim();
          if (transcript) {
            setFormData(prev => ({ 
              ...prev, 
              description: prev.description ? `${prev.description} ${transcript}` : transcript
            }));
          }
        };

        recognitionInstance.onend = () => setIsRecording(false);
        recognitionInstance.onerror = () => setIsRecording(false);

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const isDescriptionValid = useMemo(() => {
    if (formData.description.length < 10) return false;
    if (templateUsed) {
      const hasBrackets = /\[.*?\]/.test(formData.description);
      if (hasBrackets) return false;
    }
    return true;
  }, [formData.description, templateUsed]);

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1: return formData.category !== '';
      case 2: {
        const details = CATEGORY_DETAILS[formData.category];
        if (!details) return true;
        return formData.subCategory.length > 0;
      }
      case 3: return isDescriptionValid;
      case 4: return formData.urgency !== '';
      case 5: return formData.visibility.length > 0;
      default: return true;
    }
  }, [step, formData, isDescriptionValid]);

  const handlePublish = useCallback(async () => {
    setIsSubmitting(true);
    setIsAnalyzing(true);
    setAnalysisStage(0);
    
    try {
      // Simulate analysis stages
      for (let i = 0; i < stages.length; i++) {
        setAnalysisStage(i);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      
      setIsAnalyzing(false);
      
      // Prepare data for API
      const pedidoData = {
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        urgency: formData.urgency,
        visibility: formData.visibility,
        radius: formData.radius,
        location: {
          coordinates: formData.userLocation,
          address: formData.locationString,
          city: formData.city,
          neighborhood: formData.neighborhood
        },
        isPublic: formData.isPublic
      };
      
      // Import ApiService dynamically
      const { default: ApiService } = await import('../../services/apiService');
      
      // Call API to create pedido
      const response = await ApiService.createPedido(pedidoData);
      
      if (response.success) {
        setAnalysis({ 
          reason: 'Pedido criado com sucesso! Sua solicitação já está visível na rede Solidar.' 
        });
        setIsPublished(true);
      } else {
        throw new Error(response.error || 'Erro ao criar pedido');
      }
    } catch (error) {
      console.error('Erro ao publicar pedido:', error);
      setIsAnalyzing(false);
      
      // Check if it's a validation error
      if (error.message.includes('validação') || error.message.includes('inconsistent')) {
        setIsInconsistent(true);
      } else {
        // Show generic error
        alert('Erro ao publicar pedido: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, stages.length]);

  const selectedCategory = useMemo(() => CATEGORIES.find(c => c.id === formData.category), [formData.category]);
  const selectedUrgency = useMemo(() => URGENCY_OPTIONS.find(o => o.id === formData.urgency), [formData.urgency]);

  const toggleArrayItem = useCallback((array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
  }, []);

  const renderCategoryStep = () => (
    <motion.div className="pdam-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="pdam-step-header">
        <span className="pdam-step-badge">1 de 6</span>
        <h2>Qual ajuda você precisa?</h2>
      </div>
      <div className="pdam-categories-grid">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateData({ category: cat.id, subCategory: [] })}
            className={`pdam-cat-btn ${formData.category === cat.id ? 'active' : ''}`}
            style={{ '--cat-color': cat.color }}
          >
            <div className="pdam-cat-icon">{cat.icon}</div>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderDetailsStep = () => {
    const details = CATEGORY_DETAILS[formData.category];
    
    if (!details) {
      return (
        <motion.div className="pdam-step pdam-centered" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="pdam-skip-box">
            <Layers size={40} color={selectedCategory?.color} />
            <h3>{formData.category}</h3>
            <p>Sem detalhes adicionais. Continue.</p>
          </div>
        </motion.div>
      );
    }

    const subOptModal = selectedSubModal ? details.options.find(o => o.id === selectedSubModal) : null;

    return (
      <motion.div className="pdam-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="pdam-step-header">
          <span className="pdam-step-badge" style={{ background: selectedCategory?.color }}>2 de 6</span>
          <h2>O que exatamente?</h2>
        </div>
        <div className="pdam-options-list">
          {details.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                const newSub = toggleArrayItem(formData.subCategory, opt.id);
                updateData({ subCategory: newSub });
              }}
              className={`pdam-opt-btn ${formData.subCategory.includes(opt.id) ? 'active' : ''}`}
              style={{ '--opt-color': opt.color }}
            >
              <div className="pdam-opt-check">
                {formData.subCategory.includes(opt.id) && <Check size={14} />}
              </div>
              <div className="pdam-opt-text">
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selectedSubModal && subOptModal && (
            <motion.div 
              className="pdam-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubModal(null)}
            >
              <motion.div 
                className="pdam-modal"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pdam-modal-header">
                  <h3>{subOptModal.label}</h3>
                  <button onClick={() => setSelectedSubModal(null)}><X size={20} /></button>
                </div>
                {subOptModal.contextInfo && (
                  <div className="pdam-modal-info">
                    <Lightbulb size={16} />
                    <p>{subOptModal.contextInfo}</p>
                  </div>
                )}
                <button className="pdam-btn-done" onClick={() => setSelectedSubModal(null)}>
                  Concluir <Check size={16} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderDescriptionStep = () => (
    <motion.div className="pdam-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="pdam-step-header">
        <span className="pdam-step-badge pdam-story-badge">3 de 6</span>
        <h2>Conte sua história</h2>
        <p className="pdam-step-subtitle">A ajuda vem mais rápido quando as pessoas entendem o seu motivo.</p>
      </div>
      
      <div className="pdam-story-container-v4">
        <div className="pdam-input-wrapper-v4">
          <textarea
            placeholder="Descreva sua necessidade aqui com o máximo de detalhes possível..."
            value={formData.description}
            onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
            className={`pdam-textarea-v4 ${templateUsed && !isDescriptionValid ? 'warning' : ''}`}
          />
          
          <div className="pdam-textarea-footer-v4">
            <div className="pdam-voice-action-v4">
              <button 
                className={`pdam-mic-btn-v4 ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                {isRecording && <span className="pdam-pulse-v4" />}
              </button>
              <span className="pdam-voice-label-v4">
                {isRecording ? 'Ouvindo...' : 'Gravar voz'}
              </span>
            </div>

            <div className="pdam-char-counter-v4">
              <div className="pdam-progress-v4">
                <div 
                  className="pdam-progress-fill-v4" 
                  style={{ 
                    width: `${(formData.description.length / 500) * 100}%`,
                    background: formData.description.length > 450 ? '#ef4444' : '#f97316'
                  }} 
                />
              </div>
              <span>{formData.description.length}/500</span>
            </div>
          </div>
        </div>

        <div className="pdam-templates-v4">
          <div className="pdam-label-v4">
            <Sparkles size={14} />
            SUGESTÕES DE TEXTO
          </div>
          <div className="pdam-templates-scroll-v4">
            {STORY_TEMPLATES.map((t) => (
              <button
                key={t.id}
                className={`pdam-template-chip-v4 ${templateUsed === t.text ? 'active' : ''}`}
                onClick={() => {
                  updateData({ description: t.text });
                  setTemplateUsed(t.text);
                }}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pdam-tips-card-v4">
          <div className="pdam-tips-title-v4">
            <Lightbulb size={16} />
            Dicas para uma boa história
          </div>
          <ul className="pdam-tips-list-v4">
            <li>Diga <strong>exatamente</strong> o que aconteceu.</li>
            <li>Mencione a <strong>urgência</strong> (ex: remédio acabando).</li>
            <li>Informe o <strong>tamanho da família</strong>.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );

  const renderUrgencyStep = () => (
    <motion.div className="pdam-step" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="pdam-step-header">
        <span className="pdam-step-badge pdam-urgency-badge">NÍVEL DE PRIORIDADE</span>
        <h2>Qual a urgência?</h2>
        <p className="pdam-step-subtitle">Isso ajuda a priorizar casos críticos na rede.</p>
      </div>

      <div className="pdam-urgency-scale-labels">
        <span>Baixa</span>
        <span>Moderada</span>
        <span>Crítica</span>
      </div>

      <div className="pdam-urgency-scale-mobile">
        <motion.div 
          className="pdam-urgency-scale-fill"
          initial={{ width: 0 }}
          animate={{ 
            width: formData.urgency === 'critico' ? '100%' : 
                   formData.urgency === 'urgente' ? '75%' : 
                   formData.urgency === 'moderada' ? '50%' : 
                   formData.urgency === 'tranquilo' ? '25%' : 
                   formData.urgency === 'recorrente' ? '5%' : '0%'
          }}
        />
        {URGENCY_OPTIONS.map((opt) => (
          <motion.div 
            key={opt.id}
            className="pdam-urgency-dot"
            animate={{ 
              scale: formData.urgency === opt.id ? 1.5 : 1,
              background: formData.urgency === opt.id ? opt.color : '#e5e7eb'
            }}
          />
        ))}
      </div>

      <div className="pdam-urgency-list">
        {URGENCY_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateData({ urgency: opt.id })}
            className={`pdam-urg-btn ${formData.urgency === opt.id ? 'active' : ''}`}
            style={{ '--urg-color': opt.color }}
          >
            <div className="pdam-urg-icon">{opt.icon}</div>
            <div className="pdam-urg-text">
              <strong>{opt.label}</strong>
              <span>{opt.desc}</span>
            </div>
            <span className="pdam-urg-time">{opt.time}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );

  const renderVisibilityStep = () => (
    <motion.div className="pdam-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <div className="pdam-step-header">
        <span className="pdam-step-badge">5 de 6</span>
        <h2>Quem pode ver?</h2>
        <p className="pdam-step-subtitle">Defina o alcance para avisar quem está por perto.</p>
      </div>
      
      <div className="pdam-vis-grid-v2">
        {VISIBILITY_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              const newRadius = opt.id === 'bairro' ? 2 : opt.id === 'proximos' ? 10 : opt.id === 'todos' ? 50 : 5;
              updateData({ 
                visibility: toggleArrayItem(formData.visibility, opt.id),
                radius: newRadius
              });
            }}
            className={`pdam-vis-card-v2 ${formData.visibility.includes(opt.id) ? 'active' : ''}`}
            style={{ '--vis-color': opt.color }}
          >
            <div className="pdam-vis-icon-v2">{opt.icon}</div>
            <span className="pdam-vis-label-v2">{opt.label}</span>
            {formData.visibility.includes(opt.id) && (
              <div className="pdam-vis-check-v2">
                <Check size={10} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="pdam-map-section-v2">
        <div style={{
          position: 'relative',
          height: '100%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          {/* Animated Background Particles */}
          <AnimatedParticles radius={formData.radius} isActive={true} />
          
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
            `,
            animation: 'backgroundShift 8s ease-in-out infinite'
          }} />
          
          {/* Header with Stats */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#f97316'
                }} 
              />
              Alcance: {formData.radius}km
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                backdropFilter: 'blur(12px)',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#10b981',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              <Users size={14} />
              {Math.floor(formData.radius / 2) + 2} pessoas
            </motion.div>
          </div>
          
          <MapaAlcance 
            radius={formData.radius} 
            onRadiusChange={(r) => updateData({ radius: r })}
            userLocation={formData.userLocation}
          />
          
          {/* Interactive Radius Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              zIndex: 10,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(16px)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'white'
              }}>
                <Globe size={16} color="#f97316" />
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Ajustar Visibilidade</span>
              </div>
              
              <motion.div 
                key={formData.radius}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: 'white',
                  boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
                }}
              >
                {formData.radius}km
              </motion.div>
            </div>
            
            <input
              type="range"
              min="1"
              max="50"
              value={formData.radius}
              onChange={(e) => updateData({ radius: Number(e.target.value) })}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.3) 0%, rgba(249, 115, 22, 0.3) 50%, rgba(239, 68, 68, 0.3) 100%)',
                outline: 'none',
                WebkitAppearance: 'none',
                cursor: 'pointer'
              }}
            />
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.6)'
            }}>
              <span>Bairro</span>
              <span>Região</span>
              <span>Cidade</span>
            </div>
            
            {/* Impact Indicator */}
            <motion.div 
              key={`impact-${Math.floor(formData.radius / 10)}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: formData.radius <= 5 ? '#10b981' : formData.radius <= 15 ? '#f59e0b' : '#ef4444'
                  }} 
                />
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  Impacto: {
                    formData.radius <= 5 ? 'Focado no Bairro' :
                    formData.radius <= 15 ? 'Alcance Regional' :
                    'Visibilidade Ampla'
                  }
                </span>
              </div>
              <p style={{
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
                lineHeight: '1.4'
              }}>
                {
                  formData.radius <= 5 ? 'Ideal para necessidades locais e construção de vínculos comunitários.' :
                  formData.radius <= 15 ? 'Equilibra alcance e proximidade, ótimo para a maioria dos casos.' :
                  'Máxima visibilidade, recomendado para urgências críticas.'
                }
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const renderConfirmationStep = () => {
    const details = CATEGORY_DETAILS[formData.category];
    
    return (
      <motion.div className="pdam-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="pdam-step-header pdam-finish-header">
          <div className="pdam-finish-icon">
            <Rocket size={28} />
          </div>
          <h2>Confirmar pedido</h2>
        </div>
        <div className="pdam-review-card">
          <div className="pdam-review-tags">
            <span style={{ background: `${selectedCategory?.color}20`, color: selectedCategory?.color }}>
              {formData.category}
            </span>
            {selectedUrgency && (
              <span style={{ background: `${selectedUrgency.color}20`, color: selectedUrgency.color }}>
                {selectedUrgency.label}
              </span>
            )}
          </div>
          <p className="pdam-review-desc">&ldquo;{formData.description}&rdquo;</p>
          {formData.subCategory.length > 0 && (
            <p className="pdam-review-items">
              <strong>Itens:</strong> {formData.subCategory.map(id => details?.options.find(o => o.id === id)?.label).join(', ')}
            </p>
          )}
          {formData.locationString && (
            <p className="pdam-review-location">
              <MapPin size={14} /> {formData.locationString} • {formData.radius}km
            </p>
          )}
          <label className="pdam-public-switch">
            <input 
              type="checkbox" 
              checked={formData.isPublic} 
              onChange={(e) => updateData({ isPublic: e.target.checked })} 
            />
            <span className="pdam-switch-slider"></span>
            <span className="pdam-switch-label">
              {formData.isPublic ? <><Globe size={14} /> Público</> : <><ShieldCheck size={14} /> Privado</>}
            </span>
          </label>
        </div>
      </motion.div>
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
    <div className="pdam-container">
      <MobileHeader title="Preciso de Ajuda" />
      {isAnalyzing && <AnalyzingModal stages={stages} analysisStage={analysisStage} />}
      {isPublished && (
        <SuccessModal 
          urgencyColor={selectedUrgency?.color || '#f59e0b'}
          urgencyLabel={selectedUrgency?.label || 'MODERADA'}
          urgencyIcon={selectedUrgency?.icon || <Calendar size={16} />}
          reason={analysis?.reason || 'Pedido publicado!'}
          onClose={() => navigate('/')}
        />
      )}
      {isInconsistent && (
        <InconsistentModal 
          onEdit={() => { setIsInconsistent(false); setStep(3); }}
          onClose={() => navigate('/')}
        />
      )}

      <header className="pdam-header">
        <Heart size={20} fill="#f97316" color="#f97316" />
        <span>Solidar</span>
        {formData.locationString && (
          <div className="pdam-location">
            <MapPin size={12} />
            <span>{formData.neighborhood || formData.city}</span>
          </div>
        )}
      </header>

      <div className="pdam-progress">
        <div className="pdam-progress-bar">
          <div className="pdam-progress-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
        <div className="pdam-progress-steps">
          {STEP_LABELS.map((_, i) => (
            <div 
              key={i} 
              className={`pdam-progress-dot ${i + 1 <= step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}`}
            >
              {i + 1 < step ? <Check size={10} /> : null}
            </div>
          ))}
        </div>
      </div>

      <main className="pdam-main">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </main>

      <footer className="pdam-footer">
        <button 
          onClick={prevStep} 
          disabled={step === 1} 
          className="pdam-btn-back"
        >
          <ChevronLeft size={18} />
        </button>
        
        {step < TOTAL_STEPS ? (
          <button 
            onClick={nextStep} 
            disabled={!isStepValid} 
            className="pdam-btn-next"
          >
            Continuar <ArrowRight size={18} />
          </button>
        ) : (
          <button 
            onClick={handlePublish} 
            disabled={isSubmitting} 
            className="pdam-btn-publish"
          >
            {isSubmitting ? 'Enviando...' : 'Publicar'} {!isSubmitting && <Check size={18} />}
          </button>
        )}
      </footer>
    </div>
  );
}

export default PrecisoDeAjudaMobile;