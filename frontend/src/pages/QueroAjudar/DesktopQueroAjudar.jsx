import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSpring, animated, useTrail, useSprings } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Tooltip } from 'react-tooltip';
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
import LandingHeader from '../../components/layout/LandingHeader';
import './styles.css';
import { 
  CATEGORY_METADATA, 
  CATEGORIES, 
  URGENCY_OPTIONS, 
  SUB_QUESTION_LABELS
} from './constants';
import ApiService from '../../services/apiService';

// Import the existing components from the original file
function ModalDetalhes({ order, onClose, onHelp }) {
  const scrollContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('historia');
  
  const sections = [
    { id: 'historia', label: 'Relato', icon: <MessageSquare size={18} /> },
    { id: 'necessidades', label: 'Itens', icon: <ShoppingCart size={18} /> },
    { id: 'tecnico', label: 'Técnico', icon: <Info size={18} /> },
    { id: 'contato', label: 'Localização', icon: <MapPin size={18} /> },
  ];

  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true });

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

  const allSpecs = { ...(order?.details || {}), ...(order?.subQuestionAnswers || {}) };
  const specsArray = Object.entries(allSpecs);
  const specsTrail = useTrail(specsArray.length, {
    opacity: contentInView ? 1 : 0,
    transform: contentInView ? 'translateY(0px)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 }
  });

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
      <div 
        className="qa-modal-content-v3"
        onClick={e => e.stopPropagation()}
        style={{
          animation: 'modalSlideIn 0.3s ease-out'
        }}
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
              <button 
                key={s.id}
                className={`nav-item-v3 ${activeTab === s.id ? 'active' : ''}`}
                onClick={() => scrollToSection(s.id)}
                data-tooltip-id="nav-tooltip"
                data-tooltip-content={`Ver ${s.label.toLowerCase()}`}
                style={{
                  animation: `slideInLeft 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                {s.icon}
                <span>{s.label}</span>
                {activeTab === s.id && (
                  <div 
                    className="nav-indicator"
                    style={{ backgroundColor: catMeta.color }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="modal-main-v3">
          <animated.header className="main-header-v3" style={headerSpring} ref={headerRef}>
            <div className="header-titles-v3">
              <span 
                className="cat-badge-v3" 
                style={{ color: catMeta.color, backgroundColor: catMeta.color + '15' }}
                data-tooltip-id="category-tooltip"
                data-tooltip-content={`Categoria: ${order.category}`}
              >
                {catMeta.icon}
                {order.category}
              </span>
              <h2>{order.title || order.category}</h2>
              <p className="user-info-v3">
                Solicitado por <strong>{order.userName}</strong> • {order.userType || 'Cidadão'}
              </p>
            </div>
            <div 
              className="header-urgency-v3" 
              style={{ color: urg?.color, borderColor: urg?.color }}
              data-tooltip-id="urgency-tooltip"
              data-tooltip-content={urg?.desc}
            >
              {urg?.icon}
              <span>{urg?.label}</span>
            </div>
          </animated.header>

          <animated.div className="modal-scroll-v3" ref={scrollContainerRef} style={contentSpring}>
            <div ref={contentRef}>
              <section id="section-historia" className="content-section-v3">
                <div 
                  className="section-title-v3"
                  style={{
                    animation: 'fadeInUp 0.5s ease-out 0.2s both'
                  }}
                >
                  <MessageSquare size={20} />
                  <h3>O Relato de {order.userName.split(' ')[0]}</h3>
                </div>
                <div 
                  className="story-card-v3"
                  style={{
                    animation: 'scaleIn 0.5s ease-out 0.3s both'
                  }}
                >
                  <div className="quote-mark">"</div>
                  <p>{order.description}</p>
                  <div className="quote-mark-end">"</div>
                </div>
              </section>

              <section id="section-necessidades" className="content-section-v3">
                <div 
                  className="section-title-v3"
                  style={{
                    animation: 'fadeInUp 0.5s ease-out 0.4s both'
                  }}
                >
                  <ShoppingCart size={20} />
                  <h3>Itens Necessários</h3>
                </div>
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
                          {/* Context info would go here */}
                        </div>
                        <p>{catMeta.details[sc]?.desc}</p>
                      </animated.div>
                    );
                  })}
                </div>
              </section>

              <section id="section-tecnico" className="content-section-v3">
                <div 
                  className="section-title-v3"
                  style={{
                    animation: 'fadeInUp 0.5s ease-out 0.5s both'
                  }}
                >
                  <Info size={20} />
                  <h3>Detalhes e Especificações</h3>
                </div>
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
                                  <span 
                                    key={v} 
                                    className="spec-chip"
                                    style={{ backgroundColor: catMeta.color + '20', color: catMeta.color }}
                                  >
                                    {v}
                                  </span>
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
                  <div 
                    className="enhanced-empty-state"
                    style={{
                      animation: 'scaleIn 0.5s ease-out 0.6s both'
                    }}
                  >
                    <Info size={48} className="empty-icon" />
                    <h4>Sem especificações adicionais</h4>
                    <p>Este pedido não possui detalhes técnicos específicos informados.</p>
                  </div>
                )}
              </section>

              <section id="section-contato" className="content-section-v3">
                <div 
                  className="section-title-v3"
                  style={{
                    animation: 'fadeInUp 0.5s ease-out 0.7s both'
                  }}
                >
                  <MapPin size={20} />
                  <h3>Localização e Contato</h3>
                </div>
                <div 
                  className="contact-card-v3"
                  style={{
                    animation: 'scaleIn 0.5s ease-out 0.8s both'
                  }}
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
                </div>
              </section>
            </div>
          </animated.div>

          <footer 
            className="modal-footer-v3"
            style={{
              animation: 'fadeInUp 0.5s ease-out 0.9s both'
            }}
          >
            <button className="btn-cancel-v3" onClick={onClose}>
              Voltar
            </button>
            <button 
              className="btn-action-v3"
              onClick={() => {
                onHelp(order);
                onClose();
                toast.success('Conectando vocês! 💚');
              }}
              style={{ backgroundColor: catMeta.color }}
              data-tooltip-id="help-action-tooltip"
              data-tooltip-content="Iniciar conversa para ajudar"
            >
              <Heart size={20} fill="white" />
              Quero Ajudar Agora
            </button>
          </footer>
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
          id="help-action-tooltip" 
          place="top"
          delayShow={300}
        />
      </div>
    </div>
  );
}

function AnimatedBackground() {
  return (
    <div className="animated-background">
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

export default function DesktopQueroAjudar() {
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
  const [error, setError] = useState(null);

  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [cardsRef, cardsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const headerSpring = useSpring({
    opacity: headerInView ? 1 : 0,
    transform: headerInView ? 'translateY(0px)' : 'translateY(-50px)',
    config: { tension: 280, friction: 60 }
  });

  const filterButtonSpring = useSpring({
    scale: showFiltersModal ? 1.05 : 1,
    config: { tension: 300, friction: 10 }
  });

  const loadPedidos = async (filters = {}) => {
    try {
      setLoadingPedidos(true);
      setError(null);
      
      const response = await ApiService.getPedidos();
      
      if (response.success && response.data) {
        // Transformar dados do backend para o formato esperado pelo frontend
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
      toast.error('Erro ao carregar pedidos: ' + error.message);
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
    
    setIsLoading(true);
    
    // Carregar pedidos
    loadPedidos();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          let detectedState = 'MG';
          let detectedCity = 'Belo Horizonte';
          
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
          toast.success(`Localização detectada: ${detectedCity}, ${detectedState}`);
          setTimeout(() => setIsLoading(false), 1000);
        },
        (error) => {
          console.log('Location access denied');
          setUserLocation({ state: 'MG', city: 'Belo Horizonte' });
          toast.error('Localização negada. Usando Belo Horizonte como padrão.');
          setTimeout(() => setIsLoading(false), 1000);
        }
      );
    } else {
      setUserLocation({ state: 'MG', city: 'Belo Horizonte' });
      toast.error('Geolocalização não suportada.');
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []);

  const citiesByState = useMemo(() => {
    const grouped = {};
    pedidos.forEach(order => {
      if (!grouped[order.state]) {
        grouped[order.state] = new Set();
      }
      grouped[order.state].add(order.city);
    });
    
    Object.keys(grouped).forEach(state => {
      grouped[state] = Array.from(grouped[state]).sort();
    });
    
    return grouped;
  }, [pedidos]);

  const filteredOrders = useMemo(() => {
    return pedidos.filter((order) => {
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
  }, [pedidos, selectedCat, selectedUrgency, selectedLocation, selectedTimeframe, onlyNew, userLocation]);

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
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
      <AnimatedBackground />
      
      {!selectedOrder && <LandingHeader scrolled={true} />}
      
      <div className="qa-main-wrapper" id="main-content" style={{ paddingTop: '80px' }}>
        
        <animated.header className="page-header" style={headerSpring} ref={headerRef}>
          <div className="brand-box">
            <div className="brand-info">
              <h1>Solidariedade <span>Próxima</span></h1>
              <p>Conectando quem precisa com quem pode ajudar</p>
            </div>
          </div>

        <div className="header-controls">
          <button
            className="accessibility-toggle"
            onClick={() => setShowHelper(!showHelper)}
            data-tooltip-id="accessibility-tooltip"
            data-tooltip-content="Opções de acessibilidade"
          >
            Acessibilidade
          </button>
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

        {showFiltersModal && (
          <div className="filters-modal-overlay" onClick={() => setShowFiltersModal(false)}>
            <div 
              className="filters-modal"
              onClick={e => e.stopPropagation()}
              style={{
                animation: 'modalSlideIn 0.3s ease-out'
              }}
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
            </div>
          </div>
        )}

        <div className="results-count">
          <p>Encontramos <strong>{loadingPedidos ? <Skeleton width={30} /> : filteredOrders.length}</strong> pedidos para você ajudar</p>
          {error && (
            <div className="error-message" style={{ color: '#ef4444', marginTop: '8px' }}>
              {error}
            </div>
          )}
        </div>

        <div className="orders-grid-layout" ref={cardsRef}>
          {showHelper && (
            <div className="accessibility-overlay">
              <div
                className="accessibility-modal"
                onClick={e => e.stopPropagation()}
                style={{
                  animation: 'modalSlideIn 0.3s ease-out'
                }}
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
              </div>
            </div>
          )}
          {loadingPedidos ? (
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
            <>
              {trail.map((style, index) => {
                const order = filteredOrders[index];
                if (!order) return null;
                
                const urg = URGENCY_OPTIONS.find((u) => u.id === order.urgency);
                const catMeta = CATEGORY_METADATA[order.category] || { color: '#64748b' };
                
                return (
                  <animated.div key={order.id} style={style}>
                    <div
                      className="vibrant-order-card"
                      style={{
                        animation: 'cardSlideIn 0.5s ease-out'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-8px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                      }}
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
                          <div className="qa-user-avatar">
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
                    </div>
                  </animated.div>
                );
              })}
            </>
          )}
        </div>

        {selectedOrder && (
          <ModalDetalhes 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            onHelp={(order) => setOrderToHelp(order)}
          />
        )}

        {orderToHelp && (
          <div className="qa-modal-overlay high-z" onClick={() => setOrderToHelp(null)}>
            <div 
              className="confirm-help-modal"
              onClick={e => e.stopPropagation()}
              style={{
                animation: 'modalSlideIn 0.3s ease-out'
              }}
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
                      // Criar conversa diretamente
                      const conversationData = {
                        participants: [orderToHelp.userId],
                        pedidoId: orderToHelp.id,
                        type: 'ajuda',
                        title: `Ajuda: ${orderToHelp.title}`
                      };
                      
                      const response = await ApiService.createConversation(conversationData);
                      
                      if (response.success) {
                        toast.success('Conversa iniciada! Redirecionando...');
                        window.location.href = `/chat/${response.data.id}`;
                      } else {
                        throw new Error(response.error || 'Erro ao criar conversa');
                      }
                    } catch (error) {
                      console.error('Erro ao iniciar conversa:', error);
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
            </div>
          </div>
        )}
        
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