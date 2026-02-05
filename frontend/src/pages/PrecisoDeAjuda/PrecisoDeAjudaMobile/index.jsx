import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyzingModal, InconsistentModal, SuccessModal } from '../modals';
import { ValidationModal } from './AIComponents'; // Agora usará o novo componente
import AnimatedParticles from '../AnimatedParticles';
import MobileHeader from '../../../components/layout/MobileHeader';
import { validateRequest } from './AIAssistant';
import { validateRequiredFields } from './SmartValidator'; // Mantido para validação básica
import { useNotifications } from '../../../contexts/NotificationContext';
import './styles.css';
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
  Rocket,
  Loader2
} from 'lucide-react';
import { SecurityUtils, geocodingRateLimiter } from '../../../utils/security';

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
      { id: 'cesta', label: 'Cesta Básica Completa', desc: 'Arroz, feijão, óleo, açúcar', color: '#f97316', contextInfo: 'Cesta básica alimenta família de 4 por ~15 dias.' },
      { id: 'cereais_graos', label: 'Cereais & Grãos', desc: 'Arroz, feijão, lentilha', color: '#d97706' },
      { id: 'proteinas_carnes', label: 'Carnes & Aves', desc: 'Carne, frango, peixe', color: '#ef4444' },
      { id: 'ovos_laticinios', label: 'Ovos & Laticínios', desc: 'Ovos, leite, queijo', color: '#f59e0b' },
      { id: 'frutas_frescas', label: 'Frutas Frescas', desc: 'Banana, maçã, laranja', color: '#10b981' },
      { id: 'verduras_legumes', label: 'Verduras & Legumes', desc: 'Alface, tomate, batata', color: '#059669' },
      { id: 'padaria_matinal', label: 'Padaria & Café', desc: 'Pão, biscoito, café', color: '#8b5cf6' },
      { id: 'temperos_condimentos', label: 'Temperos', desc: 'Sal, açúcar, óleo', color: '#475569' },
      { id: 'massas_farinhas', label: 'Massas & Farinhas', desc: 'Macarrão, farinha', color: '#6366f1' },
      { id: 'enlatados_conservas', label: 'Enlatados', desc: 'Sardinha, atum, milho', color: '#dc2626' },
      { id: 'bebidas_sucos', label: 'Bebidas & Sucos', desc: 'Suco, refrigerante', color: '#0ea5e9' },
      { id: 'doces_sobremesas', label: 'Doces', desc: 'Chocolate, bolo', color: '#ec4899' },
      { id: 'alimentacao_infantil', label: 'Alimentação Infantil', desc: 'Papinha, fórmula', color: '#f43f5e' },
      { id: 'alimentacao_especial', label: 'Alimentação Especial', desc: 'Sem glúten, vegano', color: '#7c3aed' },
      { id: 'refeicoes_prontas', label: 'Marmitas', desc: 'Refeições prontas', color: '#f97316' },
      { id: 'merenda_escolar', label: 'Merenda', desc: 'Lanche escolar', color: '#14b8a6' },
    ]
  },
  Roupas: {
    options: [
      { id: 'roupas_inverno', label: 'Roupas Inverno', desc: 'Casacos, blusas', color: '#1e40af' },
      { id: 'roupas_verao', label: 'Roupas Verão', desc: 'Camisetas, bermudas', color: '#f59e0b' },
      { id: 'uniforme_escolar', label: 'Uniforme Escolar', desc: 'Kits escolares', color: '#6366f1' },
      { id: 'uniforme_trabalho', label: 'Uniforme Trabalho', desc: 'Aventais, jalecos', color: '#475569' },
      { id: 'roupa_social', label: 'Roupa Social', desc: 'Entrevistas, trabalho', color: '#374151' },
      { id: 'roupas_intimas', label: 'Roupas Íntimas', desc: 'Cueca, calcinha (NOVAS)', color: '#f43f5e' },
      { id: 'enxoval_bebe', label: 'Enxoval Bebê', desc: 'Body, mantas', color: '#f472b6' },
      { id: 'roupas_crianca', label: 'Roupas Infantis', desc: '1 a 14 anos', color: '#8b5cf6' },
      { id: 'pijamas_dormir', label: 'Pijamas', desc: 'Roupas para dormir', color: '#14b8a6' },
      { id: 'cama_mesa_banho', label: 'Cama & Banho', desc: 'Lençol, toalha', color: '#0ea5e9' },
    ]
  },
  Medicamentos: {
    options: [
      { id: 'pressao_alta', label: 'Pressão Alta', desc: 'Losartana, Enalapril', color: '#ef4444' },
      { id: 'diabetes', label: 'Diabetes', desc: 'Metformina, Insulina', color: '#dc2626' },
      { id: 'analgesicos_antitermicos', label: 'Analgésicos', desc: 'Dipirona, Paracetamol', color: '#10b981' },
      { id: 'asma_bronquite', label: 'Asma', desc: 'Bombinhas, Salbutamol', color: '#0ea5e9' },
      { id: 'antibioticos', label: 'Antibióticos', desc: 'Com receita', color: '#8b5cf6' },
      { id: 'saude_mental', label: 'Saúde Mental', desc: 'Controlados', color: '#ec4899' },
      { id: 'antiinflamatorios', label: 'Anti-inflamatórios', desc: 'Diclofenaco', color: '#f59e0b' },
      { id: 'gastrico_digestivo', label: 'Gástrico', desc: 'Omeprazol', color: '#14b8a6' },
      { id: 'vitaminas_suplementos', label: 'Vitaminas', desc: 'Complexo B, Ferro', color: '#059669' },
      { id: 'pediatrico', label: 'Pediátrico', desc: 'Xaropes infantis', color: '#f472b6' },
    ]
  },
  Higiene: {
    options: [
      { id: 'kit_banho_completo', label: 'Kit Banho', desc: 'Sabonete, shampoo', color: '#14b8a6' },
      { id: 'saude_bucal', label: 'Saúde Bucal', desc: 'Pasta, escova', color: '#0d9488' },
      { id: 'higiene_intima_feminina', label: 'Higiene Feminina', desc: 'Absorvente', color: '#ec4899' },
      { id: 'fraldas_infantis', label: 'Fraldas Infantis', desc: 'P, M, G, XG', color: '#6366f1' },
      { id: 'fraldas_geriatricas', label: 'Fraldas Adulto', desc: 'M, G, GG', color: '#8b5cf6' },
      { id: 'produtos_cabelo', label: 'Cabelo', desc: 'Shampoo, creme', color: '#f59e0b' },
      { id: 'desodorante_perfume', label: 'Desodorante', desc: 'Roll-on, aerosol', color: '#10b981' },
      { id: 'limpeza_casa', label: 'Limpeza Casa', desc: 'Detergente, sabão', color: '#059669' },
      { id: 'papel_higienico', label: 'Papel Higiênico', desc: 'Papel, toalha', color: '#64748b' },
      { id: 'higiene_bebe', label: 'Higiene Bebê', desc: 'Produtos infantis', color: '#f472b6' },
    ]
  },
  Contas: {
    options: [
      { id: 'conta_luz', label: 'Conta Luz', desc: 'Evitar corte', color: '#ef4444' },
      { id: 'conta_agua', label: 'Conta Água', desc: 'Manter abastecimento', color: '#3b82f6' },
      { id: 'gas_cozinha', label: 'Gás', desc: 'Botijão 13kg', color: '#f97316' },
      { id: 'apoio_aluguel', label: 'Aluguel', desc: 'Evitar despejo', color: '#dc2626' },
      { id: 'internet_telefone', label: 'Internet', desc: 'Estudo, trabalho', color: '#6366f1' },
      { id: 'plano_saude', label: 'Plano Saúde', desc: 'Convênio médico', color: '#10b981' },
      { id: 'educacao_escola', label: 'Escola', desc: 'Material, uniforme', color: '#f59e0b' },
      { id: 'transporte_publico', label: 'Transporte', desc: 'Cartão, passagens', color: '#0ea5e9' },
    ]
  },
  Emprego: {
    options: [
      { id: 'curriculo_impressao', label: 'Currículo', desc: 'Elaboração, impressão', color: '#8b5cf6' },
      { id: 'qualificacao_cursos', label: 'Cursos', desc: 'Qualificação técnica', color: '#7c3aed' },
      { id: 'epis_uniforme_trabalho', label: 'EPIs', desc: 'Equipamentos segurança', color: '#059669' },
      { id: 'ferramentas_profissionais', label: 'Ferramentas', desc: 'Pedreiro, eletricista', color: '#dc2626' },
      { id: 'transporte_entrevistas', label: 'Transporte', desc: 'Passagens entrevistas', color: '#0ea5e9' },
      { id: 'documentacao_trabalho', label: 'Documentação', desc: 'Carteira, CPF, RG', color: '#f59e0b' },
      { id: 'capacitacao_digital', label: 'Informática', desc: 'Cursos digitais', color: '#6366f1' },
      { id: 'material_vendas', label: 'Material Vendas', desc: 'Produtos revenda', color: '#10b981' },
    ]
  },
  Móveis: {
    options: [
      { id: 'cama_solteiro', label: 'Cama Solteiro', desc: 'Cama ou colchão', color: '#f59e0b' },
      { id: 'cama_casal', label: 'Cama Casal', desc: 'Cama ou colchão', color: '#d97706' },
      { id: 'berco_bebe', label: 'Berço Bebê', desc: 'Móveis infantis', color: '#ec4899' },
      { id: 'sofa_poltrona', label: 'Sofá', desc: 'Sala de estar', color: '#6366f1' },
      { id: 'mesa_jantar', label: 'Mesa Jantar', desc: 'Mesa com cadeiras', color: '#8b5cf6' },
      { id: 'armario_cozinha', label: 'Armário Cozinha', desc: 'Paneleiro', color: '#059669' },
      { id: 'guarda_roupa', label: 'Guarda-roupa', desc: 'Roupeiro', color: '#10b981' },
      { id: 'mesa_estudo', label: 'Mesa Estudo', desc: 'Escrivaninha', color: '#f97316' },
    ]
  },
  Eletrodomésticos: {
    options: [
      { id: 'geladeira_freezer', label: 'Geladeira', desc: 'Conservar alimentos', color: '#475569' },
      { id: 'fogao_cooktop', label: 'Fogão', desc: 'Preparo refeições', color: '#334155' },
      { id: 'maquina_lavar_roupa', label: 'Lavadora', desc: 'Lavar roupas', color: '#0ea5e9' },
      { id: 'microondas', label: 'Micro-ondas', desc: 'Aquecimento rápido', color: '#64748b' },
      { id: 'ventilador_ar', label: 'Ventilador', desc: 'Dias de calor', color: '#06b6d4' },
      { id: 'televisao', label: 'TV', desc: 'Televisão, conversor', color: '#374151' },
      { id: 'ferro_passar', label: 'Ferro Passar', desc: 'Tábua e ferro', color: '#6b7280' },
      { id: 'liquidificador_batedeira', label: 'Liquidificador', desc: 'Preparo alimentos', color: '#10b981' },
    ]
  },
  Transporte: {
    options: [
      { id: 'passagens_onibus', label: 'Passagens Ônibus', desc: 'Ônibus urbano/trem', color: '#0ea5e9' },
      { id: 'bicicleta', label: 'Bicicleta', desc: 'Trabalho/escola', color: '#10b981' },
      { id: 'combustivel_veiculo', label: 'Combustível', desc: 'Gasolina, álcool', color: '#f97316' },
      { id: 'manutencao_veiculo', label: 'Manutenção', desc: 'Conserto, peças', color: '#dc2626' },
      { id: 'apoio_carona', label: 'Carona', desc: 'Consultas médicas', color: '#ec4899' },
      { id: 'pecas_moto', label: 'Peças Moto', desc: 'Delivery, trabalho', color: '#f59e0b' },
      { id: 'taxi_uber', label: 'Taxi/Uber', desc: 'Emergência', color: '#8b5cf6' },
    ]
  },
  Calçados: {
    options: [
      { id: 'tenis_esportivo', label: 'Tênis Esportivo', desc: 'Exercícios, caminhada', color: '#10b981' },
      { id: 'tenis_casual', label: 'Tênis Casual', desc: 'Uso diário', color: '#059669' },
      { id: 'sapato_social_masculino', label: 'Sapato Social M', desc: 'Trabalho, entrevista', color: '#475569' },
      { id: 'sapato_social_feminino', label: 'Sapato Social F', desc: 'Trabalho feminino', color: '#374151' },
      { id: 'sandalia_feminina', label: 'Sandália', desc: 'Rasteirinha', color: '#ec4899' },
      { id: 'chinelos_havaianas', label: 'Chinelos', desc: 'Uso doméstico', color: '#f59e0b' },
      { id: 'botas_trabalho', label: 'Botas Trabalho', desc: 'Segurança, bico aço', color: '#dc2626' },
      { id: 'calcados_infantis', label: 'Calçados Infantis', desc: 'Crianças', color: '#8b5cf6' },
      { id: 'calcados_bebe', label: 'Calçados Bebê', desc: 'Sapatinho bebê', color: '#f472b6' },
    ]
  },
  Outros: {
    options: [
      { id: 'educacao_cursos', label: 'Educação', desc: 'Material escolar', color: '#6366f1' },
      { id: 'saude_consultas', label: 'Saúde', desc: 'Consultas, exames', color: '#10b981' },
      { id: 'juridico_documentos', label: 'Jurídico', desc: 'Advogado, cartório', color: '#8b5cf6' },
      { id: 'tecnologia_equipamentos', label: 'Tecnologia', desc: 'Celular, computador', color: '#0ea5e9' },
      { id: 'animais_estimacao', label: 'Animais', desc: 'Ração, veterinário', color: '#f59e0b' },
      { id: 'reforma_casa', label: 'Reforma', desc: 'Material construção', color: '#dc2626' },
      { id: 'lazer_cultura', label: 'Lazer', desc: 'Livros, brinquedos', color: '#ec4899' },
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
  const { addNotification } = useNotifications();
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
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [shakeReviewButton, setShakeReviewButton] = useState(false);
  const [isInconsistent, setIsInconsistent] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const stages = ['Iniciando validação...', 'Comunicando com assistente IA...', 'Analisando seu pedido...', 'Finalizando...'];

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

  const safeGeocodeRequest = async (coords) => {
    // Validar coordenadas usando SecurityUtils
    const coordValidation = SecurityUtils.validateCoordinates(coords);
    if (!coordValidation.valid) {
      throw new Error(coordValidation.error);
    }
    
    // Rate limiting
    const rateLimitCheck = geocodingRateLimiter('geocoding');
    if (!rateLimitCheck.allowed) {
      throw new Error(rateLimitCheck.error);
    }
    
    const baseUrl = 'https://nominatim.openstreetmap.org/reverse';
    const params = new URLSearchParams({
      format: 'json',
      lat: coords.lat.toFixed(6),
      lon: coords.lng.toFixed(6),
      addressdetails: '1',
      zoom: '18'
    });
    
    // Validar URL final
    const fullUrl = `${baseUrl}?${params}`;
    const urlValidation = SecurityUtils.validateUrl(fullUrl);
    if (!urlValidation.valid) {
      throw new Error(urlValidation.error);
    }
    
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'SolidarBairro/1.0'
      },
      signal: AbortSignal.timeout(10000) // Timeout de 10s
    });
    
    if (!response.ok) {
      throw new Error(`Erro na geocodificação: ${response.status}`);
    }
    
    return response.json();
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          
          try {
            const data = await safeGeocodeRequest(coords);
            
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
          } catch (error) {
            console.error('Erro na geocodificação:', error);
            setLocationError('Não foi possível obter sua localização precisa');
            addNotification({
              title: 'Localização',
              message: 'Usando localização padrão. Você pode ajustar manualmente.'
            });
            updateData({ 
              userLocation: { lat: -23.5505, lng: -46.6333 },
              locationString: 'São Paulo, SP (Padrão)',
              city: 'São Paulo',
              neighborhood: 'Centro'
            });
          }
        },
        (error) => {
          console.error('Erro de geolocalização:', error);
          let errorMessage = 'Localização não disponível';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite para obter localização';
              break;
          }
          
          setLocationError(errorMessage);
          addNotification({
            title: 'Localização',
            message: `${errorMessage}. Usando São Paulo como padrão.`
          });
          
          updateData({ 
            userLocation: { lat: -23.5505, lng: -46.6333 },
            locationString: 'São Paulo, SP (Padrão)',
            city: 'São Paulo',
            neighborhood: 'Centro'
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setLocationError('Geolocalização não suportada');
      addNotification({
        title: 'Localização',
        message: 'Seu navegador não suporta geolocalização. Usando São Paulo como padrão.'
      });
      updateData({ 
        userLocation: { lat: -23.5505, lng: -46.6333 },
        locationString: 'São Paulo, SP (Padrão)',
        city: 'São Paulo',
        neighborhood: 'Centro'
      });
    }
  }, [updateData, addNotification]);

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

  const publishRequest = useCallback(async () => {
    // This function contains the actual API call logic
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const pedidoData = {
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        urgency: formData.urgency,
        visibility: formData.visibility,
        radius: formData.radius,
        location: formData.userLocation,
        locationString: formData.locationString,
        city: formData.city,
        neighborhood: formData.neighborhood,
        isPublic: formData.isPublic
      };
      
      const { default: ApiService } = await import('../../../services/apiService');
      const response = await ApiService.createPedido(pedidoData);
      
      setIsAnalyzing(false);
      if (response.success) {
        addNotification({
          title: 'Pedido criado com sucesso!',
          message: `Seu pedido de "${formData.category}" foi publicado e já está visível para a comunidade.`
        });
        setIsPublished(true);
      } else {
        throw new Error(response.error || 'Erro ao criar pedido');
      }
    } catch (error) {
      console.error('Erro ao publicar pedido:', error);
      setIsAnalyzing(false);
      alert('Erro ao publicar pedido: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, addNotification]);

  const handlePublish = useCallback(async () => {
    // 1. Validação básica de campos obrigatórios
    const requiredFieldsErrors = validateRequiredFields(formData);
    if (requiredFieldsErrors.length > 0) {
      setValidationResult({
        canPublish: false,
        analysis: 'Campos obrigatórios não foram preenchidos.',
        confidence: 0,
        suggestions: requiredFieldsErrors.map(error => ({
          type: 'error',
          message: error.message,
        })),
        validations: {}
      });
      setShowValidationModal(true);
      return;
    }

    // 2. Exibe o modal de "Analisando..." e chama o bot
    setIsSubmitting(true);
    setIsAnalyzing(true);

    // Simula etapas da análise para feedback visual
    for (let i = 0; i < stages.length; i++) {
      setAnalysisStage(i);
      await new Promise(resolve => setTimeout(resolve, 750));
    }

    // 3. Chama o bot de validação real
    const analysisResult = await validateRequest(formData);
    setValidationResult(analysisResult);
    
    // 4. Esconde o modal de "Analisando..." e exibe o resultado da validação
    setIsAnalyzing(false);
    setIsSubmitting(false);
    setShowValidationModal(true);

  }, [formData, stages]);

  const handleReview = () => {
    setShowValidationModal(false);
    setValidationResult(null);
    setStep(3); // Volta para a etapa da história para revisão
  };

  const handleAcceptAndPublish = () => {
    // Se a validação falhou, o usuário está clicando em "Publicar Mesmo Assim".
    // Acionamos a animação no botão "Revisar" e publicamos após um pequeno atraso.
    if (validationResult && !validationResult.canPublish) {
      setShakeReviewButton(true);
      setTimeout(() => {
        setShowValidationModal(false);
        publishRequest();
        setShakeReviewButton(false); // Reseta o estado da animação
      }, 600); // Duração da animação
    } else {
      // Se a validação passou, publica imediatamente.
      setShowValidationModal(false);
      publishRequest();
    }
  };

  const selectedCategory = useMemo(() => CATEGORIES.find(c => c.id === formData.category), [formData.category]);
  const selectedUrgency = useMemo(() => URGENCY_OPTIONS.find(o => o.id === formData.urgency), [formData.urgency]);

  const toggleArrayItem = useCallback((array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
  }, []);

  const descriptionQuality = useMemo(() => {
    const len = formData.description.length;
    if (len === 0) return { label: '', color: '#e5e7eb' };
    if (len < 50) return { label: 'Fraca', color: '#ef4444' };
    if (len < 150) return { label: 'Razoável', color: '#f59e0b' };
    if (len < 250) return { label: 'Boa', color: '#3b82f6' };
    return { label: 'Excelente', color: '#10b981' };
  }, [formData.description]);

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
        <h2>
          Conte sua história
          {descriptionQuality.label && (
            <span className="pdam-quality-badge" style={{ backgroundColor: descriptionQuality.color }}>
              {descriptionQuality.label}
            </span>
          )}
        </h2>
        <p className="pdam-step-subtitle">A ajuda vem mais rápido quando as pessoas entendem o seu motivo.</p>
      </div>
      
      <div className="pdam-story-container-v4">
        <div className="pdam-input-wrapper-v4">
          <textarea
            placeholder="Descreva sua necessidade aqui com o máximo de detalhes possível..."
            value={formData.description}
            onChange={(e) => {
              updateData({ description: e.target.value.slice(0, 300) });
            }}
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
                    width: `${(formData.description.length / 300) * 100}%`,
                    backgroundColor: descriptionQuality.color
                  }}
                />
              </div>
              <span>{formData.description.length}/300</span>
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
        <div className="pdam-map-inner">
          {/* Animated Background Particles */}
          <AnimatedParticles radius={formData.radius} isActive={true} />
          
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            animation: 'backgroundShift 8s ease-in-out infinite'
          }} />

          {/* Visual Map Elements */}
          <div className="pdam-map-visuals">
             {/* Radar Circles */}
             {[1, 2, 3].map(i => (
                 <motion.div 
                    key={i}
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ duration: 3, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
                    className="pdam-radar-circle"
                    style={{
                        width: `${Math.min(formData.radius * 10 + (i * 60), 280)}px`,
                        height: `${Math.min(formData.radius * 10 + (i * 60), 280)}px`,
                    }}
                 />
             ))}
             
             {/* Active Radius */}
             <motion.div 
                className="pdam-active-radius"
                animate={{ 
                    width: `${Math.min(Math.max(formData.radius * 15, 100), 260)}px`,
                    height: `${Math.min(Math.max(formData.radius * 15, 100), 260)}px`,
                }}
             />

             {/* Marker */}
             <div className="pdam-map-marker-container">
                <div className="pdam-map-marker">
                   <MapPin size={24} className="text-white" />
                </div>
                <div className="pdam-map-marker-pulse" />
             </div>
             
             {/* Location Label */}
             <div className="pdam-map-location-label">
                 <MapPin size={14} className="text-orange-500" />
                 <span className="truncate max-w-[200px]">{formData.neighborhood || formData.city || 'Localização'}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Interactive Radius Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pdam-map-controls-overlay"
      >
        <div className="pdam-controls-header">
          <div className="pdam-radius-display">
            <span className="pdam-radius-label">Raio de Alcance</span>
            <span className="pdam-radius-value">{formData.radius} km</span>
          </div>
          <div className="pdam-people-estimate">
            <Users size={16} />
            <span>~{Math.floor(formData.radius / 2) + 2} pessoas</span>
          </div>
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
        
        <div className="pdam-slider-labels">
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
          
          <div className="pdam-privacy-section">
            <label className="pdam-public-switch">
              <input 
                type="checkbox" 
                checked={formData.isPublic} 
                onChange={(e) => updateData({ isPublic: e.target.checked })} 
              />
              <span className="pdam-switch-slider"></span>
              <div className="pdam-switch-content">
                <span className="pdam-switch-label">
                  {formData.isPublic ? <><Globe size={16} /> Pedido Público</> : <><ShieldCheck size={16} /> Pedido Anônimo</>}
                </span>
                <span className="pdam-switch-desc">
                  {formData.isPublic 
                    ? 'Seu nome aparecerá para todos na plataforma.' 
                    : 'Seu nome será ocultado (ex: "Usuário Anônimo").'}
                </span>
              </div>
            </label>
          </div>
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
      {showValidationModal && (
        <ValidationModal
          isOpen={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          validationResult={validationResult}
          onReview={handleReview}
          onAccept={handleAcceptAndPublish}
          shakeReviewButton={shakeReviewButton}
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
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                Concluir <Check size={18} />
              </>
            )}
          </button>
        )}
      </footer>
    </div>
  );
}

export default PrecisoDeAjudaMobile;