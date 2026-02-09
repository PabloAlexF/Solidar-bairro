import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSpring, animated, useTrail, useSprings } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Tooltip } from 'react-tooltip';
import apiService from '../../services/apiService';
import LandingHeader from '../../components/layout/LandingHeader';
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
  Receipt,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';
import './visibility-fix.css';

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
    description: 'Somos uma família de 4 pessoas e meu marido está desempregado. Precisamos de ajuda com itens básicos de alimentação para as crianças passarem o mês.',
    subCategories: ['cesta', 'proteinas', 'frescos'],
    subQuestionAnswers: {
      itens_cesta: ['Arroz', 'Feijão', 'Leite', 'Óleo', 'Macarrão'],
      familia: '4 pessoas (2 adultos, 2 crianças)',
      restricao: 'Diabetes (sem açúcar)',
      tipo_proteina: ['Ovos', 'Frango'],
      armazenamento_prot: 'Sim, possui geladeira',
      tipo_fresco: 'Batata, cebola e frutas da época'
    },
    isNew: true,
    createdAt: new Date().toISOString()
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
    isNew: true,
    createdAt: new Date().toISOString()
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
    },
    createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
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
    },
    createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
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
    },
    createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
  },
  // Adicionando pedidos de Belo Horizonte para teste
  {
    id: '6',
    userName: 'Pedro Santos',
    city: 'Belo Horizonte',
    state: 'MG',
    neighborhood: 'Savassi',
    urgency: 'urgente',
    category: 'Alimentos',
    title: 'Cesta Básica Urgente',
    userType: 'Cidadão',
    description: 'Perdi o emprego recentemente e preciso de ajuda com alimentação para minha família de 3 pessoas.',
    subCategories: ['cesta', 'proteinas'],
    subQuestionAnswers: {
      itens_cesta: ['Arroz', 'Feijão', 'Açúcar', 'Sal'],
      familia: '3 pessoas (2 adultos, 1 criança)',
      tipo_proteina: ['Ovos', 'Carne']
    },
    isNew: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    userName: 'Lucia Mendes',
    city: 'Belo Horizonte',
    state: 'MG',
    neighborhood: 'Centro',
    urgency: 'moderada',
    category: 'Medicamentos',
    title: 'Remédio para Pressão',
    userType: 'Cidadão',
    description: 'Preciso de ajuda para comprar medicamento para pressão alta. O remédio acabou e não consigo pelo SUS.',
    subCategories: ['continuo'],
    subQuestionAnswers: {
      medicamento_nome: 'Losartana 50mg',
      receita: 'Sim, tenho receita médica',
      med_continuo: 'Sim, uso diariamente'
    },
    createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
  },
  {
    id: '8',
    userName: 'Roberto Silva',
    city: 'Belo Horizonte',
    state: 'MG',
    neighborhood: 'Pampulha',
    urgency: 'critico',
    category: 'Contas',
    title: 'Conta de Luz Vencida',
    userType: 'Cidadão',
    description: 'Minha conta de luz está vencida há 2 meses e recebi aviso de corte. Tenho uma criança pequena em casa.',
    subCategories: ['luz'],
    subQuestionAnswers: {
      valor_luz: 'R$ 180,00',
      atraso_luz: '2 meses'
    },
    isNew: true,
    createdAt: new Date().toISOString()
  }
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

  // Animation refs
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Spring animations
  const headerSpring = useSpring({
    opacity: headerInView ? 1 : 0,
    transform: headerInView ? 'translateY(0px)' : 'translateY(-20px)',
    config: { tension: 280, friction: 60 }
  });

  const contentSpring = useSpring({
    opacity: contentInView ? 1 : 0,
    transform: contentInView ? 'translateX(0px)' : 'translateX(20px)',
    config: { tension: 280, friction: 60 }
  });

  // Trail animation for specs
  const allSpecs = { ...(order?.details || {}), ...(order?.subQuestionAnswers || {}) };
  const specsArray = Object.entries(allSpecs);
  const specsTrail = useTrail(specsArray.length, {
    opacity: contentInView ? 1 : 0,
    transform: contentInView ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 }
  });

  // Items trail animation
  const itemsTrail = useTrail(order?.subCategories?.length || 0, {
    opacity: contentInView ? 1 : 0,
    transform: contentInView ? 'scale(1)' : 'scale(0.9)',
    config: { tension: 280, friction: 60 }
  });

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

  const hasSpecs = Object.keys(allSpecs).length > 0;

  const scrollToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(id);
      toast.success(`Navegando para ${sections.find(s => s.id === id)?.label}`);
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
        <button 
          className="modal-close-btn-v3" 
          onClick={onClose} 
          data-tooltip-id="close-tooltip"
          data-tooltip-content="Fechar detalhes"
        >
          <X size={24} />
        </button>
        
        <div className="modal-sidebar-v3">
          <nav className="sidebar-nav-v3">
            {sections.map((s, index) => (
              <motion.button 
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`nav-item-v3 ${activeTab === s.id ? 'active' : ''}`}
                onClick={() => scrollToSection(s.id)}
                data-tooltip-id="nav-tooltip"
                data-tooltip-content={`Ver ${s.label.toLowerCase()}`}
              >
                {s.icon}
                <span>{s.label}</span>
                {activeTab === s.id && (
                  <motion.div 
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    style={{ backgroundColor: catMeta.color }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="modal-main-v3">
          <animated.header className="main-header-v3" style={headerSpring} ref={headerRef}>
            <div className="header-titles-v3">
              <motion.span 
                className="cat-badge-v3" 
                style={{ color: catMeta.color, backgroundColor: catMeta.color + '15' }}
                whileHover={{ scale: 1.05 }}
                data-tooltip-id="category-tooltip"
                data-tooltip-content={`Categoria: ${order.category}`}
              >
                {catMeta.icon}
                {order.category}
              </motion.span>
              <h2>{order.title || order.category}</h2>
              <p className="user-info-v3">
                Solicitado por <strong>{order.userName}</strong> • {order.userType || 'Cidadão'}
              </p>
            </div>
            <motion.div 
              className="header-urgency-v3" 
              style={{ color: urg?.color, borderColor: urg?.color }}
              whileHover={{ scale: 1.05 }}
              data-tooltip-id="urgency-tooltip"
              data-tooltip-content={urg?.desc}
            >
              {urg?.icon}
              <span>{urg?.label}</span>
            </motion.div>
          </animated.header>

          <animated.div className="modal-scroll-v3" ref={scrollContainerRef} style={contentSpring}>
            <div ref={contentRef}>
              <section id="section-historia" className="content-section-v3">
                <motion.div 
                  className="section-title-v3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MessageSquare size={20} />
                  <h3>O Relato de {order.userName.split(' ')[0]}</h3>
                </motion.div>
                <motion.div 
                  className="story-card-v3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="quote-mark">"</div>
                  <p>{order.description}</p>
                  <div className="quote-mark-end">"</div>
                </motion.div>
              </section>

              <section id="section-necessidades" className="content-section-v3">
                <motion.div 
                  className="section-title-v3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ShoppingCart size={20} />
                  <h3>Itens Necessários</h3>
                </motion.div>
                <div className="items-grid-v3">
                  {itemsTrail.map((style, index) => {
                    const sc = order.subCategories?.[index];
                    if (!sc) return null;
                    
                    return (
                      <animated.div 
                        key={sc} 
                        className="item-card-v3" 
                        style={{ ...style, borderLeftColor: catMeta.color }}
                      >
                        <div className="item-header-v3">
                          <h4>{catMeta.details[sc]?.label || sc}</h4>
                          {CONTEXT_INFO[sc] && (
                            <div 
                              className="context-hint-v3" 
                              data-tooltip-id="context-tooltip"
                              data-tooltip-content={CONTEXT_INFO[sc]}
                            >
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
                      </animated.div>
                    );
                  })}
                </div>
              </section>

              <section id="section-tecnico" className="content-section-v3">
                <motion.div 
                  className="section-title-v3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Info size={20} />
                  <h3>Detalhes e Especificações</h3>
                </motion.div>
                {hasSpecs ? (
                  <div className="enhanced-specs-grid">
                    {specsTrail.map((style, index) => {
                      const [key, val] = specsArray[index];
                      return (
                        <animated.div key={key} className="enhanced-spec-card" style={style}>
                          <div className="spec-header">
                            <Info size={16} className="spec-icon" />
                            <label className="spec-label">{SUB_QUESTION_LABELS[key] || key}</label>
                          </div>
                          <div className="spec-content">
                            {Array.isArray(val) ? (
                              <div className="spec-chips">
                                {val.map(v => (
                                  <motion.span 
                                    key={v} 
                                    className="spec-chip"
                                    whileHover={{ scale: 1.05 }}
                                    style={{ backgroundColor: catMeta.color + '20', color: catMeta.color }}
                                  >
                                    {v}
                                  </motion.span>
                                ))}
                              </div>
                            ) : (
                              <div className="spec-value">{val}</div>
                            )}
                          </div>
                        </animated.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div 
                    className="enhanced-empty-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Info size={48} className="empty-icon" />
                    <h4>Sem especificações adicionais</h4>
                    <p>Este pedido não possui detalhes técnicos específicos informados.</p>
                  </motion.div>
                )}
              </section>

              <section id="section-contato" className="content-section-v3">
                <motion.div 
                  className="section-title-v3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <MapPin size={20} />
                  <h3>Localização e Contato</h3>
                </motion.div>
                <motion.div 
                  className="contact-card-v3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
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
                      <span>
                        Contato preferencial via chat ou {order.subQuestionAnswers?.contato_pref || 'telefone'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </section>
            </div>
          </animated.div>

          <motion.footer 
            className="modal-footer-v3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <button className="btn-cancel-v3" onClick={onClose}>
              Voltar
            </button>
            <motion.button 
              className="btn-action-v3"
              onClick={() => {
                onHelp(order);
                onClose();
                toast.success('Conectando vocês! 💚');
              }}
              style={{ backgroundColor: catMeta.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-tooltip-id="help-action-tooltip"
              data-tooltip-content="Iniciar conversa para ajudar"
            >
              <Heart size={20} fill="white" />
              Quero Ajudar Agora
            </motion.button>
          </motion.footer>
        </div>
        
        <Tooltip 
          id="close-tooltip" 
          place="left"
          delayShow={200}
        />
        <Tooltip 
          id="nav-tooltip" 
          place="right"
          delayShow={200}
        />
        <Tooltip 
          id="category-tooltip" 
          place="top"
          delayShow={200}
        />
        <Tooltip 
          id="urgency-tooltip" 
          place="top"
          delayShow={200}
        />
        <Tooltip 
          id="context-tooltip" 
          place="top"
          delayShow={300}
        />
        <Tooltip 
          id="help-action-tooltip" 
          place="top"
          delayShow={300}
        />
        <Tooltip 
          id="accessibility-tooltip" 
          place="left"
          delayShow={200}
        />
      </motion.div>
    </div>
  );
}

// --- MAIN PAGE ---

// Accessibility and Navigation Helper Component
function AccessibilityHelper() {
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    setFontSize(savedFontSize);
    setHighContrast(savedContrast);
    
    document.documentElement.className = `font-${savedFontSize} ${savedContrast ? 'high-contrast' : ''}`;
  }, []);

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.className = document.documentElement.className.replace(/font-\w+/g, `font-${size}`);
    toast.success(`Tamanho da fonte: ${size === 'large' ? 'Grande' : size === 'small' ? 'Pequena' : 'Normal'}`);
  };

  const toggleContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    localStorage.setItem('highContrast', newContrast.toString());
    document.documentElement.classList.toggle('high-contrast', newContrast);
    toast.success(newContrast ? 'Alto contraste ativado' : 'Alto contraste desativado');
  };

  return (
    <>
      <motion.button
        className="accessibility-toggle"
        onClick={() => setShowHelper(!showHelper)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        data-tooltip-id="accessibility-tooltip"
        data-tooltip-content="Opções de acessibilidade"
      >
        ♿ Acessibilidade
      </motion.button>
      
      <AnimatePresence>
        {showHelper && (
          <div className="filters-modal-overlay" onClick={() => setShowHelper(false)}>
            <motion.div
              className="accessibility-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
            <h3>Acessibilidade</h3>
            
            <div className="accessibility-group">
              <label>Tamanho da Fonte:</label>
              <div className="font-controls">
                <button 
                  className={fontSize === 'small' ? 'active' : ''}
                  onClick={() => changeFontSize('small')}
                >
                  A-
                </button>
                <button 
                  className={fontSize === 'normal' ? 'active' : ''}
                  onClick={() => changeFontSize('normal')}
                >
                  A
                </button>
                <button 
                  className={fontSize === 'large' ? 'active' : ''}
                  onClick={() => changeFontSize('large')}
                >
                  A+
                </button>
              </div>
            </div>
            
            <div className="accessibility-group">
              <button 
                className={`contrast-btn ${highContrast ? 'active' : ''}`}
                onClick={toggleContrast}
              >
                {highContrast ? '🌙' : '☀️'} Alto Contraste
              </button>
            </div>
            
            <button 
              className="close-accessibility"
              onClick={() => setShowHelper(false)}
            >
              ✕
            </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
function AnimatedBackground() {
  return (
    <div className="animated-background">
      {/* Floating geometric shapes */}
      <div className="geometric-shapes">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={`shape shape-${(i % 8) + 1}`}
            style={{
              '--delay': `${i * 1.5}s`,
              '--duration': `${20 + i * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Gradient orbs */}
      <div className="gradient-orbs">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`orb orb-${(i % 5) + 1}`}
            style={{
              '--delay': `${i * 2}s`,
              '--size': `${120 + i * 40}px`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function QueroAjudarPage() {
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  // Animation hooks
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [cardsRef, cardsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Spring animations
  const headerSpring = useSpring({
    opacity: headerInView ? 1 : 0,
    transform: headerInView ? 'translateY(0px)' : 'translateY(-50px)',
    config: { tension: 280, friction: 60 }
  });

  const filterButtonSpring = useSpring({
    scale: showFiltersModal ? 1.05 : 1,
    config: { tension: 300, friction: 10 }
  });

  // Transform backend data to frontend format
  const transformPedidoData = (pedido) => {
    // Extrair cidade e estado da localização
    let city = 'Porto Alegre';
    let state = 'RS';
    let neighborhood = 'Centro';
    
    // Mapeamento de estados por nome completo para sigla
    const stateMapping = {
      'Minas Gerais': 'MG',
      'São Paulo': 'SP', 
      'Rio Grande do Sul': 'RS',
      'Rio de Janeiro': 'RJ',
      'Bahia': 'BA',
      'Paraná': 'PR',
      'Santa Catarina': 'SC',
      'Goiás': 'GO',
      'Pernambuco': 'PE',
      'Ceará': 'CE'
    };
    
    // Priorizar campos diretos
    if (pedido.city && pedido.state) {
      city = pedido.city;
      // Converter nome do estado para sigla se necessário
      state = stateMapping[pedido.state] || pedido.state;
      neighborhood = pedido.neighborhood || 'Centro';
    } 
    // Fallback para campo location
    else if (pedido.location) {
      try {
        // Tentar diferentes formatos de localização
        const locationStr = pedido.location.toString();
        
        // Formato: "Cidade, Estado - Bairro" ou "Bairro, Cidade - Estado"
        if (locationStr.includes(',') && locationStr.includes('-')) {
          const [part1, part2] = locationStr.split('-').map(s => s.trim());
          const [subPart1, subPart2] = part1.split(',').map(s => s.trim());
          
          // Assumir que o estado é sempre 2 letras ou nome completo
          if (part2.length === 2 || stateMapping[part2]) {
            state = stateMapping[part2] || part2;
            city = subPart2 || subPart1;
            neighborhood = subPart2 ? subPart1 : 'Centro';
          } else {
            city = subPart1;
            state = stateMapping[subPart2] || subPart2 || 'RS';
            neighborhood = part2;
          }
        }
        // Formato: "Cidade, Estado"
        else if (locationStr.includes(',')) {
          const parts = locationStr.split(',').map(s => s.trim());
          city = parts[0];
          state = stateMapping[parts[1]] || parts[1] || 'RS';
        }
        // Formato simples: apenas cidade
        else {
          city = locationStr;
        }
      } catch (error) {
        console.warn('Erro ao processar localização:', pedido.location, error);
      }
    }
    
    // Garantir que state seja sempre maiúsculo e tenha 2 caracteres
    state = state.toUpperCase();
    if (state.length !== 2) {
      // Se ainda não é uma sigla válida, tentar mapear novamente
      state = stateMapping[state] || 'RS'; // fallback
    }
    
    return {
      id: pedido.id,
      userName: pedido.usuario?.nome || pedido.userName || 'Usuário',
      city: city,
      state: state,
      neighborhood: neighborhood,
      urgency: pedido.urgency || 'moderada',
      category: pedido.category || 'Outros',
      title: pedido.title || `${pedido.category} - ${pedido.subCategory?.join(', ') || 'Ajuda'}`,
      userType: pedido.usuario?.tipo || pedido.userType || 'Cidadão',
      description: pedido.description || 'Sem descrição',
      subCategories: pedido.subCategory || [],
      subQuestionAnswers: pedido.subQuestionAnswers || {},
      isNew: new Date(pedido.createdAt) > new Date(Date.now() - 24*60*60*1000),
      userId: pedido.userId,
      createdAt: pedido.createdAt
    };
  };

  // Load pedidos with filters
  const loadPedidos = async (filters = {}) => {
    setLoadingPedidos(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Apenas adicionar parâmetros que têm valor
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const url = queryParams.toString() ? `/pedidos?${queryParams.toString()}` : '/pedidos';
      console.log('Fazendo requisição para:', url);
      
      const response = await apiService.get(url);
      
      if (response.success) {
        const transformedPedidos = response.data.map(transformPedidoData);
        setPedidos(transformedPedidos);
        console.log(`Carregados ${transformedPedidos.length} pedidos`);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      toast.error('Erro ao carregar pedidos');
      setPedidos(MOCK_ORDERS);
    } finally {
      setLoadingPedidos(false);
    }
  };

  // Get user's location and load pedidos
  useEffect(() => {
    const loadData = async () => {
      const savedFontSize = localStorage.getItem('fontSize') || 'normal';
      const savedContrast = localStorage.getItem('highContrast') === 'true';
      setFontSize(savedFontSize);
      setHighContrast(savedContrast);
      
      document.documentElement.className = `font-${savedFontSize} ${savedContrast ? 'high-contrast' : ''}`;
      
      setIsLoading(true);
      
      // Load initial pedidos
      await loadPedidos();
      
      // Get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            let detectedState = 'MG';
            let detectedCity = 'Belo Horizonte';
            
            // Coordenadas aproximadas para diferentes regiões
            if (latitude >= -20.5 && latitude <= -19.5 && longitude >= -44.5 && longitude <= -43.5) {
              detectedState = 'MG';
              detectedCity = 'Belo Horizonte';
            } else if (latitude >= -24 && latitude <= -23 && longitude >= -47 && longitude <= -46) {
              detectedState = 'SP';
              detectedCity = 'São Paulo';
            } else if (latitude >= -31 && latitude <= -29 && longitude >= -52 && longitude <= -50) {
              detectedState = 'RS';
              detectedCity = 'Porto Alegre';
            }
            
            setUserLocation({ state: detectedState, city: detectedCity });
            setTimeout(() => setIsLoading(false), 1000);
          },
          (error) => {
            console.log('Location access denied');
            setUserLocation({ state: 'MG', city: 'Belo Horizonte' });
            setTimeout(() => setIsLoading(false), 1000);
          }
        );
      } else {
        setUserLocation({ state: 'MG', city: 'Belo Horizonte' });
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    
    loadData();
  }, []);

  // Group cities by state
  const citiesByState = useMemo(() => {
    const grouped = {};
    const ordersToUse = pedidos.length > 0 ? pedidos : MOCK_ORDERS;
    ordersToUse.forEach(order => {
      const state = order.state || order.usuario?.estado || 'RS';
      const city = order.city || order.usuario?.cidade || order.location || 'Porto Alegre';
      if (!grouped[state]) {
        grouped[state] = new Set();
      }
      grouped[state].add(city);
    });
    
    // Convert Sets to sorted arrays
    Object.keys(grouped).forEach(state => {
      grouped[state] = Array.from(grouped[state]).sort();
    });
    
    return grouped;
  }, [pedidos]);

  // Apply filters - client-side filtering for better performance
  const filteredOrders = useMemo(() => {
    let filtered = pedidos.length > 0 ? pedidos : MOCK_ORDERS;
    
    console.log('=== FILTROS APLICADOS ===');
    console.log('Total de pedidos:', filtered.length);
    console.log('Dados dos pedidos:', filtered.map(p => ({ id: p.id, city: p.city, state: p.state, category: p.category })));
    console.log('Localização do usuário:', userLocation);
    console.log('Filtro selecionado:', selectedLocation);
    
    // Category filter
    if (selectedCat !== 'Todas') {
      filtered = filtered.filter(order => order.category === selectedCat);
      console.log(`Após filtro categoria: ${filtered.length} pedidos`);
    }
    
    // Urgency filter
    if (selectedUrgency) {
      filtered = filtered.filter(order => order.urgency === selectedUrgency);
      console.log(`Após filtro urgência: ${filtered.length} pedidos`);
    }
    
    // Location filter - com normalização de strings
    if (selectedLocation === 'meu_estado' && userLocation) {
      filtered = filtered.filter(order => {
        const orderState = order.state?.toUpperCase().trim();
        const userState = userLocation.state?.toUpperCase().trim();
        console.log(`Comparando estados: "${orderState}" === "${userState}"`);
        return orderState === userState;
      });
      console.log(`Após filtro meu estado (${userLocation.state}): ${filtered.length} pedidos`);
    } else if (selectedLocation === 'minha_cidade' && userLocation) {
      filtered = filtered.filter(order => {
        const orderCity = order.city?.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const userCity = userLocation.city?.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const orderState = order.state?.toUpperCase().trim();
        const userState = userLocation.state?.toUpperCase().trim();
        
        console.log(`Comparando: cidade "${orderCity}" === "${userCity}" && estado "${orderState}" === "${userState}"`);
        return orderCity === userCity && orderState === userState;
      });
      console.log(`Após filtro minha cidade (${userLocation.city}): ${filtered.length} pedidos`);
    } else if (selectedLocation !== 'brasil' && selectedLocation.includes(',')) {
      const [city, state] = selectedLocation.split(', ');
      filtered = filtered.filter(order => {
        const orderCity = order.city?.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const filterCity = city?.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const orderState = order.state?.toUpperCase().trim();
        const filterState = state?.toUpperCase().trim();
        
        return orderCity === filterCity && orderState === filterState;
      });
      console.log(`Após filtro cidade específica (${city}): ${filtered.length} pedidos`);
    }
    
    // Timeframe filter
    if (selectedTimeframe !== 'todos') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt || Date.now());
        
        switch (selectedTimeframe) {
          case 'hoje':
            return orderDate >= today;
          case 'semana':
            return orderDate >= weekAgo;
          case 'mes':
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
      console.log(`Após filtro período: ${filtered.length} pedidos`);
    }
    
    // Only new filter
    if (onlyNew) {
      filtered = filtered.filter(order => order.isNew);
      console.log(`Após filtro apenas novos: ${filtered.length} pedidos`);
    }
    
    console.log('=== RESULTADO FINAL ===', filtered.length, 'pedidos');
    return filtered;
  }, [pedidos, selectedCat, selectedUrgency, selectedLocation, selectedTimeframe, onlyNew, userLocation]);

  // Load pedidos only once on mount
  useEffect(() => {
    loadPedidos();
  }, []);

  // Trail animation for cards
  const trail = useTrail(filteredOrders.length, {
    opacity: cardsInView ? 1 : 0,
    transform: cardsInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 280, friction: 60 }
  });

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.className = document.documentElement.className.replace(/font-\w+/g, `font-${size}`);
    toast.success(`Tamanho da fonte: ${size === 'large' ? 'Grande' : size === 'small' ? 'Pequena' : 'Normal'}`);
  };

  const toggleContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    localStorage.setItem('highContrast', newContrast.toString());
    document.documentElement.classList.toggle('high-contrast', newContrast);
    toast.success(newContrast ? 'Alto contraste ativado' : 'Alto contraste desativado');
  };

  return (
    <div className="qa-page">
      <LandingHeader />
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
      <AnimatedBackground />
      
      <div className="qa-main-wrapper" id="main-content" style={{ paddingTop: '80px' }}>
        
        <animated.header className="page-header" style={headerSpring} ref={headerRef}>
          <div className="brand-box">
            <div className="brand-logo">
              <Heart size={32} fill="#ef4444" color="#ef4444" />
            </div>
            <div className="brand-info">
              <h1>Solidariedade <span>Próxima</span></h1>
              <p>Conectando quem precisa com quem pode ajudar</p>
            </div>
          </div>

        <div className="header-controls">
          <motion.button
            className="btn-home"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-tooltip-id="home-tooltip"
            data-tooltip-content="Voltar para a página inicial"
          >
            <Home size={20} />
            <span>Início</span>
          </motion.button>
          <motion.button
            className="accessibility-toggle"
            onClick={() => setShowHelper(!showHelper)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            data-tooltip-id="accessibility-tooltip"
            data-tooltip-content="Opções de acessibilidade"
          >
            Acessibilidade
          </motion.button>
          <animated.button 
            className={`btn-toggle-filters ${showFiltersModal ? 'active' : ''}`}
            onClick={() => {
              setShowFiltersModal(true);
              toast.success('Filtros abertos!');
            }}
            style={filterButtonSpring}
            data-tooltip-id="filter-tooltip"
            data-tooltip-content="Clique para abrir filtros avançados"
          >
            <Filter size={20} />
            <span>Filtros Avançados</span>
            {(selectedCat !== 'Todas' || selectedUrgency || (selectedLocation !== 'brasil' && selectedLocation !== 'todas') || selectedTimeframe !== 'todos' || onlyNew) && <div className="active-filter-indicator" />}
          </animated.button>
        </div>
        </animated.header>

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
                        onClick={() => {
                          setSelectedLocation('brasil');
                          toast.success('Mostrando pedidos de todo o Brasil');
                        }}
                      >
                        🇧🇷 Todo o Brasil
                      </button>
                      {userLocation && (
                        <>
                          <button
                            className={`filter-option ${selectedLocation === 'meu_estado' ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedLocation('meu_estado');
                              toast.success(`Filtrando por estado: ${userLocation.state}`);
                            }}
                          >
                            📍 Meu Estado ({userLocation.state})
                          </button>
                          <button
                            className={`filter-option ${selectedLocation === 'minha_cidade' ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedLocation('minha_cidade');
                              toast.success(`Filtrando por cidade: ${userLocation.city}`);
                            }}
                          >
                            🏠 Minha Cidade ({userLocation.city})
                          </button>
                        </>
                      )}
                    </div>
                    
                    {userLocation && (selectedLocation === 'meu_estado' || selectedLocation.includes(userLocation.state)) && (
                      <div className="state-section">
                        <h4>🏙️ Cidades em {userLocation.state}:</h4>
                        <select 
                          className="city-dropdown"
                          value={selectedLocation}
                          onChange={(e) => {
                            setSelectedLocation(e.target.value);
                            const selectedValue = e.target.value;
                            if (selectedValue === 'meu_estado') {
                              toast.success(`Mostrando todas as cidades de ${userLocation.state}`);
                            } else {
                              const cityName = selectedValue.split(', ')[0];
                              toast.success(`Filtrando por: ${cityName}`);
                            }
                          }}
                        >
                          <option value="meu_estado">🌆 Todas as cidades do estado</option>
                          {citiesByState[userLocation.state]?.map(city => (
                            <option key={city} value={`${city}, ${userLocation.state}`}>
                              🏘️ {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Mostrar outras opções de estados se houver dados */}
                    {Object.keys(citiesByState).length > 1 && (
                      <div className="other-states-section">
                        <h4>🗺️ Outros Estados:</h4>
                        <div className="states-grid">
                          {Object.keys(citiesByState)
                            .filter(state => state !== userLocation?.state)
                            .map(state => (
                              <button
                                key={state}
                                className={`state-btn ${selectedLocation.includes(state) ? 'active' : ''}`}
                                onClick={() => {
                                  setSelectedLocation(`${citiesByState[state][0]}, ${state}`);
                                  toast.success(`Filtrando por: ${state}`);
                                }}
                              >
                                {state}
                              </button>
                            ))
                          }
                        </div>
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
                          onClick={() => {
                            setSelectedCat(cat.id);
                            toast.success(`Categoria selecionada: ${cat.label}`);
                          }}
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
                          onClick={() => {
                            const newUrgency = selectedUrgency === opt.id ? null : opt.id;
                            setSelectedUrgency(newUrgency);
                            toast.success(newUrgency ? `Urgência: ${opt.label}` : 'Filtro de urgência removido');
                          }}
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
                        onClick={() => {
                          setSelectedTimeframe('todos');
                          toast.success('Mostrando todos os períodos');
                        }}
                      >
                        Todos os Períodos
                      </button>
                      <button
                        className={`filter-option ${selectedTimeframe === 'hoje' ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedTimeframe('hoje');
                          toast.success('Filtrando pedidos de hoje');
                        }}
                      >
                        Hoje
                      </button>
                      <button
                        className={`filter-option ${selectedTimeframe === 'semana' ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedTimeframe('semana');
                          toast.success('Filtrando última semana');
                        }}
                      >
                        Última Semana
                      </button>
                      <button
                        className={`filter-option ${selectedTimeframe === 'mes' ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedTimeframe('mes');
                          toast.success('Filtrando último mês');
                        }}
                      >
                        Último Mês
                      </button>
                    </div>
                  </div>

                  <div className="filter-section">
                    <h3>Novidades</h3>
                    <div className="filter-options">
                      <button
                        className={`filter-option ${onlyNew ? 'active' : ''}`}
                        onClick={() => {
                          setOnlyNew(!onlyNew);
                          toast.success(onlyNew ? 'Mostrando todos os pedidos' : 'Mostrando apenas pedidos novos');
                        }}
                      >
                        Apenas Pedidos Novos (24h)
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
                      toast.success('Todos os filtros foram limpos!');
                    }}
                  >
                    Limpar Filtros
                  </button>
                  <button 
                    className="btn-apply-filters"
                    onClick={() => {
                      setShowFiltersModal(false);
                      toast.success(`Filtros aplicados! ${filteredOrders.length} pedidos encontrados.`);
                    }}
                  >
                    Aplicar Filtros
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="results-count">
          <p>Encontramos <strong>{loadingPedidos ? <Skeleton width={30} /> : filteredOrders.length}</strong> pedidos para você ajudar</p>
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '8px' }}>
              Filtros ativos: {selectedCat !== 'Todas' ? `Categoria: ${selectedCat}` : ''}
              {selectedUrgency ? ` | Urgência: ${selectedUrgency}` : ''}
              {selectedLocation !== 'brasil' ? ` | Local: ${selectedLocation}` : ''}
              {selectedTimeframe !== 'todos' ? ` | Período: ${selectedTimeframe}` : ''}
              {onlyNew ? ' | Apenas novos' : ''}
            </div>
          )}
        </div>

        <div className="orders-grid-layout" ref={cardsRef}>
          <AnimatePresence>
            {showHelper && (
              <div className="accessibility-overlay">
                <motion.div
                  className="accessibility-modal"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={e => e.stopPropagation()}
                >
                  <h3>Acessibilidade</h3>
                  
                  <div className="accessibility-group">
                    <label>Tamanho da Fonte:</label>
                    <div className="font-controls">
                      <button 
                        className={fontSize === 'small' ? 'active' : ''}
                        onClick={() => changeFontSize('small')}
                      >
                        A-
                      </button>
                      <button 
                        className={fontSize === 'normal' ? 'active' : ''}
                        onClick={() => changeFontSize('normal')}
                      >
                        A
                      </button>
                      <button 
                        className={fontSize === 'large' ? 'active' : ''}
                        onClick={() => changeFontSize('large')}
                      >
                        A+
                      </button>
                    </div>
                  </div>
                  
                  <div className="accessibility-group">
                    <button 
                      className={`contrast-btn ${highContrast ? 'active' : ''}`}
                      onClick={toggleContrast}
                    >
                      {highContrast ? 'Desativar' : 'Ativar'} Alto Contraste
                    </button>
                  </div>
                  
                  <button 
                    className="close-accessibility"
                    onClick={() => setShowHelper(false)}
                  >
                    X
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          {loadingPedidos ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="vibrant-order-card">
                <div className="card-header">
                  <Skeleton height={24} width={80} />
                  <Skeleton height={24} width={50} />
                </div>
                <div className="card-content">
                  <Skeleton height={32} width="80%" />
                  <Skeleton count={3} />
                  <Skeleton height={20} width={120} />
                </div>
                <div className="card-footer-info">
                  <Skeleton height={32} width={32} circle />
                  <Skeleton height={24} width={60} />
                </div>
                <div className="card-buttons">
                  <Skeleton height={48} />
                </div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {trail.map((style, index) => {
                const order = filteredOrders[index];
                if (!order) return null;
                
                const urg = URGENCY_OPTIONS.find((u) => u.id === order.urgency);
                const catMeta = CATEGORY_METADATA[order.category] || { color: '#64748b' };
                
                return (
                  <animated.div key={order.id} style={style}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="vibrant-order-card"
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    >
                      <div className="card-header">
                        <span 
                          className="cat-label" 
                          style={{ backgroundColor: catMeta.color }}
                          data-tooltip-id="category-tooltip"
                          data-tooltip-content={`Categoria: ${order.category}`}
                        >
                          {order.category}
                        </span>
                        {order.isNew && (
                          <span 
                            className="new-badge"
                            data-tooltip-id="new-tooltip"
                            data-tooltip-content="Pedido recente!"
                          >
                            NOVO
                          </span>
                        )}
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
                        <div 
                          className="urg-status" 
                          style={{ color: urg?.color }}
                          data-tooltip-id="urgency-tooltip"
                          data-tooltip-content={urg?.desc}
                        >
                          {urg?.icon}
                          <span>{urg?.label}</span>
                        </div>
                      </div>

                      <div className="card-buttons">
                        <button 
                          className="btn-v-view" 
                          onClick={() => setSelectedOrder(order)}
                          data-tooltip-id="view-tooltip"
                          data-tooltip-content="Ver detalhes completos"
                          aria-label={`Ver detalhes de ${order.title}`}
                        >
                          <Eye size={18} />
                          Ver Detalhes
                        </button>
                        <button 
                          className="btn-v-help" 
                          onClick={() => {
                            setOrderToHelp(order);
                            toast.success('Que gesto lindo! Vamos conectar vocês.');
                          }}
                          data-tooltip-id="help-tooltip"
                          data-tooltip-content="Oferecer ajuda"
                          aria-label={`Ajudar ${order.userName} com ${order.title}`}
                        >
                          <Heart size={18} />
                          Ajudar
                        </button>
                      </div>
                    </motion.div>
                  </animated.div>
                );
              })}
            </AnimatePresence>
          )}
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
                  <button 
                    className="btn-confirm-chat"
                    onClick={async () => {
                      try {
                        const conversationData = {
                          participants: [orderToHelp.userId],
                          pedidoId: orderToHelp.id,
                          type: 'ajuda',
                          title: `Ajuda: ${orderToHelp.title}`
                        };
                        
                        const response = await apiService.createConversation(conversationData);
                        
                        if (response.success) {
                          toast.success('Conversa iniciada! Redirecionando...');
                          setTimeout(() => {
                            navigate('/conversas');
                          }, 1500);
                        } else {
                          throw new Error(response.error || 'Erro ao criar conversa');
                        }
                      } catch (error) {
                        console.error('Erro ao criar conversa:', error);
                        toast.error('Erro ao iniciar conversa: ' + error.message);
                      }
                      setOrderToHelp(null);
                    }}
                  >
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
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '600'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff'
              }
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff'
              }
            }
          }}
        />
        
        <Tooltip 
          id="home-tooltip" 
          place="bottom"
          delayShow={200}
        />
        <Tooltip 
          id="filter-tooltip" 
          place="bottom"
          delayShow={300}
        />
        <Tooltip 
          id="category-tooltip" 
          place="top"
          delayShow={200}
        />
        <Tooltip 
          id="new-tooltip" 
          place="top"
          delayShow={200}
        />
        <Tooltip 
          id="urgency-tooltip" 
          place="top"
          delayShow={200}
        />
        <Tooltip 
          id="view-tooltip" 
          place="top"
          delayShow={300}
        />
        <Tooltip 
          id="help-tooltip" 
          place="top"
          delayShow={300}
        />
      </div>
    </div>
  );
}

