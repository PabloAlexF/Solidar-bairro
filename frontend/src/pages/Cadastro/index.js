import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Heart, Sparkles, User, Store, ArrowRight, Zap, TrendingUp, ArrowUp } from 'lucide-react';
import LandingHeader from '../../components/layout/LandingHeader';
import './styles.css';

const scrollToCards = () => {
  const cardsSection = document.querySelector('.cards-grid');
  if (cardsSection) {
    cardsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Exports dos componentes de cadastro
export { default as CadastroCidadao } from './CadastroCidadao/CadastroCidadao';
export { default as CadastroComercio } from './CadastroComercio/CadastroComercio';
export { default as CadastroFamilia } from './CadastroFamilia/CadastroFamilia';
export { default as CadastroONG } from './CadastroONG/CadastroONG';

const cadastroTypes = [
  {
    id: "familia",
    title: "Família",
    description: "Cadastre sua família para receber apoio e mapeamento social no seu bairro",
    icon: Users,
    gradient: "linear-gradient(to bottom right, #f97316, #f43f5e)",
    shadowColor: "rgba(249, 115, 22, 0.1)",
    href: "/cadastro/familia",
    badge: "Mais procurado",
  },
  {
    id: "cidadao",
    title: "Cidadão",
    description: "Seja um voluntário e ajude famílias da sua comunidade a superar dificuldades",
    icon: User,
    gradient: "linear-gradient(to bottom right, #10b981, #14b8a6)",
    shadowColor: "rgba(16, 185, 129, 0.1)",
    href: "/cadastro/cidadao",
    badge: "Impacto direto",
  },
  {
    id: "ong",
    title: "Organização Social",
    description: "Registre sua ONG para atuar oficialmente e conectar-se com quem precisa",
    icon: Building2,
    gradient: "linear-gradient(to bottom right, #8b5cf6, #a855f7)",
    shadowColor: "rgba(139, 92, 246, 0.1)",
    href: "/cadastro/ong",
    badge: "Parceria oficial",
  },
  {
    id: "comercio",
    title: "Comércio Local",
    description: "Torne-se um parceiro solidário e ganhe visibilidade apoiando sua comunidade",
    icon: Store,
    gradient: "linear-gradient(to bottom right, #3b82f6, #0ea5e9)",
    shadowColor: "rgba(59, 130, 246, 0.1)",
    href: "/cadastro/comercio",
    badge: "Visibilidade +",
  },
];

function CadastroCard({ type, index }) {
  const Icon = type.icon;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`card-outer stagger-${index + 1}`}
      style={{ opacity: 0 }}
    >
      <Link
        to={type.href}
        className="card-inner"
        style={{ boxShadow: `0 10px 25px -5px ${type.shadowColor}` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-badge">
          <Zap size={12} />
          <span>{type.badge}</span>
        </div>
        
        <div 
          className="card-gradient-overlay" 
          style={{ backgroundImage: type.gradient }}
        />
        
        <div className="card-bg-icon">
          <Icon size={180} strokeWidth={1} />
        </div>

        <div className="card-content">
          <div 
            className="card-icon-wrapper"
            style={{ backgroundImage: type.gradient }}
          >
            <Icon className="card-icon" />
          </div>

          <h3 className="card-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            {type.title}
          </h3>
          
          <p className="card-description" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
            {type.description}
          </p>

          <div className="card-footer">
            <span>{isHovered ? 'Começar agora' : 'Explorar'}</span>
            <div className="card-arrow-wrapper">
              <ArrowRight className="card-arrow" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton-card {
    background: #fff;
    border-radius: 1rem;
    height: 100%;
    min-height: 320px;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .skeleton-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .skeleton-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background: #f0f0f0;
    margin-bottom: 1.5rem;
    background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
    will-change: background-position;
  }
  .skeleton-title {
    width: 60%;
    height: 24px;
    border-radius: 4px;
    background: #f0f0f0;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
    will-change: background-position;
  }
  .skeleton-text {
    width: 100%;
    height: 16px;
    border-radius: 4px;
    background: #f0f0f0;
    margin-bottom: 0.5rem;
    background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
    will-change: background-position;
  }
  .skeleton-text.short {
    width: 80%;
  }
  .skeleton-footer {
    width: 40%;
    height: 20px;
    border-radius: 4px;
    background: #f0f0f0;
    margin-top: auto;
    background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
    will-change: background-position;
  }
`;

function SkeletonCard() {
  return (
    <div className="card-outer">
      <div className="skeleton-card">
        <div className="skeleton-content">
          <div className="skeleton-icon"></div>
          <div className="skeleton-title"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
          <div className="skeleton-footer"></div>
        </div>
      </div>
    </div>
  );
}

export default function CadastroPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isBackToTopHovered, setIsBackToTopHovered] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    const circles = document.querySelectorAll('.floating-circle');
    
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.02;
        const x = (window.innerWidth / 2 - mouseX) * speed;
        const y = (window.innerHeight / 2 - mouseY) * speed;
        circle.style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    // Setup Intersection Observer for cards fade-in
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slideUp');
          entry.target.style.opacity = '';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    const cards = document.querySelectorAll('.card-outer');
    cards.forEach(card => observer.observe(card));

    // Auto-scroll to cards section after animations complete
    const timer = setTimeout(() => {
      if (window.scrollY < 50 && window.innerWidth > 768) {
        scrollToCards();
      }
    }, 3000); // Wait for hero animations to complete

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cadastro-page cadastro-wrapper">
      <style>{shimmerStyles}</style>
      <div className="bg-decoration">
        <div className="blob-orange animate-pulse-slow" />
        <div className="blob-indigo animate-pulse-slow" style={{ animationDelay: '-5s' }} />
      </div>

      <LandingHeader scrolled={true} />

      {/* Floating decorative elements */}
      <div className="floating-elements">
        <div className="floating-circle floating-1"></div>
        <div className="floating-circle floating-2"></div>
        <div className="floating-circle floating-3"></div>
      </div>

      <main style={{ paddingTop: '120px', maxWidth: '1200px', margin: '0 auto', paddingInline: '2rem' }}>
        <div className="cadastro-hero" style={{ marginBottom: '4rem', maxWidth: '800px', marginInline: 'auto' }}>
          <div className="badge-sparkles animate-scaleIn" style={{ fontSize: '0.8rem' }}>
            <Sparkles size={16} className="animate-pulse" />
            CONSTRUINDO COMUNIDADES FORTES
          </div>

          <h2 className="hero-title animate-slideUp stagger-1" style={{ fontSize: '3.5rem', lineHeight: '1.1' }}>
            Como você quer
            <br />
            <span className="text-gradient">
              transformar o mundo?
            </span>
          </h2>

          <p className="hero-description animate-slideUp stagger-2" style={{ fontSize: '1.1rem', maxWidth: '600px', marginInline: 'auto' }}>
            Escolha seu papel nesta rede de solidariedade e comece a impactar vidas positivamente ainda hoje.
          </p>
        </div>

        <div className="cards-grid">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            cadastroTypes.map((type, index) => (
              <CadastroCard key={type.id} type={type} index={index} />
            ))
          )}
        </div>


      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
             <div className="footer-icon-wrapper">
              <Heart className="footer-icon" />
            </div>
            <p className="footer-copy">
              © 2026 SolidarBairro. Made for impact.
            </p>
          </div>
          <div className="footer-links">
            {['Privacidade', 'Termos', 'Suporte'].map((link) => (
              <Link key={link} to="#" className="footer-link">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        onMouseEnter={() => setIsBackToTopHovered(true)}
        onMouseLeave={() => setIsBackToTopHovered(false)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: isBackToTopHovered ? '#3b82f6' : 'white',
          color: isBackToTopHovered ? 'white' : '#3b82f6',
          border: 'none',
          boxShadow: isBackToTopHovered ? '0 20px 25px -5px rgba(59, 130, 246, 0.4), 0 10px 10px -5px rgba(59, 130, 246, 0.2)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: showBackToTop ? 1 : 0,
          transform: showBackToTop ? (isBackToTopHovered ? 'translateY(-5px) scale(1.1)' : 'translateY(0) scale(1)') : 'translateY(20px) scale(0.9)',
          pointerEvents: showBackToTop ? 'auto' : 'none',
        }}
        aria-label="Voltar ao topo"
      >
        <ArrowUp size={24} />
        <span style={{
          position: 'absolute',
          bottom: '100%',
          marginBottom: '10px',
          padding: '0.5rem 1rem',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          opacity: isBackToTopHovered ? 1 : 0,
          transform: isBackToTopHovered ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.2s ease',
          pointerEvents: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          Voltar ao topo
        </span>
      </button>
    </div>
  );
}