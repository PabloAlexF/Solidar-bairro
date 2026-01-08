import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/apiService';
import { AnalyzingModal, InconsistentModal, SuccessModal } from '../components/ui/modals';
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
  Map as MapIcon,
  Globe
} from 'lucide-react';
import MapaAlcance from '../components/MapaAlcance';
import '../styles/pages/PrecisoDeAjuda-main.css';

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

const SPECIALISTS = [
  { id: 'medicos', label: 'Médicos/Saúde', icon: <Pill size={16} />, color: '#10b981' },
  { id: 'advogados', label: 'Advogados/Jurídico', icon: <ShieldCheck size={16} />, color: '#3b82f6' },
  { id: 'psicologos', label: 'Psicólogos', icon: <Heart size={16} />, color: '#ec4899' },
  { id: 'assistentes', label: 'Assistentes Sociais', icon: <Users size={16} />, color: '#8b5cf6' },
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
          { 
            id: 'itens_cesta', 
            label: 'Itens de maior necessidade?', 
            type: 'chips', 
            options: ['Arroz', 'Feijão', 'Óleo', 'Açúcar', 'Café', 'Leite', 'Macarrão', 'Sal', 'Farinha'] 
          },
          { 
            id: 'familia', 
            label: 'Tamanho da Família?', 
            type: 'select', 
            options: ['1-2 pessoas', '3-4 pessoas', '5 ou mais'] 
          },
          {
            id: 'restricao',
            label: 'Alguma restrição alimentar?',
            type: 'input',
            placeholder: 'Ex: Diabético, Intolerante a Lactose...'
          }
        ]
      },
      { 
        id: 'proteinas', 
        label: 'Proteínas & Ovos', 
        desc: 'Carne, frango, ovos e peixe.', 
        color: '#ef4444',
        contextInfo: 'Proteínas são fundamentais para o sistema imunológico e a manutenção da massa muscular, especialmente em crianças.',
        subQuestions: [
          { 
            id: 'tipo_proteina', 
            label: 'Qual a preferência?', 
            type: 'chips', 
            options: ['Frango', 'Ovos', 'Carne Bovina', 'Peixe', 'Porco'] 
          },
          {
            id: 'armazenamento_prot',
            label: 'Possui geladeira ou congelador?',
            type: 'select',
            options: ['Sim', 'Não', 'Espaço limitado']
          }
        ]
      },
      { 
        id: 'frescos', 
        label: 'Hortifruti', 
        desc: 'Frutas, legumes e verduras.', 
        color: '#10b981',
        contextInfo: 'Alimentos frescos são as melhores fontes de vitaminas e minerais essenciais para o desenvolvimento.',
        subQuestions: [
          { 
            id: 'tipo_fresco', 
            label: 'O que mais precisa?', 
            type: 'chips', 
            options: ['Legumes', 'Frutas', 'Verduras', 'Temperos Verdes'] 
          }
        ]
      },
      { 
        id: 'padaria', 
        label: 'Padaria & Laticínios', 
        desc: 'Pão, leite, queijo e café.', 
        color: '#f59e0b',
        contextInfo: 'O café da manhã é uma das refeições mais importantes para manter a energia e o foco durante o dia.',
        subQuestions: [
          { 
            id: 'itens_padaria', 
            label: 'Itens desejados?', 
            type: 'chips', 
            options: ['Pão de Forma', 'Pão Francês', 'Leite Integral', 'Manteiga/Marg.', 'Queijo/Frios', 'Café', 'Achocolatado'] 
          }
        ]
      },
      { 
        id: 'infantil', 
        label: 'Bebês & Crianças', 
        desc: 'Fórmulas, papinhas e fraldas.', 
        color: '#6366f1',
        contextInfo: 'A nutrição adequada nos primeiros anos de vida é crucial para o desenvolvimento cognitivo e físico.',
        subQuestions: [
          { 
            id: 'fralda', 
            label: 'Tamanho da Fralda?', 
            type: 'select', 
            options: ['RN', 'P', 'M', 'G', 'GG', 'XG'] 
          },
          { 
            id: 'leite_especial', 
            label: 'Leite ou Fórmula Específica?', 
            type: 'input', 
            placeholder: 'Ex: Nan Soy, Aptamil, etc.' 
          },
          {
            id: 'idade_crianca',
            label: 'Idade da criança?',
            type: 'input',
            placeholder: 'Ex: 6 meses'
          }
        ]
      },
      { 
        id: 'lanches', 
        label: 'Lanches & Merenda', 
        desc: 'Biscoitos, sucos e práticos.', 
        color: '#ec4899',
        contextInfo: 'Itens práticos ajudam na alimentação escolar e fornecem energia rápida para quem trabalha fora.',
        subQuestions: [
          { 
            id: 'tipo_lanche', 
            label: 'Preferência?', 
            type: 'chips', 
            options: ['Biscoitos Doces', 'Biscoitos Salgados', 'Sucos de Caixinha', 'Gelatina', 'Pipoca'] 
          }
        ]
      },
      { 
        id: 'cozinha', 
        label: 'Temperos & Cozinha', 
        desc: 'Óleo, sal, açúcar e temperos.', 
        color: '#475569',
        contextInfo: 'Temperos e itens básicos de cozinha permitem preparar uma variedade de pratos com dignidade e sabor.',
        subQuestions: [
          { 
            id: 'itens_coz', 
            label: 'O que falta?', 
            type: 'chips', 
            options: ['Óleo', 'Sal', 'Açúcar', 'Extrato Tomate', 'Vinagre', 'Caldo de Galinha/Carne'] 
          }
        ]
      },
      { 
        id: 'prontas', 
        label: 'Refeições Prontas', 
        desc: 'Marmitas e consumo imediato.', 
        color: '#f43f5e',
        contextInfo: 'Opção ideal para situações de emergência onde não há meios para cozinhar no momento.'
      },
    ]
  },
  Roupas: {
    options: [
      { id: 'blusas', label: 'Blusas/Camisetas', desc: 'Peças para o tronco.', color: '#3b82f6' },
      { id: 'calcas', label: 'Calças/Bermudas', desc: 'Peças para as pernas.', color: '#2563eb' },
      { id: 'agasalhos', label: 'Agasalhos', desc: 'Casacos e blusas de frio.', color: '#1e40af', contextInfo: 'Agasalhos de lã ou sintéticos ajudam muito em frentes frias.' },
      { 
        id: 'escolar', 
        label: 'Uniforme Escolar', 
        desc: 'Roupas para escola.', 
        color: '#6366f1',
        contextInfo: 'Estar uniformizado ajuda na integração da criança no ambiente escolar e evita o desgaste de roupas civis.',
        subQuestions: [
          { id: 'serie_escolar', label: 'Série/Idade?', type: 'input', placeholder: 'Ex: 3º ano / 8 anos' },
          { id: 'escola_nome', label: 'Nome da Escola (se necessário)', type: 'input', placeholder: 'Ex: Escola Municipal...' }
        ]
      },
    ],
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'EXG', 'Infantil'],
    styles: ['Masculino', 'Feminino', 'Unissex', 'Infantil']
  },
  Medicamentos: {
    options: [
      { 
        id: 'analgesico', 
        label: 'Analgésicos', 
        desc: 'Para dor e febre.', 
        color: '#10b981',
        contextInfo: 'Sempre verifique a data de validade e nunca se automedique sem orientação básica.',
        subQuestions: [
          { id: 'medicamento_nome', label: 'Nome do Medicamento', type: 'input', placeholder: 'Ex: Paracetamol, Dipirona...' }
        ]
      },
      { 
        id: 'continuo', 
        label: 'Uso Contínuo', 
        desc: 'Pressão, diabetes, etc.', 
        color: '#059669',
        contextInfo: 'Atenção: A interrupção de tratamentos contínuos pode agravar doenças crônicas rapidamente.',
        subQuestions: [
          { id: 'receita', label: 'Possui receita médica?', type: 'select', options: ['Sim, atualizada', 'Sim, vencida', 'Não possuo'] },
          { id: 'med_continuo', label: 'Qual o medicamento?', type: 'input', placeholder: 'Ex: Losartana, Metformina...' },
          { id: 'dosagem', label: 'Dosagem (mg)?', type: 'input', placeholder: 'Ex: 50mg, 100mg...' }
        ]
      },
    ]
  },
  Higiene: {
    options: [
      { 
        id: 'banho', 
        label: 'Banho & Corpo', 
        desc: 'Sabonete, shampoo, etc.', 
        color: '#14b8a6',
        contextInfo: 'A higiene corporal básica previne doenças de pele e contribui para o bem-estar mental.',
        subQuestions: [
          { id: 'itens_banho', label: 'O que falta?', type: 'chips', options: ['Sabonete', 'Shampoo', 'Condicionador', 'Desodorante', 'Papel Higiênico', 'Lâmina de Barbear'] }
        ]
      },
      { id: 'bucal', label: 'Higiene Bucal', desc: 'Pasta, escova, fio dental.', color: '#0d9488' },
      { id: 'feminina', label: 'Saúde Feminina', desc: 'Absorventes e higiene.', color: '#ec4899' },
    ]
  },
  Contas: {
    options: [
      { 
        id: 'luz', 
        label: 'Energia Elétrica', 
        desc: 'Conta de luz atrasada.', 
        color: '#ef4444',
        contextInfo: 'Se você recebe Bolsa Família ou tem baixa renda, pode ter direito a até 65% de desconto na luz (Tarifa Social).',
        subQuestions: [
          { id: 'valor_luz', label: 'Valor aproximado (R$)?', type: 'input', placeholder: 'Ex: 150,00' },
          { id: 'atraso_luz', label: 'Meses em atraso?', type: 'select', options: ['1 mês', '2 meses', '3 ou mais', 'Aviso de corte'] }
        ]
      },
      { id: 'agua', label: 'Água / Saneamento', desc: 'Conta de água.', color: '#3b82f6' },
      { id: 'gas', label: 'Botijão de Gás', desc: 'Para cozinhar alimentos.', color: '#f97316' },
    ]
  },
  Emprego: {
    options: [
      { 
        id: 'curriculo', 
        label: 'Currículo Profissional', 
        desc: 'Ajuda para criar ou imprimir.', 
        color: '#8b5cf6',
        contextInfo: 'Destaque suas experiências, mesmo as informais. Um bom currículo abre portas inesperadas.',
        subQuestions: [
          { id: 'tipo_curr', label: 'Qual a ajuda exata?', type: 'select', options: ['Criar um do zero', 'Revisar o atual', 'Apenas imprimir'] }
        ]
      },
      { id: 'vagas', label: 'Busca de Vagas', desc: 'Indicação de oportunidades.', color: '#7c3aed' },
    ]
  },
  Móveis: {
    options: [
      { 
        id: 'cama', 
        label: 'Cama/Colchão', 
        desc: 'Para dormir com dignidade.', 
        color: '#f59e0b',
        contextInfo: 'Um sono de qualidade é essencial para a saúde física e mental de adultos e crianças.',
        subQuestions: [
          { id: 'tipo_cama', label: 'Qual o tipo?', type: 'select', options: ['Solteiro', 'Casal', 'Berço', 'Apenas Colchão'] }
        ]
      },
      { id: 'mesa', label: 'Mesa & Cadeiras', desc: 'Para refeições e estudo.', color: '#d97706' },
    ]
  },
  Eletrodomésticos: {
    options: [
      { 
        id: 'geladeira', 
        label: 'Geladeira', 
        desc: 'Conservação de alimentos.', 
        color: '#475569',
        contextInfo: 'Evite abrir a geladeira sem necessidade para economizar energia e manter os alimentos frescos.',
        subQuestions: [
          { id: 'volts_geladeira', label: 'Qual a voltagem necessária?', type: 'select', options: ['110v', '220v', 'Bivolt'] }
        ]
      },
      { id: 'fogao', label: 'Fogão', desc: 'Para cozinhar refeições.', color: '#334155' },
    ]
  },
  Transporte: {
    options: [
      { 
        id: 'passagem', 
        label: 'Passagem Urbana', 
        desc: 'Ônibus, metrô ou trem.', 
        color: '#0ea5e9',
        contextInfo: 'Muitos municípios oferecem gratuidade ou passe social para desempregados e estudantes.',
        subQuestions: [
          { id: 'tipo_transp', label: 'Tipo de transporte?', type: 'chips', options: ['Ônibus', 'Metrô', 'Trem', 'Uber/Taxi (Emergência)'] },
          { id: 'freq_transp', label: 'Frequência da ajuda?', type: 'select', options: ['Única vez', 'Semanal', 'Mensal'] }
        ]
      },
      { id: 'bike', label: 'Bicicleta', desc: 'Para trabalho ou estudo.', color: '#10b981' },
    ]
  },
  Outros: {
    options: [
      { 
        id: 'outros_ajuda', 
        label: 'Outro tipo de ajuda', 
        desc: 'Algo que não está nas categorias.', 
        color: '#94a3b8',
        subQuestions: [
          { id: 'especifique', label: 'O que exatamente você precisa?', type: 'input', placeholder: 'Descreva brevemente aqui...' }
        ]
      }
    ]
  }
};

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

export default function PrecisoDeAjuda() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSubModal, setSelectedSubModal] = useState(null);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [subQuestionAnswers, setSubQuestionAnswers] = useState({});
  const [templateUsed, setTemplateUsed] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  
  // Estados para análise de IA
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

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Não foi possível obter sua localização');
          // Default to São Paulo center if location fails
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        }
      );
    } else {
      setLocationError('Geolocalização não suportada');
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'pt-BR';
        recognitionInstance.maxAlternatives = 1;

        let finalTranscript = '';
        let isProcessing = false;

        recognitionInstance.onstart = () => {
          finalTranscript = '';
          isProcessing = false;
        };

        recognitionInstance.onresult = (event) => {
          if (isProcessing) return;
          isProcessing = true;
          
          const transcript = event.results[0][0].transcript.trim();
          if (transcript && transcript !== finalTranscript) {
            finalTranscript = transcript;
            setFormData(prev => ({ 
              ...prev, 
              description: prev.description ? `${prev.description} ${transcript}` : transcript
            }));
          }
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
          isProcessing = false;
        };
        
        recognitionInstance.onerror = (event) => {
          setIsRecording(false);
          isProcessing = false;
          console.log('Erro na gravação de voz:', event.error);
        };

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
      try {
        recognition.stop();
      } catch (error) {
        console.log('Erro ao parar gravação:', error);
      }
      setIsRecording(false);
    } else {
      try {
        // Garantir que não há gravação ativa
        recognition.abort();
        setTimeout(() => {
          recognition.start();
          setIsRecording(true);
        }, 100);
      } catch (error) {
        console.log('Erro ao iniciar gravação:', error);
        setIsRecording(false);
      }
    }
  };
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
    radius: 5
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
    
    // Simular análise de IA
    for (let i = 0; i < stages.length; i++) {
      setAnalysisStage(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Simular resultado da análise
    const isValid = Math.random() > 0.2; // 80% de chance de aprovação
    
    setIsAnalyzing(false);
    
    if (isValid) {
      setAnalysis({
        reason: 'Pedido validado com sucesso. Todas as informações estão claras e condizem com a categoria selecionada.'
      });
      setIsPublished(true);
      
      try {
        const pedidoData = {
          category: formData.category,
          subCategory: formData.subCategory,
          size: formData.size,
          style: formData.style,
          subQuestionAnswers: formData.subQuestionAnswers,
          description: formData.description,
          urgency: formData.urgency,
          visibility: formData.visibility,
          specialists: formData.specialists,
          isPublic: formData.isPublic,
          radius: formData.radius
        };
        
        await apiService.createPedido(pedidoData);
      } catch (error) {
        console.error('Erro ao salvar pedido:', error);
      }
    } else {
      setIsInconsistent(true);
    }
    
    setIsSubmitting(false);
  }, [formData, stages]);

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
            onClick={() => updateData({ category: cat.id, subCategory: [] })}
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

  const toggleArrayItem = useCallback((array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
  }, []);

  const renderDetailsStep = () => {
    const details = CATEGORY_DETAILS[formData.category];
    
    if (!details) {
      return (
        <div className="compact-step centered">
          <div className="skip-box color-fade">
            <div className="skip-icon-wrapper" style={{ background: selectedCategory?.color }}>
              <Layers size={32} color="white" />
            </div>
            <h3>Categoria: {formData.category}</h3>
            <p>Esta categoria não possui sub-escolhas. Clique em próximo para continuar.</p>
          </div>
        </div>
      );
    }

    const handleToggleSub = (id) => {
      const opt = details.options.find(o => o.id === id);
      const isAlreadySelected = formData.subCategory.includes(id);
      const newSubCategory = toggleArrayItem(formData.subCategory, id);
      updateData({ subCategory: newSubCategory });
      
      if (!isAlreadySelected && opt?.subQuestions) {
        setSelectedSubModal(id);
      }
    };

    const subOptModal = selectedSubModal 
      ? details.options.find(o => o.id === selectedSubModal) 
      : null;

    return (
      <div className="compact-step">
        <div className="step-intro">
          <span className="step-badge" style={{ background: selectedCategory?.color }}>Passo 02</span>
          <h2>O que exatamente?</h2>
          <p>Selecione as opções desejadas em <strong>{formData.category}</strong>.</p>
        </div>
        
        <div className="step-2-v3-layout">
          <div className="options-grid-v3">
            {details.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleToggleSub(opt.id)}
                className={`opt-card-v3 ${formData.subCategory.includes(opt.id) ? 'active' : ''}`}
                style={{ '--opt-color': opt.color }}
              >
                <div className="opt-check-v3">
                  {formData.subCategory.includes(opt.id) && <Check size={14} />}
                </div>
                <div className="opt-body-v3">
                  <strong>{opt.label}</strong>
                  <span>{opt.desc}</span>
                </div>
                {opt.subQuestions && formData.subCategory.includes(opt.id) && (
                  <div 
                    className="opt-edit-badge" 
                    onClick={(e) => { e.stopPropagation(); setSelectedSubModal(opt.id); }}
                  >
                    <PenTool size={10} /> Editar
                  </div>
                )}
              </button>
            ))}
          </div>

          {details.sizes && (
            <button 
              className="btn-specs-trigger"
              onClick={() => setShowSpecsModal(true)}
              style={{ '--cat-color': selectedCategory?.color }}
            >
              <div className="trigger-info">
                <Maximize2 size={20} />
                <div className="text">
                  <strong>Especificações Gerais</strong>
                  <span>{formData.size || 'Tamanho'} • {formData.style || 'Preferência'}</span>
                </div>
              </div>
              <ChevronLeft size={20} className="rotate-icon" />
            </button>
          )}
        </div>

        {/* Modal de Especificações */}
        <AnimatePresence>
          {showSpecsModal && (
            <motion.div 
              className="modal-overlay" 
              onClick={() => setShowSpecsModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="sub-modal-v3 specs-modal"
                style={{ '--modal-color': selectedCategory?.color }}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              <div className="modal-header">
                <div className="header-info">
                  <h3>Especificações Gerais</h3>
                  <p>Defina o tamanho e a preferência para o seu pedido.</p>
                </div>
                <button className="close-btn" onClick={() => setShowSpecsModal(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="specs-modal-content">
                  <div className="spec-item">
                    <label className="q-label"><Maximize2 size={16} /> Qual o tamanho?</label>
                    <div className="chips-grid">
                      {details.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => updateData({ size: s })}
                          className={`chip-item ${formData.size === s ? 'active' : ''}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {details.styles && (
                    <div className="spec-item" style={{ marginTop: '24px' }}>
                      <label className="q-label"><User size={16} /> Qual a preferência?</label>
                      <div className="chips-grid">
                        {details.styles.map((s) => (
                          <button
                            key={s}
                            onClick={() => updateData({ style: s })}
                            className={`chip-item ${formData.style === s ? 'active' : ''}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-v3 btn-modal-done"
                  onClick={() => setShowSpecsModal(false)}
                >
                  Concluir <Check size={18} />
                </button>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de Subperguntas */}
        <AnimatePresence>
          {selectedSubModal && subOptModal && (
            <motion.div 
              className="modal-overlay" 
              onClick={() => setSelectedSubModal(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="sub-modal-v3"
                style={{ '--modal-color': subOptModal.color }}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
              <div className="modal-header">
                <div className="header-info">
                  <h3>Detalhes: {subOptModal.label}</h3>
                  <p>{subOptModal.desc}</p>
                </div>
                <button className="close-btn" onClick={() => setSelectedSubModal(null)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body scrollable-modal-content">
                {subOptModal.contextInfo && (
                  <div className="modal-context-info">
                    <Lightbulb size={20} className="info-icon" />
                    <p>{subOptModal.contextInfo}</p>
                  </div>
                )}
                <div className="sub-q-grid-layout">
                  {subOptModal.subQuestions?.map((q) => (
                    <div key={q.id} className="q-item">
                      <label className="q-label">{q.label}</label>
                      
                      {q.type === 'chips' && q.options && (
                        <div className="chips-grid">
                          {q.options.map((opt) => {
                            const currentAnswers = (formData.subQuestionAnswers[q.id] || []);
                            const isActive = Array.isArray(currentAnswers) ? currentAnswers.includes(opt) : false;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  const current = formData.subQuestionAnswers[q.id] || [];
                                  const next = isActive 
                                    ? current.filter(a => a !== opt)
                                    : [...current, opt];
                                  updateSubAnswer(q.id, next);
                                }}
                                className={`chip-item ${isActive ? 'active' : ''}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'select' && q.options && (
                        <div className="chips-grid">
                          {q.options.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => updateSubAnswer(q.id, opt)}
                              className={`chip-item ${formData.subQuestionAnswers[q.id] === opt ? 'active' : ''}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.type === 'input' && (
                        <input 
                          type="text"
                          placeholder={q.placeholder}
                          value={formData.subQuestionAnswers[q.id] || ''}
                          onChange={(e) => updateSubAnswer(q.id, e.target.value)}
                          className="sub-input-v3"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-v3 btn-modal-done"
                  onClick={() => setSelectedSubModal(null)}
                >
                  Concluir <Check size={18} />
                </button>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

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
            
            <button 
              className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              title={isRecording ? "Parar Gravação" : "Gravar com Voz"}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              <span>{isRecording ? 'Ouvindo...' : 'Falar (Gravar Voz)'}</span>
            </button>
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
        <p>Defina o alcance geográfico e o público-alvo da sua solicitação.</p>
      </div>

      <div className="visibility-layout-vertical-v4">
        <div className="vis-grid-v4">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateData({ visibility: toggleArrayItem(formData.visibility, opt.id) })}
              className={`vis-card-v4 ${formData.visibility.includes(opt.id) ? 'active' : ''}`}
              style={{ '--vis-color': opt.color }}
            >
              <div className="vis-icon-v4">{opt.icon}</div>
              <div className="vis-text-v4">
                <strong>{opt.label}</strong>
              </div>
            </button>
          ))}
        </div>

        <div className="vis-map-section-v4">
          <MapaAlcance 
            radius={formData.radius} 
            onRadiusChange={(r) => updateData({ radius: r })} 
          />
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => {
    const catColor = selectedCategory?.color;
    const details = CATEGORY_DETAILS[formData.category];
    
    return (
      <div className="compact-step">
        <div className="finish-header-v2">
          <div className="finish-check-v2"><Check size={32} /></div>
          <h2>Confirme seus dados</h2>
          <p>Veja como seu pedido aparecerá para os vizinhos.</p>
        </div>

        <div className="review-card-v2">
          <div className="review-main">
            <div className="review-tags">
              <span className="tag-v2" style={{ background: catColor + '15', color: catColor }}>{formData.category}</span>
              {selectedUrgency && (
                <span className="tag-v2" style={{ background: selectedUrgency.color + '15', color: selectedUrgency.color }}>
                  {selectedUrgency.icon} {formData.urgency.toUpperCase()}
                </span>
              )}
            </div>
            <div className="review-quote"><p>&ldquo;{formData.description}&rdquo;</p></div>
            {formData.subCategory.length > 0 && (
              <div className="review-details">
                <strong>Itens:</strong> {formData.subCategory.map(id => details?.options.find(o => o.id === id)?.label).join(', ')}
              </div>
            )}
          </div>
          <div className="review-meta">
            <div className="meta-item-v2"><MapPin size={16} /> <span>{formData.radius}km de alcance</span></div>
            <div className="meta-toggle-review">
              <label className="vis-switch-v3">
                <input type="checkbox" checked={formData.isPublic} onChange={(e) => updateData({ isPublic: e.target.checked })} />
                <div className="vis-switch-body-v3">
                  <div className="vis-switch-handle-v3">{formData.isPublic ? <Globe size={14} /> : <ShieldCheck size={14} />}</div>
                  <span>{formData.isPublic ? 'Pedido Público' : 'Pedido Privado'}</span>
                </div>
              </label>
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

  const selectedUrgencyData = URGENCY_OPTIONS.find(o => o.id === formData.urgency);
  const urgencyColor = selectedUrgencyData?.color || '#f59e0b';
  const urgencyLabel = selectedUrgencyData?.label || 'MODERADA';
  const urgencyIcon = selectedUrgencyData?.icon || <Calendar size={16} />;

  return (
    <div className="novo-pedido-container">
      <div className="bg-blobs">
        <div className="blob blob-orange" />
        <div className="blob blob-blue" />
      </div>

      {/* Visual de Análise (Assistente de IA) */}
      {isAnalyzing && (
        <AnalyzingModal stages={stages} analysisStage={analysisStage} />
      )}

      {/* Modal de Pedido Publicado */}
      {isPublished && (
        <SuccessModal
          urgencyColor={urgencyColor}
          urgencyLabel={urgencyLabel}
          urgencyIcon={urgencyIcon}
          reason={analysis?.reason || 'Pedido validado com sucesso'}
          onClose={() => navigate('/quero-ajudar')}
        />
      )}

      {/* Modal de Inconsistência */}
      {isInconsistent && (
        <InconsistentModal
          onEdit={() => { setIsInconsistent(false); setStep(3); }}
          onClose={() => navigate('/')}
        />
      )}

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
            <div className="step-container-v2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="step-motion-container"
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
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