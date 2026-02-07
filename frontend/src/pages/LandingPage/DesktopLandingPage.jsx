import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useInView } from 'react-intersection-observer';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import createGlobe from 'cobe';
import GlobeFeatureSection from './GlobeFeatureSection';
import ApiService from '../../services/apiService';
import { NotificationDropdown } from '../../components/NotificationDropdown';
import Footer from '../../components/layout/Footer';
import ReusableHeader from '../../components/layout/ReusableHeader';
import {
  Heart,
  HandHelping,
  Search,
  MapPin,
  Navigation,
  Bell,
  User,
  MessageSquare,
  LogOut,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Users,
  Locate,
  Info,
  ExternalLink,
  Sparkles,
  Copy,
  Share2,
  Settings,
  Shield,
  Globe
} from 'lucide-react';

import marca from '../../assets/images/marca.png';

import './styles.css';

const ActionCard = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
  color,
  delay
}) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      className={`landing-action-card landing-card-${color}`}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      whileHover={{ y: -15 }}
      data-tooltip-id={`card-${color}`}
      data-tooltip-content={`Clique para ${buttonText.toLowerCase()}`}
    >
      <div className="landing-card-gradient" />

      <div className="landing-card-body">
        <div className="landing-card-icon">
          {icon}
        </div>

        <h3 className="landing-card-title">
          {title}
        </h3>

        <p className="landing-card-description">
          {description}
        </p>

        <button
          onClick={onClick}
          className="landing-card-button"
        >
          {buttonText}
          <ChevronRight size={22} className="landing-button-icon" />
        </button>
      </div>

      <div className="landing-card-sparkle">
        <Sparkles size={40} />
      </div>

      <Tooltip id={`card-${color}`} place="top" />
    </motion.div>
  );
};

const GlobeVisualization = () => {
  const canvasRef = useRef(null);
  const globeRef = useRef(null);
  const [globeError, setGlobeError] = useState(false);

  useEffect(() => {
    let phi = 0;

    const initGlobe = () => {
      if (!canvasRef.current) return;

      try {
        if (globeRef.current) {
          globeRef.current.destroy();
        }

        globeRef.current = createGlobe(canvasRef.current, {
          devicePixelRatio: 2,
          width: 600,
          height: 600,
          phi: 0,
          theta: 0.3,
          dark: 0,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: [0.3, 0.3, 0.3],
          markerColor: [0.1, 0.8, 0.5],
          glowColor: [1, 1, 1],
          markers: [
            { location: [-23.5505, -46.6333], size: 0.08 },
            { location: [-22.9068, -43.1729], size: 0.06 },
            { location: [-15.7975, -47.8919], size: 0.05 },
            { location: [40.7128, -74.0060], size: 0.03 },
            { location: [48.8566, 2.3522], size: 0.03 },
            { location: [-34.6037, -58.3816], size: 0.04 },
          ],
          onRender: (state) => {
            state.phi = phi;
            phi += 0.005;
          },
        });
        setGlobeError(false);
      } catch (error) {
        console.warn('Globe initialization failed:', error);
        setGlobeError(true);
      }
    };

    const timer = setTimeout(initGlobe, 100);

    return () => {
      clearTimeout(timer);
      if (globeRef.current) {
        try {
          globeRef.current.destroy();
        } catch (error) {
          console.warn('Globe cleanup failed:', error);
        }
      }
    };
  }, []);

  if (globeError) {
    return (
      <div className="globe-wrapper">
        <div className="globe-fallback">
          <div className="fallback-circle">
            <div className="fallback-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
            </div>
            <div className="fallback-center">
              <MapPin size={48} className="fallback-icon" />
            </div>
          </div>
          <div className="fallback-text">
            <h4>Conectando Vizinhança</h4>
            <p>Mapeando sua região...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="globe-wrapper globe-canvas">
      <div className="globe-decoration">
        <div className="radar-ring-1" />
        <div className="radar-ring-2" />
        <div className="scan-line" />
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%', 
        height: '100%',
        position: 'relative',
        zIndex: 10
      }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          style={{ 
            width: '100%', 
            height: '100%',
            maxWidth: '700px',
            maxHeight: '700px',
            display: 'block'
          }}
        />
      </div>
      <div className="globe-fade-overlay"></div>
    </div>
  );
};

export default function DesktopLandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const navigateToTop = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
  const [scrolled, setScrolled] = useState(false);
  const [location, setLocation] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    helpedCount: 0,
    receivedHelpCount: 0
  });

  useEffect(() => {
    if (user) {
      // Inicializa com dados do contexto se disponíveis, verificando ambas as convenções de nomenclatura
      setUserStats({
        helpedCount: Number(user.helpedCount || user.helped_count || user.ajudas_prestadas || 0),
        receivedHelpCount: Number(user.receivedHelpCount || user.received_help_count || user.ajudas_recebidas || 0)
      });

      const fetchStats = async () => {
        try {
          const userId = user.uid || user.id;
          if (!userId) return;

          console.log('[DesktopLandingPage] Fetching stats for user:', userId);
          const response = await ApiService.get(`/users/${userId}`);
          console.log('[DesktopLandingPage] Stats response:', response);

          if (response.success && response.data) {
            const userData = response.data;
            console.log('[DesktopLandingPage] Full user data from API:', userData);

            // Robust parsing for stats
            const helped = Number(
              userData.helpedCount ?? 
              userData.helped_count ?? 
              userData.helped ?? 
              userData.ajudas_prestadas ?? 
              userData.pessoas_ajudadas ?? 
              0
            );
            const received = Number(
              userData.receivedHelpCount ?? 
              userData.received_help_count ?? 
              userData.received ?? 
              userData.ajudas_recebidas ?? 
              0
            );
            
            console.log('[DesktopLandingPage] Parsed stats:', { helped, received });

            setUserStats({
              helpedCount: isNaN(helped) ? 0 : helped,
              receivedHelpCount: isNaN(received) ? 0 : received
            });
          }
        } catch (error) {
          console.error('[DesktopLandingPage] Error fetching user stats:', error);
        }
      };
      
      if (isAuthenticated()) {
        fetchStats();
      }
    }
  }, [user, isAuthenticated]);
  
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: featuresRef, inView: featuresInView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu) {
        const userMenuElement = document.querySelector('.user-menu-wrapper');

        if (userMenuElement && !userMenuElement.contains(event.target)) {
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.log('Erro de geolocalização:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  }, []);



  const shareContent = async () => {
    const shareData = {
      title: 'SolidarBrasil - Conectando Vizinhos',
      text: 'Descubra a rede de ajuda da sua vizinhança!',
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Compartilhado com sucesso!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success('Link copiado!'))
      .catch(() => toast.error('Erro ao copiar link'));
  };

  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial || "Vizinho";

  // Verificar se é administrador
  const isAdmin = user?.role === 'admin' ||
                  user?.isAdmin ||
                  user?.tipo === 'admin' ||
                  user?.email === 'admin@solidarbairro.com';

  console.log('=== ADMIN DEBUG ===');
  console.log('user:', user);
  console.log('isAdmin:', isAdmin);
  console.log('isAuthenticated():', isAuthenticated());

  return (
    <div className="landing-wrapper">
      <div className="bg-mesh" />

      <ReusableHeader
        navigationItems={[
          { path: '/contato', label: 'Contato' }
        ]}
        showLoginButton={true}
        showAdminButtons={true}
        showPainelSocial={true}
        currentPage="landing"
      />

      {/* Hero Section */}
      <header className="hero-section" ref={heroRef} style={{
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

        <div className="section-container">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '80vh'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              style={{
                padding: '2rem',
                maxWidth: '900px',
                margin: '0 auto'
              }}
            >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, rotateX: -15 }}
              animate={heroInView ? { opacity: 1, scale: 1, y: 0, rotateX: 0 } : { opacity: 0, scale: 0.8, y: 20, rotateX: -15 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.3 }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50px',
                padding: '12px 24px',
                marginBottom: '3rem',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                cursor: 'default'
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              >
                <Sparkles size={16} style={{ marginRight: '8px', color: '#f59e0b' }} />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                TRANSFORMANDO VIZINHANÇAS
              </motion.span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              style={{
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                fontWeight: '800',
                marginBottom: '1.5rem',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #0d9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                cursor: 'default'
              }}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Solidar
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 20, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 200 }}
                whileHover={{
                  scale: 1.1,
                  textShadow: '0 0 20px rgba(13, 148, 136, 0.5)',
                  transition: { duration: 0.3 }
                }}
                style={{
                  background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Brasil
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: '#6b7280',
                marginBottom: '2rem',
                fontWeight: '400',
                maxWidth: '600px',
                margin: '0 auto 2rem'
              }}
            >
              A rede de ajuda da sua vizinhança
            </motion.p>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              style={{
                marginBottom: '3rem'
              }}
            >
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.8, delay: 1 }}
                style={{
                  fontSize: '1.1rem',
                  color: '#4b5563',
                  lineHeight: '1.7',
                  maxWidth: '650px',
                  margin: '0 auto 1.5rem',
                  fontWeight: '400'
                }}
              >
                Conecte-se com vizinhos, ofereça ou receba ajuda, e fortaleça os laços da sua comunidade.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
                animate={heroInView ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0.95, rotateX: 10 }}
                transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
                whileHover={{
                  scale: 1.02,
                  color: '#374151',
                  transition: { duration: 0.3 }
                }}
                style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  fontStyle: 'italic',
                  maxWidth: '550px',
                  margin: '0 auto',
                  cursor: 'default'
                }}
              >
                "Criamos pontes onde antes existiam apenas muros."
              </motion.p>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={() => {
                const actionCardsSection = document.getElementById('action-cards');
                if (actionCardsSection) {
                  const elementPosition = actionCardsSection.getBoundingClientRect().top + window.pageYOffset;
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
                y: -3,
                boxShadow: '0 20px 40px rgba(13, 148, 136, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut", type: "spring", stiffness: 200 }}
              style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0f766e 100%)',
                border: 'none',
                color: 'white',
                padding: '18px 40px',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 12px 32px rgba(13, 148, 136, 0.3)',
                marginBottom: '4rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={heroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                Explorar Plataforma
              </motion.span>
              <motion.div
                animate={{
                  x: [0, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight size={20} />
              </motion.div>
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
                }}
                animate={{
                  left: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
            </motion.button>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '4rem',
                flexWrap: 'wrap'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={heroInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: '0 20px 40px rgba(13, 148, 136, 0.2)',
                  transition: { duration: 0.3 }
                }}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  minWidth: '140px',
                  cursor: 'default'
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={heroInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.6, delay: 1.6, type: "spring", stiffness: 200 }}
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: '#0d9488',
                    marginBottom: '0.5rem'
                  }}
                >
                  500+
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                  style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}
                >
                  Vizinhos
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={heroInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
                  transition: { duration: 0.3 }
                }}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  minWidth: '140px',
                  cursor: 'default'
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={heroInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.6, delay: 1.8, type: "spring", stiffness: 200 }}
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: '#7c3aed',
                    marginBottom: '0.5rem'
                  }}
                >
                  2km
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 2 }}
                  style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}
                >
                  Raio Ativo
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
          </div>
        </div>
      </header>

      {/* Action Cards */}
      <section id="action-cards" className="action-cards-section">
        <div className="section-container">
          <div className="cards-grid">
            <ActionCard
              icon={<Heart size={40} />}
              title="Quero ajudar"
              description="Descubra pessoas próximas que precisam da sua ajuda. Seja a diferença na vida de alguém com pequenos gestos."
              buttonText="Ver oportunidades"
              onClick={() => navigateToTop('/quero-ajudar')}
              color="teal"
              delay={0.1}
            />

            <ActionCard
              icon={<HandHelping size={40} />}
              title="Preciso de Ajuda"
              description="Compartilhe sua necessidade com vizinhos dispostos a ajudar. Você não está sozinho nesta jornada."
              buttonText="Pedir ajuda"
              onClick={() => navigateToTop('/preciso-de-ajuda')}
              color="orange"
              delay={0.2}
            />

            <ActionCard
              icon={<Search size={40} />}
              title="Achados e Perdidos"
              description="Localize documentos, veículos or bens perdidos na sua vizinhança. Ajude a devolver o que foi perdido."
              buttonText="Ver itens"
              onClick={() => navigateToTop('/achados-e-perdidos')}
              color="purple"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      <GlobeFeatureSection />

      <Footer />
    </div>
  );
}
