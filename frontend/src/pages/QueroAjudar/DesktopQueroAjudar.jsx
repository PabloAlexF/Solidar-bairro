import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSpring, animated, useTrail } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Tooltip } from 'react-tooltip';
import ApiService from '../../services/apiService';
import {
  Bell,
  LogOut,
  Settings,
  Shield
} from 'lucide-react';
import createGlobe from 'cobe';
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
  Shirt,
  Pill,
  Briefcase,
  Sofa,
  Lightbulb,
  Clock,
  User,
  Package,
  Search,
  Sparkles,
  Navigation,
  Grid3X3,
  List,
  HandHeart,
  HelpCircle,
  FileSearch,
  Accessibility,
  Users,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import './styles-v4.css';

const CATEGORY_METADATA = {
  'Alimentos': { color: '#f97316', icon: <ShoppingCart size={18} aria-hidden="true" />, label: 'Alimentos' },
  'Roupas': { color: '#6366f1', icon: <Shirt size={18} aria-hidden="true" />, label: 'Roupas' },
  'Medicamentos': { color: '#ef4444', icon: <Pill size={18} aria-hidden="true" />, label: 'Medicamentos' },
  'Móveis': { color: '#8b5cf6', icon: <Sofa size={18} aria-hidden="true" />, label: 'Móveis' },
  'Serviços': { color: '#10b981', icon: <Briefcase size={18} aria-hidden="true" />, label: 'Serviços' },
  'Outros': { color: '#64748b', icon: <Lightbulb size={18} aria-hidden="true" />, label: 'Outros' },
};

const CATEGORIES = [
  { id: 'Todas', label: 'Todas', color: '#64748b' },
  { id: 'Alimentos', label: 'Alimentos', color: '#f97316' },
  { id: 'Roupas', label: 'Roupas', color: '#6366f1' },
  { id: 'Medicamentos', label: 'Medicamentos', color: '#ef4444' },
  { id: 'Móveis', label: 'Móveis', color: '#8b5cf6' },
  { id: 'Serviços', label: 'Serviços', color: '#10b981' },
  { id: 'Outros', label: 'Outros', color: '#64748b' },
];

const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato', icon: <AlertTriangle size={14} aria-hidden="true" />, color: '#ef4444' },
  { id: 'urgente', label: 'URGENTE', desc: 'Próximas 24h', icon: <Zap size={14} aria-hidden="true" />, color: '#f97316' },
  { id: 'moderada', label: 'MODERADA', desc: 'Alguns dias', icon: <Calendar size={14} aria-hidden="true" />, color: '#f59e0b' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem pressa', icon: <Coffee size={14} aria-hidden="true" />, color: '#10b981' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Mensal', icon: <RefreshCcw size={14} aria-hidden="true" />, color: '#6366f1' },
];



function CobeGlobe() {
  const canvasRef = useRef();
  const [globe, setGlobe] = useState();

  useEffect(() => {
    let phi = 0;
    
    if (canvasRef.current) {
      const globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: 900,
        height: 900,
        phi: -0.1,
        theta: 0.2,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 20000,
        mapBrightness: 8,
        baseColor: [0.2, 0.2, 0.2],
        markerColor: [0.1, 0.8, 1],
        glowColor: [0.1, 0.8, 0.5],
        markers: [
          { location: [-23.5505, -46.6333], size: 0.04 }, // São Paulo
          { location: [-22.9068, -43.1729], size: 0.04 }, // Rio de Janeiro
          { location: [-19.9167, -43.9345], size: 0.03 }, // Belo Horizonte
          { location: [-25.4284, -49.2733], size: 0.03 }, // Curitiba
          { location: [-30.0346, -51.2177], size: 0.03 }, // Porto Alegre
          { location: [-8.0476, -34.8770], size: 0.03 }, // Recife
          { location: [-15.7942, -47.8822], size: 0.03 }, // Brasília
          { location: [-3.7319, -38.5267], size: 0.03 }, // Fortaleza
          { location: [-12.9714, -38.5014], size: 0.03 }, // Salvador
          { location: [-5.7945, -35.2110], size: 0.02 }, // Natal
        ],
        onRender: (state) => {
          phi += 0.005;
          state.phi = phi;
        }
      });
      
      setGlobe(globe);
    }
    
    return () => {
      if (globe) {
        globe.destroy();
      }
    };
  }, []);

  return (
    <div className="globe-container">
      <canvas
        ref={canvasRef}
        style={{
          width: 900,
          height: 900,
          maxWidth: '100%',
          aspectRatio: 1,
          filter: 'drop-shadow(0 20px 40px rgba(16, 185, 129, 0.2))',
        }}
      />
    </div>
  );
}

function SkipLinks() {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <a href="#filters" className="skip-link">
        Pular para filtros
      </a>
      <a href="#orders-list" className="skip-link">
        Pular para lista de pedidos
      </a>
    </div>
  );
}

function HeroSection({ 
  filteredCount, 
  userLocation
}) {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  const leftSpring = useSpring({
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? 'translateX(0px)' : 'translateX(-40px)',
    config: { tension: 200, friction: 40 }
  });

  const rightSpring = useSpring({
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? 'translateX(0px)' : 'translateX(40px)',
    delay: 150,
    config: { tension: 200, friction: 40 }
  });

  const navLinks = [
    { href: '/quero-ajudar', label: 'Quero Ajudar', icon: <HandHeart size={18} aria-hidden="true" />, active: true },
    { href: '/preciso-de-ajuda', label: 'Preciso de Ajuda', icon: <HelpCircle size={18} aria-hidden="true" />, active: false },
    { href: '/achados-e-perdidos', label: 'Achados e Perdidos', icon: <FileSearch size={18} aria-hidden="true" />, active: false },
  ];

  return (
    <section className="hero-section-v5" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-bg-pattern" aria-hidden="true" />

      <div className="hero-main-content">
        <animated.div className="hero-left" style={leftSpring}>
          <div className="hero-badge">
            <Sparkles size={14} aria-hidden="true" />
            <span>Rede de solidariedade comunitária</span>
          </div>
          
          <h1 id="hero-title">
            <span className="hero-title-highlight">Transforme vidas através da solidariedade</span>
          </h1>
          
          <p className="hero-subtitle">
            Una-se a milhares de pessoas que fazem a diferença todos os dias. 
            Descubra pedidos de ajuda próximos e seja parte da mudança que sua comunidade precisa.
          </p>

          {userLocation && (
            <div className="hero-location">
              <MapPin size={18} aria-hidden="true" />
              <span>Sua localização: <strong>{userLocation.city}, {userLocation.state}</strong></span>
            </div>
          )}

          <div className="hero-cta-group">
            <a href="#orders-list" className="btn-hero-primary">
              <Heart size={18} aria-hidden="true" />
              Ver pedidos de ajuda
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link to="/preciso-de-ajuda" className="btn-hero-secondary">
              <HelpCircle size={18} aria-hidden="true" />
              Preciso de ajuda
            </Link>
          </div>

          <nav className="hero-inline-nav" role="navigation" aria-label="Navegação de páginas">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                to={link.href} 
                className={`hero-inline-link ${link.active ? 'active' : ''}`}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </animated.div>

        <animated.div className="hero-right" style={rightSpring}>
          <CobeGlobe />
        </animated.div>

      </div>

      <a href="#orders-list" className="scroll-indicator" aria-label="Rolar para ver os pedidos">
        <span>Ver pedidos abaixo</span>
        <ArrowRight size={18} aria-hidden="true" className="scroll-arrow" />
      </a>
    </section>
  );
}

function OrderCard({ order, onViewDetails, onHelp }) {
  const urg = URGENCY_OPTIONS.find((u) => u.id === order.urgency);
  const catMeta = CATEGORY_METADATA[order.category] || { color: '#64748b', icon: <Package size={18} aria-hidden="true" />, label: order.category };
  
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMinutes < 1) return 'Agora mesmo';
    if (diffMinutes < 60) return `há ${diffMinutes} minutos`;
    if (diffHours < 24) return `há ${diffHours} horas`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;
    return createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onViewDetails(order);
    }
  };

  return (
    <article 
      className="order-card-v4"
      aria-labelledby={`order-title-${order.id}`}
      aria-describedby={`order-desc-${order.id}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="article"
    >
      <div 
        className="card-accent-v4" 
        style={{ background: `linear-gradient(180deg, ${urg?.color || '#64748b'}, transparent)` }} 
        aria-hidden="true"
      />
      
      <div className="card-header-v4">
        <div className="card-badges-v4" role="list" aria-label="Status do pedido">
          {order.isNew && (
            <span className="badge-new-v4" role="listitem" aria-label="Pedido novo">
              <Sparkles size={12} aria-hidden="true" />
              Novo
            </span>
          )}
          <span 
            className="badge-urgency-v4" 
            style={{ color: urg?.color, background: `${urg?.color}15`, borderColor: `${urg?.color}30` }}
            role="listitem"
            aria-label={`Urgência: ${urg?.label}, ${urg?.desc}`}
          >
            {urg?.icon}
            {urg?.label}
          </span>
        </div>
        <time className="card-time-v4" dateTime={order.createdAt.toISOString()} aria-label={`Publicado ${getTimeAgo(order.createdAt)}`}>
          <Clock size={14} aria-hidden="true" />
          {getTimeAgo(order.createdAt)}
        </time>
      </div>

      <div className="card-category-v4">
        <div 
          className="category-icon-v4" 
          style={{ background: catMeta.color }}
          aria-hidden="true"
        >
          {catMeta.icon || <Package size={18} />}
        </div>
        <h3 id={`order-title-${order.id}`} className="category-name-v4">
          {order.title || order.category}
        </h3>
      </div>

      <p id={`order-desc-${order.id}`} className="card-description-v4">
        {order.description?.substring(0, 150)}...
      </p>

      <dl className="card-meta-v4">
        <div className="meta-row-v4">
          <dt className="sr-only">Solicitante</dt>
          <User size={16} aria-hidden="true" />
          <dd>{order.userName}</dd>
        </div>
        <div className="meta-row-v4">
          <dt className="sr-only">Localização</dt>
          <MapPin size={16} aria-hidden="true" />
          <dd>{order.neighborhood}, {order.city} - {order.state}</dd>
        </div>
      </dl>

      <div className="card-actions-v4" role="group" aria-label="Ações do pedido">
        <button
          className="btn-view-v4"
          onClick={(e) => onViewDetails(order, e)}
          aria-label={`Ver detalhes do pedido de ${order.userName}`}
        >
          <Eye size={16} aria-hidden="true" />
          Detalhes
        </button>
        <button 
          className="btn-help-v4" 
          onClick={() => onHelp(order)}
          aria-label={`Oferecer ajuda para ${order.userName}`}
        >
          <Heart size={16} aria-hidden="true" />
          Ajudar
        </button>
      </div>
    </article>
  );
}

function ModalDetalhes({ order, onClose, onHelp }) {
  const [activeTab, setActiveTab] = useState('historia');
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  
  const sections = [
    { id: 'historia', label: 'Relato', icon: <MessageSquare size={18} aria-hidden="true" /> },
    { id: 'urgencia', label: 'Urgência', icon: <AlertTriangle size={18} aria-hidden="true" /> },
    { id: 'contato', label: 'Localização', icon: <MapPin size={18} aria-hidden="true" /> },
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

  const URGENCY_OPTIONS_MODAL = [
    { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato à saúde ou vida', icon: <AlertTriangle size={20} aria-hidden="true" />, color: '#ef4444' },
    { id: 'urgente', label: 'URGENTE', desc: 'Necessário para as próximas 24h', icon: <Zap size={20} aria-hidden="true" />, color: '#f97316' },
    { id: 'moderada', label: 'MODERADA', desc: 'Pode aguardar alguns dias', icon: <Calendar size={20} aria-hidden="true" />, color: '#f59e0b' },
    { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem prazo rígido', icon: <Coffee size={20} aria-hidden="true" />, color: '#10b981' },
    { id: 'recorrente', label: 'RECORRENTE', desc: 'Necessidade mensal constante', icon: <RefreshCcw size={20} aria-hidden="true" />, color: '#6366f1' }
  ];

  useEffect(() => {
    if (order && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [order]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (order) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [order, onClose]);
    
  if (!order) return null;
  
  const urg = URGENCY_OPTIONS_MODAL.find((u) => u.id === order.urgency);
  const catMeta = CATEGORY_METADATA[order.category] || { color: '#64748b', icon: <Info size={24} aria-hidden="true" />, label: order.category };

  const scrollToSection = (id) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(id);
    }
  };

  return (
    <div 
      className="qa-modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="qa-modal-content-v4" 
        onClick={e => e.stopPropagation()}
        ref={modalRef}
      >
        <button 
          ref={closeButtonRef}
          className="modal-close-btn-v4" 
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          <X size={20} aria-hidden="true" />
        </button>
        
        <aside className="modal-sidebar-v4" aria-label="Navegação do modal">
          <div className="sidebar-header-v4">
            <div className="sidebar-category-badge" style={{ background: catMeta.color }} aria-hidden="true">
              {catMeta.icon || <Package size={20} />}
            </div>
            <span>{order.category}</span>
          </div>
          <nav className="sidebar-nav-v4" aria-label="Seções do pedido">
            {sections.map((s) => (
              <button 
                key={s.id}
                className={`nav-item-v4 ${activeTab === s.id ? 'active' : ''}`}
                onClick={() => scrollToSection(s.id)}
                aria-current={activeTab === s.id ? 'true' : undefined}
                aria-label={`Ir para seção ${s.label}`}
              >
                <span className="nav-icon-v4">{s.icon}</span>
                <span className="nav-label-v4">{s.label}</span>
                {activeTab === s.id && <div className="nav-indicator-v4" style={{ backgroundColor: catMeta.color }} aria-hidden="true" />}
              </button>
            ))}
          </nav>
          <div 
            className="sidebar-urgency-v4" 
            style={{ borderColor: urg?.color, background: `${urg?.color}10` }}
            role="status"
            aria-label={`Nível de urgência: ${urg?.label}`}
          >
            <span className="urgency-icon-v4" style={{ color: urg?.color }} aria-hidden="true">{urg?.icon}</span>
            <div className="urgency-text-v4">
              <span className="urgency-label-v4" style={{ color: urg?.color }}>{urg?.label}</span>
              <span className="urgency-desc-v4">{urg?.desc}</span>
            </div>
          </div>
        </aside>

        <main className="modal-main-v4">
          <animated.header className="main-header-v4" style={headerSpring} ref={headerRef}>
            <div className="header-content-v4">
              <h2 id="modal-title">{order.title || order.category}</h2>
              <div className="header-meta-v4">
                <div className="meta-item-v4">
                  <User size={16} aria-hidden="true" />
                  <span>{order.userName}</span>
                </div>
                <div className="meta-divider-v4" aria-hidden="true" />
                <div className="meta-item-v4">
                  <MapPin size={16} aria-hidden="true" />
                  <span>{order.neighborhood}, {order.city}</span>
                </div>
              </div>
            </div>
          </animated.header>

          <animated.div className="modal-scroll-v4" style={contentSpring}>
            <div ref={contentRef}>
              <section id="section-historia" className="content-section-v4" aria-labelledby="section-historia-title">
                <div className="section-header-v4">
                  <MessageSquare size={20} aria-hidden="true" />
                  <h3 id="section-historia-title">O Relato de {order.userName.split(' ')[0]}</h3>
                </div>
                <div className="story-card-v4">
                  <p>{order.description}</p>
                </div>
              </section>

              <section id="section-urgencia" className="content-section-v4" aria-labelledby="section-urgencia-title">
                <div className="section-header-v4">
                  <AlertTriangle size={20} aria-hidden="true" />
                  <h3 id="section-urgencia-title">Nível de Urgência</h3>
                </div>
                <div className="urgency-card-v4" style={{ borderColor: urg?.color, background: `${urg?.color}08` }}>
                  <div className="urgency-badge-large" style={{ background: urg?.color }} aria-hidden="true">
                    {urg?.icon}
                  </div>
                  <div className="urgency-details-v4">
                    <h4 style={{ color: urg?.color }}>{urg?.label}</h4>
                    <p>{urg?.desc}</p>
                    <div className="urgency-timeline-v4">
                      <Clock size={14} aria-hidden="true" />
                      <span>Resposta esperada: {urg?.id === 'critico' ? '< 2h' : urg?.id === 'urgente' ? '< 24h' : '2-5 dias'}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section id="section-contato" className="content-section-v4" aria-labelledby="section-contato-title">
                <div className="section-header-v4">
                  <MapPin size={20} aria-hidden="true" />
                  <h3 id="section-contato-title">Localização</h3>
                </div>
                <div className="contact-card-v4">
                  <dl className="contact-grid-v4">
                    <div className="contact-item-v4">
                      <dt>Bairro</dt>
                      <dd>{order.neighborhood}</dd>
                    </div>
                    <div className="contact-item-v4">
                      <dt>Cidade</dt>
                      <dd>{order.city} - {order.state}</dd>
                    </div>
                  </dl>
                </div>
              </section>
            </div>
          </animated.div>

          <footer className="modal-footer-v4">
            <button className="btn-secondary-v4" onClick={onClose}>
              Voltar
            </button>
            <button 
              className="btn-primary-v4"
              onClick={() => { onHelp(order); onClose(); }}
              style={{ background: `linear-gradient(135deg, ${catMeta.color}, ${catMeta.color}dd)` }}
              aria-label={`Oferecer ajuda para ${order.userName}`}
            >
              <Heart size={18} fill="white" aria-hidden="true" />
              Quero Ajudar
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}

function FiltersModal({ 
  show, 
  onClose, 
  selectedCat, 
  setSelectedCat, 
  selectedUrgency, 
  setSelectedUrgency,
  selectedLocation,
  setSelectedLocation,
  onlyNew,
  setOnlyNew,
  userLocation,
  onClear
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (show && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [show]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (show) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div 
      className="filters-modal-overlay-v4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filters-title"
    >
      <div 
        className="filters-modal-v4" 
        onClick={e => e.stopPropagation()}
        ref={modalRef}
      >
        <div className="filters-header-v4">
          <div className="filters-title-v4">
            <Filter size={20} aria-hidden="true" />
            <h2 id="filters-title">Filtros</h2>
          </div>
          <button 
            ref={closeButtonRef}
            className="filters-close-v4" 
            onClick={onClose}
            aria-label="Fechar filtros"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="filters-content-v4">
          <fieldset className="filter-group-v4">
            <legend>
              <MapPin size={16} aria-hidden="true" />
              Localização
            </legend>
            <div className="filter-chips-v4" role="radiogroup" aria-label="Filtrar por localização">
              <button 
                className={`filter-chip-v4 ${selectedLocation === 'brasil' ? 'active' : ''}`}
                onClick={() => setSelectedLocation('brasil')}
                role="radio"
                aria-checked={selectedLocation === 'brasil'}
              >
                Todo o Brasil
              </button>
              {userLocation && (
                <>
                  <button 
                    className={`filter-chip-v4 ${selectedLocation === 'meu_estado' ? 'active' : ''}`}
                    onClick={() => setSelectedLocation('meu_estado')}
                    role="radio"
                    aria-checked={selectedLocation === 'meu_estado'}
                  >
                    {userLocation.state}
                  </button>
                  <button 
                    className={`filter-chip-v4 ${selectedLocation === 'minha_cidade' ? 'active' : ''}`}
                    onClick={() => setSelectedLocation('minha_cidade')}
                    role="radio"
                    aria-checked={selectedLocation === 'minha_cidade'}
                  >
                    {userLocation.city}
                  </button>
                </>
              )}
            </div>
          </fieldset>

          <fieldset className="filter-group-v4">
            <legend>
              <Package size={16} aria-hidden="true" />
              Categoria
            </legend>
            <div className="filter-chips-v4 scrollable" role="radiogroup" aria-label="Filtrar por categoria">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-chip-v4 ${selectedCat === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCat(cat.id)}
                  style={{ '--chip-color': cat.color }}
                  role="radio"
                  aria-checked={selectedCat === cat.id}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group-v4">
            <legend>
              <AlertTriangle size={16} aria-hidden="true" />
              Urgência
            </legend>
            <div className="filter-chips-v4" role="group" aria-label="Filtrar por urgência">
              {URGENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`filter-chip-v4 urgency ${selectedUrgency === opt.id ? 'active' : ''}`}
                  onClick={() => setSelectedUrgency(selectedUrgency === opt.id ? null : opt.id)}
                  style={{ '--chip-color': opt.color }}
                  role="checkbox"
                  aria-checked={selectedUrgency === opt.id}
                  aria-label={`${opt.label}: ${opt.desc}`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group-v4">
            <legend>
              <Clock size={16} aria-hidden="true" />
              Período
            </legend>
            <div className="filter-chips-v4">
              <button 
                className={`filter-chip-v4 ${onlyNew ? 'active' : ''}`}
                onClick={() => setOnlyNew(!onlyNew)}
                role="checkbox"
                aria-checked={onlyNew}
              >
                <Sparkles size={14} aria-hidden="true" />
                Apenas Novos
              </button>
            </div>
          </fieldset>
        </div>

        <div className="filters-footer-v4">
          <button className="btn-clear-v4" onClick={onClear}>
            Limpar Filtros
          </button>
          <button className="btn-apply-v4" onClick={onClose}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmHelpModal({ order, onConfirm, onClose }) {
  const confirmButtonRef = useRef(null);

  useEffect(() => {
    if (order && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [order]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (order) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [order, onClose]);

  if (!order) return null;

  return (
    <div 
      className="confirm-modal-overlay-v4" 
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="confirm-modal-v4" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon-v4" aria-hidden="true">
          <Heart size={40} fill="#10b981" color="#10b981" />
        </div>
        <h2 id="confirm-title">Deseja ajudar {order.userName}?</h2>
        <p id="confirm-desc">Iremos abrir um chat seguro para vocês combinarem a ajuda.</p>
        <div className="confirm-actions-v4">
          <button 
            ref={confirmButtonRef}
            className="btn-confirm-v4" 
            onClick={onConfirm}
          >
            <MessageCircle size={18} aria-hidden="true" />
            Sim, conversar agora
          </button>
          <button className="btn-cancel-v4" onClick={onClose}>
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveRegion({ message }) {
  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true" 
      className="sr-only"
    >
      {message}
    </div>
  );
}

export default function QueroAjudarPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [selectedUrgency, setSelectedUrgency] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
  const [orderToHelp, setOrderToHelp] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('brasil');
  const [onlyNew, setOnlyNew] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [liveMessage, setLiveMessage] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [cardsRef, cardsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        const response = await ApiService.getPedidos();
        if (response.success && response.data) {
          // Mapear dados do backend para o formato esperado pelo frontend
          const mappedPedidos = response.data.map(pedido => {
            // Safe date parsing
            let createdAt = new Date();
            let isNew = false;

            try {
              if (pedido.createdAt) {
                if (pedido.createdAt.seconds) {
                  // Firebase Timestamp format
                  createdAt = new Date(pedido.createdAt.seconds * 1000);
                } else if (pedido.createdAt._seconds) {
                  // Alternative Firebase format
                  createdAt = new Date(pedido.createdAt._seconds * 1000);
                } else if (typeof pedido.createdAt === 'string') {
                  // ISO string
                  createdAt = new Date(pedido.createdAt);
                } else if (pedido.createdAt instanceof Date) {
                  // Already a Date object
                  createdAt = pedido.createdAt;
                }

                // Check if date is valid
                if (isNaN(createdAt.getTime())) {
                  createdAt = new Date();
                } else {
                  isNew = (new Date() - createdAt) < (24 * 60 * 60 * 1000);
                }
              }
            } catch (error) {
              console.warn('Error parsing date for pedido:', pedido.id, error);
              createdAt = new Date();
            }

            return {
              id: pedido.id,
              userId: pedido.userId,
              userName: pedido.usuario?.nome || 'Usuário',
              city: pedido.city || 'Não informado',
              state: pedido.state || 'Não informado',
              neighborhood: pedido.neighborhood || 'Não informado',
              urgency: pedido.urgency || 'moderada',
              category: pedido.category || 'Outros',
              title: pedido.category || 'Pedido de ajuda', // Usar categoria como título se não houver título específico
              description: pedido.description || 'Descrição não disponível',
              isNew,
              createdAt,
              status: pedido.status || 'ativo'
            };
          });

          setPedidos(mappedPedidos);
          setLiveMessage(`${mappedPedidos.length} pedidos de ajuda carregados`);
        } else {
          console.error('Erro ao carregar pedidos:', response);
          setLiveMessage('Erro ao carregar pedidos');
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        setLiveMessage('Erro ao carregar pedidos');
      } finally {
        setLoadingPedidos(false);
      }
    };

    loadPedidos();
    setUserLocation({ state: 'SP', city: 'São Paulo' });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = typeof window !== 'undefined' ? localStorage.getItem('solidar-notifications') : null;
      if (savedNotifications) {
        try {
          setNotifications(JSON.parse(savedNotifications));
        } catch (error) {
          console.error('Error parsing notifications:', error);
          setNotifications([]);
        }
      }
    };

    loadNotifications();

    const handleClickOutside = (event) => {
      if (showUserMenu || showNotifications) {
        const userMenuElement = document.querySelector('.user-menu-wrapper');
        const notificationElement = document.querySelector('.notification-wrapper');

        if (userMenuElement && !userMenuElement.contains(event.target)) {
          setShowUserMenu(false);
        }

        if (notificationElement && !notificationElement.contains(event.target)) {
          setShowNotifications(false);
        }
      }
    };

    window.addEventListener('notificationAdded', loadNotifications);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('notificationAdded', loadNotifications);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  const filteredOrders = useMemo(() => {
    const filtered = pedidos.filter((order) => {
      const catMatch = selectedCat === 'Todas' || order.category === selectedCat;
      const urgMatch = !selectedUrgency || order.urgency === selectedUrgency;
      
      let locationMatch = true;
      if (selectedLocation === 'meu_estado' && userLocation) {
        locationMatch = order.state === userLocation.state;
      } else if (selectedLocation === 'minha_cidade' && userLocation) {
        locationMatch = order.city === userLocation.city && order.state === userLocation.state;
      }
      
      const newMatch = !onlyNew || order.isNew;
      
      return catMatch && urgMatch && locationMatch && newMatch;
    });
    
    return filtered;
  }, [pedidos, selectedCat, selectedUrgency, selectedLocation, onlyNew, userLocation]);

  useEffect(() => {
    if (!loadingPedidos) {
      setLiveMessage(`${filteredOrders.length} pedidos encontrados`);
    }
  }, [filteredOrders.length, loadingPedidos]);

  const trail = useTrail(filteredOrders.length, {
    opacity: cardsInView ? 1 : 0,
    transform: cardsInView ? 'translateY(0px)' : 'translateY(30px)',
    config: { tension: 280, friction: 60 }
  });

  const hasActiveFilters = selectedCat !== 'Todas' || selectedUrgency || selectedLocation !== 'brasil' || onlyNew;

  const handleConfirmHelp = () => {
    toast.success('Conversa iniciada! (Demo)', {
      icon: '💬',
      duration: 4000,
    });
    setOrderToHelp(null);
    setLiveMessage('Conversa iniciada com sucesso');
  };

  const handleViewDetails = (order, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const modalWidth = Math.min(1000, window.innerWidth * 0.9); // max-width of modal or 90% of viewport
    const modalHeight = window.innerHeight * 0.85; // 85vh

    let top = rect.bottom + 10; // Position below the card
    let left = (window.innerWidth - modalWidth) / 2; // Center horizontally on viewport
    let transform = 'none';

    // If positioning below would go off-screen, position above
    if (top + modalHeight > window.innerHeight - 20) {
      top = rect.top - modalHeight - 10;
    }

    // Ensure modal stays within viewport bounds
    if (top < 10) {
      top = 10;
    }

    setModalPosition({
      top: `${top}px`,
      left: `${left}px`,
      transform: 'none'
    });
    setSelectedOrder(order);
  };

  const clearFilters = () => {
    setSelectedCat('Todas');
    setSelectedUrgency(null);
    setSelectedLocation('brasil');
    setOnlyNew(false);
    setLiveMessage('Filtros limpos');
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('solidar-notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('solidar-notifications');
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('solidar-notifications', JSON.stringify(updatedNotifications));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial || "Vizinho";

  // Verificar se é administrador
  const storedUser = JSON.parse(localStorage.getItem('solidar-user') || '{}');
  const isAdmin = user?.role === 'admin' ||
                  user?.isAdmin ||
                  user?.tipo === 'admin' ||
                  user?.email === 'admin@solidarbairro.com' ||
                  storedUser?.role === 'admin' ||
                  storedUser?.isAdmin ||
                  storedUser?.tipo === 'admin' ||
                  storedUser?.email === 'admin@solidarbairro.com';

  return (
    <div className={`qa-page-v4 ${highContrast ? 'high-contrast' : ''}`}>
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="section-container nav-container">
          <div className="logo-wrapper" onClick={() => navigate('/')}>
            <div className="logo-icon">
              <Heart fill="white" size={24} />
            </div>
            <span className="logo-text">Solidar<span className="logo-accent">Bairro</span></span>
          </div>

          <div className="nav-menu">
            <Link to="/preciso-de-ajuda" className="nav-link">
              Preciso de Ajuda
              <span className="link-underline" />
            </Link>
            <Link to="/achados-e-perdidos" className="nav-link">
              Achados e Perdidos
              <span className="link-underline" />
            </Link>

            {!isAuthenticated() ? (
              <div className="auth-group">
                <button
                  className="auth-btn-login"
                  onClick={() => navigate('/login')}
                >
                  Entrar
                </button>
                <button
                  className="auth-btn-register"
                  onClick={() => navigate('/cadastro')}
                >
                  Cadastrar
                </button>
              </div>
            ) : (
              <div className="user-section">
                {isAdmin && (
                  <>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, rgb(139, 92, 246), rgb(124, 58, 237))',
                        border: 'none',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: '0.3s',
                        boxShadow: 'rgba(139, 92, 246, 0.4) 0px 6px 20px',
                        marginRight: '0.5rem',
                        transform: 'translateY(-2px)'
                      }}
                      onClick={() => navigate('/admin')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-settings"
                        aria-hidden="true"
                        style={{
                          transform: 'translateY(0px)',
                          boxShadow: 'rgba(139, 92, 246, 0.3) 0px 4px 12px'
                        }}
                      >
                        <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button
                      title="Painel Social"
                      style={{
                        background: 'linear-gradient(135deg, rgb(13, 148, 136), rgb(20, 184, 166))',
                        border: 'none',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: '0.3s',
                        boxShadow: 'rgba(13, 148, 136, 0.4) 0px 6px 20px',
                        marginRight: '1rem',
                        transform: 'translateY(-2px)'
                      }}
                      onClick={() => navigate('/painel-social')}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-shield"
                        aria-hidden="true"
                        style={{
                          transform: 'translateY(0px)',
                          boxShadow: 'rgba(13, 148, 136, 0.3) 0px 4px 12px'
                        }}
                      >
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                      </svg>
                    </button>
                  </>
                )}

                <div className="notification-wrapper">
                  <button
                    className="notification-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={24} />
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <h3>Notificações</h3>
                        {notifications.length > 0 && (
                          <div className="notification-actions">
                            {unreadCount > 0 && (
                              <button
                                className="action-btn mark-read-btn"
                                onClick={markAllAsRead}
                                title="Marcar todas como lidas"
                              >
                                ✓
                              </button>
                            )}
                            <button
                              className="action-btn clear-btn"
                              onClick={clearAllNotifications}
                              title="Limpar todas"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="notification-list">
                        {notifications.length === 0 ? (
                          <div className="no-notifications">
                            Nenhuma notificação ainda
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                              onClick={() => !notification.read && markAsRead(notification.id)}
                            >
                              <div className="notification-content">
                                <p className="notification-title">{notification.title}</p>
                                <p className="notification-message">{notification.message}</p>
                                <span className="notification-time">
                                  {new Date(notification.timestamp).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                              {!notification.read && <div className="unread-dot"></div>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="user-menu-wrapper">
                  <button
                    className="user-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="user-avatar">
                      {user?.fotoPerfil ? (
                        <img
                          src={user.fotoPerfil}
                          alt="Foto do perfil"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                          onError={(e) => {
                            console.log('Erro ao carregar imagem:', user.fotoPerfil);
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = userName?.substring(0, 2).toUpperCase();
                          }}
                        />
                      ) : (
                        userName?.substring(0, 2).toUpperCase()
                      )}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <div className="user-avatar-large">
                          {user?.fotoPerfil ? (
                            <img
                              src={user.fotoPerfil}
                              alt="Foto do perfil"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                              onError={(e) => {
                                console.log('Erro ao carregar imagem grande:', user.fotoPerfil);
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = userName?.substring(0, 2).toUpperCase();
                              }}
                            />
                          ) : (
                            userName?.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="user-details">
                          <div className="user-name">
                            {userName}
                            {user?.isVerified && (
                              <span className="verified-text">Verificado</span>
                            )}
                          </div>
                          <div className="user-phone">{user?.phone || user?.telefone || user?.email}</div>
                        </div>
                      </div>

                      <div className="user-stats">
                        <div className="stat">
                          <div className="stat-number">{user?.helpedCount || 0}</div>
                          <div className="stat-label">Pessoas ajudadas</div>
                        </div>
                        <div className="stat">
                          <div className="stat-number">{user?.receivedHelpCount || 0}</div>
                          <div className="stat-label">Ajudas recebidas</div>
                        </div>
                      </div>

                      <div className="user-actions">
                        <button
                          className="menu-item profile-btn"
                          onClick={() => {
                            navigate('/perfil');
                            setShowUserMenu(false);
                          }}
                        >
                          👤 Ver perfil
                        </button>

                        <button
                          className="menu-item"
                          onClick={() => {
                            navigate('/conversas');
                            setShowUserMenu(false);
                          }}
                        >
                          💬 Minhas conversas
                        </button>

                        {isAdmin && (
                          <button
                            className="menu-item"
                            onClick={() => {
                              navigate('/admin');
                              setShowUserMenu(false);
                            }}
                          >
                            ⚙️ Dashboard Admin
                          </button>
                        )}

                        <button
                          className="menu-item logout-btn"
                          onClick={() => {
                            localStorage.removeItem('solidar-user');
                            window.location.reload();
                          }}
                        >
                          🚪 Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="skip-links">
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <a href="#filters" className="skip-link">
          Pular para filtros
        </a>
        <a href="#orders-list" className="skip-link">
          Pular para lista de pedidos
        </a>
      </div>
      <LiveRegion message={liveMessage} />

        <HeroSection
          filteredCount={filteredOrders.length}
          userLocation={userLocation}
        />
      
      <main id="main-content" className="qa-content-v4" role="main">
        <div className="qa-container-v4">
          <div className="section-header-bar" id="filters">
            <div className="section-header-left">
              <h2>Pedidos de ajuda</h2>
              <span className="pedidos-count">{filteredOrders.length} encontrados</span>
            </div>
            <div className="section-header-actions">
              <button 
                className={`btn-filters-section ${hasActiveFilters ? 'has-filters' : ''}`}
                onClick={() => setShowFiltersModal(true)}
                aria-label={`Abrir filtros${hasActiveFilters ? ' - filtros ativos' : ''}`}
                aria-haspopup="dialog"
              >
                <Filter size={18} aria-hidden="true" />
                <span>Filtros</span>
                {hasActiveFilters && <span className="filter-badge-count" aria-hidden="true" />}
              </button>
              
              <button
                className={`btn-accessibility-section ${highContrast ? 'active' : ''}`}
                onClick={() => setHighContrast(!highContrast)}
                aria-label={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
                title={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
              >
                <Accessibility size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="active-filters-v4" role="region" aria-label="Filtros ativos">
              <span className="filters-label-v4">Filtros ativos:</span>
              {selectedCat !== 'Todas' && (
                <span className="filter-tag-v4">
                  {selectedCat}
                  <button 
                    onClick={() => setSelectedCat('Todas')}
                    aria-label={`Remover filtro de categoria ${selectedCat}`}
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </span>
              )}
              {selectedUrgency && (
                <span className="filter-tag-v4">
                  {URGENCY_OPTIONS.find(u => u.id === selectedUrgency)?.label}
                  <button 
                    onClick={() => setSelectedUrgency(null)}
                    aria-label="Remover filtro de urgência"
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </span>
              )}
              {selectedLocation !== 'brasil' && (
                <span className="filter-tag-v4">
                  {selectedLocation === 'meu_estado' ? userLocation?.state : userLocation?.city}
                  <button 
                    onClick={() => setSelectedLocation('brasil')}
                    aria-label="Remover filtro de localização"
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </span>
              )}
              <button className="clear-all-v4" onClick={clearFilters}>
                Limpar todos
              </button>
            </div>
          )}

          <section 
            id="orders-list" 
            className="orders-grid-v4" 
            ref={cardsRef}
            aria-label="Lista de pedidos de ajuda"
            aria-busy={loadingPedidos}
          >
            {loadingPedidos ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="order-card-v4 skeleton" aria-hidden="true">
                  <Skeleton height={180} />
                  <div style={{ padding: '20px' }}>
                    <Skeleton height={24} width="60%" />
                    <Skeleton count={2} style={{ marginTop: 12 }} />
                    <Skeleton height={40} style={{ marginTop: 16 }} />
                  </div>
                </div>
              ))
            ) : filteredOrders.length === 0 ? (
              <div className="empty-state-v4" role="status">
                <Search size={48} aria-hidden="true" />
                <h3>Nenhum pedido encontrado</h3>
                <p>Tente ajustar os filtros ou volte mais tarde</p>
                <button onClick={clearFilters}>Limpar Filtros</button>
              </div>
            ) : (
              trail.map((style, index) => {
                const order = filteredOrders[index];
                if (!order) return null;
                return (
                  <animated.div key={order.id} style={style}>
                    <OrderCard
                      order={order}
                      onViewDetails={handleViewDetails}
                      onHelp={setOrderToHelp}
                    />
                  </animated.div>
                );
              })
            )}
          </section>
        </div>
      </main>

      <FiltersModal
        show={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        selectedCat={selectedCat}
        setSelectedCat={setSelectedCat}
        selectedUrgency={selectedUrgency}
        setSelectedUrgency={setSelectedUrgency}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onlyNew={onlyNew}
        setOnlyNew={setOnlyNew}
        userLocation={userLocation}
        onClear={clearFilters}
      />

      {selectedOrder && (
        <div
          className="qa-modal-overlay"
          style={{
            '--modal-top': modalPosition.top,
            '--modal-left': modalPosition.left,
            '--modal-transform': modalPosition.transform
          }}
        >
          <ModalDetalhes
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onHelp={setOrderToHelp}
          />
        </div>
      )}

      <ConfirmHelpModal
        order={orderToHelp}
        onConfirm={handleConfirmHelp}
        onClose={() => setOrderToHelp(null)}
      />

      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { background: '#1e293b', color: '#fff', borderRadius: '12px' },
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      }} />
    </div>
  );
}