import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Heart,
  AlertTriangle, 
  Zap, 
  Calendar, 
  Coffee, 
  RefreshCcw,
  MessageCircle,
  Filter,
  Eye,
  X,
  Info,
  ShoppingCart,
  MessageSquare,
  Lightbulb,
  Shirt,
  Pill,
  Plus,
  Briefcase,
  Bath,
  Sofa,
  Tv,
  Car,
  Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

// --- CONSTANTS ---
const CATEGORY_METADATA = {
  Alimentos: { 
    color: '#0ea5e9', 
    icon: <ShoppingCart size={24} />,
    details: { 
      cesta: { label: 'Cesta Básica', desc: 'Itens essenciais (arroz, feijão, óleo).' }, 
      proteinas: { label: 'Proteínas & Ovos', desc: 'Carne, frango ou ovos para a família.' }, 
      frescos: { label: 'Hortifruti', desc: 'Frutas e legumes frescos da estação.' }, 
      padaria: { label: 'Padaria & Leite', desc: 'Pães, leite e laticínios básicos.' }, 
      infantil: { label: 'Alimentação Infantil', desc: 'Fórmulas, papinhas e complementos.' }, 
      cozinha: { label: 'Itens de Cozinha', desc: 'Temperos, sal, açúcar e farinhas.' } 
    } 
  },
  Roupas: { 
    color: '#3b82f6', 
    icon: <Shirt size={24} />,
    details: { 
      agasalhos: { label: 'Agasalhos & Inverno', desc: 'Casacos, lãs e roupas pesadas.' }, 
      escolar: { label: 'Material/Uniforme', desc: 'Kits escolares ou uniforme da rede.' }, 
      calcados: { label: 'Calçados', desc: 'Tênis, sapatos ou chinelos.' },
      bebe: { label: 'Roupas de Bebê', desc: 'Enxoval e roupinhas pequenas.' }
    } 
  },
  Medicamentos: { 
    color: '#10b981', 
    icon: <Pill size={24} />,
    details: { 
      continuo: { label: 'Uso Contínuo', desc: 'Remédios para pressão, diabetes, etc.' }, 
      analgesico: { label: 'Sintomáticos', desc: 'Para dor, febre ou resfriados.' },
      especial: { label: 'Medicamento Especial', desc: 'Itens de alto custo ou específicos.' }
    } 
  },
  Higiene: { 
    color: '#14b8a6', 
    icon: <Bath size={24} />,
    details: { 
      banho: { label: 'Banho & Limpeza', desc: 'Sabonete, shampoo e desodorante.' }, 
      bucal: { label: 'Higiene Bucal', desc: 'Pasta e escovas de dente.' }, 
      feminina: { label: 'Saúde Íntima', desc: 'Absorventes e cuidados femininos.' } 
    } 
  },
  Contas: { 
    color: '#ef4444', 
    icon: <Receipt size={24} />,
    details: { 
      luz: { label: 'Energia Elétrica', desc: 'Evitar o corte de luz da residência.' }, 
      agua: { label: 'Água & Esgoto', desc: 'Conta de água essencial.' }, 
      gas: { label: 'Gás de Cozinha', desc: 'Botijão para preparo de alimentos.' } 
    } 
  },
  Emprego: { 
    color: '#8b5cf6', 
    icon: <Briefcase size={24} />,
    details: { 
      curriculo: { label: 'Currículo & Docs', desc: 'Montagem e impressão de currículos.' }, 
      vagas: { label: 'Oportunidades', desc: 'Indicação de vagas ou cursos.' } 
    } 
  },
  Móveis: { 
    color: '#f59e0b', 
    icon: <Sofa size={24} />,
    details: { 
      cama: { label: 'Dormitório', desc: 'Camas, colchões ou berços.' }, 
      cozinha_movel: { label: 'Cozinha', desc: 'Mesas, cadeiras ou armários.' } 
    } 
  },
  Eletrodomésticos: { 
    color: '#475569', 
    icon: <Tv size={24} />,
    details: { 
      geladeira: { label: 'Geladeira', desc: 'Fundamental para conservar alimentos.' }, 
      fogao: { label: 'Fogão', desc: 'Para preparo digno das refeições.' } 
    } 
  },
  Transporte: { 
    color: '#0ea5e9', 
    icon: <Car size={24} />,
    details: { 
      passagem: { label: 'Passagem Social', desc: 'Créditos para ônibus ou trem.' }, 
      bike: { label: 'Mobilidade', desc: 'Bicicleta para trabalho ou estudo.' } 
    } 
  },
  Outros: { 
    color: '#94a3b8', 
    icon: <Plus size={24} />,
    details: { 
      apoio: { label: 'Apoio Geral', desc: 'Outras necessidades específicas.' } 
    } 
  },
};

const CONTEXT_INFO = {
  cesta: 'Alimenta uma família por cerca de 15 dias.',
  proteinas: 'Essencial para a saúde e desenvolvimento das crianças.',
  frescos: 'Vitaminas cruciais para o sistema imunológico.',
  infantil: 'Bebês precisam de nutrientes específicos para crescer.',
  continuo: 'A interrupção pode agravar doenças crônicas.',
  luz: 'Luz é segurança e dignidade para a família à noite.',
  gas: 'Sem gás, a família não consegue preparar doações secas.',
  curriculo: 'Um currículo bem feito é o primeiro passo para o emprego.',
  geladeira: 'Evita desperdício de alimentos perecíveis.',
  passagem: 'Permite que a pessoa chegue a entrevistas de emprego.',
  padaria: 'O café da manhã é fundamental para manter a energia.',
  agasalhos: 'Proteção essencial contra as baixas temperaturas.',
  escolar: 'Estar uniformizado ajuda na integração da criança na escola.'
};

const CATEGORIES = [
  { id: 'Todas', label: 'Todas Categorias', color: '#6366f1' },
  { id: 'Alimentos', label: 'Alimentos', color: '#0ea5e9' },
  { id: 'Roupas', label: 'Roupas', color: '#3b82f6' },
  { id: 'Medicamentos', label: 'Medicamentos', color: '#10b981' },
  { id: 'Contas', label: 'Contas', color: '#ef4444' },
  { id: 'Higiene', label: 'Higiene', color: '#14b8a6' },
  { id: 'Emprego', label: 'Emprego', color: '#8b5cf6' },
  { id: 'Móveis', label: 'Móveis', color: '#f59e0b' },
  { id: 'Transporte', label: 'Transporte', color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', color: '#94a3b8' },
];

const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato', icon: <AlertTriangle size={20} />, color: '#ef4444' },
  { id: 'urgente', label: 'URGENTE', desc: 'Próximas 24h', icon: <Zap size={20} />, color: '#f97316' },
  { id: 'moderada', label: 'MODERADA', desc: 'Alguns dias', icon: <Calendar size={20} />, color: '#f59e0b' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem pressa', icon: <Coffee size={20} />, color: '#10b981' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Mensal', icon: <RefreshCcw size={20} />, color: '#9333ea' },
];

const SUB_QUESTION_LABELS = {
  itens_cesta: 'Itens necessários',
  familia: 'Tamanho da família',
  restricao: 'Restrições alimentares',
  tipo_proteina: 'Preferência de proteína',
  armazenamento_prot: 'Possui geladeira?',
  tipo_fresco: 'Hortifruti desejado',
  itens_padaria: 'Itens de padaria',
  fralda: 'Tamanho da fralda',
  leite_especial: 'Leite específico',
  idade_crianca: 'Idade da criança',
  itens_coz: 'Temperos/Cozinha',
  tipo_lanche: 'Tipos de lanche',
  medicamento_nome: 'Nome do remédio',
  receita: 'Possui receita?',
  med_continuo: 'Medicamento contínuo',
  dosagem: 'Dosagem',
  itens_banho: 'Itens de banho',
  itens_bucal: 'Itens de higiene bucal',
  itens_fem: 'Itens de higiene feminina',
  valor_luz: 'Valor aproximado (Luz)',
  atraso_luz: 'Meses em atraso (Luz)',
  valor_agua: 'Valor aproximado (Água)',
  atraso_agua: 'Meses em atraso (Água)',
  valor_gas: 'Valor aproximado (Gás)',
  tipo_curr: 'Tipo de ajuda com currículo',
  area_interesse: 'Área de interesse',
  tipo_cama: 'Tipo de cama',
  tipo_movel: 'Tipo de móvel',
  volts_geladeira: 'Voltagem necessária',
  tipo_eletro: 'Tipo de eletrodoméstico',
  tipo_transp: 'Tipo de transporte',
  freq_transp: 'Frequência da ajuda',
  serie_escolar: 'Série Escolar',
  escola_nome: 'Nome da Escola',
  genero: 'Gênero',
  especifique: 'Detalhes da ajuda',
  size: 'Tamanho',
  style: 'Estilo/Preferência',
  quantidade: 'Quantidade',
  observacoes: 'Observações Adicionais',
  contato_pref: 'Contato Preferencial',
  horario: 'Melhor Horário',
  ponto_referencia: 'Ponto de Referência'
};

const MOCK_ORDERS = [
    {
    id: '1',
    userName: 'Maria Silva',
    city: 'Porto Alegre',
    state: 'RS',
    neighborhood: 'Sarandi',
    urgency: 'urgente',
    category: 'Alimentos',
    title: 'Cesta Básica para Família',
    userType: 'Cidadão',
    description: 'Somos uma família de 4 pessoas e meu marido está desempregado. Precisamos de ajuda with itens básicos de alimentação para as crianças passarem o mês.',
    subCategories: ['cesta', 'proteinas', 'frescos'],
    subQuestionAnswers: {
      itens_cesta: ['Arroz', 'Feijão', 'Leite', 'Óleo', 'Macarrão'],
      familia: '4 pessoas (2 adultos, 2 crianças)',
      restricao: 'Diabetes (sem açúcar)',
      tipo_proteina: ['Ovos', 'Frango'],
      armazenamento_prot: 'Sim, possui geladeira',
      tipo_fresco: 'Batata, cebola e frutas da época'
    },
    isNew: true
  },
  {
    id: '2',
    userName: 'João Pereira',
    city: 'Canoas',
    state: 'RS',
    neighborhood: 'Mathias Velho',
    urgency: 'critico',
    category: 'Medicamentos',
    title: 'Insulina de Uso Contínuo',
    userType: 'Cidadão',
    description: 'Sou diabético e minha medicação acabou. Não estou conseguindo pelo posto este mês e não tenho condições de comprar agora.',
    subCategories: ['continuo'],
    subQuestionAnswers: {
      medicamento_nome: 'Insulina NPH',
      receita: 'Sim, receita válida por mais 3 meses',
      dosagem: '30 UI pela manhã, 20 UI à noite',
      med_continuo: 'Sim'
    },
    isNew: true
  },
  {
    id: '3',
    userName: 'Ana Costa',
    city: 'Eldorado do Sul',
    state: 'RS',
    neighborhood: 'Centro',
    urgency: 'moderada',
    category: 'Contas',
    title: 'Conta de Luz em Atraso',
    userType: 'Cidadão',
    description: 'Tivemos um imprevisto médico e a conta de luz acumulou. Estamos com aviso de corte para a próxima semana.',
    subCategories: ['luz', 'agua'],
    subQuestionAnswers: {
      valor_luz: 'R$ 245,00',
      atraso_luz: '2 meses',
      valor_agua: 'R$ 80,00',
      atraso_agua: '1 mês'
    }
  },
  {
    id: '4',
    userName: 'Carlos Oliveira',
    city: 'Porto Alegre',
    state: 'RS',
    neighborhood: 'Partenon',
    urgency: 'urgente',
    category: 'Roupas',
    title: 'Uniforme Escolar e Agasalho',
    userType: 'Cidadão',
    description: 'Meu filho começou na escola municipal e não temos o uniforme nem casaco para o frio que está chegando.',
    subCategories: ['escolar', 'agasalhos'],
    subQuestionAnswers: {
      size: '10 (Infantil)',
      style: 'Masculino',
      serie_escolar: '4º ano do Fundamental',
      escola_nome: 'Escola Estadual Júlio de Castilhos',
      genero: 'Masculino'
    }
  },
  {
    id: '5',
    userName: 'Fernanda Lima',
    city: 'Guaíba',
    state: 'RS',
    neighborhood: 'Colina',
    urgency: 'moderada',
    category: 'Emprego',
    title: 'Ajuda com Currículo',
    userType: 'Cidadão',
    description: 'Estou há muito tempo fora do mercado e preciso de ajuda para refazer meu currículo e algumas impressões para distribuir.',
    subCategories: ['curriculo'],
    subQuestionAnswers: {
      tipo_curr: 'Criar um do zero e imprimir'
    }
  },
];

// --- COMPONENTS ---

function ModalDetalhes({ order, onClose, onHelp }) {
  const scrollContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('historia');
  
  const sections = [
    { id: 'historia', label: 'Relato', icon: <MessageSquare size={18} /> },
    { id: 'necessidades', label: 'Itens', icon: <ShoppingCart size={18} /> },
    { id: 'tecnico', label: 'Técnico', icon: <Info size={18} /> },
    { id: 'contato', label: 'Localização', icon: <MapPin size={18} /> },
  ];

  useEffect(() => {
    if (!order) return;
    
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      let currentSection = sections[0].id;
      for (const section of sections) {
        const element = document.getElementById(`section-${section.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (rect.top <= containerRect.top + 100) {
            currentSection = section.id;
          }
        }
      }
      setActiveTab(currentSection);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [order, sections]);
  
  if (!order) return null;
  
  const urg = URGENCY_OPTIONS.find((u) => u.id === order.urgency);
  const catMeta = CATEGORY_METADATA[order.category] || { color: '#64748b', details: {}, icon: <Info size={24} /> };

  const allSpecs = { ...(order.details || {}), ...(order.subQuestionAnswers || {}) };
  const hasSpecs = Object.keys(allSpecs).length > 0;

  const scrollToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(id);
    }
  };

  return (
    <div className="qa-modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="qa-modal-content-v3"
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn-v3" onClick={onClose} title="Fechar">
          <X size={24} />
        </button>
        
          <div className="modal-sidebar-v3">
            <nav className="sidebar-nav-v3">
            {sections.map(s => (
              <button 
                key={s.id}
                className={`nav-item-v3 ${activeTab === s.id ? 'active' : ''}`}
                onClick={() => scrollToSection(s.id)}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="modal-main-v3">
          <header className="main-header-v3">
            <div className="header-titles-v3">
              <span className="cat-badge-v3" style={{ color: catMeta.color, backgroundColor: catMeta.color + '15' }}>
                {order.category}
              </span>
              <h2>{order.title || order.category}</h2>
              <p className="user-info-v3">Solicitado por <strong>{order.userName}</strong> • {order.userType || 'Cidadão'}</p>
            </div>
            <div className="header-urgency-v3" style={{ color: urg?.color, borderColor: urg?.color }}>
              {urg?.icon}
              <span>{urg?.label}</span>
            </div>
          </header>

          <div className="modal-scroll-v3" ref={scrollContainerRef}>
            <section id="section-historia" className="content-section-v3">
              <div className="section-title-v3">
                <MessageSquare size={20} />
                <h3>O Relato de {order.userName.split(' ')[0]}</h3>
              </div>
              <div className="story-card-v3">
                <div className="quote-mark">"</div>
                <p>{order.description}</p>
                <div className="quote-mark-end">"</div>
              </div>
            </section>

            <section id="section-necessidades" className="content-section-v3">
              <div className="section-title-v3">
                <ShoppingCart size={20} />
                <h3>Itens Necessários</h3>
              </div>
              <div className="items-grid-v3">
                {order.subCategories?.map((sc) => (
                  <div key={sc} className="item-card-v3" style={{ borderLeftColor: catMeta.color }}>
                    <div className="item-header-v3">
                      <h4>{catMeta.details[sc]?.label || sc}</h4>
                      {CONTEXT_INFO[sc] && (
                        <div className="context-hint-v3" title={CONTEXT_INFO[sc]}>
                          <Lightbulb size={14} />
                        </div>
                      )}
                    </div>
                    <p>{catMeta.details[sc]?.desc}</p>
                    {CONTEXT_INFO[sc] && (
                      <div className="context-text-v3">
                        {CONTEXT_INFO[sc]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section id="section-tecnico" className="content-section-v3">
              <div className="section-title-v3">
                <Info size={20} />
                <h3>Detalhes e Especificações</h3>
              </div>
              {hasSpecs ? (
                <div className="enhanced-specs-grid">
                  {Object.entries(allSpecs).map(([key, val]) => (
                    <div key={key} className="enhanced-spec-card">
                      <div className="spec-header">
                        <Info size={16} className="spec-icon" />
                        <label className="spec-label">{SUB_QUESTION_LABELS[key] || key}</label>
                      </div>
                      <div className="spec-content">
                        {Array.isArray(val) ? (
                          <div className="spec-chips">
                            {val.map(v => (
                              <span key={v} className="spec-chip">{v}</span>
                            ))}
                          </div>
                        ) : (
                          <div className="spec-value">{val}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="enhanced-empty-state">
                  <Info size={48} className="empty-icon" />
                  <h4>Sem especificações adicionais</h4>
                  <p>Este pedido não possui detalhes técnicos específicos informados.</p>
                </div>
              )}
            </section>

            <section id="section-contato" className="content-section-v3">
              <div className="section-title-v3">
                <MapPin size={20} />
                <h3>Localização e Contato</h3>
              </div>
              <div className="contact-card-v3">
                <div className="loc-row-v3">
                  <div className="loc-item-v3">
                    <label>Bairro</label>
                    <span>{order.neighborhood}</span>
                  </div>
                  <div className="loc-item-v3">
                    <label>Cidade</label>
                    <span>{order.city} - {order.state}</span>
                  </div>
                </div>
                {order.subQuestionAnswers?.ponto_referencia && (
                  <div className="loc-full-v3">
                    <label>Ponto de Referência</label>
                    <p>{order.subQuestionAnswers.ponto_referencia}</p>
                  </div>
                )}
                <div className="contact-footer-v3">
                  <div className="pref-v3">
                    <MessageCircle size={14} />
                    <span>Contato preferencial via chat ou {order.subQuestionAnswers?.contato_pref || 'telefone'}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <footer className="modal-footer-v3">
            <button className="btn-cancel-v3" onClick={onClose}>
              Voltar
            </button>
            <button 
              className="btn-action-v3"
              onClick={() => {
                onHelp(order);
                onClose();
              }}
              style={{ backgroundColor: catMeta.color }}
            >
              <Heart size={20} fill="white" />
              Quero Ajudar Agora
            </button>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN PAGE ---

export default function QueroAjudarPage() {
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [selectedUrgency, setSelectedUrgency] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToHelp, setOrderToHelp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('brasil');
  const [selectedTimeframe, setSelectedTimeframe] = useState('todos');
  const [onlyNew, setOnlyNew] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Use a real geocoding service to get state/city from coordinates
          // For now, simulating based on coordinates
          const { latitude, longitude } = position.coords;
          
          // Simple coordinate-based state detection (you should use a proper geocoding service)
          let detectedState = 'MG';
          let detectedCity = 'Belo Horizonte';
          
          // Basic coordinate ranges for major states (simplified)
          if (latitude >= -23 && latitude <= -19 && longitude >= -51 && longitude <= -39) {
            detectedState = 'MG';
            detectedCity = 'Belo Horizonte';
          } else if (latitude >= -25 && latitude <= -22 && longitude >= -54 && longitude <= -44) {
            detectedState = 'SP';
            detectedCity = 'São Paulo';
          } else if (latitude >= -33 && latitude <= -27 && longitude >= -58 && longitude <= -49) {
            detectedState = 'RS';
            detectedCity = 'Porto Alegre';
          }
          
          setUserLocation({ state: detectedState, city: detectedCity });
        },
        (error) => {
          console.log('Location access denied');
          // Default to MG if location is denied
          setUserLocation({ state: 'MG', city: 'Belo Horizonte' });
        }
      );
    } else {
      // Default to MG if geolocation is not supported
      setUserLocation({ state: 'MG', city: 'Belo Horizonte' });
    }
  }, []);

  // Group cities by state
  const citiesByState = useMemo(() => {
    const grouped = {};
    MOCK_ORDERS.forEach(order => {
      if (!grouped[order.state]) {
        grouped[order.state] = new Set();
      }
      grouped[order.state].add(order.city);
    });
    
    // Convert Sets to sorted arrays
    Object.keys(grouped).forEach(state => {
      grouped[state] = Array.from(grouped[state]).sort();
    });
    
    return grouped;
  }, []);

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      const catMatch = selectedCat === 'Todas' || order.category === selectedCat;
      const urgMatch = !selectedUrgency || order.urgency === selectedUrgency;
      
      let locationMatch = true;
      if (selectedLocation === 'meu_estado' && userLocation) {
        locationMatch = order.state === userLocation.state;
      } else if (selectedLocation === 'minha_cidade' && userLocation) {
        locationMatch = order.city === userLocation.city && order.state === userLocation.state;
      } else if (selectedLocation !== 'brasil' && selectedLocation !== 'meu_estado' && selectedLocation !== 'minha_cidade') {
        locationMatch = `${order.city}, ${order.state}` === selectedLocation;
      }
      
      const newMatch = !onlyNew || order.isNew;
      const timeMatch = selectedTimeframe === 'todos' || (selectedTimeframe === 'hoje' && order.isNew);
      
      return catMatch && urgMatch && locationMatch && newMatch && timeMatch;
    });
  }, [selectedCat, selectedUrgency, selectedLocation, selectedTimeframe, onlyNew, userLocation]);

  return (
    <div className="qa-page">
      <div className="floating-elements">
        {[...Array(9)].map((_, i) => (
          <Heart key={i} className="floating-heart" size={Math.random() * 20 + 15} />
        ))}
      </div>
      
      <div className="qa-main-wrapper">
        <header className="page-header">
          <div className="brand-box">
            <div className="brand-logo">
              <Heart size={32} fill="#ef4444" color="#ef4444" />
            </div>
            <div className="brand-info">
              <h1>Solidariedade <span>Próxima</span></h1>
              <p>Conectando quem precisa com quem pode ajudar</p>
            </div>
          </div>

          <button 
            className={`btn-toggle-filters ${showFiltersModal ? 'active' : ''}`}
            onClick={() => setShowFiltersModal(true)}
          >
            <Filter size={20} />
            <span>Filtros Avançados</span>
            {(selectedCat !== 'Todas' || selectedUrgency || (selectedLocation !== 'brasil' && selectedLocation !== 'todas') || selectedTimeframe !== 'todos' || onlyNew) && <div className="active-filter-indicator" />}
          </button>
        </header>

        <AnimatePresence>
          {showFiltersModal && (
            <div className="filters-modal-overlay" onClick={() => setShowFiltersModal(false)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="filters-modal"
                onClick={e => e.stopPropagation()}
              >
                <div className="filters-modal-header">
                  <h2>Filtros Avançados</h2>
                  <button className="modal-close-btn" onClick={() => setShowFiltersModal(false)}>
                    <X size={24} />
                  </button>
                </div>

                <div className="filters-modal-content">
                  <div className="filter-section">
                    <h3>Localização</h3>
                    <div className="filter-options">
                      <button
                        className={`filter-option ${selectedLocation === 'brasil' ? 'active' : ''}`}
                        onClick={() => setSelectedLocation('brasil')}
                      >
                        Todo o Brasil
                      </button>
                      {userLocation && (
                        <>
                          <button
                            className={`filter-option ${selectedLocation === 'meu_estado' ? 'active' : ''}`}
                            onClick={() => setSelectedLocation('meu_estado')}
                          >
                            Meu Estado ({userLocation.state})
                          </button>
                          <button
                            className={`filter-option ${selectedLocation === 'minha_cidade' ? 'active' : ''}`}
                            onClick={() => setSelectedLocation('minha_cidade')}
                          >
                            Minha Cidade ({userLocation.city})
                          </button>
                        </>
                      )}
                    </div>
                    
                    {userLocation && selectedLocation === 'meu_estado' && (
                      <div className="state-section">
                        <h4>Escolher cidade em {userLocation.state}:</h4>
                        <select 
                          className="city-dropdown"
                          value={selectedLocation.startsWith(userLocation.state) ? selectedLocation : ''}
                          onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                          <option value="meu_estado">Todas as cidades do estado</option>
                          {citiesByState[userLocation.state]?.map(city => (
                            <option key={city} value={`${city}, ${userLocation.state}`}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="filter-section">
                    <h3>Categorias</h3>
                    <div className="filter-options">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          className={`filter-option ${selectedCat === cat.id ? 'active' : ''}`}
                          onClick={() => setSelectedCat(cat.id)}
                          style={{ '--filter-color': cat.color }}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="filter-section">
                    <h3>Urgência</h3>
                    <div className="filter-options">
                      {URGENCY_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          className={`filter-option ${selectedUrgency === opt.id ? 'active' : ''}`}
                          onClick={() => setSelectedUrgency(selectedUrgency === opt.id ? null : opt.id)}
                          style={{ '--filter-color': opt.color }}
                        >
                          {opt.icon}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="filter-section">
                    <h3>Período</h3>
                    <div className="filter-options">
                      <button
                        className={`filter-option ${selectedTimeframe === 'todos' ? 'active' : ''}`}
                        onClick={() => setSelectedTimeframe('todos')}
                      >
                        Todos os Períodos
                      </button>
                      <button
                        className={`filter-option ${selectedTimeframe === 'hoje' ? 'active' : ''}`}
                        onClick={() => setSelectedTimeframe('hoje')}
                      >
                        Hoje
                      </button>
                      <button
                        className={`filter-option ${onlyNew ? 'active' : ''}`}
                        onClick={() => setOnlyNew(!onlyNew)}
                      >
                        Apenas Novos
                      </button>
                    </div>
                  </div>
                </div>

                <div className="filters-modal-footer">
                  <button 
                    className="btn-clear-filters"
                    onClick={() => {
                      setSelectedCat('Todas');
                      setSelectedUrgency(null);
                      setSelectedLocation('brasil');
                      setSelectedTimeframe('todos');
                      setOnlyNew(false);
                    }}
                  >
                    Limpar Filtros
                  </button>
                  <button 
                    className="btn-apply-filters"
                    onClick={() => setShowFiltersModal(false)}
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="results-count">
          <p>Encontramos <strong>{filteredOrders.length}</strong> pedidos para você ajudar</p>
        </div>

        <div className="orders-grid-layout">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => {
              const urg = URGENCY_OPTIONS.find((u) => u.id === order.urgency);
              const catMeta = CATEGORY_METADATA[order.category] || { color: '#64748b' };
              
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="vibrant-order-card"
                >
                  <div className="card-header">
                    <span className="cat-label" style={{ backgroundColor: catMeta.color }}>
                      {order.category}
                    </span>
                    {order.isNew && <span className="new-badge">NOVO</span>}
                  </div>

                  <div className="card-content">
                    <h2>{order.title}</h2>
                    <p>{order.description.substring(0, 120)}...</p>
                    <div className="loc-info">
                      <MapPin size={14} />
                      <span>{order.neighborhood}, {order.city}</span>
                    </div>
                  </div>

                  <div className="card-footer-info">
                    <div className="user-snippet">
                      <div className="user-avatar" style={{ backgroundColor: catMeta.color }}>
                        {order.userName.charAt(0)}
                      </div>
                      <span className="user-name">{order.userName}</span>
                    </div>
                    <div className="urg-status" style={{ color: urg?.color }}>
                      {urg?.icon}
                      <span>{urg?.label}</span>
                    </div>
                  </div>

                  <div className="card-buttons">
                    <button className="btn-v-view" onClick={() => setSelectedOrder(order)}>
                      <Eye size={18} />
                      Ver Detalhes
                    </button>
                    <button className="btn-v-help" onClick={() => setOrderToHelp(order)}>
                      <Heart size={18} />
                      Ajudar
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedOrder && (
            <ModalDetalhes 
              order={selectedOrder} 
              onClose={() => setSelectedOrder(null)} 
              onHelp={(order) => setOrderToHelp(order)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {orderToHelp && (
            <div className="qa-modal-overlay high-z" onClick={() => setOrderToHelp(null)}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="confirm-help-modal"
                onClick={e => e.stopPropagation()}
              >
                <div className="heart-icon-box">
                  <Heart size={48} fill="#ef4444" color="#ef4444" />
                </div>
                <h2>Deseja ajudar {orderToHelp.userName}?</h2>
                <p>
                  Iremos abrir um chat para que vocês possam combinar a entrega ou doação diretamente.
                </p>
                <div className="modal-confirm-actions">
                  <button className="btn-confirm-chat">
                    <MessageCircle size={20} />
                    Sim, conversar agora
                  </button>
                  <button className="btn-cancel-modal" onClick={() => setOrderToHelp(null)}>
                    Voltar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}