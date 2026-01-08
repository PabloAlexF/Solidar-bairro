import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useToast } from '../hooks/useToast';
import { formatAddress, formatLocation, formatNeighborhood, safeRenderAddress } from '../utils/addressUtils';
import { 
  MapPin, 
  Heart,
  User,
  ChevronLeft,
  ChevronRight,
  AlertTriangle, 
  Zap, 
  Calendar, 
  Coffee, 
  RefreshCcw,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './quero-ajudar.css';

// --- Constants ---
const DETAIL_LABELS = {
  tamanho: 'Tamanho',
  restricao: 'Restrição',
  medicamento: 'Medicamento',
  dosagem: 'Dosagem',
  estilo: 'Estilo',
  itens: 'Itens',
  quantidade: 'Quantidade'
};

const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato', icon: <AlertTriangle size={20} />, color: '#ef4444' },
  { id: 'urgente', label: 'URGENTE', desc: 'Necessidade urgente', icon: <Zap size={20} />, color: '#f97316' },
  { id: 'moderada', label: 'MODERADA', desc: 'Próximos dias', icon: <Calendar size={20} />, color: '#f59e0b' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem pressa', icon: <Coffee size={20} />, color: '#10b981' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Ajuda mensal', icon: <RefreshCcw size={20} />, color: '#6366f1' },
];

const CATEGORIES = [
  { id: 'Todas', label: 'Todas Categorias' },
  { id: 'Alimentos', label: 'Alimentos' },
  { id: 'Roupas', label: 'Roupas' },
  { id: 'Calçados', label: 'Calçados' },
  { id: 'Medicamentos', label: 'Medicamentos' },
  { id: 'Higiene', label: 'Higiene' },
  { id: 'Contas', label: 'Contas' },
  { id: 'Emprego', label: 'Emprego' },
  { id: 'Móveis', label: 'Móveis' },
  { id: 'Eletrodomésticos', label: 'Eletrodomésticos' },
  { id: 'Transporte', label: 'Transporte' },
  { id: 'Outros', label: 'Outros' },
];

// --- Mock Data ---
const MOCK_ORDERS = [
  {
    id: '1',
    userName: 'Maria Silva',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Jardins',
    urgency: 'urgente',
    category: 'Alimentos',
    title: 'Cesta Básica, Alimentos Frescos',
    userType: 'Cidadão',
    description: 'Somos uma família de 4 pessoas e meu marido está desempregado. Precisamos de ajuda com itens básicos de alimentação e hortifruti para as crianças.',
    subCategories: ['Cesta Básica', 'Hortifruti', 'Proteínas'],
    details: { tamanho: 'Família 4 pessoas', restricao: 'Sem açúcar' },
    isNew: true
  },
  {
    id: '2',
    userName: 'João Pereira',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Capão Redondo',
    urgency: 'critico',
    category: 'Medicamentos',
    title: 'Insulina e Medidor de Glicemia',
    userType: 'Cidadão',
    description: 'Sou diabético e minha medicação acabou. Não estou conseguindo pelo posto este mês e não tenho condições de comprar agora.',
    subCategories: ['Uso Contínuo'],
    details: { medicamento: 'Insulina NPH', dosagem: '100 UI' },
    isNew: true
  },
  {
    id: '3',
    userName: 'Ana Costa',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Lapa',
    urgency: 'moderada',
    category: 'Roupas',
    title: 'Roupas de Inverno para Crianças',
    userType: 'Cidadão',
    description: 'Meus filhos cresceram e as roupas de frio do ano passado não servem mais. Qualquer doação de agasalhos tamanho 8 e 10 ajudaria muito.',
    subCategories: ['Agasalhos', 'Blusas'],
    details: { tamanho: '8 e 10', estilo: 'Infantil' }
  },
  {
    id: '4',
    userName: 'Roberto Santos',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Itaquera',
    urgency: 'recorrente',
    category: 'Higiene',
    title: 'Fraldas G e Itens de Banho',
    userType: 'Cidadão',
    description: 'Tenho um bebê de 1 ano e as fraldas pesam muito no orçamento. Se alguém puder ajudar com pacotes G ou sabonete infantil.',
    subCategories: ['Fraldas', 'Banho'],
    details: { tamanho: 'G', itens: 'Sabonete, Lenço' }
  },
];

// --- Subcomponents ---

function ModalDetalhes({ order, onClose, onHelp }) {
  if (!order) return null;

  const urg = URGENCY_OPTIONS.find(u => u.id === (order.urgencia || order.urgency));

  return (
    <AnimatePresence>
      <div className="qa-modal-overlay" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="qa-modal-content"
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close-abs" onClick={onClose}><X size={20} /></button>
          <div className="modal-hero-stripe" />
          
          <div className="modal-body-qa">
            <header className="modal-header-qa">
              <div className="modal-user-profile">
                <div className="user-avatar-placeholder">
                  {(order.usuarioNome || order.nomeUsuario || order.userName || 'U').charAt(0)}
                </div>
                <div className="user-meta-qa">
                  <h3>{order.usuarioNome || order.nomeUsuario || order.userName || 'Usuário'}</h3>
                  <div className="user-sub-meta">
                    <span className="user-type-badge">{order.tipoUsuario || order.userType || 'Cidadão'}</span>
                    <span className="user-loc-modal">
                      <MapPin size={14} />
                      {safeRenderAddress(formatLocation(order.endereco, order.cidade || order.city, order.estado || order.state))}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="urgency-status-modal" style={{ '--urg-color': urg?.color }}>
                <div className="urg-icon-modal">{urg?.icon}</div>
                <div className="urg-text-modal">
                  <span className="urg-label-modal">{urg?.label}</span>
                  <span className="urg-desc-modal">{urg?.desc}</span>
                </div>
              </div>
            </header>

            <div className="details-grid-qa">
              <div className="detail-section-qa">
                <h4>A História</h4>
                <div className="detail-story-qa">
                  <span className="quote-mark">“</span>
                  {order.descricao || order.description || 'Sem descrição'}
                  <span className="quote-mark-end">”</span>
                </div>
              </div>

              <div className="modal-info-columns">
                <div className="detail-section-qa">
                  <h4>Itens Solicitados</h4>
                  <div className="items-list-qa">
                    {(order.subCategorias || order.subCategories || []).map((item) => (
                      <span key={item} className="item-badge-qa">
                        <Zap size={14} />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="detail-section-qa">
                  <h4>Detalhes Específicos</h4>
                  <div className="specs-grid">
                    {Object.entries(order.detalhes || order.details || {}).map(([key, val]) => (
                      <div key={key} className="spec-item">
                        <span className="spec-key">{DETAIL_LABELS[key] || key}</span>
                        <span className="spec-val">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="location-card-modal">
                <div className="loc-icon-box">
                  <MapPin size={24} />
                </div>
                <div className="loc-content-modal">
                  <strong>Local de Retirada/Entrega</strong>
                  <p>{safeRenderAddress(formatLocation(order.endereco, order.cidade || order.city, order.estado || order.state))}</p>
                  <span>O endereço exato será compartilhado após o contato inicial.</span>
                </div>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button 
                className="btn-card-help-full" 
                onClick={() => {
                  onHelp(order);
                  onClose();
                }}
              >
                Quero Ajudar Agora
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// --- Main Page ---

export default function QueroAjudarPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [selectedUrgency, setSelectedUrgency] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToHelp, setOrderToHelp] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await apiService.getPedidos();
        console.log('Dados da API:', response);
        if (response.success) {
          const ordersWithUserData = (response.data || []).map(order => ({
            ...order,
            userName: order.usuario?.nome || 'Usuário',
            userType: order.usuario?.tipo || 'cidadao',
            items: order.subCategory || [],
            urgencia: order.urgency,
            descricao: order.description,
            categoria: order.category,
            subCategorias: order.subCategory || [],
            detalhes: order.subQuestionAnswers || {},
            location: order.location || 'São Paulo, SP'
          }));
          setOrders(ordersWithUserData);
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const catMatch = selectedCat === 'Todas' || order.category === selectedCat;
      const urgMatch = !selectedUrgency || order.urgency === selectedUrgency;
      return catMatch && urgMatch;
    });
  }, [orders, selectedCat, selectedUrgency]);

  const clearFilters = () => {
    setSelectedCat('Todas');
    setSelectedUrgency(null);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="quero-ajudar-container">
      <header className="qa-header">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          Pedidos perto de você
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          Explore as necessidades da sua comunidade e transforme vidas com pequenos gestos.
        </motion.p>
        <button className="btn-filters" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </header>

      {showFilters && (
        <section className="qa-filters-section">
          <div className="filter-group">
            <label className="filter-label">Categorias</label>
            <div className="categories-wrapper">
              <button className="scroll-btn left" onClick={() => scroll('left')}><ChevronLeft size={20} /></button>
              <div className="categories-scroll" ref={scrollRef}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-chip ${selectedCat === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCat(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <button className="scroll-btn right" onClick={() => scroll('right')}><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Nível de Urgência</label>
            <div className="urgency-grid">
              {URGENCY_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  className={`urgency-card-filter ${selectedUrgency === opt.id ? 'active' : ''}`}
                  style={{ 
                    '--accent-color': opt.color,
                  }}
                  onClick={() => setSelectedUrgency(selectedUrgency === opt.id ? null : opt.id)}
                >
                  <div className="urgency-icon">{opt.icon}</div>
                  <div className="urgency-info">
                    <span className="urgency-title">{opt.label}</span>
                    <span className="urgency-desc">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn-qa-clear" onClick={clearFilters}>Limpar Filtros</button>
            <button className="btn-qa-apply">Filtrar Pedidos</button>
          </div>
        </section>
      )}

      <div className="qa-stats">
        {loading ? 'Carregando pedidos...' : `Encontramos ${filteredOrders.length} pedidos correspondentes`}
      </div>

      <div className="orders-grid">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Carregando...</div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="order-card"
              >
                <div className="card-header">
                  <div className="user-info">
                    <div className="user-header-row">
                      <span className="user-name">{order.userName || 'Usuário'}</span>
                      {order.isNew && <span className="new-badge">Novo</span>}
                    </div>
                    <div className="user-loc">
                      <MapPin size={14} />
                      <span>{safeRenderAddress(formatNeighborhood(order.endereco, order.bairro || order.neighborhood) || order.location || 'Localização não informada')}</span>
                    </div>
                  </div>
                  {(() => {
                    const urg = URGENCY_OPTIONS.find(u => u.id === order.urgency);
                    return (
                      <div className="urgency-tag" style={{ background: urg?.color + '15', color: urg?.color }}>
                        {urg?.label || 'MODERADA'}
                      </div>
                    );
                  })()}
                </div>

                <h3 className="card-title">{order.subCategory?.join(', ') || order.category}</h3>

                <div className="user-type-tag">
                  <User size={12} />
                  <span>Categoria: {order.category}</span>
                </div>

                <p className="card-desc">{order.description || 'Sem descrição'}</p>

                <div className="card-footer">
                  <button className="btn-card-details" onClick={() => setSelectedOrder(order)}>
                    Detalhes
                  </button>
                  <button className="btn-card-help" onClick={() => setOrderToHelp(order)}>
                    Ajudar
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <ModalDetalhes 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
        onHelp={(order) => setOrderToHelp(order)}
      />

      <AnimatePresence>
        {orderToHelp && (
          <div className="qa-modal-overlay" onClick={() => setOrderToHelp(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="qa-modal-content mini"
              onClick={e => e.stopPropagation()}
            >
              <div className="confirm-help-content">
                <div className="confirm-icon-box"><Heart size={48} fill="currentColor" /></div>
                <h2>Gesto de Solidariedade</h2>
                <p>Você escolheu ajudar <strong>{orderToHelp.nomeUsuario || orderToHelp.userName || 'este usuário'}</strong>. Deseja iniciar uma conversa para combinar os detalhes?</p>
                <div className="confirm-actions-stack">
                  <button className="btn-confirm-primary" onClick={async () => {
                    try {
                      addToast('Iniciando conversa...', 'info');
                      
                      // Criar ou encontrar conversa existente
                      const conversationData = {
                        participants: [orderToHelp.userId || orderToHelp.usuario?.id],
                        pedidoId: orderToHelp.id,
                        type: 'direct',
                        title: `Ajuda: ${orderToHelp.category || 'Pedido'}`
                      };
                      
                      const response = await apiService.createConversation(conversationData);
                      
                      if (response.success) {
                        addToast('Conversa iniciada com sucesso!', 'success');
                        navigate(`/chat/${response.data.id}`);
                      } else {
                        throw new Error(response.error || 'Erro ao criar conversa');
                      }
                    } catch (error) {
                      console.error('Erro ao iniciar conversa:', error);
                      addToast('Erro ao iniciar conversa. Tente novamente.', 'error');
                    } finally {
                      setOrderToHelp(null);
                    }
                  }}>
                    Sim, vamos conversar!
                  </button>
                  <button className="btn-confirm-ghost" onClick={() => setOrderToHelp(null)}>
                    Voltar aos pedidos
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
