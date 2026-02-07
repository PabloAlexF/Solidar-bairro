
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import toast, { Toaster } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Tooltip } from 'react-tooltip';
import { motion } from 'framer-motion';
import ApiService from '../../services/apiService';
import { getCurrentLocation, getLocationWithFallback } from '../../utils/geolocation';
import ReusableHeader from '../../components/layout/ReusableHeader';
import {
  Sparkles,
  Heart,
  CheckCircle2
} from 'lucide-react';
import createGlobe from 'cobe';
import {
  MapPin,
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
  Navigation,
  Grid3X3,
  List,
  HandHeart,
  FileSearch,
  Accessibility,
  Users,
  TrendingUp,
  ArrowRight,
  Globe,
  Receipt,
  Car
} from 'lucide-react';
import './styles-v4.css';
import marca from '../../assets/images/marca.png';

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
    <div className="globe-container-with-items">
      {/* Floating 3D items around the globe */}
      <div className="floating-3d-items">
        {/* Food related items */}
        <div className="floating-item food-item-1" data-tooltip="Alimentos - Cesta Básica">
          <ShoppingCart size={24} />
        </div>
        <div className="floating-item food-item-2" data-tooltip="Proteínas">
          🍖
        </div>
        <div className="floating-item food-item-3" data-tooltip="Hortifruti">
          🥕
        </div>

        {/* Clothing related items */}
        <div className="floating-item clothes-item-1" data-tooltip="Roupas">
          <Shirt size={24} />
        </div>
        <div className="floating-item clothes-item-2" data-tooltip="Agasalhos">
          🧥
        </div>
        <div className="floating-item clothes-item-3" data-tooltip="Calçados">
          👟
        </div>

        {/* Resume/CV related items */}
        <div className="floating-item resume-item-1" data-tooltip="Currículos">
          <Briefcase size={24} />
        </div>
        <div className="floating-item resume-item-2" data-tooltip="Documentos">
          📄
        </div>

        {/* Medicine related items */}
        <div className="floating-item medicine-item-1" data-tooltip="Medicamentos">
          <Pill size={24} />
        </div>
        <div className="floating-item medicine-item-2" data-tooltip="Saúde">
          💊
        </div>

        {/* Furniture related items */}
        <div className="floating-item furniture-item-1" data-tooltip="Móveis">
          <Sofa size={24} />
        </div>
        <div className="floating-item furniture-item-2" data-tooltip="Casa">
          🏠
        </div>

        {/* Bills/Utilities related items */}
        <div className="floating-item bills-item-1" data-tooltip="Contas">
          <Receipt size={24} />
        </div>
        <div className="floating-item bills-item-2" data-tooltip="Energia">
          ⚡
        </div>

        {/* Transportation related items */}
        <div className="floating-item transport-item-1" data-tooltip="Transporte">
          <Car size={24} />
        </div>
        <div className="floating-item transport-item-2" data-tooltip="Mobilidade">
          🚌
        </div>
      </div>

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

  return (
    <section className="hero-section" ref={heroRef} style={{
      paddingTop: '8rem',
      paddingBottom: '6rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
        zIndex: -1
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        alignItems: 'center',
        gap: '4rem',
        minHeight: '80vh',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* Left Column - Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            padding: '2rem'
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50px',
              padding: '12px 24px',
              marginBottom: '2rem',
              fontSize: '18px',
              fontWeight: '700',
              color: '#374151',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Users size={18} style={{ marginRight: '8px', color: '#0d9488' }} />
            Rede de Solidariedade Comunitária
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '800',
              marginBottom: '1.5rem',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #1f2937 0%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Transforme vidas através da solidariedade
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              marginBottom: '2rem',
              fontWeight: '400',
              lineHeight: '1.6',
              maxWidth: '800px'
            }}
          >
            Una-se a milhares de pessoas que fazem a diferença todos os dias. Descubra pedidos de ajuda próximos e seja parte da mudança que sua comunidade precisa.
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            style={{
              fontSize: '1.1rem',
              color: '#4b5563',
              lineHeight: '1.7',
              marginBottom: '2rem',
              fontWeight: '400',
              maxWidth: '800px'
            }}
          >
            Conecte-se com vizinhos, ofereça ou receba ajuda, e fortaleça os laços da sua comunidade.
          </motion.p>

         

          {/* CTA Button */}
          <motion.button
            onClick={() => {
              const ordersListSection = document.getElementById('orders-list');
              if (ordersListSection) {
                const elementPosition = ordersListSection.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - 100; // Position 100px above the section
                window.scrollTo({
                  top: offsetPosition,
                  behavior: 'smooth'
                });
                toast.success('Escolha uma das opções abaixo para começar!');
                window.dispatchEvent(new Event('explorePlatformClick'));
              }
            }}
            whileHover={{
              scale: 1.05,
              y: -2,
              boxShadow: '0 16px 32px rgba(13, 148, 136, 0.3)'
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
              border: 'none',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(13, 148, 136, 0.3)',
              marginBottom: '3rem'
            }}
          >
            Ver pedidos de ajuda
            <ArrowRight size={18} />
          </motion.button>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'flex-start'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Package size={24} style={{ color: '#0d9488' }} />
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0d9488' }}>10+</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Categorias</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Heart size={24} style={{ color: '#7c3aed' }} />
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7c3aed' }}>{filteredCount || 0}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Pedidos Ativos</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Column - Visual */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            aspectRatio: '1'
          }}>
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.1), rgba(139, 92, 246, 0.1))',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <Heart size={80} style={{ color: '#0d9488' }} />
                <div style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#374151',
                  textAlign: 'center'
                }}>
                  Conectando<br />Vizinhos
                </div>
              </motion.div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '10%',
                right: '10%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Users size={20} style={{ color: '#0d9488' }} />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              style={{
                position: 'absolute',
                bottom: '15%',
                left: '10%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Users size={20} style={{ color: '#7c3aed' }} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(45deg, rgba(13, 148, 136, 0.2), rgba(20, 184, 166, 0.2))',
          borderRadius: '20px',
          transform: 'rotate(45deg)'
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [45, 65, 45]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2))',
          borderRadius: '50%',
        }}
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

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
        {order.description?.length > 36
          ? `${order.description.substring(0, 36)}...`
          : order.description}
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
  const scrollRef = useRef(null);
  
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
    if (order && scrollRef.current) {
      // Focus on the scrollable content and activate scrolling after modal is rendered
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.focus();
          // Scroll by 1px to activate the scroll bar and make it ready for user interaction
          scrollRef.current.scrollTop = 1;
          setTimeout(() => {
            scrollRef.current.scrollTop = 0;
          }, 10);
        }
      }, 100);
    }
  }, [order]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const preventScroll = (e) => {
      // Allow scrolling if the event target is inside the modal
      if (modalRef.current && modalRef.current.contains(e.target)) {
        return;
      }
      e.preventDefault();
    };

    if (order) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open-body');
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open-body');
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

          <animated.div className="modal-scroll-v4" style={contentSpring} ref={scrollRef} tabIndex="-1">
            <div ref={contentRef}>
              <section id="section-historia" className="content-section-v4" aria-labelledby="section-historia-title">
                <div className="section-header-v4">
                  <MessageSquare size={20} aria-hidden="true" />
                  <h3 id="section-historia-title">O Relato de {order.userName.split(' ')[0]}</h3>
                </div>
                <div className="story-card-v4">
                  <p style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    paddingRight: '10px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {order.description}
                  </p>
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

              {order.subCategory && order.subCategory.length > 0 && (
                <section id="section-subcategorias" className="content-section-v4" aria-labelledby="section-subcategorias-title">
                  <div className="section-header-v4">
                    <Package size={20} aria-hidden="true" />
                    <h3 id="section-subcategorias-title">Itens Específicos</h3>
                  </div>
                  <div className="story-card-v4">
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {order.subCategory.map((sub, index) => (
                        <li key={index} style={{ marginBottom: '8px', padding: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                          <div style={{ fontWeight: '600', color: '#334155' }}>{sub}</div>
                          {order.subQuestionAnswers && order.subQuestionAnswers[sub] && (
                             <div style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '6px', padding: '8px', background: 'white', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.05)' }}>
                               <strong>Especificações:</strong> {order.subQuestionAnswers[sub]}
                             </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {order.visibility && order.visibility.length > 0 && (
                <section id="section-visibilidade" className="content-section-v4" aria-labelledby="section-visibilidade-title">
                  <div className="section-header-v4">
                    <Globe size={20} aria-hidden="true" />
                    <h3 id="section-visibilidade-title">Alcance Geográfico</h3>
                  </div>
                  <div className="story-card-v4">
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {order.visibility.map((vis, index) => (
                        <li key={index} style={{ marginBottom: '8px', padding: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                          {vis === 'bairro' ? 'Meu Bairro' : vis === 'proximos' ? 'Região Próxima' : vis === 'todos' ? 'Toda a Cidade' : vis === 'ongs' ? 'ONGs Parceiras' : vis}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )}

              {order.size && (
                <section id="section-tamanho" className="content-section-v4" aria-labelledby="section-tamanho-title">
                  <div className="section-header-v4">
                    <User size={20} aria-hidden="true" />
                    <h3 id="section-tamanho-title">Tamanho</h3>
                  </div>
                  <div className="story-card-v4">
                    <p>{order.size}</p>
                  </div>
                </section>
              )}

              {order.style && (
                <section id="section-estilo" className="content-section-v4" aria-labelledby="section-estilo-title">
                  <div className="section-header-v4">
                    <Sparkles size={20} aria-hidden="true" />
                    <h3 id="section-estilo-title">Estilo</h3>
                  </div>
                  <div className="story-card-v4">
                    <p>{order.style}</p>
                  </div>
                </section>
              )}

              {order.subQuestionAnswers && Object.keys(order.subQuestionAnswers).length > 0 && (
                <section id="section-respostas" className="content-section-v4" aria-labelledby="section-respostas-title">
                  <div className="section-header-v4">
                    <MessageSquare size={20} aria-hidden="true" />
                    <h3 id="section-respostas-title">Respostas Adicionais</h3>
                  </div>
                  <div className="story-card-v4">
                    <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {Object.entries(order.subQuestionAnswers).map(([key, value]) => (
                        <div key={key} style={{ padding: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                          <dt style={{ fontWeight: 'bold', marginBottom: '4px' }}>{key}</dt>
                          <dd>{Array.isArray(value) ? value.join(', ') : value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </section>
              )}
            </div>
          </animated.div>

          <footer className="modal-footer-v4">
            <button className="btn-secondary-v4" onClick={onClose}>
              Voltar
            </button>
            <button
              className="btn-primary-v4"
              onClick={() => { onHelp(order); onClose(); }}
              style={{ background: catMeta.color }}
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
  setUserLocation,
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
                    Meu Estado ({userLocation.state})
                  </button>
                  <button 
                    className={`filter-chip-v4 ${selectedLocation === 'minha_cidade' ? 'active' : ''}`}
                    onClick={() => setSelectedLocation('minha_cidade')}
                    role="radio"
                    aria-checked={selectedLocation === 'minha_cidade'}
                  >
                    Minha Cidade ({userLocation.city})
                  </button>
                  {userLocation.neighborhood && (
                    <button 
                      className={`filter-chip-v4 ${selectedLocation === 'meu_bairro' ? 'active' : ''}`}
                      onClick={() => setSelectedLocation('meu_bairro')}
                      role="radio"
                      aria-checked={selectedLocation === 'meu_bairro'}
                    >
                      Meu Bairro ({userLocation.neighborhood})
                    </button>
                  )}
                </>
              )}
              {!userLocation && (
                <button 
                  className="filter-chip-v4" 
                  onClick={async () => {
                    try {
                      console.log('Tentando obter localização manualmente...');
                      const location = await getLocationWithFallback();
                      console.log('Localização manual obtida:', location);
                      if (typeof setUserLocation === 'function') {
                        setUserLocation(location);
                      }
                    } catch (error) {
                      console.error('Erro na localização manual:', error);
                      toast.error('Não foi possível obter sua localização. Usando São Paulo como padrão.');
                    }
                  }}
                  style={{ opacity: 0.7 }}
                >
                  📍 Detectar Localização
                </button>
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

function AccessibilityModal({ show, onClose, fontSize, onFontSizeChange, highContrast, onContrastChange }) {
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
      aria-labelledby="accessibility-title"
    >
      <div 
        className="filters-modal-v4" 
        onClick={e => e.stopPropagation()}
        ref={modalRef}
        style={{ maxWidth: '500px' }}
      >
        <div className="filters-header-v4">
          <div className="filters-title-v4">
            <Accessibility size={20} aria-hidden="true" />
            <h2 id="accessibility-title">Acessibilidade</h2>
          </div>
          <button 
            ref={closeButtonRef}
            className="filters-close-v4" 
            onClick={onClose}
            aria-label="Fechar acessibilidade"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="filters-content-v4">
          <fieldset className="filter-group-v4">
            <legend>Tamanho da Fonte</legend>
            <div className="filter-chips-v4" role="group">
              <button className={`filter-chip-v4 ${fontSize === 'small' ? 'active' : ''}`} onClick={() => onFontSizeChange('small')}>Pequeno</button>
              <button className={`filter-chip-v4 ${fontSize === 'normal' ? 'active' : ''}`} onClick={() => onFontSizeChange('normal')}>Normal</button>
              <button className={`filter-chip-v4 ${fontSize === 'large' ? 'active' : ''}`} onClick={() => onFontSizeChange('large')}>Grande</button>
            </div>
          </fieldset>
          <fieldset className="filter-group-v4">
            <legend>Contraste</legend>
            <button className={`filter-chip-v4 ${highContrast ? 'active' : ''}`} onClick={onContrastChange}>
              Ativar Alto Contraste
            </button>
          </fieldset>
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
  const [selectedLocation, setSelectedLocation] = useState('minha_cidade');
  const [onlyNew, setOnlyNew] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [liveMessage, setLiveMessage] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        setLoadingPedidos(true);

        // Simular delay mínimo para mostrar o skeleton
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Preparar filtros para a API
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
        }

        // Filtro "apenas novos"
        if (onlyNew) {
          apiFilters.onlyNew = true;
        }

        const response = await ApiService.getPedidos(apiFilters);
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

            // Extrair dados de localização
            let city = pedido.city || 'Não informado';
            let state = pedido.state || 'Não informado';
            let neighborhood = pedido.neighborhood || 'Não informado';

            // Se não tem dados diretos, extrair da location string
            if ((!city || city === 'Não informado') && pedido.location) {
              const parts = pedido.location.split(',');
              if (parts.length >= 2) {
                neighborhood = parts[0]?.trim() || neighborhood;
                const secondPart = parts[1].trim();
                if (secondPart.includes('-')) {
                  const cityState = secondPart.split('-');
                  city = cityState[0]?.trim() || city;
                  state = cityState[1]?.trim() || state;
                } else {
                  city = secondPart || city;
                }
              }
            }

            return {
              id: pedido.id,
              userId: pedido.userId,
              userName: pedido.usuario?.nome || 'Usuário',
              city,
              state,
              neighborhood,
              urgency: pedido.urgency || 'moderada',
              category: pedido.category || 'Outros',
              title: pedido.category || 'Pedido de ajuda',
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

    // A localização é carregada em um useEffect separado.
    // Carregamos os pedidos apenas quando a localização estiver disponível.
    if (userLocation) {
      loadPedidos();
    }
  }, [selectedCat, selectedUrgency, selectedLocation, onlyNew, userLocation]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efeitos para acessibilidade
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') || 'normal';
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    setFontSize(savedFontSize);
    setHighContrast(savedContrast);
  }, []);

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

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    toast.success(`Fonte alterada para ${size === 'large' ? 'Grande' : size === 'small' ? 'Pequena' : 'Normal'}`);
  };

  const handleContrastChange = () => {
    const newContrast = !highContrast;
    setHighContrast(newContrast);
    localStorage.setItem('highContrast', newContrast.toString());
    toast.success(newContrast ? 'Alto contraste ativado' : 'Alto contraste desativado');
  };

  // UseEffect separado para carregar localização na inicialização
  useEffect(() => {
    const loadInitialLocation = async () => {
      try {
        // Primeiro tentar obter localização atual
        console.log('Tentando obter localização atual...');
        const currentLocation = await getCurrentLocation();
        setUserLocation(currentLocation);
        console.log('Localização atual obtida:', currentLocation);
      } catch (error) {
        console.warn('Não foi possível obter localização atual:', error.message);
        // Fallback para endereço cadastrado
        if (user && user.endereco) {
          const userCity = user.endereco.cidade || user.endereco.city || 'São Paulo';
          const userState = user.endereco.estado || user.endereco.state || 'SP';
          setUserLocation({ city: userCity, state: userState });
          console.log('Localização definida pelo endereço cadastrado (Desktop):', { city: userCity, state: userState });
        } else {
          // Fallback to São Paulo if no user address
          setUserLocation({ city: 'São Paulo', state: 'SP' });
          console.log('Usando localização padrão (São Paulo) - usuário não logado ou sem endereço (Desktop)');
        }
      }
      setLocationLoading(false);
    };

    loadInitialLocation();
  }, [user]); // Executar quando user mudar



  const filteredOrders = useMemo(() => {
    // Como os filtros agora são aplicados no backend, apenas retornamos os pedidos
    return pedidos;
  }, [pedidos]);

  useEffect(() => {
    if (!loadingPedidos) {
      setLiveMessage(`${filteredOrders.length} pedidos encontrados`);
    }
  }, [filteredOrders.length, loadingPedidos]);

  const hasActiveFilters = selectedCat !== 'Todas' || selectedUrgency || selectedLocation !== 'brasil' || onlyNew;

  const handleHelpClick = (order) => {
    if (!isAuthenticated()) {
      toast.error('Você precisa estar logado para ajudar.');
      navigate('/login');
      return;
    }
    setOrderToHelp(order);
  };

  const handleConfirmHelp = async () => {
    if (!orderToHelp) return;

    // Verificar se o usuário está tentando ajudar seu próprio pedido
    const currentUserId = user.uid || user.id;
    if (orderToHelp.userId === currentUserId) {
      toast.error('Você não pode ajudar seu próprio pedido.');
      setOrderToHelp(null);
      return;
    }

    try {
      // Usar o método startConversation do ApiService que já implementa a lógica de busca/criação
      console.log('Iniciando conversa para pedido:', orderToHelp.id);
      const response = await ApiService.startConversation(
        orderToHelp.userId,
        orderToHelp.id,
        'pedido',
        `Ajuda: ${orderToHelp.category}`
      );

      if (response && response.success && response.data?.id) {
        console.log('Conversa iniciada com sucesso:', response.data.id);
        toast.success('Conversa iniciada com sucesso!');
        navigate(`/chat/${response.data.id}`);
      } else {
        console.error('Resposta inválida da criação da conversa:', response);
        throw new Error(response?.error || 'Erro ao criar conversa');
      }
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
      toast.error(`Erro ao iniciar conversa: ${error.message || 'Tente novamente'}`);
    }
    setOrderToHelp(null);
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

  const queroAjudarNavigationItems = [
    { path: '/preciso-de-ajuda', label: 'Preciso de Ajuda' },
    { path: '/achados-e-perdidos', label: 'Achados e Perdidos' }
  ];

  return (
    <div className={`qa-page-v4 ${selectedOrder ? 'modal-open' : ''}`}>
      <ReusableHeader
        navigationItems={queroAjudarNavigationItems}
        showAdminButtons={true}
        showPainelSocial={true}
        currentPage="quero-ajudar"
      />

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
                onClick={() => setShowAccessibilityModal(true)}
                aria-label="Abrir opções de acessibilidade"
                title="Abrir opções de acessibilidade"
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
                  {selectedLocation === 'minha_cidade' ? `Minha Cidade (${userLocation?.city})` : 
                   selectedLocation === 'meu_bairro' ? `Meu Bairro (${userLocation?.neighborhood})` : 
                   selectedLocation}
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
            aria-label="Lista de pedidos de ajuda"
            aria-busy={loadingPedidos}
          >
            {loadingPedidos ? (
              <>
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0 40px' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 24px' }}>
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: '-20px',
                        borderRadius: '50%',
                        border: '2px solid #0d9488',
                        opacity: 0.3
                      }}
                      animate={{ scale: [0.8, 1.2], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div
                      style={{
                        position: 'absolute',
                        inset: '-10px',
                        borderRadius: '50%',
                        border: '2px solid #0d9488',
                        opacity: 0.5
                      }}
                      animate={{ scale: [0.9, 1.1], opacity: [0.8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    />
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      background: 'white', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(13, 148, 136, 0.2)',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      <Search size={32} color="#0d9488" />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                    Buscando pedidos próximos a você
                  </h3>
                  <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
                    Aguarde enquanto carregamos as oportunidades de ajuda...
                  </p>
                </div>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="order-card-v4" style={{ height: '100%', minHeight: '300px', pointerEvents: 'none' }}>
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <Skeleton width={80} height={24} borderRadius={12} />
                        <Skeleton width={60} height={16} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <Skeleton circle width={48} height={48} />
                        <div>
                          <Skeleton width={120} height={18} style={{ marginBottom: '4px' }} />
                          <Skeleton width={180} height={14} />
                        </div>
                      </div>
                      <Skeleton width="80%" height={24} style={{ marginBottom: '12px' }} />
                      <Skeleton count={2} style={{ marginBottom: '24px' }} />
                      <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                        <Skeleton height={42} borderRadius={12} containerClassName="flex-1" />
                        <Skeleton height={42} borderRadius={12} containerClassName="flex-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : filteredOrders.length === 0 ? (
              <div className="empty-state-v4" role="status">
                <Search size={48} aria-hidden="true" />
                <h3>Nenhum pedido encontrado</h3>
                <p>Tente ajustar os filtros ou volte mais tarde</p>
                <button onClick={clearFilters}>Limpar Filtros</button>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                >
                  <OrderCard
                    order={order}
                    onViewDetails={handleViewDetails}
                    onHelp={handleHelpClick}
                  />
                </motion.div>
              ))
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
        setUserLocation={setUserLocation}
        onClear={clearFilters}
      />

      <AccessibilityModal
        show={showAccessibilityModal}
        onClose={() => setShowAccessibilityModal(false)}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        highContrast={highContrast}
        onContrastChange={handleContrastChange}
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
            onHelp={handleHelpClick}
          />
        </div>
      )}

      <ConfirmHelpModal
        order={orderToHelp}
        onConfirm={handleConfirmHelp}
        onClose={() => setOrderToHelp(null)}
      />

    </div>
  );
}