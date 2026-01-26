import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
import { AnalyzingModal, InconsistentModal, SuccessModal } from '../modals';
import { MapaAlcance } from './MapaAlcance';
import LandingHeader from '../../../components/layout/LandingHeader';
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
  Sparkles,
  Lightbulb,
  Mic,
  MicOff,
  Globe,
  Rocket,
  Home
} from 'lucide-react';
import './styles.css';

const CATEGORIES = [
  { id: 'Alimentos', label: 'Alimentos', icon: <ShoppingCart size={32} />, color: '#f97316' },
  { id: 'Roupas', label: 'Roupas', icon: <Shirt size={32} />, color: '#3b82f6' },
  { id: 'Calçados', label: 'Calçados', icon: <Footprints size={32} />, color: '#6366f1' },
  { id: 'Medicamentos', label: 'Medicamentos', icon: <Pill size={32} />, color: '#10b981' },
  { id: 'Higiene', label: 'Higiene', icon: <Bath size={32} />, color: '#14b8a6' },
  { id: 'Contas', label: 'Contas', icon: <Receipt size={32} />, color: '#ef4444' },
  { id: 'Emprego', label: 'Emprego', icon: <Briefcase size={32} />, color: '#8b5cf6' },
  { id: 'Móveis', label: 'Móveis', icon: <Sofa size={32} />, color: '#f59e0b' },
  { id: 'Eletrodomésticos', label: 'Eletro', icon: <Tv size={32} />, color: '#475569' },
  { id: 'Transporte', label: 'Transporte', icon: <Car size={32} />, color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', icon: <Plus size={32} />, color: '#94a3b8' },
];

const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato', icon: <AlertTriangle size={32} />, color: '#ef4444' },
  { id: 'urgente', label: 'URGENTE', desc: 'Próximas 24h', icon: <Zap size={32} />, color: '#f97316' },
  { id: 'moderada', label: 'MODERADA', desc: 'Alguns dias', icon: <Calendar size={32} />, color: '#f59e0b' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem pressa', icon: <Coffee size={32} />, color: '#10b981' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Mensal', icon: <RefreshCcw size={32} />, color: '#6366f1' },
];

const VISIBILITY_OPTIONS = [
  { id: 'bairro', label: 'Meu Bairro', desc: 'Até 2km', icon: <MapPin size={32} />, color: '#10b981' },
  { id: 'proximos', label: 'Região Próxima', desc: 'Até 10km', icon: <Users size={32} />, color: '#3b82f6' },
  { id: 'todos', label: 'Toda a Cidade', desc: 'Visível para todos', icon: <Globe size={32} />, color: '#f97316' },
  { id: 'ongs', label: 'ONGs Parceiras', desc: 'Instituições', icon: <Building2 size={32} />, color: '#6366f1' },
];

const STEP_LABELS = ['Categoria', 'Descrição', 'Urgência', 'Visibilidade', 'Confirmação'];
const TOTAL_STEPS = 5;

function AnimatedBackground() {
  return (
    <div className="animated-background">
      <div className="geometric-shapes">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={`shape shape-${(i % 6) + 1}`}
            style={{
              '--delay': `${i * 2}s`,
              '--duration': `${15 + i * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="gradient-orbs">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`orb orb-${(i % 4) + 1}`}
            style={{
              '--delay': `${i * 3}s`,
              '--size': `${100 + i * 30}px`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function PrecisoDeAjudaDesktop() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [isInconsistent, setIsInconsistent] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const stages = ['Verificando dados', 'Analisando urgência', 'Validando', 'Finalizando'];

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    urgency: '',
    visibility: [],
    radius: 5,
    userLocation: null,
    locationString: '',
    city: '',
    state: '',
    neighborhood: ''
  });

  // Animation hooks
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const headerSpring = useSpring({
    opacity: headerInView ? 1 : 0,
    transform: headerInView ? 'translateY(0px)' : 'translateY(-50px)',
    config: { tension: 280, friction: 60 }
  });

  const formSpring = useSpring({
    opacity: formInView ? 1 : 0,
    transform: formInView ? 'translateY(0px)' : 'translateY(30px)',
    config: { tension: 280, friction: 60 }
  });

  const nextStep = useCallback(() => setStep(s => Math.min(s + 1, TOTAL_STEPS)), []);
  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const updateData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Initialize location and speech recognition
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(coords);
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&zoom=18`
            );
            const data = await response.json();
            
            if (data?.address) {
              const address = data.address;
              const bairro = address.suburb || address.neighbourhood || '';
              const cidade = address.city || address.town || '';
              const estado = address.state || '';
              
              updateData({ 
                userLocation: coords,
                locationString: `${bairro}, ${cidade} - ${estado}`,
                city: cidade,
                state: estado,
                neighborhood: bairro
              });
            }
          } catch {
            updateData({ 
              userLocation: coords,
              locationString: 'São Paulo, SP - Centro',
              city: 'São Paulo',
              state: 'SP',
              neighborhood: 'Centro'
            });
          }
        },
        () => {
          const defaultCoords = { lat: -23.5505, lng: -46.6333 };
          setUserLocation(defaultCoords);
          updateData({ 
            userLocation: defaultCoords,
            locationString: 'São Paulo, SP - Centro',
            city: 'São Paulo',
            state: 'SP',
            neighborhood: 'Centro'
          });
        }
      );
    }

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
  }, [updateData]);

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

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1: return formData.category !== '';
      case 2: return formData.description.length >= 10;
      case 3: return formData.urgency !== '';
      case 4: return formData.visibility.length > 0;
      default: return true;
    }
  }, [step, formData]);

  const handlePublish = useCallback(async () => {
    setIsSubmitting(true);
    setIsAnalyzing(true);
    setAnalysisStage(0);
    
    try {
      for (let i = 0; i < stages.length; i++) {
        setAnalysisStage(i);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setIsAnalyzing(false);
      
      const pedidoData = {
        category: formData.category,
        description: formData.description,
        urgency: formData.urgency,
        visibility: formData.visibility,
        radius: formData.radius,
        locationString: formData.locationString,
        city: formData.city,
        state: formData.state,
        neighborhood: formData.neighborhood,
        coordinates: formData.userLocation
      };
      
      const { default: ApiService } = await import('../../../services/apiService');
      const response = await ApiService.createPedido(pedidoData);
      
      if (response.success) {
        setAnalysis({ reason: 'Pedido criado com sucesso!' });
        setIsPublished(true);
      } else {
        throw new Error(response.error || 'Erro ao criar pedido');
      }
    } catch (error) {
      console.error('Erro ao publicar pedido:', error);
      setIsAnalyzing(false);
      
      if (error.message.includes('validação') || error.message.includes('inconsistent')) {
        setIsInconsistent(true);
      } else {
        alert('Erro ao publicar pedido: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, stages.length]);

  const selectedCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === formData.category), 
    [formData.category]
  );

  const selectedUrgency = useMemo(() => 
    URGENCY_OPTIONS.find(o => o.id === formData.urgency),
    [formData.urgency]
  );

  const toggleArrayItem = useCallback((array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
  }, []);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="step-header">
              <h2>Qual tipo de ajuda você precisa?</h2>
              <p>Escolha a categoria que melhor descreve sua necessidade</p>
            </div>
            <div className="categories-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateData({ category: cat.id })}
                  className={`category-card ${formData.category === cat.id ? 'active' : ''}`}
                  style={{ '--cat-color': cat.color }}
                >
                  <div className="category-icon">{cat.icon}</div>
                  <span className="category-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="step-header">
              <h2>Conte sua história</h2>
              <p>Descreva sua situação com detalhes para que as pessoas entendam como ajudar</p>
            </div>
            <div className="description-container">
              <div className="textarea-wrapper">
                <textarea
                  placeholder="Descreva sua necessidade aqui com o máximo de detalhes possível..."
                  value={formData.description}
                  onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
                  className="description-textarea"
                />
                <div className="textarea-footer">
                  <button
                    onClick={toggleRecording}
                    className={`voice-btn ${isRecording ? 'recording' : ''}`}
                  >
                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                    {isRecording ? 'Ouvindo...' : 'Gravar voz'}
                  </button>
                  <span className="char-counter">{formData.description.length}/500</span>
                </div>
              </div>
              <div className="tips-card">
                <div className="tips-header">
                  <Lightbulb size={20} />
                  Dicas para uma boa descrição
                </div>
                <ul>
                  <li>Seja específico sobre o que aconteceu</li>
                  <li>Mencione se há prazo crítico</li>
                  <li>Informe quantas pessoas serão beneficiadas</li>
                  <li>Explique por que precisa de ajuda agora</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="step-header">
              <h2>Qual a urgência do seu pedido?</h2>
              <p>Isso ajuda a priorizar casos críticos na rede</p>
            </div>
            <div className="urgency-grid">
              {URGENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateData({ urgency: opt.id })}
                  className={`urgency-card ${formData.urgency === opt.id ? 'active' : ''}`}
                  style={{ '--urg-color': opt.color }}
                >
                  <div className="urgency-icon">{opt.icon}</div>
                  <div className="urgency-content">
                    <strong>{opt.label}</strong>
                    <p>{opt.desc}</p>
                  </div>
                  {formData.urgency === opt.id && <Check size={20} className="check-icon" />}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="step-header">
              <h2>Quem deve ver seu pedido?</h2>
              <p>Defina o alcance para que as pessoas próximas sejam notificadas</p>
            </div>
            <div className="visibility-container">
              <div className="visibility-options">
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
                    className={`visibility-card ${formData.visibility.includes(opt.id) ? 'active' : ''}`}
                    style={{ '--vis-color': opt.color }}
                  >
                    <div className="visibility-icon">{opt.icon}</div>
                    <div className="visibility-content">
                      <strong>{opt.label}</strong>
                      <p>{opt.desc}</p>
                    </div>
                    {formData.visibility.includes(opt.id) && <Check size={16} className="check-icon" />}
                  </button>
                ))}
              </div>
              <div className="map-section">
                <MapaAlcance 
                  radius={formData.radius} 
                  onRadiusChange={(r) => updateData({ radius: r })}
                  userLocation={formData.userLocation}
                />
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="step-header">
              <h2>Confirmar pedido</h2>
              <p>Revise os detalhes antes de publicar</p>
            </div>
            <div className="confirmation-card">
              <div className="confirmation-header">
                <span className="category-badge" style={{ background: selectedCategory?.color }}>
                  {selectedCategory?.icon}
                  {formData.category}
                </span>
                <span className="urgency-badge" style={{ color: selectedUrgency?.color, borderColor: selectedUrgency?.color }}>
                  {selectedUrgency?.icon}
                  {selectedUrgency?.label}
                </span>
              </div>
              <div className="confirmation-content">
                <p className="description-preview">"{formData.description}"</p>
                <div className="location-preview">
                  <MapPin size={16} />
                  <span>{formData.locationString} • Raio: {formData.radius}km</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pda-page">
      <LandingHeader />
      <AnimatedBackground />
      
      {isAnalyzing && <AnalyzingModal stages={stages} analysisStage={analysisStage} />}
      {isPublished && (
        <SuccessModal 
          urgencyColor={selectedUrgency?.color || '#f97316'}
          urgencyLabel={selectedUrgency?.label || 'PUBLICADO'}
          urgencyIcon={selectedUrgency?.icon}
          reason={analysis?.reason || 'Pedido publicado!'}
          onClose={() => navigate('/')}
        />
      )}
      {isInconsistent && (
        <InconsistentModal 
          onEdit={() => { setIsInconsistent(false); setStep(2); }}
          onClose={() => navigate('/')}
        />
      )}

      <div className="pda-main-wrapper" style={{ paddingTop: '80px' }}>
        
        <animated.header className="page-header" style={headerSpring} ref={headerRef}>
          <div className="brand-box">
            <div className="brand-logo">
              <Heart size={32} fill="#ef4444" color="#ef4444" />
            </div>
            <div className="brand-info">
              <h1>Preciso de <span>Ajuda</span></h1>
              <p>Publique sua necessidade e conecte-se com pessoas dispostas a ajudar</p>
            </div>
          </div>

          <div className="header-controls">
            <motion.button
              className="btn-home"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={20} />
              <span>Início</span>
            </motion.button>
          </div>
        </animated.header>

        <div className="content-section">
          <div className="step-indicator">
            PASSO {step} DE {TOTAL_STEPS}
          </div>

          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          <div className="form-actions">
            <button 
              onClick={step === 1 ? () => navigate('/') : prevStep} 
              className="btn-back"
            >
              <ChevronLeft size={20} /> 
              {step === 1 ? 'Cancelar' : 'Voltar'}
            </button>
            
            {step < TOTAL_STEPS ? (
              <button 
                onClick={nextStep} 
                disabled={!isStepValid} 
                className="btn-next"
              >
                Continuar <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                onClick={handlePublish} 
                disabled={isSubmitting} 
                className="btn-publish"
              >
                {isSubmitting ? 'Publicando...' : 'Publicar Pedido'} <Rocket size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrecisoDeAjudaDesktop;