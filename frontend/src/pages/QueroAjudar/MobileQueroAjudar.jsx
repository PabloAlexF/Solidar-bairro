import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LandingHeader from '../../components/layout/LandingHeader';
import MobileHeader from '../../components/layout/MobileHeader';
import { useAuth } from '../../contexts/AuthContext';
import { StatsManager } from '../../utils/statsManager';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Heart,
  Filter,
  Eye,
  X,
  MessageCircle,
  FileText,
  ClipboardList,
  Wrench,
  Navigation,
  Clock,
  ShieldCheck,
  AlertCircle,
  Calendar,
  Zap,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import './mobile-quero-ajudar.css';
import { 
  CATEGORY_METADATA, 
  CATEGORIES, 
  URGENCY_OPTIONS, 
  SUB_QUESTION_LABELS
} from './constants';
import ApiService from '../../services/apiService';
import { getCurrentLocation } from '../../utils/geolocation';

export const MobileQueroAjudar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [selectedUrgency, setSelectedUrgency] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToHelp, setOrderToHelp] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [error, setError] = useState(null);

  const loadPedidos = async () => {
    try {
      setLoadingPedidos(true);
      setError(null);
      
      // Verificar se a API está disponível
      const response = await ApiService.getPedidos();
      
      if (response.success && response.data) {
        const transformedPedidos = response.data.map(pedido => ({
          id: pedido.id,
          userId: pedido.userId, // ID do usuário que criou o pedido
          userName: pedido.usuario?.nome || 'Usuário',
          userType: pedido.usuario?.tipo || 'Cidadão',
          city: pedido.city || extractCityFromLocation(pedido.location),
          state: pedido.state || extractStateFromLocation(pedido.location),
          neighborhood: pedido.neighborhood || extractNeighborhoodFromLocation(pedido.location),
          urgency: pedido.urgency,
          category: pedido.category,
          title: pedido.title || pedido.category,
          description: pedido.description,
          subCategories: pedido.subCategory || [],
          items: (pedido.subCategory || []).map(sc => ({ name: sc, details: pedido.subQuestionAnswers?.[sc] || null })),
          subQuestionAnswers: pedido.subQuestionAnswers || {},
          isNew: isNewPedido(pedido.createdAt),
          createdAt: pedido.createdAt
        }));
        
        setPedidos(transformedPedidos);
      } else {
        throw new Error('Erro ao carregar pedidos');
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setError(error.message);
      
      // Se for erro de conexão, mostrar dados mock para desenvolvimento
      if (error.message.includes('conectar com a API')) {
        console.warn('Usando dados mock para desenvolvimento');
        setPedidos([]); // Dados vazios por enquanto
        toast.error('Servidor offline. Inicie o backend em localhost:3001');
      } else {
        toast.error('Erro ao carregar pedidos');
      }
    } finally {
      setLoadingPedidos(false);
    }
  };

  const extractCityFromLocation = (location) => {
    if (!location) return 'Não informado';
    const parts = location.split(',');
    if (parts.length >= 2) {
      const secondPart = parts[1].trim();
      if (secondPart.includes('-')) {
        return secondPart.split('-')[0].trim();
      }
      return secondPart;
    }
    return 'Não informado';
  };

  const extractStateFromLocation = (location) => {
    if (!location) return 'BR';
    const parts = location.split(',');
    if (parts.length >= 2) {
      const secondPart = parts[1].trim();
      if (secondPart.includes('-')) {
        return secondPart.split('-')[1].trim();
      }
    }
    return 'BR';
  };

  const extractNeighborhoodFromLocation = (location) => {
    if (!location) return 'Não informado';
    const parts = location.split(',');
    return parts[0]?.trim() || 'Não informado';
  };

  const isNewPedido = (createdAt) => {
    if (!createdAt) return false;
    const created = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return created > yesterday;
  };

  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    setFontSize(savedFontSize);
    setHighContrast(savedContrast);
    document.documentElement.className = `font-${savedFontSize} ${savedContrast ? 'high-contrast' : ''}`;
    
    loadPedidos();
    
  const loadLocation = async () => {
    try {
      // Verificar se geolocalização está disponível
      if (!navigator.geolocation) {
        throw new Error('Geolocalização não suportada');
      }
      
      // Solicitar localização apenas se o usuário interagir
      const location = await getCurrentLocation();
      console.log('Localização obtida:', location);
      setUserLocation(location);
    } catch (error) {
      console.warn('Erro ao obter localização:', error);
      // Usar localização genérica apenas se realmente não conseguir obter
      setUserLocation({ city: 'Sua Cidade', state: 'Seu Estado' });
    } finally {
      setLocationLoading(false);
    }
  };
    
    loadLocation();
    
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const [selectedLocation, setSelectedLocation] = useState('brasil');
  const [selectedTimeframe, setSelectedTimeframe] = useState('todos');
  const [activeTab, setActiveTab] = useState('relato');
  const [expandedItem, setExpandedItem] = useState(null);

  const filteredOrders = useMemo(() => {
    return pedidos.filter((order) => {
      const catMatch = selectedCat === 'Todas' || order.category === selectedCat;
      const urgMatch = !selectedUrgency || order.urgency === selectedUrgency;
      
      let locationMatch = true;
      if (selectedLocation === 'meu_estado') {
        locationMatch = order.state === userLocation.state;
      } else if (selectedLocation === 'minha_cidade') {
        locationMatch = order.city === userLocation.city && order.state === userLocation.state;
      }

      const timeMatch = selectedTimeframe === 'todos' || (selectedTimeframe === 'hoje' && order.isNew);
      
      return catMatch && urgMatch && locationMatch && timeMatch;
    });
  }, [pedidos, selectedCat, selectedUrgency, selectedLocation, selectedTimeframe, userLocation, user]);

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    document.documentElement.className = `font-${size} ${highContrast ? 'high-contrast' : ''}`;
    toast.success(`Fonte: ${size === 'large' ? 'Grande' : size === 'small' ? 'Pequena' : 'Normal'}`);
  };

  const toggleContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    localStorage.setItem('highContrast', newContrast.toString());
    document.documentElement.classList.toggle('high-contrast', newContrast);
  };

  const handleHelpClick = (order) => {
    if (!user) {
      toast.error('Faça login para ajudar');
      navigate('/login');
      return;
    }
    setOrderToHelp(order);
  };

  const { ref } = useInView({ threshold: 0.1, triggerOnce: true });

  const renderModalContent = () => {
    if (!selectedOrder) return null;
    
    const catMeta = CATEGORY_METADATA[selectedOrder.category] || { color: '#64748b', details: {} };
    
    return (
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{ paddingBottom: '100px' }}
      >
        {activeTab === 'relato' && (
          <div className="detail-section-mobile" style={{ gap: '20px' }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '24px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-10px', 
                right: '-10px', 
                fontSize: '8rem', 
                color: catMeta.color, 
                opacity: 0.05, 
                fontFamily: 'serif',
                lineHeight: 1 
              }}>"</div>
              
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color={catMeta.color} />
                Relato do Pedido
              </h3>
              
              <p style={{ 
                fontSize: '1.05rem', 
                lineHeight: '1.7', 
                color: '#475569', 
                whiteSpace: 'pre-wrap',
                position: 'relative',
                zIndex: 1
              }}>
                {selectedOrder.description}
              </p>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: catMeta.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {selectedOrder.userName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#1e293b' }}>{selectedOrder.userName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} color="#10b981" />
                    Identidade Verificada
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Publicado</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', fontWeight: '600' }}>
                  <Calendar size={18} color="#64748b" />
                  {(() => {
                    const date = selectedOrder.createdAt?.toDate ? selectedOrder.createdAt.toDate() : new Date(selectedOrder.createdAt);
                    return isNaN(date.getTime()) ? 'Recente' : date.toLocaleDateString('pt-BR');
                  })()}
                </div>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Urgência</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: URGENCY_OPTIONS.find(u => u.id === selectedOrder.urgency)?.color, fontWeight: '700' }}>
                  <AlertCircle size={18} />
                  {URGENCY_OPTIONS.find(u => u.id === selectedOrder.urgency)?.label}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itens' && (
          <div className="detail-section-mobile" style={{ gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Itens Necessários</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Lista de necessidades</p>
              </div>
            </div>

            <div className="items-list-v4-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedOrder.items?.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ 
                    background: 'white', 
                    padding: '16px', 
                    borderRadius: '16px', 
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onClick={() => item.details && setExpandedItem(expandedItem === idx ? null : idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={14} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', color: '#1e293b', marginBottom: '2px' }}>{catMeta.details?.[item.name]?.label || item.name}</strong>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{catMeta.details?.[item.name]?.desc || 'Item essencial'}</p>
                    </div>
                    {item.details && (
                      <div style={{ color: '#94a3b8' }}>
                        {expandedItem === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {expandedItem === idx && item.details && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', color: '#475569', border: '1px solid #e2e8f0' }}>
                          <strong style={{ display: 'block', marginBottom: '4px', color: '#334155' }}>Especificações:</strong>
                          {item.details}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            
            <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', alignItems: 'start', color: '#1e40af' }}>
              <AlertCircle size={18} />
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>Combine a forma de entrega ou doação diretamente com o solicitante através do chat.</p>
            </div>
          </div>
        )}

        {activeTab === 'tecnico' && (
          <div className="detail-section-mobile" style={{ gap: '16px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wrench size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Ficha Técnica</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Detalhes específicos</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {Object.entries({ ...(selectedOrder.details || {}), ...(selectedOrder.subQuestionAnswers || {}) })
                .filter(([key]) => key !== 'ponto_referencia' && !selectedOrder.subCategories?.includes(key))
                .map(([key, val], idx) => (
                <motion.div 
                  key={key} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}
                >
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>
                    {SUB_QUESTION_LABELS[key] || key.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>
                    {Array.isArray(val) ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {val.map(v => <span key={v} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{v}</span>)}
                      </div>
                    ) : val}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'local' && (
          <div className="detail-section-mobile" style={{ gap: '16px' }}>
            <div style={{ height: '200px', background: '#f1f5f9', borderRadius: '24px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              <div style={{ position: 'absolute', width: '100px', height: '100px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <div style={{ position: 'relative', zIndex: 2, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}>
                <MapPin size={32} fill="#ef4444" color="white" />
              </div>
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '12px 16px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  <strong style={{ display: 'block', color: '#1e293b' }}>{selectedOrder.neighborhood}</strong>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{selectedOrder.city}, {selectedOrder.state}</span>
                </div>
              </div>
            </div>

            {selectedOrder.subQuestionAnswers?.ponto_referencia && (
              <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', border: '1px solid #fcd34d' }}>
                <div style={{ color: '#d97706' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#d97706', display: 'block', marginBottom: '2px' }}>Ponto de Referência</label>
                  <p style={{ margin: 0, color: '#92400e', fontWeight: '500' }}>{selectedOrder.subQuestionAnswers.ponto_referencia}</p>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', marginTop: '8px' }}>
              <ShieldCheck size={18} />
              <span>Localização aproximada para sua segurança</span>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="qa-page-mobile" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '20px' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'rgba(255,255,255,0.95)', 
          backdropFilter: 'blur(10px)', 
          borderBottom: '1px solid #e2e8f0',
          zIndex: -1
        }} />
        <MobileHeader title="Quero Ajudar" />
        
        <div style={{ padding: '12px 16px 4px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px', margin: 0 }}>
                Explorar
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                {filteredOrders.length} pedidos próximos
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
               <button 
                onClick={() => setShowAccessibility(true)}
                style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              >
                <span style={{ fontSize: '1.2rem' }}>Aa</span>
              </button>
              <button 
                onClick={() => setShowFiltersModal(true)}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  background: (selectedCat !== 'Todas' || selectedUrgency || selectedLocation !== 'brasil') ? '#eff6ff' : 'white',
                  color: (selectedCat !== 'Todas' || selectedUrgency || selectedLocation !== 'brasil') ? '#3b82f6' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Filter size={20} />
                {(selectedCat !== 'Todas' || selectedUrgency || selectedLocation !== 'brasil') && (
                  <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', border: '1px solid white' }} />
                )}
              </button>
            </div>
          </div>

          <div className="no-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', margin: '0 -16px', paddingLeft: '16px', paddingRight: '16px' }}>
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCat(cat.id)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  border: 'none',
                  background: selectedCat === cat.id ? (CATEGORY_METADATA[cat.id]?.color || '#3b82f6') : 'white',
                  color: selectedCat === cat.id ? 'white' : '#64748b',
                  boxShadow: selectedCat === cat.id ? `0 4px 12px ${CATEGORY_METADATA[cat.id]?.color}40` : '0 1px 2px rgba(0,0,0,0.05)',
                  border: selectedCat === cat.id ? 'none' : '1px solid #e2e8f0'
                }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }} ref={ref}>
        <AnimatePresence mode='popLayout'>
          {loadingPedidos ? (
            [...Array(3)].map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                <Skeleton height={20} width="60%" style={{ marginBottom: '12px' }} />
                <Skeleton height={60} style={{ marginBottom: '12px' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Skeleton height={30} width={80} />
                  <Skeleton height={30} width={80} />
                </div>
              </div>
            ))
          ) : filteredOrders.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }}
               style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}
             >
               <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                 <Search size={32} color="#94a3b8" />
               </div>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Nenhum pedido encontrado</h3>
               <p>Tente ajustar os filtros para ver mais resultados.</p>
               <button 
                 onClick={() => { setSelectedCat('Todas'); setSelectedUrgency(null); setSelectedLocation('brasil'); }}
                 style={{ marginTop: '16px', padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', color: '#3b82f6' }}
               >
                 Limpar Filtros
               </button>
             </motion.div>
          ) : (
            filteredOrders.map((order) => {
              const urg = URGENCY_OPTIONS.find(u => u.id === order.urgency);
              const catMeta = CATEGORY_METADATA[order.category] || { color: '#64748b' };
              
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '16px',
                    marginBottom: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.02)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Urgency Strip */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: urg?.color || '#e2e8f0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingLeft: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: catMeta.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 'bold' }}>
                        {order.userName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>{order.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={10} />
                          {/* Time logic inline */}
                          {(() => {
                            const createdAt = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
                            if (!createdAt || isNaN(createdAt.getTime())) return 'Recente';
                            const now = new Date();
                            const diffMs = now - createdAt;
                            const diffMinutes = Math.floor(diffMs / (1000 * 60));
                            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                            
                            if (diffMinutes < 1) return 'Agora';
                            if (diffMinutes < 60) return `Há ${diffMinutes} min`;
                            if (diffHours < 24) return `Há ${diffHours}h`;
                            if (diffDays < 7) return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
                            return createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                          })()}
                        </div>
                      </div>
                    </div>
                    {order.isNew && (
                      <span style={{ background: '#dbeafe', color: '#2563eb', fontSize: '0.7rem', fontWeight: '700', padding: '4px 8px', borderRadius: '100px' }}>
                        NOVO
                      </span>
                    )}
                  </div>

                  <div style={{ paddingLeft: '8px', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '6px', lineHeight: '1.3' }}>
                      {order.title}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: `${catMeta.color}15`, color: catMeta.color, fontWeight: '600' }}>
                        {order.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px', background: `${urg?.color}15`, color: urg?.color, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {urg?.icon && React.cloneElement(urg.icon, { size: 12 })}
                        {urg?.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.875rem' }}>
                      <MapPin size={14} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                        {order.neighborhood}, {order.city}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', paddingLeft: '8px' }}>
                    <button 
                      onClick={() => { setSelectedOrder(order); setActiveTab('relato'); }}
                      style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: '600', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Eye size={16} />
                      Detalhes
                    </button>
                    {user?.uid !== order.userId ? (
                      <button 
                        onClick={() => handleHelpClick(order)}
                        style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#10b981', color: 'white', fontWeight: '600', fontSize: '0.875rem', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}
                      >
                        <Heart size={16} fill="white" />
                        Ajudar
                      </button>
                    ) : (
                      <button 
                        disabled
                        style={{ flex: 1, padding: '10px', borderRadius: '12px', background: '#f1f5f9', color: '#94a3b8', fontWeight: '600', fontSize: '0.875rem', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        Seu Pedido
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showFiltersModal && (
          <motion.div 
            className="bottom-sheet-overlay" 
            onClick={() => setShowFiltersModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 2000 }}
          >
            <motion.div 
              className="bottom-sheet" 
              onClick={e => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="sheet-header">
                <div className="sheet-handle" />
                <div className="sheet-title-row">
                  <h2>Filtros</h2>
                  <button onClick={() => setShowFiltersModal(false)}><X size={20} /></button>
                </div>
              </div>
              <div className="sheet-content">
                <div className="sheet-section">
                  <h4>Localização</h4>
                  <div className="pills-grid-mobile">
                    <button className={`pill-mobile ${selectedLocation === 'brasil' ? 'active' : ''}`} onClick={() => setSelectedLocation('brasil')}>Brasil</button>
                    {userLocation && userLocation.city !== 'Sua Cidade' ? (
                      <>
                        <button className={`pill-mobile ${selectedLocation === 'meu_estado' ? 'active' : ''}`} onClick={() => setSelectedLocation('meu_estado')}>{userLocation.state}</button>
                        <button className={`pill-mobile ${selectedLocation === 'minha_cidade' ? 'active' : ''}`} onClick={() => setSelectedLocation('minha_cidade')}>{userLocation.city}</button>
                      </>
                    ) : (
                      <button className="pill-mobile" disabled style={{ opacity: 0.5 }}>Localização indisponível</button>
                    )}
                  </div>
                </div>
                <div className="sheet-section">
                  <h4>Categorias</h4>
                  <div className="pills-grid-mobile">
                    {CATEGORIES.map(cat => (
                      <button 
                        key={cat.id} 
                        className={`pill-mobile ${selectedCat === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCat(cat.id)}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sheet-section">
                  <h4>Urgência</h4>
                  <div className="pills-grid-mobile">
                    {URGENCY_OPTIONS.map(urg => (
                      <button 
                        key={urg.id} 
                        className={`pill-mobile ${selectedUrgency === urg.id ? 'active' : ''}`}
                        onClick={() => setSelectedUrgency(selectedUrgency === urg.id ? null : urg.id)}
                      >
                        {urg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sheet-footer">
                <button className="btn-apply-mobile" onClick={() => setShowFiltersModal(false)}>
                  Aplicar Filtros
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAccessibility && (
          <motion.div 
            className="bottom-sheet-overlay" 
            onClick={() => setShowAccessibility(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 2000 }}
          >
            <motion.div 
              className="bottom-sheet" 
              onClick={e => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="sheet-header">
                <div className="sheet-handle" />
                <div className="sheet-title-row">
                  <h2>Acessibilidade</h2>
                  <button onClick={() => setShowAccessibility(false)}><X size={20} /></button>
                </div>
              </div>
              <div className="sheet-content">
                <div className="sheet-section">
                  <h4>Tamanho da Fonte</h4>
                  <div className="font-options-mobile">
                    <button className={fontSize === 'small' ? 'active' : ''} onClick={() => changeFontSize('small')}>A-</button>
                    <button className={fontSize === 'normal' ? 'active' : ''} onClick={() => changeFontSize('normal')}>A</button>
                    <button className={fontSize === 'large' ? 'active' : ''} onClick={() => changeFontSize('large')}>A+</button>
                  </div>
                </div>
                <div className="sheet-section">
                  <button className={`contrast-btn-mobile ${highContrast ? 'active' : ''}`} onClick={toggleContrast}>
                    {highContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            className="full-modal-v4-mobile"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              background: '#f8fafc', 
              zIndex: 2000, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderBottom: '1px solid #f1f5f9', zIndex: 10 }}>
              <button onClick={() => setSelectedOrder(null)} style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                <X size={20} />
              </button>
              <span style={{ fontWeight: '700', color: '#1e293b' }}>Detalhes do Pedido</span>
              <button style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                <Zap size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
              <div style={{ position: 'relative', padding: '24px 20px', background: 'white', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', color: 'white', background: CATEGORY_METADATA[selectedOrder.category]?.color || '#64748b' }}>
                    {selectedOrder.category}
                  </span>
                  <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: URGENCY_OPTIONS.find(u => u.id === selectedOrder.urgency)?.color, background: (URGENCY_OPTIONS.find(u => u.id === selectedOrder.urgency)?.color || '#64748b') + '15' }}>
                    {URGENCY_OPTIONS.find(u => u.id === selectedOrder.urgency)?.label}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', marginBottom: '12px' }}>{selectedOrder.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>
                  <MapPin size={16} />
                  <span>{selectedOrder.neighborhood}, {selectedOrder.city}</span>
                </div>
              </div>

              <div className="no-scrollbar" style={{ display: 'flex', gap: '12px', padding: '0 20px', marginBottom: '24px', overflowX: 'auto' }}>
                {[
                  { id: 'relato', label: 'Relato', icon: <FileText size={18} /> },
                  { id: 'itens', label: 'Itens', icon: <ClipboardList size={18} /> },
                  { id: 'tecnico', label: 'Técnico', icon: <Wrench size={18} /> },
                  { id: 'local', label: 'Local', icon: <Navigation size={18} /> },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{ 
                      flex: '0 0 auto', 
                      padding: '10px 16px', 
                      borderRadius: '12px', 
                      border: activeTab === tab.id ? 'none' : '1px solid #e2e8f0', 
                      background: activeTab === tab.id ? '#1e293b' : 'white', 
                      color: activeTab === tab.id ? 'white' : '#64748b',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div style={{ padding: '0 20px' }}>
                <AnimatePresence mode='wait'>
                  {renderModalContent()}
                </AnimatePresence>
              </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 32px 20px', background: 'white', borderTop: '1px solid #f1f5f9' }}>
              <button 
                onClick={() => { handleHelpClick(selectedOrder); setSelectedOrder(null); }}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#0f172a', color: 'white', fontWeight: '700', fontSize: '1rem', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(15, 23, 42, 0.15)' }}
              >
                <Heart size={20} fill="white" />
                Quero Ajudar Agora
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {orderToHelp && (
          <motion.div 
            className="bottom-sheet-overlay" 
            onClick={() => setOrderToHelp(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ zIndex: 2000 }}
          >
            <motion.div 
              className="bottom-sheet" 
              onClick={e => e.stopPropagation()}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="confirm-help-v4-mobile">
                <div className="heart-circle-v4-mobile">
                  <Heart size={44} fill="#ef4444" color="#ef4444" />
                </div>
                <h2>Ajudar {orderToHelp.userName}?</h2>
                <p>Você será conectado diretamente para combinar os detalhes da doação ou ajuda.</p>
                <div className="confirm-actions-v4-mobile">
                  <button 
                    className="btn-confirm-chat-v4-mobile" 
                    onClick={async () => {
                      try {
                        // Primeiro registrar interesse (opcional)
                        try {
                          const interesseData = {
                            pedidoId: orderToHelp.id,
                            tipo: 'ajuda',
                            mensagem: 'Interesse em ajudar através da plataforma'
                          };
                          await ApiService.createInteresse(interesseData);
                          
                          // Registrar estatística de ajuda oferecida
                          if (user?.uid || user?.id) {
                            StatsManager.registerAjudaOferecida(user.uid || user.id, orderToHelp.id, interesseData);
                          }
                        } catch (err) {
                          console.warn('Erro ao registrar interesse:', err);
                        }
                        
                        // Depois criar conversa
                        const conversationData = {
                          participants: [user.uid || user.id, orderToHelp.userId], // Inclui ambos os participantes
                          pedidoId: orderToHelp.id,
                          type: 'ajuda',
                          title: `Ajuda: ${orderToHelp.title || orderToHelp.category}`,
                          initialMessage: `Olá! Vi seu pedido de ${orderToHelp.category} e gostaria de ajudar. Podemos conversar?`
                        };
                        
                        let response;
                        try {
                          // Tenta endpoint /chat/conversations (baseado nos logs do backend: /api/chat + /conversations)
                          response = await ApiService.post('/chat/conversations', conversationData);
                        } catch (err) {
                          console.warn('Falha ao criar conversa via /chat/conversations, tentando alternativas...', err);
                          try {
                               // Tenta endpoint /conversas (padrão antigo)
                               response = await ApiService.post('/conversas', conversationData);
                          } catch (err2) {
                               try {
                                  // Tenta endpoint /conversations (fallback em inglês)
                                  response = await ApiService.post('/conversations', conversationData);
                               } catch (err3) {
                                   // Tenta endpoint /chats (fallback comum)
                                   try {
                                      response = await ApiService.post('/chats', conversationData);
                                   } catch (err4) {
                                      console.error('Todas as tentativas de endpoint falharam', err4);
                                      throw new Error('Não foi possível iniciar o chat. Verifique sua conexão.');
                                   }
                               }
                          }
                        }
                        
                        if (response && response.success) {
                          toast.success('Conversa iniciada!');
                          navigate(`/chat/${response.data.id}`);
                        } else {
                          throw new Error(response?.error || 'Erro ao criar conversa');
                        }
                      } catch (error) {
                        console.error('Erro ao iniciar conversa:', error);
                        toast.error(`Erro ao iniciar conversa: ${error.message}`);
                      }
                      setOrderToHelp(null);
                    }}
                  >
                    <MessageCircle size={20} /> Conversar Agora
                  </button>
                  <button className="btn-cancel-help-v4-mobile" onClick={() => setOrderToHelp(null)}>
                    Voltar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster position="bottom-center" />
    </div>
  );
};