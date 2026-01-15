import React, { useState, useMemo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LandingHeader from '../../components/layout/LandingHeader';
import MobileHeader from '../../components/layout/MobileHeader';
import { useAuth } from '../../contexts/AuthContext';
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
  Zap
} from 'lucide-react';
import './mobile-quero-ajudar.css';
import { 
  CATEGORY_METADATA, 
  CATEGORIES, 
  URGENCY_OPTIONS, 
  SUB_QUESTION_LABELS
} from './constants';
import ApiService from '../../services/apiService';

export const MobileQueroAjudar = () => {
  const { user } = useAuth();
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [selectedUrgency, setSelectedUrgency] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToHelp, setOrderToHelp] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation] = useState({ state: 'RS', city: 'Porto Alegre' });
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
    
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const [selectedLocation, setSelectedLocation] = useState('brasil');
  const [selectedTimeframe, setSelectedTimeframe] = useState('todos');
  const [activeTab, setActiveTab] = useState('relato');

  const filteredOrders = useMemo(() => {
    return pedidos.filter((order) => {
      // Filtrar pedidos do próprio usuário
      if (user && order.userId === user.uid) {
        return false;
      }
      
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
              <p className="story-text-v4-mobile">{selectedOrder.description}</p>
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
    <div className="qa-page-mobile">
      <MobileHeader title="Quero Ajudar" />
      <div className="qa-main-wrapper-mobile">
        <header className="page-header-mobile">
          <div className="brand-box-mobile">
            <h1>Solidariedade <span>Próxima</span></h1>
          </div>

          <div className="header-controls-mobile">
            <button className="accessibility-btn-mobile" onClick={() => setShowAccessibility(true)}>
              ♿
            </button>
            <button className="btn-toggle-filters-mobile" onClick={() => setShowFiltersModal(true)}>
              <Filter size={18} />
              {(selectedCat !== 'Todas' || selectedUrgency || selectedLocation !== 'brasil' || selectedTimeframe !== 'todos') && <div className="filter-badge" />}
            </button>
          </div>
        </header>

        <div className="orders-grid-mobile" ref={ref}>
          {loadingPedidos ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card-mobile">
                <Skeleton height={180} borderRadius={16} />
              </div>
            ))
          ) : (
            <>
              {filteredOrders.map((order) => {
                const urg = URGENCY_OPTIONS.find(u => u.id === order.urgency);
                const catMeta = CATEGORY_METADATA[order.category] || { color: '#64748b' };
                return (
                  <div 
                    key={order.id}
                    className="order-card-mobile"
                    style={{
                      animation: 'fadeInUp 0.5s ease-out'
                    }}
                  >
                    <div className="card-header-mobile">
                      <span className="cat-badge-mobile" style={{ backgroundColor: catMeta.color }}>
                        {order.category}
                      </span>
                      {order.isNew && <span className="new-badge-mobile">NOVO</span>}
                    </div>
                    
                    <div className="card-content-mobile">
                      <h3>{order.title}</h3>
                      <div className="loc-row-mobile">
                        <MapPin size={12} />
                        <span>{order.neighborhood}</span>
                      </div>
                      <div className="urg-row-mobile" style={{ color: urg?.color }}>
                        {urg?.icon}
                        <span>{urg?.label}</span>
                      </div>
                    </div>

                    <div className="card-footer-mobile">
                      <button className="btn-view-mobile" onClick={() => { setSelectedOrder(order); setActiveTab('relato'); }}>
                        <Eye size={16} /> Detalhes
                      </button>
                      <button className="btn-help-mobile" onClick={() => setOrderToHelp(order)}>
                        <Heart size={16} /> Ajudar
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
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
                  <button className={`pill-mobile ${selectedLocation === 'meu_estado' ? 'active' : ''}`} onClick={() => setSelectedLocation('meu_estado')}>RS</button>
                  <button className={`pill-mobile ${selectedLocation === 'minha_cidade' ? 'active' : ''}`} onClick={() => setSelectedLocation('minha_cidade')}>Porto Alegre</button>
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
            <button className="btn-help-now-v4-mobile" onClick={() => { setOrderToHelp(selectedOrder); setSelectedOrder(null); }}>
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
                      // Primeiro registrar interesse
                      const interesseData = {
                        pedidoId: orderToHelp.id,
                        tipo: 'ajuda',
                        observacoes: 'Interesse em ajudar através da plataforma'
                      };
                      
                      await ApiService.createInteresse(interesseData);
                      
                      // Depois criar conversa
                      const conversationData = {
                        participantId: orderToHelp.userId,
                        type: 'ajuda',
                        metadata: {
                          pedidoId: orderToHelp.id,
                          categoria: orderToHelp.category,
                          titulo: orderToHelp.title
                        }
                      };
                      
                      const response = await ApiService.createConversation(conversationData);
                      
                      if (response.success) {
                        toast.success('Conversa iniciada!');
                        window.location.href = `/chat/${response.data.id}`;
                      } else {
                        throw new Error(response.error || 'Erro ao criar conversa');
                      }
                    } catch (error) {
                      console.error('Erro ao iniciar conversa:', error);
                      toast.error('Erro ao iniciar conversa');
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