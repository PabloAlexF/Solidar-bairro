import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../contexts/NotificationContext';
import { MapaAlcance } from './MapaAlcance';
import { AnalyzingModal, InconsistentModal, SuccessModal } from './modals';
import AnimatedParticles from '../AnimatedParticles';
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
  Globe,
  Star,
  Wand2,
  Target,
  Rocket,
  ChevronDown,
  Bell
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
  { id: 'Eletrodomésticos', label: 'Eletrodomésticos', icon: <Tv size={32} />, color: '#475569' },
  { id: 'Transporte', label: 'Transporte', icon: <Car size={32} />, color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', icon: <Plus size={32} />, color: '#94a3b8' },
];

const URGENCY_OPTIONS = [
  { 
    id: 'critico', 
    label: 'CRÍTICO', 
    desc: 'Risco imediato à saúde ou vida', 
    icon: <AlertTriangle size={32} />, 
    color: '#ef4444', 
    time: 'Imediato',
    examples: ['Falta de medicamento vital', 'Risco de despejo hoje', 'Sem comida há 2+ dias'],
    priority: 'Máxima',
    response: '< 2 horas'
  },
  { 
    id: 'urgente', 
    label: 'URGENTE', 
    desc: 'Necessário para as próximas 24h', 
    icon: <Zap size={32} />, 
    color: '#f97316', 
    time: '24 horas',
    examples: ['Conta vencendo hoje', 'Entrevista amanhã', 'Medicamento acabando'],
    priority: 'Alta',
    response: '< 24 horas'
  },
  { 
    id: 'moderada', 
    label: 'MODERADA', 
    desc: 'Pode aguardar alguns dias', 
    icon: <Calendar size={32} />, 
    color: '#f59e0b', 
    time: '3-5 dias',
    examples: ['Roupas para inverno', 'Móveis básicos', 'Documentos'],
    priority: 'Média',
    response: '2-5 dias'
  },
  { 
    id: 'tranquilo', 
    label: 'TRANQUILO', 
    desc: 'Sem prazo rígido', 
    icon: <Coffee size={32} />, 
    color: '#10b981', 
    time: 'Sem pressa',
    examples: ['Melhorias gerais', 'Itens extras', 'Complementos'],
    priority: 'Baixa',
    response: '1-2 semanas'
  },
  { 
    id: 'recorrente', 
    label: 'RECORRENTE', 
    desc: 'Necessidade mensal constante', 
    icon: <RefreshCcw size={32} />, 
    color: '#6366f1', 
    time: 'Mensal',
    examples: ['Cesta básica mensal', 'Medicamentos contínuos', 'Transporte regular'],
    priority: 'Contínua',
    response: 'Agendado'
  },
];

const VISIBILITY_OPTIONS = [
  { id: 'bairro', label: 'Meu Bairro', desc: 'Até 2km de distância', icon: <MapPin size={32} />, color: '#10b981' },
  { id: 'proximos', label: 'Região Próxima', desc: 'Até 10km de distância', icon: <Users size={32} />, color: '#3b82f6' },
  { id: 'todos', label: 'Toda a Cidade', desc: 'Visível para todos na cidade', icon: <Globe size={32} />, color: '#f97316' },
  { id: 'ongs', label: 'ONGs Parceiras', desc: 'Visível para instituições', icon: <Building2 size={32} />, color: '#6366f1' },
];

const CATEGORY_DETAILS = {
  Alimentos: {
    options: [
      { 
        id: 'cesta', 
        label: 'Cesta Básica', 
        desc: 'Arroz, feijão, óleo e itens secos.', 
        color: '#f97316',
        contextInfo: 'Uma cesta básica padrão costuma alimentar uma família de 4 pessoas por cerca de 15 dias.',
        subQuestions: [
          { id: 'itens_cesta', label: 'Itens de maior necessidade?', type: 'chips', options: ['Arroz', 'Feijão', 'Óleo', 'Açúcar', 'Café', 'Leite', 'Macarrão', 'Sal', 'Farinha'] },
          { id: 'familia', label: 'Tamanho da Família?', type: 'select', options: ['1-2 pessoas', '3-4 pessoas', '5 ou mais'] },
          { id: 'restricao', label: 'Alguma restrição alimentar?', type: 'input', placeholder: 'Ex: Diabético, Intolerante a Lactose...' }
        ]
      },
      { id: 'proteinas', label: 'Proteínas & Ovos', desc: 'Carne, frango, ovos e peixe.', color: '#ef4444' },
      { id: 'frescos', label: 'Hortifruti', desc: 'Frutas, legumes e verduras.', color: '#10b981' },
      { id: 'padaria', label: 'Padaria & Laticínios', desc: 'Pão, leite, queijo e café.', color: '#f59e0b' },
      { id: 'infantil', label: 'Bebês & Crianças', desc: 'Fórmulas, papinhas e fraldas.', color: '#6366f1' },
      { id: 'lanches', label: 'Lanches & Merenda', desc: 'Biscoitos, sucos e práticos.', color: '#ec4899' },
      { id: 'cozinha', label: 'Temperos & Cozinha', desc: 'Óleo, sal, açúcar e temperos.', color: '#475569' },
      { id: 'prontas', label: 'Refeições Prontas', desc: 'Marmitas e consumo imediato.', color: '#f43f5e' },
    ]
  },
  Roupas: {
    options: [
      { id: 'agasalhos', label: 'Agasalhos', desc: 'Casacos pesados, blusas de lã.', color: '#1e40af' },
      { id: 'escolar', label: 'Uniforme Escolar', desc: 'Kits da rede municipal/estadual.', color: '#6366f1' },
      { id: 'calcados', label: 'Calçados', desc: 'Tênis, sapatos, botas ou chinelos.', color: '#2563eb' },
      { id: 'enxoval', label: 'Enxoval de Bebê', desc: 'Body, mantas e fraldas pano.', color: '#ec4899' },
      { id: 'intimas', label: 'Roupas Íntimas', desc: 'Novas: meias, cuecas, calcinhas.', color: '#f43f5e' },
      { id: 'cama_banho', label: 'Cama & Banho', desc: 'Lençóis, cobertas, toalhas.', color: '#14b8a6' },
      { id: 'verao', label: 'Roupas de Verão', desc: 'Camisetas, bermudas, vestidos.', color: '#f59e0b' },
      { id: 'profissional', label: 'Roupa Profissional', desc: 'Social para interviews ou trabalho.', color: '#475569' },
    ],
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'EXG', 'Infantil'],
    styles: ['Masculino', 'Feminino', 'Unissex', 'Infantil']
  },
  Calçados: {
    options: [
      { id: 'tenis_esportivo', label: 'Tênis Esportivo', desc: 'Para exercícios e caminhadas.', color: '#10b981' },
      { id: 'sapato_social', label: 'Sapato Social', desc: 'Para trabalho e entrevistas.', color: '#475569' },
      { id: 'chinelos', label: 'Chinelos/Sandálias', desc: 'Para uso doméstico e casual.', color: '#f59e0b' },
      { id: 'botas', label: 'Botas/Botinas', desc: 'Para trabalho e proteção.', color: '#dc2626' },
      { id: 'calcados_infantis', label: 'Calçados Infantis', desc: 'Para crianças e bebês.', color: '#ec4899' },
    ],
    sizes: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    styles: ['Masculino', 'Feminino', 'Infantil', 'Unissex']
  },
  Medicamentos: {
    options: [
      { id: 'pressao', label: 'Pressão Alta', desc: 'Losartana, Enalapril, etc.', color: '#ef4444' },
      { id: 'diabetes', label: 'Diabetes', desc: 'Metformina, Insulinas.', color: '#dc2626' },
      { id: 'analgesicos', label: 'Analgésicos', desc: 'Dipirona, Paracetamol, Ibuprofeno.', color: '#10b981' },
      { id: 'bombinhas', label: 'Bombinhas/Asma', desc: 'Salbutamol, Beclometasona.', color: '#0ea5e9' },
      { id: 'antibioticos', label: 'Antibióticos', desc: 'Com receita médica atualizada.', color: '#8b5cf6' },
      { id: 'saude_mental', label: 'Saúde Mental', desc: 'Controlados com receita.', color: '#ec4899' },
    ]
  },
  Higiene: {
    options: [
      { id: 'kit_banho', label: 'Kit Banho', desc: 'Sabonete, shampoo, condicionador.', color: '#14b8a6' },
      { id: 'saude_bucal', label: 'Saúde Bucal', desc: 'Pasta, escova, fio dental.', color: '#0d9488' },
      { id: 'higiene_intima', label: 'Higiene Íntima', desc: 'Absorventes e protetores.', color: '#ec4899' },
      { id: 'fraldas_infantis', label: 'Fraldas Infantis', desc: 'Tamanhos P ao XXG.', color: '#6366f1' },
      { id: 'fraldas_geriatricas', label: 'Fraldas Geriátricas', desc: 'Uso adulto (M, G, GG).', color: '#8b5cf6' },
      { id: 'limpeza_casa', label: 'Limpeza Casa', desc: 'Detergente, sabão pó, amaciante.', color: '#059669' },
    ]
  },
  Contas: {
    options: [
      { id: 'conta_luz', label: 'Conta de Luz', desc: 'Evitar o desligamento imediato.', color: '#ef4444' },
      { id: 'conta_agua', label: 'Conta de Água', desc: 'Manter o abastecimento.', color: '#3b82f6' },
      { id: 'gas_cozinha', label: 'Gás de Cozinha', desc: 'Recarga de botijão 13kg.', color: '#f97316' },
      { id: 'apoio_aluguel', label: 'Apoio Aluguel', desc: 'Ajuda para evitar despejo.', color: '#dc2626' },
      { id: 'internet_estudo', label: 'Internet/Estudo', desc: 'Educação ou trabalho remoto.', color: '#6366f1' },
    ]
  },
  Emprego: {
    options: [
      { id: 'curriculo', label: 'Currículo', desc: 'Elaboração e impressão.', color: '#8b5cf6' },
      { id: 'qualificacao', label: 'Qualificação', desc: 'Cursos técnicos ou básicos.', color: '#7c3aed' },
      { id: 'epis_uniforme', label: 'EPIs/Uniforme', desc: 'Botinas, luvas ou roupas.', color: '#059669' },
      { id: 'ferramentas', label: 'Ferramentas', desc: 'Para pedreiro, eletricista, etc.', color: '#dc2626' },
    ]
  },
  Móveis: {
    options: [
      { id: 'cama_solteiro', label: 'Cama Solteiro', desc: 'Ou colchão de solteiro.', color: '#f59e0b' },
      { id: 'cama_casal', label: 'Cama Casal', desc: 'Ou colchão de casal.', color: '#d97706' },
      { id: 'berco', label: 'Berço', desc: 'Para recém-nascidos.', color: '#ec4899' },
      { id: 'armario_cozinha', label: 'Armário Cozinha', desc: 'Ou paneleiro.', color: '#059669' },
      { id: 'roupeiro', label: 'Roupeiro', desc: 'Guarda-roupa para o quarto.', color: '#6366f1' },
      { id: 'mesa_cadeiras', label: 'Mesa/Cadeiras', desc: 'Para refeições.', color: '#8b5cf6' },
    ]
  },
  Eletrodomésticos: {
    options: [
      { id: 'geladeira', label: 'Geladeira', desc: 'Fundamental para alimentos.', color: '#475569' },
      { id: 'fogao', label: 'Fogão', desc: 'Para preparo de refeições.', color: '#334155' },
      { id: 'maquina_lavar', label: 'Máquina Lavar', desc: 'Cuidado com as roupas.', color: '#0ea5e9' },
      { id: 'microondas', label: 'Micro-ondas', desc: 'Aquecimento rápido.', color: '#64748b' },
      { id: 'ventilador', label: 'Ventilador', desc: 'Para dias de calor.', color: '#06b6d4' },
    ]
  },
  Transporte: {
    options: [
      { id: 'passagens', label: 'Passagens', desc: 'Ônibus ou trem (TRI/TEU).', color: '#0ea5e9' },
      { id: 'bicicleta', label: 'Bicicleta', desc: 'Trabalho ou escola.', color: '#10b981' },
      { id: 'apoio_carona', label: 'Apoio Carona', desc: 'Consultas médicas.', color: '#ec4899' },
      { id: 'pecas_moto', label: 'Peças Moto', desc: 'Para quem trabalha com entrega.', color: '#f97316' },
    ]
  },
  Outros: {
    options: [
      { id: 'outros_ajuda', label: 'Outro tipo de ajuda', desc: 'Algo que não está nas categorias.', color: '#94a3b8' }
    ]
  }
};

const STORY_TEMPLATES = [
  { id: 'familia', label: 'Família', icon: <Users size={20} />, text: 'Preciso de ajuda com alimentos para minha família de [X] pessoas. Estamos passando por um momento difícil e qualquer contribuição de cesta básica seria muito bem-vinda.' },
  { id: 'saude', label: 'Saúde', icon: <Pill size={20} />, text: 'Estou precisando de ajuda para adquirir o medicamento [Nome] para uso contínuo. Não estou conseguindo arcar com os custos este mês devido a [Motivo].' },
  { id: 'emprego', label: 'Emprego', icon: <Briefcase size={20} />, text: 'Estou em busca de recolocação profissional e precisaria de ajuda com passagens de ônibus para comparecer a entrevistas ou ajuda para imprimir currículos.' },
];

const STEP_LABELS = ['Categoria', 'Detalhes', 'História', 'Urgência', 'Visibilidade', 'Confirmação'];
const TOTAL_STEPS = 6;

export function PrecisoDeAjudaDesktop() {
  const navigate = useNavigate();
  const { notifications, getUnreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSubModal, setSelectedSubModal] = useState(null);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [templateUsed, setTemplateUsed] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [isInconsistent, setIsInconsistent] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const stages = [
    'Verificando categoria e descrição',
    'Analisando urgência e contexto',
    'Validando dados de segurança',
    'Finalizando aprovação'
  ];

  const [formData, setFormData] = useState({
    category: '',
    subCategory: [],
    size: '',
    style: '',
    subQuestionAnswers: {},
    description: '',
    urgency: '',
    visibility: [],
    specialists: [],
    isPublic: true,
    radius: 5,
    userLocation: null,
    locationString: '',
    city: '',
    state: '',
    neighborhood: ''
  });

  const nextStep = useCallback(() => setStep(s => Math.min(s + 1, TOTAL_STEPS)), []);
  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const updateData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const updateSubAnswer = useCallback((questionId, value) => {
    setFormData(prev => ({
      ...prev,
      subQuestionAnswers: {
        ...prev.subQuestionAnswers,
        [questionId]: value
      }
    }));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications) {
        const notificationElement = document.querySelector('.pda-notifications');
        if (notificationElement && !notificationElement.contains(event.target)) {
          setShowNotifications(false);
        }
      }
      if (showUserMenu) {
        const userElement = document.querySelector('.pda-user-avatar');
        if (userElement && !userElement.contains(event.target)) {
          setShowUserMenu(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showUserMenu]);

  useEffect(() => {
    if (navigator.geolocation) {
      const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
      
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
              const bairro = address.suburb || address.neighbourhood || address.quarter || address.city_district || '';
              const cidade = address.city || address.town || address.village || address.municipality || '';
              const estado = address.state || address.region || '';
              
              let locationString = bairro ? `${bairro}, ` : '';
              locationString += `${cidade} - ${estado}`;
              
              updateData({ 
                userLocation: coords,
                locationString,
                city: cidade,
                state: estado,
                neighborhood: bairro
              });
            }
          } catch {
            setLocationError('Localização obtida, mas não foi possível determinar o endereço');
          }
        },
        () => {
          setLocationError('Não foi possível obter sua localização');
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
          updateData({ 
            userLocation: { lat: -23.5505, lng: -46.6333 },
            locationString: 'São Paulo, SP - Centro',
            city: 'São Paulo',
            state: 'SP',
            neighborhood: 'Centro'
          });
        },
        options
      );
    } else {
      setLocationError('Geolocalização não suportada');
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
      updateData({ 
        userLocation: { lat: -23.5505, lng: -46.6333 },
        locationString: 'São Paulo, SP - Centro',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro'
      });
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
        recognitionInstance.maxAlternatives = 1;

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
    if (!recognition) {
      alert("Seu navegador não suporta gravação de áudio por voz.");
      return;
    }

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
      const isIdentical = formData.description === templateUsed;
      if (hasBrackets || isIdentical) return false;
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
        await new Promise(resolve => setTimeout(resolve, 1500));
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
          state: formData.state,
          neighborhood: formData.neighborhood
        },
        isPublic: formData.isPublic,
        subQuestionAnswers: formData.subQuestionAnswers
      };
      
      // Import ApiService dynamically
      const { default: ApiService } = await import('../../../services/apiService');
      
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
      
      // Check if it's a validation error or server error
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

  const renderCategoryStep = () => (
    <div className="pda-compact-step">
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-primary)' }}>
          CATEGORIA PRINCIPAL
        </span>
        <h2>Qual o foco da sua necessidade?</h2>
        <p>A Solidar conecta você com vizinhos dispostos a ajudar. Escolha uma categoria para começar.</p>
      </div>

      <div className="pda-scroll-hint">
        <ChevronDown size={20} />
        <span>Role para baixo para ver todas as categorias</span>
      </div>

      <div className="pda-categories-grid-compact">
        {CATEGORIES.map((cat, index) => (
          <button
            key={cat.id}
            onClick={() => updateData({ category: cat.id, subCategory: [] })}
            className={`pda-cat-item ${formData.category === cat.id ? 'active' : ''}`}
            style={{ '--cat-color': cat.color }}
          >
            <div className="pda-cat-icon-box">
              {cat.icon}
            </div>
            <span className="pda-cat-text">{cat.label}</span>
            {formData.category === cat.id && (
              <div className="pda-selection-indicator">
                <Check size={14} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderDetailsStep = () => {
    const details = CATEGORY_DETAILS[formData.category];
    
    if (!details) return null;

    return (
      <div className="pda-compact-step">
        <div className="pda-step-intro">
          <span className="pda-step-badge" style={{ background: selectedCategory?.color }}>
            {formData.category.toUpperCase()} • DETALHES
          </span>
          <h2>O que exatamente<br/>você precisa?</h2>
          <p>Selecione um ou mais itens dentro da categoria {formData.category}.</p>
        </div>

        <div className="pda-scroll-hint">
          <ChevronDown size={20} />
          <span>Role para baixo para ver todas as opções</span>
        </div>

        <div className="pda-options-grid-v3">
          {details.options.map((opt, index) => (
            <button
              key={opt.id}
              onClick={() => updateData({ subCategory: toggleArrayItem(formData.subCategory, opt.id) })}
              className={`pda-opt-card-v3 ${formData.subCategory.includes(opt.id) ? 'active' : ''}`}
              style={{ '--opt-color': opt.color }}
            >
              <div className="pda-opt-check-v3">
                {formData.subCategory.includes(opt.id) && <Check size={14} />}
              </div>
              <div className="pda-opt-body-v3">
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDescriptionStep = () => (
    <div className="pda-compact-step">
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-dark)' }}>
          HISTÓRIA E CONTEXTO
        </span>
        <h2>Conte sua<br/>história</h2>
        <p>A ajuda vem mais rápido quando as pessoas entendem o motivo e o contexto.</p>
      </div>

      <div className="pda-story-container-v4">
        <div className="pda-story-main-v4">
          <div className="pda-input-wrapper-v4">
            <textarea
              placeholder="Descreva sua necessidade aqui com o máximo de detalhes possível..."
              value={formData.description}
              onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
              className="pda-textarea-v4"
            />
            
            <div className="pda-textarea-footer-v4">
              <div className="pda-voice-action-v4">
                <button
                  onClick={toggleRecording}
                  className={`pda-mic-btn-v4 ${isRecording ? 'recording' : ''}`}
                >
                  {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                  {isRecording && <span className="pda-recording-pulse" />}
                </button>
                <span className="pda-voice-label-v4">
                  {isRecording ? 'Ouvindo...' : 'Ditar história'}
                </span>
              </div>

              <div className="pda-char-counter-v4">
                <div className="pda-counter-progress-v4">
                  <div 
                    className="pda-counter-fill-v4"
                    style={{ 
                      width: `${(formData.description.length / 500) * 100}%`,
                      background: formData.description.length > 450 ? 'var(--pda-danger)' : 
                                 formData.description.length > 400 ? 'var(--pda-warning)' : 
                                 'var(--pda-primary)' 
                    }}
                  />
                </div>
                <span>{formData.description.length}/500</span>
              </div>
            </div>
          </div>

          <div className="pda-templates-section-v4">
            <div className="pda-section-label-v4">
              <Sparkles size={16} />
              SUGESTÕES DE TEXTO
            </div>
            <div className="pda-templates-grid-v4">
              {STORY_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  className={`pda-template-card-v4 ${templateUsed === t.text ? 'active' : ''}`}
                  onClick={() => {
                    updateData({ description: t.text });
                    setTemplateUsed(t.text);
                  }}
                >
                  <div className="pda-template-icon-v4">{t.icon}</div>
                  <div className="pda-template-info-v4">
                    <strong>{t.label}</strong>
                    <span>Usar modelo</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pda-story-tips-v4">
          <div className="pda-tips-header-v4">
            <Lightbulb size={20} />
            Dicas para uma boa história
          </div>
          <ul className="pda-tips-list-v4">
            <li><strong>Seja específico:</strong> Diga exatamente o que aconteceu e por que precisa de ajuda agora.</li>
            <li><strong>Mencione a urgência:</strong> Se houver um prazo crítico (ex: despejo, remédio acabando), deixe claro.</li>
            <li><strong>Tamanho da família:</strong> Informe quantas pessoas serão beneficiadas.</li>
            <li><strong>Fotos ajudam:</strong> Após publicar, você poderá adicionar fotos para aumentar a confiança.</li>
          </ul>
          
          <div className="pda-security-badge-v4">
            <ShieldCheck size={18} />
            Sua história será analisada por nossa IA de segurança antes de ser publicada.
          </div>
        </div>
      </div>
    </div>
  );

  const renderUrgencyStep = () => (
    <div className="pda-compact-step">
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-danger)' }}>
          PRIORIDADE DO PEDIDO
        </span>
        <h2>Qual a urgência<br/>do seu pedido?</h2>
        <p>A escala de prioridade ajuda doadores e voluntários a agirem no tempo certo.</p>
      </div>

      <div className="pda-urgency-container-v3">
        <div className="pda-urgency-scale-v3">
          <div 
            className="pda-urgency-scale-fill-v3" 
            style={{ 
              height: formData.urgency === 'critico' ? '100%' : 
                      formData.urgency === 'urgente' ? '80%' : 
                      formData.urgency === 'moderada' ? '60%' : 
                      formData.urgency === 'tranquilo' ? '40%' : 
                      formData.urgency === 'recorrente' ? '20%' : '10%'
            }}
          />
          <span className="pda-urgency-level-label" style={{ top: '10%' }}>Crítico</span>
          <span className="pda-urgency-level-label" style={{ top: '50%' }}>Moderado</span>
          <span className="pda-urgency-level-label" style={{ top: '90%' }}>Baixo</span>
        </div>

        <div className="pda-urgency-grid-v3">
          {URGENCY_OPTIONS.map((opt, index) => (
            <button
              key={opt.id}
              onClick={() => updateData({ urgency: opt.id })}
              className={`pda-urgency-card-v3 ${formData.urgency === opt.id ? 'active' : ''}`}
              style={{ '--urg-color': opt.color }}
            >
              <div className="pda-urg-icon-v3">
                {opt.icon}
              </div>
              <div className="pda-urg-body-v3">
                <strong>{opt.label}</strong>
                <p>{opt.desc}</p>
                <div className="pda-urg-examples">
                  <span className="pda-examples-label">Exemplos:</span>
                  <ul>
                    {opt.examples.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="pda-urg-check-v3">
                {formData.urgency === opt.id && <Check size={18} />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVisibilityStep = () => (
    <div className="pda-compact-step">
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-info)' }}>
          ALCANCE GEOGRÁFICO
        </span>
        <h2>Quem deve ver<br/>o seu pedido?</h2>
        <p>Defina o raio de alcance para que as pessoas próximas sejam notificadas.</p>
      </div>

      <div className="pda-vis-container-v4">
        <div className="pda-vis-options-v4">
          {VISIBILITY_OPTIONS.map((opt, index) => (
            <button
              key={opt.id}
              onClick={() => {
                const newRadius = opt.id === 'bairro' ? 2 : opt.id === 'proximos' ? 10 : opt.id === 'todos' ? 50 : 5;
                updateData({ 
                  visibility: toggleArrayItem(formData.visibility, opt.id),
                  radius: newRadius
                });
              }}
              className={`pda-vis-card-v4 ${formData.visibility.includes(opt.id) ? 'active' : ''}`}
              style={{ '--vis-color': opt.color }}
            >
              <div className="pda-vis-icon-v4">
                {opt.icon}
              </div>
              <div className="pda-vis-body-v4">
                <strong>{opt.label}</strong>
                <p>{opt.desc}</p>
              </div>
              <div className="pda-vis-check-v4">
                {formData.visibility.includes(opt.id) && <Check size={16} />}
              </div>
            </button>
          ))}
        </div>

        <div className="pda-vis-map-section-v4">
          <MapaAlcance 
            radius={formData.radius} 
            onRadiusChange={(r) => updateData({ radius: r })}
            userLocation={formData.userLocation}
          />
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="pda-compact-step">
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-success)' }}>
          RESUMO FINAL
        </span>
        <h2>Tudo certo?</h2>
        <p>Revise os detalhes antes de publicar seu pedido na rede Solidar.</p>
      </div>

      <div className="pda-review-card-v2">
        <div className="pda-review-quote">
          <p>{formData.description}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="pda-location-indicator">
            <MapPin size={16} /> {formData.locationString}
          </div>
          <div className="pda-location-indicator" style={{ background: selectedUrgency?.color + '20', color: selectedUrgency?.color }}>
            <Target size={16} /> Urgência: {selectedUrgency?.label}
          </div>
          <div className="pda-location-indicator" style={{ background: selectedCategory?.color + '20', color: selectedCategory?.color }}>
            {selectedCategory?.icon} {formData.category}
          </div>
        </div>
      </div>
    </div>
  );

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
    <div className="pda-novo-pedido-container">
      {isAnalyzing && <AnalyzingModal stages={stages} analysisStage={analysisStage} />}
      
      {isPublished && <SuccessModal urgencyColor={selectedUrgency?.color || '#f97316'} urgencyLabel={selectedUrgency?.label || ''} urgencyIcon={selectedUrgency?.icon} reason={analysis?.reason || ''} onClose={() => navigate('/')} />}
      {isInconsistent && <InconsistentModal onEdit={() => { setIsInconsistent(false); setStep(3); }} onClose={() => navigate('/')} />}

      <div className="pda-wizard-box-v2">
        <div className="pda-wizard-sidebar-v2">
          <div className="pda-sidebar-header-v2">
            <div className="pda-brand-wrapper">
              <div className="pda-logo-container">
                <Heart size={32} color="white" fill="white" />
              </div>
              <div className="pda-sidebar-brand-v2">
                <h3>Solidar</h3>
                <span>{formData.city || 'Sua Localização'}</span>
              </div>
            </div>
          </div>
          
          <div className="pda-sidebar-steps-v2">
            {STEP_LABELS.map((label, i) => (
              <div 
                key={i} 
                className={`pda-step-indicator-v3 ${i + 1 === step ? 'active' : i + 1 < step ? 'completed' : ''}`}
                onClick={() => i + 1 < step && setStep(i + 1)}
              >
                <div className="pda-indicator-dot-v3">
                  {i + 1 < step ? <Check size={20} /> : i + 1}
                </div>
                <div className="pda-indicator-info-v3">
                  <span className="pda-indicator-step-v3">PASSO {i + 1}</span>
                  <span className="pda-indicator-label-v3">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pda-sidebar-footer-v2">
            <div className="pda-progress-info-v2">
              <span>Progresso</span>
              <strong>{Math.round((step / TOTAL_STEPS) * 100)}%</strong>
            </div>
            <div className="pda-progress-bar-v2">
              <div 
                className="pda-progress-fill-v2" 
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            
            <div className="pda-user-section">
              <div className="pda-user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="pda-avatar-image">
                  <User size={18} />
                </div>
                <div className="pda-user-info">
                  <span className="pda-user-name">Usuário</span>
                  <span className="pda-user-status">Online</span>
                </div>
                
                {showUserMenu && (
                  <div className="pda-user-dropdown">
                    <button 
                      className="pda-menu-item"
                      onClick={() => {
                        navigate('/conversas');
                        setShowUserMenu(false);
                      }}
                    >
                      💬 Conversas
                    </button>
                    <button 
                      className="pda-menu-item"
                      onClick={() => {
                        navigate('/perfil');
                        setShowUserMenu(false);
                      }}
                    >
                      👤 Perfil
                    </button>
                    <button 
                      className="pda-menu-item pda-logout-btn"
                      onClick={() => {
                        localStorage.removeItem('solidar-user');
                        window.location.reload();
                      }}
                    >
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
              
              <div className="pda-notifications">
                <button 
                  className="pda-notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#dcb000ff" stroke="none">
                    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
                  </svg>
                  {getUnreadCount() > 0 && (
                    <span className="pda-notification-badge">{getUnreadCount()}</span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="pda-notification-dropdown">
                    <div className="pda-notification-header">
                      <h3>Notificações</h3>
                      {notifications.length > 0 && (
                        <div className="pda-notification-actions">
                          {getUnreadCount() > 0 && (
                            <button 
                              className="pda-action-btn pda-mark-read-btn"
                              onClick={markAllAsRead}
                              title="Marcar todas como lidas"
                            >
                              ✓
                            </button>
                          )}
                          <button 
                            className="pda-action-btn pda-clear-btn"
                            onClick={clearNotifications}
                            title="Limpar todas"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="pda-notification-list">
                      {notifications.length === 0 ? (
                        <div className="pda-no-notifications">
                          Nenhuma notificação ainda
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`pda-notification-item ${notification.read ? 'read' : 'unread'}`}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id);
                              }
                            }}
                          >
                            <div className="pda-notification-content">
                              <div className="pda-notification-icon">
                                {notification.type === 'chat' ? '💬' : '🔔'}
                              </div>
                              <div className="pda-notification-text">
                                <p className="pda-notification-title">{notification.title}</p>
                                <p className="pda-notification-message">{notification.message}</p>
                                <span className="pda-notification-time">
                                  {new Date(notification.timestamp).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                            {!notification.read && <div className="pda-unread-dot"></div>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pda-wizard-content-v2">
          <div className="pda-global-progress-container">
            <div 
              className="pda-global-progress-fill" 
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          <div className="pda-step-indicator-overlay">
            PASSO <strong>{step}</strong> / {TOTAL_STEPS}
          </div>

          <div className="pda-content-body-v2">
            <div className="pda-step-container-v2">
              <div className="pda-step-motion-container">
                {renderStepContent()}
              </div>
            </div>
          </div>

          <div className="pda-content-actions-v2">
            <button 
              onClick={step === 1 ? () => navigate('/') : prevStep} 
              className="pda-btn-v2 pda-btn-ghost"
            >
              <ChevronLeft size={20} /> VOLTAR
            </button>
            
            {step < TOTAL_STEPS ? (
              <button 
                onClick={nextStep} 
                disabled={!isStepValid} 
                className="pda-btn-v2 pda-btn-primary"
              >
                CONTINUAR <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                onClick={handlePublish} 
                disabled={isSubmitting} 
                className="pda-btn-v2 pda-btn-primary"
                style={{ background: 'var(--pda-success)' }}
              >
                {isSubmitting ? 'PUBLICANDO...' : 'PUBLICAR PEDIDO'} <Rocket size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrecisoDeAjudaDesktop;