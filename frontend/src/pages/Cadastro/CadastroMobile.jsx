import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingHeader from '../../components/layout/LandingHeader';
import {
  Users, Building2, Heart, Sparkles, User, Store,
  ArrowRight, MessageCircle, Info, ShieldCheck, ArrowLeft
} from 'lucide-react';
import './CadastroMobile.css';

const cadastroTypes = [
  {
    id: "vlt-reg-type-familia",
    title: "Família",
    description: "Conecte sua casa a redes de apoio e receba suporte essencial.",
    icon: Users,
    gradient: "linear-gradient(to bottom right, #f97316, #f43f5e)",
    shadowColor: "rgba(249, 115, 22, 0.15)",
    href: "/cadastro/familia",
    badge: "Prioridade 01",
    tag: "Popular",
  },
  {
    id: "vlt-reg-type-cidadao",
    title: "Voluntário",
    description: "Doe seu tempo e habilidades para transformar realidades locais.",
    icon: User,
    gradient: "linear-gradient(to bottom right, #10b981, #14b8a6)",
    shadowColor: "rgba(16, 185, 129, 0.15)",
    href: "/cadastro/cidadao",
    badge: "Inscrições abertas",
    tag: "Urgente",
  },
  {
    id: "vlt-reg-type-ong",
    title: "ONG Local",
    description: "Fortaleça sua atuação social com visibilidade e novos parceiros.",
    icon: Building2,
    gradient: "linear-gradient(to bottom right, #8b5cf6, #a855f7)",
    shadowColor: "rgba(139, 92, 246, 0.15)",
    href: "/cadastro/ong",
    badge: "Parceria oficial",
    tag: "Novidade",
  },
  {
    id: "vlt-reg-type-comercio",
    title: "Comerciante",
    description: "Seja um ponto de apoio e ganhe o selo de Comércio Solidário.",
    icon: Store,
    gradient: "linear-gradient(to bottom right, #3b82f6, #0ea5e9)",
    shadowColor: "rgba(59, 130, 246, 0.15)",
    href: "/cadastro/comercio",
    badge: "Selo de impacto",
    tag: "Exclusivo",
  },
];

function CadastroCard({ type, index }) {
  const Icon = type.icon;
  
  return (
    <div className="vlt-reg-card-container" id={type.id}>
      <Link to={type.href} className="vlt-reg-card-link">
        <div className="vlt-reg-card-visual" style={{ backgroundImage: type.gradient }}>
          <div className="vlt-reg-card-pattern" />
          <div className="vlt-reg-card-icon-box">
            <Icon size={32} strokeWidth={2.5} className="text-white" />
          </div>
          <div className="vlt-reg-card-tag">{type.tag}</div>
        </div>
        
        <div className="vlt-reg-card-info">
          <div className="vlt-reg-card-info-top">
            <h3 className="vlt-reg-card-title">{type.title}</h3>
            <div className="vlt-reg-card-badge">{type.badge}</div>
          </div>
          <p className="vlt-reg-card-desc">{type.description}</p>
          
          <div className="vlt-reg-card-footer">
            <div className="vlt-reg-card-users">
              <div className="vlt-reg-avatars">
                {[1, 2, 3].map(i => (
                  <div key={i} className="vlt-reg-avatar" style={{ left: (i-1) * 12 }}>
                    <img src={`https://i.pravatar.cc/40?img=${index * 3 + i}`} alt="user" />
                  </div>
                ))}
              </div>
              <span className="vlt-reg-user-count">+12 este mês</span>
            </div>
            <div className="vlt-reg-card-cta">
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function CadastroMobile() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Bem-vindo ao SolidarBairro! Escolha como você quer ajudar hoje.");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="vlt-reg-wrapper" id="vlt-reg-root">

      {/* Custom Header Overlay */}
      <div className="cadastro-header-overlay" style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        zIndex: '1000',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button
          className="cadastro-back-btn"
          onClick={() => window.history.back()}
          style={{
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.05)'}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          className="cadastro-login-btn"
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(135deg, #64748b, #475569)',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Entrar
        </button>
      </div>

      <main id="vlt-reg-main-content">
        <div className="vlt-reg-hero">
          <div className="vlt-reg-badge-sparkles">
            <Sparkles />
            IMPACTO REAL NA SUA COMUNIDADE
          </div>
          
          <h2 className="vlt-reg-hero-title">
            Sua jornada social
            <br />
            <span className="vlt-reg-text-gradient">
              começa aqui
            </span>
          </h2>
          
          <p className="vlt-reg-hero-desc">
            Selecione o seu perfil e junte-se à maior rede de solidariedade local do país.
          </p>
        </div>

        <div className="vlt-reg-cards-grid">
          {cadastroTypes.map((type, index) => (
            <CadastroCard key={type.id} type={type} index={index} />
          ))}
        </div>

        <div className="vlt-reg-stats-sec">
          <div className="vlt-reg-stats-grid">
            {[
              { label: "Vidas Impactadas", value: "1.2K+", icon: Users },
              { label: "Mãos Amigas", value: "850", icon: Heart },
              { label: "Pontos de Apoio", value: "42", icon: Building2 },
            ].map((stat, i) => (
              <div key={i} className="vlt-reg-stat-card">
                <stat.icon className="vlt-reg-stat-icon" />
                <p className="vlt-reg-stat-value">{stat.value}</p>
                <p className="vlt-reg-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="vlt-reg-fab" id="vlt-reg-fab-trigger" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
        <MessageCircle className="vlt-reg-fab-icon" />
      </button>

      {/* Simple Drawer */}
      {isDrawerOpen && (
        <>
          <div className="vlt-reg-drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
          <div className="vlt-reg-drawer-content">
            <div className="vlt-reg-drawer-handle" />
            <div className="vlt-reg-drawer-inner">
              <h3 className="vlt-reg-drawer-title">
                Precisa de ajuda?
              </h3>
              <p className="vlt-reg-drawer-desc">
                Nossa equipe está pronta para te guiar no processo de cadastro.
              </p>
              
              <div className="vlt-reg-drawer-opts">
                <button className="vlt-reg-drawer-opt">
                  <Info className="text-blue-500" />
                  <div>
                    <p className="font-bold">Dúvidas Frequentes</p>
                    <p className="text-xs opacity-60">Veja como funciona o projeto</p>
                  </div>
                </button>
                <button className="vlt-reg-drawer-opt">
                  <ShieldCheck className="text-green-500" />
                  <div>
                    <p className="font-bold">Privacidade & Segurança</p>
                    <p className="text-xs opacity-60">Seus dados estão protegidos</p>
                  </div>
                </button>
                <button className="vlt-reg-drawer-opt primary">
                  Falar com Consultor
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <footer className="vlt-reg-footer">
        <div className="vlt-reg-footer-content">
          <div className="vlt-reg-footer-links">
            <Link to="#" className="vlt-reg-footer-link">Termos de Uso</Link>
            <Link to="#" className="vlt-reg-footer-link">Privacidade</Link>
            <Link to="#" className="vlt-reg-footer-link">Ajuda</Link>
          </div>
          <div className="vlt-reg-footer-logo">
            <p className="vlt-reg-footer-copy">
              © {new Date().getFullYear()} SolidarBairro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}