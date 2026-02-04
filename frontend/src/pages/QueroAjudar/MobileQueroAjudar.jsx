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
  Bell,
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
import { getCurrentLocation, getLocationWithFallback } from '../../utils/geolocation';
import { getSocket } from '../../services/socketService';

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
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationRequested, setLocationRequested] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState('brasil');
  const [selectedTimeframe, setSelectedTimeframe] = useState('todos');
  const [activeTab, setActiveTab] = useState('relato');
  const [expandedItem, setExpandedItem] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);

  const loadPedidos = async () => {
    try {
      setLoadingPedidos(true);
      setError(null);

      // Simular delay mínimo para mostrar o skeleton
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Preparar filtros para a API (igual ao desktop)
      const apiFilters = {};

      // Filtro de categoria
      if (selectedCat !== 'Todas') {
        apiFilters.category = selectedCat;
      }

      // Filtro de urgência
      if (selectedUrgency) {
        apiFilters.urgency = selectedUrgency;
      }

      // Filtros de localização
      if (selectedLocation === 'minha_cidade' && userLocation) {
        apiFilters.city = userLocation.city;
        apiFilters.state = userLocation.state;
      } else if (selectedLocation === 'meu_estado' && userLocation) {
        apiFilters.state = userLocation.state;
      } else if (selectedLocation === 'meu_bairro' && userLocation) {
        apiFilters.neighborhood = userLocation.neighborhood;
      }

      // Localização do usuário para ordenação por proximidade
      if (userLocation) {
        apiFilters.userCity = userLocation.city;
        apiFilters.userState = userLocation.state;
        console.log('Buscando pedidos próximos à localização:', userLocation);
      } else {
        console.warn('Localização do usuário não disponível para ordenação por proximidade');
      }

      // Filtro "apenas novos"
      if (selectedTimeframe === 'hoje') {
        apiFilters.onlyNew = true;
      }

      // Verificar se a API está disponível
      const response = await ApiService.getPedidos(apiFilters);

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

  // Efeito para carregar configurações de acessibilidade na inicialização
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    setFontSize(savedFontSize);
    setHighContrast(savedContrast);
  }, []);

  // Efeito para carregar a localização e outros dados na inicialização
  useEffect(() => {
    // Try to get current location first, fallback to registered address or default
    const loadLocation = async () => {
      try {
        const location = await getLocationWithFallback();
        setUserLocation(location);
        console.log('Localização obtida automaticamente:', location);
      } catch (error) {
        console.warn('Não foi possível obter localização automática, usando endereço cadastrado ou padrão:', error.message);
        // Fallback to user's registered location or default
        if (user && user.endereco) {
          const userCity = user.endereco.cidade || user.endereco.city || 'São Paulo';
          const userState = user.endereco.estado || user.endereco.state || 'SP';
          setUserLocation({ city: userCity, state: userState });
          console.log('Localização definida pelo endereço cadastrado:', { city: userCity, state: userState });
        } else {
          // Fallback to São Paulo if no user address
          setUserLocation({ city: 'São Paulo', state: 'SP' });
          console.log('Usando localização padrão (São Paulo) - usuário não logado ou sem endereço');
        }
      }
    };

    loadLocation();

    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [user]);

  // Efeito para gerenciar classes de acessibilidade no elemento <html>
  useEffect(() => {
    const root = document.documentElement;
    // Limpa classes de acessibilidade anteriores para evitar conflitos
    root.classList.remove('font-small', 'font-normal', 'font-large', 'high-contrast');

    // Adiciona as classes atuais
    root.classList.add(`font-${fontSize}`);
    if (highContrast) {
      root.classList.add('high-contrast');
    }
  }, [fontSize, highContrast]);

  // Recarregar pedidos quando a localização ou os filtros mudarem
  useEffect(() => {
    if (userLocation) {
      loadPedidos();
    }
  }, [userLocation, selectedCat, selectedUrgency, selectedLocation, selectedTimeframe]);

  // WebSocket para notificações em tempo real (Mobile)
  useEffect(() => {
    if (!user) return;

    // Carregar notificações iniciais
    const fetchNotifications = async () => {
      try {
        const response = await ApiService.get('/notifications');
        if (response.success) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on('notification', handleNewNotification);

    return () => {
      socket.off('notification', handleNewNotification);
    };
  }, [user, navigate]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredOrders = useMemo(() => {
    // Como os filtros agora são aplicados no backend, apenas retornamos os pedidos
    return pedidos;
  }, [pedidos]);

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    toast.success(`Fonte: ${size === 'large' ? 'Grande' : size === 'small' ? 'Pequena' : 'Normal'}`);
  };

  const toggleContrast = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    localStorage.setItem('highContrast', newContrast.toString());
    toast.success(newContrast ? 'Alto contraste ativado' : 'Alto contraste desativado');
  };

  const handleHelpClick = (order) => {
    if (!user) {
      toast.error('Faça login para ajudar');
      navigate('/login');
      return;
    }
    setOrderToHelp(order);
  };

  const requestLocation = async () => {
    if (locationRequested) return; // Prevent multiple requests

    setLocationRequested(true);
    setLocationLoading(true);

    try {
      const location = await getCurrentLocation();
      console.log('Localização obtida:', location);
      setUserLocation(location);
      toast.success(`Localização atualizada: ${location.city}, ${location.state}`);
    } catch (error) {
      console.warn('Erro ao obter localização:', error);
      toast.error('Não foi possível obter sua localização. Usando São Paulo como padrão.');
      setUserLocation({ city: 'São Paulo', state: 'SP' });
    } finally {
      setLocationLoading(false);
      setLocationRequested(false);
    }
  };

  const { ref } = useInView({ threshold: 0.1, triggerOnce: true });

  const renderModalContent = () => {
    if (!selectedOrder) return null;
    
    const catMeta = CATEGORY_METADATA[selectedOrder.category] || { color: '#64748b', details: {} };
    const description = selectedOrder.description || '';
    const isLongDescription = description.length > 45;
    
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
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ 
                  fontSize: '1.05rem', 
                  lineHeight: '1.7', 
                  color: '#475569', 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {isLongDescription
                    ? `${description.substring(0, 45)}...`
                    : description
                  }
                </p>

                {isLongDescription && (
                  <button 
                    onClick={() => setShowDescriptionModal(true)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#3b82f6',
                      fontWeight: '700',
                      padding: '8px 0',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    Visualizar descrição
                  </button>
                )}
              </div>

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
                onClick={() => setShowNotifications(true)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
                )}
              </button>
              <button
                onClick={requestLocation}
                disabled={locationLoading}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: locationLoading ? '#f1f5f9' : 'white',
                  color: locationLoading ? '#94a3b8' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: locationLoading ? 'not-allowed' : 'pointer'
                }}
                title="Atualizar localização"
              >
                {locationLoading ? (
                  <div style={{ width: '16px', height: '16px', border: '2px solid #94a3b8', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Navigation size={20} />
                )}
              </button>
              <button
                onClick={() => setShowFiltersModal(true)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
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
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="loading-skeleton"
            >
              <div style={{ textAlign: 'center', padding: '24px 0 32px' }}>
                <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 16px' }}>
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: '-8px',
                      borderRadius: '50%',
                      border: '2px solid #3b82f6',
                      opacity: 0.5
                    }}
                    animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: 'white', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Search size={28} color="#3b82f6" />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
                  Buscando pedidos próximos...
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Encontrando quem precisa de ajuda
                </p>
              </div>

              {[1, 2, 3].map((i) => (
                <div key={i} className="mobile-skeleton-card" style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '16px',
                  marginBottom: '16px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Skeleton circle width={32} height={32} />
                      <div>
                        <Skeleton width={100} height={14} style={{ marginBottom: '4px' }} />
                        <Skeleton width={60} height={10} />
                      </div>
                    </div>
                    <Skeleton width={50} height={20} borderRadius={10} />
                  </div>
                  <Skeleton width="60%" height={20} style={{ marginBottom: '8px' }} />
                  <Skeleton count={2} height={14} style={{ marginBottom: '16px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Skeleton height={40} borderRadius={12} containerClassName="flex-1" />
                    <Skeleton height={40} borderRadius={12} containerClassName="flex-1" />
                  </div>
                </div>
              ))}
            </motion.div>
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
            filteredOrders.map((order, index) => {
              const urg = URGENCY_OPTIONS.find(u => u.id === order.urgency);
              const catMeta = CATEGORY_METADATA[order.category] || { color: '#64748b' };
              
              return (
                <motion.div
                  key={order.id}
                  className="mobile-order-card"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
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
                      onClick={() => { 
                        setSelectedOrder(order); 
                        setActiveTab('relato'); 
                        setShowDescriptionModal(false); 
                      }}
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
                    {userLocation ? (
                      <>
                        <button className={`pill-mobile ${selectedLocation === 'meu_estado' ? 'active' : ''}`} onClick={() => setSelectedLocation('meu_estado')}>{userLocation.state}</button>
                        {userLocation.city !== userLocation.state && (
                          <button className={`pill-mobile ${selectedLocation === 'minha_cidade' ? 'active' : ''}`} onClick={() => setSelectedLocation('minha_cidade')}>{userLocation.city}</button>
                        )}
                        {userLocation.neighborhood && (
                          <button className={`pill-mobile ${selectedLocation === 'meu_bairro' ? 'active' : ''}`} onClick={() => setSelectedLocation('meu_bairro')}>
                            {userLocation.neighborhood}
                          </button>
                        )}
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
        {showNotifications && (
          <motion.div 
            className="bottom-sheet-overlay" 
            onClick={() => setShowNotifications(false)}
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
                  <h2>Notificações</h2>
                  <button onClick={() => setShowNotifications(false)}><X size={20} /></button>
                </div>
              </div>
              <div className="sheet-content" style={{ padding: '0 16px' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                    <Bell size={40} style={{ marginBottom: '16px' }} />
                    <p>Nenhuma notificação por aqui.</p>
                  </div>
                ) : (
                  notifications.map(n => {
                    const time = new Date(n.timestamp || n.createdAt);
                    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    const getIcon = (type) => {
                      switch(type) {
                        case 'chat': return <MessageCircle size={20} color="#3b82f6" />;
                        case 'pedido': return <Heart size={20} color="#ef4444" />;
                        default: return <Bell size={20} color="#64748b" />;
                      }
                    }

                    return (
                      <div 
                        key={n.id} 
                        style={{ 
                          display: 'flex', 
                          gap: '12px', 
                          padding: '12px 0', 
                          borderBottom: '1px solid #f1f5f9',
                          background: n.read ? 'transparent' : '#eff6ff'
                        }}
                        onClick={() => {
                          if (n.type === 'chat' && n.data?.conversationId) {
                            navigate(`/chat/${n.data.conversationId}`);
                            setShowNotifications(false);
                          }
                        }}
                      >
                        <div style={{ flexShrink: 0, marginTop: '4px' }}>{getIcon(n.type)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem', color: '#1e293b' }}>{n.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{timeString}</span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{n.message}</p>
                        </div>
                      </div>
                    )
                  })
                )}
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
                          senderId: user.uid || user.id,
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

      <AnimatePresence>
        {showDescriptionModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 2100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setShowDescriptionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                width: '100%',
                maxWidth: '400px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>Relato Completo</h3>
                <button 
                  onClick={() => setShowDescriptionModal(false)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div style={{ overflowY: 'auto', paddingRight: '4px' }}>
                <p style={{ 
                  fontSize: '1rem', 
                  lineHeight: '1.6', 
                  color: '#334155', 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0
                }}>
                  {selectedOrder.description}
                </p>
              </div>

              <button
                onClick={() => setShowDescriptionModal(false)}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  padding: '12px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Fechar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};