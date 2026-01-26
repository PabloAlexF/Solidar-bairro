"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AIAssistant } from './AIAssistant';
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
  Clock,
  CheckCircle2,
  Eye
} from 'lucide-react';
import './styles.css';

const CATEGORIES = [
  { id: 'Alimentos', label: 'Alimentos', icon: ShoppingCart, color: '#f97316' },
  { id: 'Roupas', label: 'Roupas', icon: Shirt, color: '#3b82f6' },
  { id: 'Calçados', label: 'Calçados', icon: Footprints, color: '#6366f1' },
  { id: 'Medicamentos', label: 'Medicamentos', icon: Pill, color: '#10b981' },
  { id: 'Higiene', label: 'Higiene', icon: Bath, color: '#14b8a6' },
  { id: 'Contas', label: 'Contas', icon: Receipt, color: '#ef4444' },
  { id: 'Emprego', label: 'Emprego', icon: Briefcase, color: '#8b5cf6' },
  { id: 'Móveis', label: 'Móveis', icon: Sofa, color: '#f59e0b' },
  { id: 'Eletrodomésticos', label: 'Eletro', icon: Tv, color: '#475569' },
  { id: 'Transporte', label: 'Transporte', icon: Car, color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', icon: Plus, color: '#94a3b8' },
];

const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato', icon: AlertTriangle, color: '#ef4444' },
  { id: 'urgente', label: 'URGENTE', desc: 'Próximas 24h', icon: Zap, color: '#f97316' },
  { id: 'moderada', label: 'MODERADA', desc: 'Alguns dias', icon: Calendar, color: '#f59e0b' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem pressa', icon: Coffee, color: '#10b981' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Mensal', icon: RefreshCcw, color: '#6366f1' },
];

const VISIBILITY_OPTIONS = [
  { id: 'bairro', label: 'Meu Bairro', desc: 'Até 2km', icon: MapPin, color: '#10b981', rgb: '16, 185, 129' },
  { id: 'proximos', label: 'Região Próxima', desc: 'Até 10km', icon: Users, color: '#3b82f6', rgb: '59, 130, 246' },
  { id: 'todos', label: 'Toda a Cidade', desc: 'Visível para todos', icon: Globe, color: '#f97316', rgb: '249, 115, 22' },
  { id: 'ongs', label: 'ONGs Parceiras', desc: 'Instituições', icon: Building2, color: '#6366f1', rgb: '139, 92, 246' },
];

const STEP_LABELS = ['Categoria', 'Descrição', 'Urgência', 'Visibilidade', 'Confirmação'];
const TOTAL_STEPS = 5;

function AnimatedBackground() {
  return (
    <div className="animated-background">
      <div className="geometric-shapes">
        {[...Array(6)].map((_, i) => (
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

const ValidationModal = ({ isOpen, onClose, validationResult, onRetry, onForcePublish }) => {
  if (!isOpen || !validationResult) return null;

  const { canPublish, analysis, confidence, riskScore, suggestions } = validationResult;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-lg p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-white/20"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full translate-y-12 -translate-x-12" />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            canPublish 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-orange-50 border-2 border-orange-200'
          }`}>
            {canPublish ? <CheckCircle2 size={32} className="text-green-600" /> : <AlertTriangle size={32} className="text-orange-600" />}
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-slate-900 mb-2"
          >
            {canPublish ? 'Pedido Aprovado!' : 'Pedido Requer Revisão'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 text-sm"
          >
            {canPublish ? 'Tudo certo para publicação' : 'Algumas melhorias são necessárias'}
          </motion.p>
        </div>
        
        {/* Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 relative z-10"
        >
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <p className="text-slate-700 leading-relaxed mb-4 text-sm">{analysis}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-xs font-bold text-slate-600">Confiança: {confidence}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  riskScore > 70 ? 'bg-red-500' : riskScore > 40 ? 'bg-orange-500' : 'bg-green-500'
                }`} />
                <span className="text-xs font-bold text-slate-600">Risco: {riskScore}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 relative z-10"
          >
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-red-600" />
                <h3 className="font-black text-slate-900 text-sm">Problemas Identificados</h3>
              </div>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="bg-white rounded-xl p-4 border border-red-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle size={12} strokeWidth={3} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800 font-medium mb-2">{suggestion.message}</p>
                        {suggestion.evidence && (
                          <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2 border">
                            <strong>Evidência:</strong> {suggestion.evidence}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 relative z-10"
        >
          {!canPublish && (
            <button 
              onClick={onRetry}
              className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCcw size={16} /> Revisar Pedido
            </button>
          )}
          {canPublish && (
            <motion.button 
              onClick={onClose}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Continuar
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const AnalyzingModal = ({ stages, analysisStage }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-[32px] p-12 max-w-md w-full mx-4 shadow-2xl text-center"
    >
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-spin-slow">
        <RefreshCcw size={40} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">Assistente IA Analisando</h3>
      <p className="text-slate-500 mb-8">{stages[analysisStage]}</p>
      <div className="space-y-3 text-left">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= analysisStage ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {i < analysisStage ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-sm font-bold ${i === analysisStage ? 'text-slate-900' : 'text-slate-400'}`}>{stage}</span>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

const SuccessModal = ({ urgencyColor, urgencyLabel, urgencyIcon: UrgencyIcon, reason, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] p-12 max-w-lg w-full mx-4 shadow-2xl text-center"
    >
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <Check size={48} strokeWidth={3} />
      </div>
      <h2 className="text-4xl font-black text-slate-900 mb-4">Sucesso!</h2>
      <p className="text-xl text-slate-500 mb-8">{reason}</p>
      <div className="flex items-center justify-center gap-3 mb-12 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div style={{ color: urgencyColor }} className="flex items-center gap-2 font-black uppercase tracking-widest text-sm">
          {UrgencyIcon && <UrgencyIcon size={20} />}
          {urgencyLabel}
        </div>
      </div>
      <button 
        onClick={onClose}
        className="w-full py-5 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
      >
        Voltar para o Início
      </button>
    </motion.div>
  </div>
);

export default function PDAForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isImproving, setIsImproving] = useState(false);
  
  // AI Assistant states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  
  const [isPublished, setIsPublished] = useState(false);
    
  const stages = ['Analisando categoria', 'Verificando urgência', 'Avaliando descrição', 'Gerando sugestões'];

  const [formData, setFormData] = useState({
    category: '',
    description: '',
    urgency: '',
    visibility: ['bairro'],
    radius: 2,
    userLocation: null,
    locationString: 'Detectando localização...',
    city: '',
    state: '',
    neighborhood: ''
  });

  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const nextStep = useCallback(() => {
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategorySelect = (id) => {
    if (formData.category === id) {
      nextStep();
      return;
    }
    updateData({ category: id });
  };
  
  const prevStep = useCallback(() => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handlePublish = useCallback(async () => {
    setIsSubmitting(true);
    setIsAnalyzing(true);
    setAnalysisStage(0);
    
    try {
      // AI Analysis with progress
      for (let i = 0; i < stages.length; i++) {
        setAnalysisStage(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Get AI validation result
      const result = await AIAssistant.validateRequest(formData);
      
      setIsAnalyzing(false);
      
      // Check if validation passed
      if (!result.canPublish) {
        // Show validation modal with issues
        setValidationResult(result);
        setShowValidationModal(true);
        return;
      }
      
      // If validation passed, show success
      setIsPublished(true);
      
    } catch (error) {
      console.error('AI Analysis error:', error);
      setIsAnalyzing(false);
      // Show error in validation modal
      setValidationResult({
        canPublish: false,
        analysis: 'Erro na validação. Tente novamente.',
        confidence: 0,
        riskScore: 100,
        suggestions: [{
          type: 'error',
          message: 'Erro de conexão com o sistema de validação',
          action: 'Tentar novamente',
          priority: 'high'
        }],
        validations: {}
      });
      setShowValidationModal(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, stages.length]);

  const handleRetryValidation = () => {
    // Store the validation result before clearing it
    const currentValidationResult = validationResult;
    
    setShowValidationModal(false);
    setValidationResult(null);
    
    // Navigate to the step with the main problem based on suggestion type
    if (currentValidationResult?.suggestions?.length > 0) {
      const mainProblem = currentValidationResult.suggestions[0];
      
      // Navigate based on suggestion type
      if (mainProblem.type === 'description' || mainProblem.action === 'Melhorar descrição' || mainProblem.action === 'Expandir descrição') {
        setStep(2); // Description step
      } else if (mainProblem.type === 'category' || mainProblem.action === 'Alterar categoria') {
        setStep(1); // Category step
      } else if (mainProblem.type === 'urgency' || mainProblem.action === 'Revisar urgência') {
        setStep(3); // Urgency step
      } else {
        // Fallback to description for general issues
        setStep(2);
      }
    }
  };

  const handleForcePublish = () => {
    setShowValidationModal(false);
    setValidationResult(null);
    setIsPublished(true);
  };

  const selectedCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === formData.category), 
    [formData.category]
  );

  const selectedUrgency = useMemo(() => 
    URGENCY_OPTIONS.find(o => o.id === formData.urgency),
    [formData.urgency]
  );

  const descriptionQuality = useMemo(() => {
    const len = formData.description.length;
    if (len === 0) return { label: "Esperando sua história", color: "text-slate-400", bg: "bg-slate-100", width: "w-0" };
    if (len < 30) return { label: "Curto demais", color: "text-rose-500", bg: "bg-rose-100", width: "w-[20%]" };
    if (len < 100) return { label: "Ficando bom!", color: "text-amber-500", bg: "bg-amber-100", width: "w-[50%]" };
    if (len < 300) return { label: "História Emocionante", color: "text-emerald-500", bg: "bg-emerald-100", width: "w-[80%]" };
    return { label: "História Poderosa!", color: "text-blue-600", bg: "bg-blue-100", width: "w-full" };
  }, [formData.description]);

  const dynamicTips = useMemo(() => {
    const tips = ["Seja específico sobre sua situação"];
    
    if (formData.category === 'Alimentos') tips.push("Mencione se há crianças ou idosos");
    else if (formData.category === 'Medicamentos') tips.push("Informe a dosagem e se tem receita");
    else if (formData.category === 'Contas') tips.push("Explique o prazo crítico de pagamento");
    else if (formData.category === 'Emprego') tips.push("Destaque sua experiência principal");
    
    tips.push("Informe quantas pessoas serão ajudadas");
    tips.push("Explique como a ajuda fará diferença");
    
    return tips;
  }, [formData.category]);

  useEffect(() => {
    // Geolocation
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&zoom=18`
            );
            const data = await response.json();
            
            if (data?.address) {
              const address = data.address;
              const bairro = address.suburb || address.neighbourhood || address.village || "";
              const cidade = address.city || address.town || "";
              const estado = address.state || "";
              
              updateData({ 
                userLocation: coords,
                locationString: `${bairro}${bairro ? ", " : ""}${cidade} - ${estado}`,
                city: cidade,
                state: estado,
                neighborhood: bairro
              });
            }
          } catch (err) {
            updateData({ userLocation: coords, locationString: "Localização detectada" });
          }
        },
        () => {
          updateData({ locationString: "São Paulo, SP - Centro" });
        }
      );
    } else {
      updateData({ locationString: "São Paulo, SP - Centro" });
    }

    // Speech Recognition
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
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const improveWithAI = async () => {
    if (formData.description.length < 20 || isImproving) return;
    
    setIsImproving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const prefixes = [
      "Olá, gostaria de relatar que ",
      "Escrevo este pedido pois ",
      "Gostaria de contar com a ajuda de vocês porque "
    ];
    const suffixes = [
      " Este apoio seria fundamental para nossa família.",
      " Agradeço imensamente quem puder colaborar.",
      " Que Deus abençoe quem puder ajudar."
    ];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    let text = formData.description.trim();
    if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) text += '.';
    
    updateData({ description: `${prefix}${text}${suffix}`.slice(0, 500) });
    setIsImproving(false);
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Qual tipo de ajuda você precisa?</h2>
                <p>Escolha a categoria que melhor descreve sua necessidade.</p>
              </div>
              <div className="categories-grid">
                {CATEGORIES.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`category-card ${formData.category === cat.id ? 'active' : ''}`}
                    style={{ '--cat-color': cat.color }}
                  >
                    <div className="relative">
                      <cat.icon size={48} color={cat.color} strokeWidth={1.5} />
                    </div>
                    <span className="category-label">{cat.label}</span>
                    {formData.category === cat.id && (
                      <>
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-5 right-5 bg-green-500 text-white rounded-full p-2 shadow-lg z-10"
                        >
                          <Check size={20} strokeWidth={4} />
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 py-3 px-6 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-2 whitespace-nowrap shadow-xl"
                        >
                          Confirmar Categoria <ArrowRight size={14} />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Conte sua história</h2>
                <p>Sua descrição ajuda as pessoas a entenderem como podem ser úteis.</p>
              </div>
              <div className="description-container">
                <div className="textarea-wrapper">
                  <div className="flex justify-between items-center mb-4">
                    <div className="textarea-header !m-0">
                      <Heart size={20} className="text-rose-500" />
                      <span>Sua história importa</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${descriptionQuality.bg} ${descriptionQuality.color}`}>
                      {descriptionQuality.label}
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <textarea
                      placeholder="Exemplo: Sou mãe solteira de 3 filhos e estou desempregada há 2 meses. Preciso de cestas básicas..."
                      value={formData.description}
                      onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
                      className="description-textarea !min-h-[250px] !pb-16"
                    />
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={toggleRecording}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                          {isRecording ? 'Ouvindo...' : 'Voz'}
                        </motion.button>
                        <motion.button
                          onClick={improveWithAI}
                          disabled={formData.description.length < 20 || isImproving}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            formData.description.length >= 20 && !isImproving
                            ? 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100' 
                            : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                          }`}
                          whileHover={formData.description.length >= 20 && !isImproving ? { scale: 1.05 } : {}}
                          whileTap={formData.description.length >= 20 && !isImproving ? { scale: 0.95 } : {}}
                        >
                          {isImproving ? (
                            <RefreshCcw size={16} className="animate-spin" />
                          ) : (
                            <Sparkles size={16} />
                          )}
                          {isImproving ? 'Melhorando...' : 'Melhorar'}
                        </motion.button>
                      </div>
                      
                      <div className="flex flex-col items-end mt-4">
                        <span className="text-[10px] font-black text-slate-400">
                          {formData.description.length}/500
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tips-card !bg-white !shadow-xl !border-slate-100">
                  <div className="tips-header !text-slate-900 !mb-6">
                    <Lightbulb size={24} className="text-amber-500" />
                    <span className="text-lg">Sugestões</span>
                  </div>
                  <ul className="space-y-4">
                    {dynamicTips.map((tip, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
                      >
                        <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Qual a urgência?</h2>
                <p>Isso ajuda a priorizar casos críticos.</p>
              </div>
              <div className="urgency-grid">
                {URGENCY_OPTIONS.map((opt, index) => (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => updateData({ urgency: opt.id })}
                    className={`urgency-card ${formData.urgency === opt.id ? 'active' : ''}`}
                    style={{ '--urg-color': opt.color }}
                  >
                    <opt.icon size={40} color={opt.color} strokeWidth={2} />
                    <div className="urgency-content text-left">
                      <strong>{opt.label}</strong>
                      <p className="text-sm opacity-70">{opt.desc}</p>
                    </div>
                    {formData.urgency === opt.id && <Check size={24} className="ml-auto text-green-500" />}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Quem deve ver seu pedido?</h2>
                <p>Defina o alcance para notificar pessoas próximas.</p>
              </div>
              <div className="visibility-container">
                <div className="visibility-options">
                  {VISIBILITY_OPTIONS.map((opt, index) => {
                    const isActive = formData.visibility.includes(opt.id);
                    return (
                      <motion.button
                        key={opt.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          const newRadius = opt.id === 'bairro' ? 2 : opt.id === 'proximos' ? 10 : opt.id === 'todos' ? 50 : 5;
                          updateData({ 
                            visibility: formData.visibility.includes(opt.id) 
                              ? formData.visibility.filter(i => i !== opt.id)
                              : [...formData.visibility, opt.id],
                            radius: newRadius
                          });
                        }}
                        className={`visibility-card ${isActive ? 'active' : ''}`}
                        style={{ '--vis-color': opt.color, '--vis-rgb': opt.rgb }}
                      >
                        <div className="visibility-icon"><opt.icon size={24} /></div>
                        <div className="visibility-content text-left">
                          <strong>{opt.label}</strong>
                          <p>{opt.desc}</p>
                        </div>
                        {isActive && <Check size={24} className="ml-auto text-green-500" />}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="map-section">
                  <div className="map-placeholder">
                    <div className="map-indicator">
                      <MapPin size={48} className="text-blue-500 animate-bounce" />
                      <span className="font-black text-slate-800">{formData.locationString}</span>
                      <p className="text-sm opacity-70 font-normal">Sua localização para encontrar ajuda próxima.</p>
                    </div>
                  </div>
                  <div className="p-6 bg-blue-50/50 rounded-b-[24px]">
                    <p className="text-sm font-black text-blue-700 flex items-center gap-2">
                      <Globe size={16} /> Alcance selecionado: {formData.radius}km
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Confirmar pedido</h2>
                <p>Revise os detalhes antes de publicar.</p>
              </div>
              <div className="confirmation-card">
                <div className="flex justify-between items-start mb-12 gap-4 flex-wrap">
                  <div className="category-badge flex items-center gap-3" style={{ background: `${selectedCategory?.color}15`, color: selectedCategory?.color }}>
                    {selectedCategory && <selectedCategory.icon size={20} />}
                    <span className="text-sm font-black uppercase tracking-wider">{formData.category}</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 rounded-full border-2" style={{ borderColor: selectedUrgency?.color, color: selectedUrgency?.color }}>
                    {selectedUrgency && <selectedUrgency.icon size={20} />}
                    <span className="font-black text-sm uppercase tracking-tighter">{selectedUrgency?.label}</span>
                  </div>
                </div>
                
                <div className="description-preview italic text-slate-700">
                  "{formData.description}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  <div className="p-8 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Eye size={28} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Alcance</p>
                      <p className="font-black text-slate-900 text-lg">{formData.radius}km de raio</p>
                    </div>
                  </div>
                  <div className="p-8 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Localização</p>
                      <p className="font-black text-slate-900 text-lg truncate max-w-[180px]">{formData.neighborhood || formData.city || 'Sua Região'}</p>
                    </div>
                  </div>
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
      <AnimatedBackground />
      
      {/* AI Analysis Modal */}
      {isAnalyzing && <AnalyzingModal stages={stages} analysisStage={analysisStage} />}
      
      {/* Validation Modal */}
      <ValidationModal 
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        validationResult={validationResult}
        onRetry={handleRetryValidation}
        onForcePublish={handleForcePublish}
      />
      
      {isPublished && (
        <SuccessModal 
          urgencyColor={selectedUrgency?.color || '#f97316'}
          urgencyLabel={selectedUrgency?.label || 'PUBLICADO'}
          urgencyIcon={selectedUrgency?.icon}
          reason="Seu pedido foi enviado com sucesso e pessoas próximas serão notificadas."
          onClose={() => window.location.href = '/'}
        />
      )}

      <main className="pda-main-wrapper" style={{ paddingTop: '80px' }}>
        <div className="content-section" ref={formRef}>
          {!isPublished && (
            <>
              <motion.div 
                className="step-indicator"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Passo {step} de {TOTAL_STEPS}: {STEP_LABELS[step-1]}
              </motion.div>

              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              {step > 1 && (
                <div className="form-actions">
                  <button onClick={prevStep} className="btn-back">
                    <ChevronLeft size={20} /> Voltar
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
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}