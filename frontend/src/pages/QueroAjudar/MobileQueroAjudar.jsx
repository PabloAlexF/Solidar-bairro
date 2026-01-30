import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LandingHeader from '../../components/layout/LandingHeader';
import MobileHeader from '../../components/layout/MobileHeader';
import { useAuth } from '../../contexts/AuthContext';
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
  Search
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
      toast.error('Erro ao carregar pedidos');
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
    
    // Get real user location
    const loadLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        console.warn('Erro ao obter localização:', error);
        // Fallback para São Paulo
        setUserLocation({ city: 'São Paulo', state: 'SP' });
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
      <div
        key={activeTab}
        className="tab-panel-mobile"
        style={{ 
          opacity: 1,
          transform: 'translateY(0)',
          overflow: 'visible',
          animation: 'fadeInUp 0.2s ease-out'
        }}
      >
        {activeTab === 'relato' && (
          <div className="detail-section-mobile">
            <div className="section-header-mobile">
              <div className="icon-wrapper-mobile" style={{ backgroundColor: catMeta.color + '15', color: catMeta.color }}>
                <FileText size={20} />
              </div>
              <div className="section-info-mobile">
                <div className="section-label-mobile">O Relato</div>
                <div className="section-sub-mobile">A história por trás do pedido</div>
              </div>
            </div>
            
            <div 
              className="story-card-v4-mobile"
              style={{
                animation: 'scaleIn 0.3s ease-out'
              }}
            >
              <div className="quote-icon-v4-mobile" style={{ color: catMeta.color }}>"</div>
              <p className="story-text-v4-mobile" style={{ whiteSpace: 'pre-wrap' }}>{selectedOrder.description}</p>
              <div className="story-footer-v4-mobile">
                <div className="author-v4-mobile">
                  <div className="avatar-v4-mobile" style={{ backgroundColor: catMeta.color }}>
                    {selectedOrder.userName.charAt(0)}
                  </div>
                  <span>{selectedOrder.userName}</span>
                </div>
                <div className="verified-badge-v4-mobile">
                  <ShieldCheck size={14} />
                  <span>Perfil Verificado</span>
                </div>
              </div>
            </div>

            <div className="meta-grid-v4-mobile">
              <div className="meta-item-v4-mobile">
                <Calendar size={16} />
                <span>Publicado em 24/05</span>
              </div>
              <div className="meta-item-v4-mobile">
                <Clock size={16} />
                <span>Atualizado hoje</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'itens' && (
          <div className="detail-section-mobile">
            <div className="section-header-mobile">
              <div className="icon-wrapper-mobile" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                <ClipboardList size={20} />
              </div>
              <div className="section-info-mobile">
                <div className="section-label-mobile">Itens Necessários</div>
                <div className="section-sub-mobile">O que {selectedOrder.userName.split(' ')[0]} precisa</div>
              </div>
            </div>
            
            <div className="items-list-v4-mobile">
              {selectedOrder.subCategories?.map((sc, idx) => (
                <div 
                  key={sc} 
                  className="item-card-v4-mobile"
                  style={{
                    animation: `slideInLeft 0.3s ease-out ${idx * 0.05}s both`
                  }}
                >
                  <div className="item-status-v4-mobile">
                    <div className="status-dot-v4-mobile" />
                  </div>
                  <div className="item-details-v4-mobile">
                    <strong>{catMeta.details[sc]?.label || sc}</strong>
                    <p>{catMeta.details[sc]?.desc || 'Item essencial para as necessidades relatadas.'}</p>
                  </div>
                  <div className="item-priority-v4-mobile">
                    <Zap size={14} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="info-banner-v4-mobile">
              <AlertCircle size={18} />
              <p>Combine a forma de entrega ou doação diretamente com o solicitante através do chat.</p>
            </div>
          </div>
        )}

        {activeTab === 'tecnico' && (
          <div className="detail-section-mobile">
            <div className="section-header-mobile">
              <div className="icon-wrapper-mobile" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
                <Wrench size={20} />
              </div>
              <div className="section-info-mobile">
                <div className="section-label-mobile">Ficha Técnica</div>
                <div className="section-sub-mobile">Especificações detalhadas</div>
              </div>
            </div>
            
            <div className="specs-grid-v4-mobile">
              {Object.entries({ ...(selectedOrder.details || {}), ...(selectedOrder.subQuestionAnswers || {}) })
                .filter(([key]) => key !== 'ponto_referencia')
                .map(([key, val], idx) => (
                <div 
                  key={key} 
                  className="spec-card-v4-mobile"
                  style={{
                    animation: `scaleIn 0.3s ease-out ${idx * 0.03}s both`
                  }}
                >
                  <div className="spec-label-v4-mobile">{SUB_QUESTION_LABELS[key] || key.replace(/_/g, ' ')}</div>
                  <div className="spec-value-v4-mobile">
                    {Array.isArray(val) ? (
                      <div className="spec-tags-v4-mobile">
                        {val.map(v => <span key={v}>{v}</span>)}
                      </div>
                    ) : val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'local' && (
          <div className="detail-section-mobile">
            <div className="section-header-mobile">
              <div className="icon-wrapper-mobile" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                <Navigation size={20} />
              </div>
              <div className="section-info-mobile">
                <div className="section-label-mobile">Localização</div>
                <div className="section-sub-mobile">Onde a ajuda é necessária</div>
              </div>
            </div>
            
            <div className="map-view-v4-mobile">
              <div className="map-radar-v4-mobile" />
              <div className="map-marker-v4-mobile">
                <MapPin size={32} fill="#ef4444" color="white" />
              </div>
              <div className="map-overlay-v4-mobile">
                <div className="map-location-v4-mobile">
                  <strong>{selectedOrder.neighborhood}</strong>
                  <span>{selectedOrder.city}, {selectedOrder.state}</span>
                </div>
              </div>
            </div>

            {selectedOrder.subQuestionAnswers?.ponto_referencia && (
              <div className="ref-card-v4-mobile">
                <div className="ref-icon-v4-mobile">
                  <MapPin size={18} />
                </div>
                <div className="ref-content-v4-mobile">
                  <label>Ponto de Referência</label>
                  <p>{selectedOrder.subQuestionAnswers.ponto_referencia}</p>
                </div>
              </div>
            )}
            
            <div className="safety-tip-v4-mobile">
              <ShieldCheck size={18} />
              <span>Localização aproximada para sua segurança</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="qa-page-mobile" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '20px' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #e2e8f0' }}>
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
                            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                            if (diffHours < 24) return `Há ${diffHours}h`;
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

      {showFiltersModal && (
        <div className="bottom-sheet-overlay" onClick={() => setShowFiltersModal(false)}>
          <div 
            className="bottom-sheet" 
            onClick={e => e.stopPropagation()}
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
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
                  {userLocation && (
                    <>
                      <button className={`pill-mobile ${selectedLocation === 'meu_estado' ? 'active' : ''}`} onClick={() => setSelectedLocation('meu_estado')}>{userLocation.state}</button>
                      <button className={`pill-mobile ${selectedLocation === 'minha_cidade' ? 'active' : ''}`} onClick={() => setSelectedLocation('minha_cidade')}>{userLocation.city}</button>
                    </>
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
          </div>
        </div>
      )}

      {showAccessibility && (
        <div className="bottom-sheet-overlay" onClick={() => setShowAccessibility(false)}>
          <div 
            className="bottom-sheet" 
            onClick={e => e.stopPropagation()}
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
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
          </div>
        </div>
      )}

      {selectedOrder && (
        <div 
          className="full-modal-v4-mobile"
          style={{
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div className="modal-header-v4-mobile">
            <button className="back-btn-v4-mobile" onClick={() => setSelectedOrder(null)}>
              <X size={22} />
            </button>
            <div className="header-center-v4-mobile">
              <span>Solicitação de Ajuda</span>
            </div>
            <button className="share-btn-v4-mobile">
              <Zap size={20} />
            </button>
          </div>
          
          <div className="modal-scroll-v4-mobile">
            <div className="detail-hero-v4-mobile">
              <div className="hero-bg-v4-mobile" style={{ 
                background: `linear-gradient(180deg, ${CATEGORY_METADATA[selectedOrder.category]?.color}20 0%, transparent 100%)` 
              }} />
              
              <div className="hero-content-v4-mobile">
                <div className="hero-badges-v4-mobile">
                  <span className="cat-badge-v4-mobile" style={{ backgroundColor: CATEGORY_METADATA[selectedOrder.category]?.color }}>
                    {selectedOrder.category}
                  </span>
                  <div className="urgency-badge-v4-mobile" style={{ 
                    color: URGENCY_OPTIONS.find(u => u.id === selectedOrder.urgency)?.color,
                    backgroundColor: URGENCY_OPTIONS.find(u => u.id === selectedOrder.urgency)?.color + '15'
                  }}>
                    {URGENCY_OPTIONS.find(u => u.id === selectedOrder.urgency)?.label}
                  </div>
                </div>
                <h1>{selectedOrder.title}</h1>
                <div className="hero-loc-v4-mobile">
                  <MapPin size={14} />
                  <span>{selectedOrder.neighborhood}, {selectedOrder.city}</span>
                </div>
              </div>
            </div>

            <div className="tabs-v4-mobile">
              {[
                { id: 'relato', label: 'Relato', icon: <FileText size={18} /> },
                { id: 'itens', label: 'Itens', icon: <ClipboardList size={18} /> },
                { id: 'tecnico', label: 'Técnico', icon: <Wrench size={18} /> },
                { id: 'local', label: 'Local', icon: <Navigation size={18} /> },
              ].map(tab => (
                <button 
                  key={tab.id}
                  className={`tab-btn-v4-mobile ${activeTab === tab.id ? 'active' : ''}`} 
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="tab-icon-v4-mobile">{tab.icon}</div>
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <div className="tab-indicator-v4-mobile" />}
                </button>
              ))}
            </div>
            
            <div className="tab-content-v4-mobile">
              {renderModalContent()}
            </div>
          </div>
          
          <div className="modal-footer-v4-mobile">
            <button className="btn-help-now-v4-mobile" onClick={() => { handleHelpClick(selectedOrder); setSelectedOrder(null); }}>
              <Heart size={22} fill="white" />
              <span>Quero Ajudar Agora</span>
            </button>
          </div>
        </div>
      )}

      {orderToHelp && (
        <div className="bottom-sheet-overlay" onClick={() => setOrderToHelp(null)}>
          <div 
            className="bottom-sheet" 
            onClick={e => e.stopPropagation()}
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
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
          </div>
        </div>
      )}
      <Toaster position="bottom-center" />
    </div>
  );
};