import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Heart, Sparkles, User, Store, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import Header from '../../components/layout/Header';
import './styles.css';

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
    <div className={`card-outer animate-slideUp stagger-${index + 1}`}>
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
          <Icon size={240} strokeWidth={1} />
        </div>

        <div className="card-content">
          <div 
            className="card-icon-wrapper"
            style={{ backgroundImage: type.gradient }}
          >
            <Icon className="card-icon" />
          </div>

          <h3 className="card-title">
            {type.title}
          </h3>
          
          <p className="card-description">
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

export default function CadastroPage() {
  return (
    <div className="cadastro-wrapper">
      <div className="bg-decoration">
        <div className="blob-orange animate-pulse-slow" />
        <div className="blob-indigo animate-pulse-slow" style={{ animationDelay: '-5s' }} />
      </div>

      <Header />

      <main>
        <div className="cadastro-hero">
          <div className="badge-sparkles animate-scaleIn">
            <Sparkles />
            CONSTRUINDO COMUNIDADES FORTES
          </div>
          
          <h2 className="hero-title animate-slideUp stagger-1">
            Como você quer
            <br />
            <span className="text-gradient">
              transformar o mundo?
            </span>
          </h2>
          
          <p className="hero-description animate-slideUp stagger-2">
            Escolha seu papel nesta rede de solidariedade e comece a impactar vidas positivamente ainda hoje.
          </p>
        </div>

        <div className="cards-grid">
          {cadastroTypes.map((type, index) => (
            <CadastroCard key={type.id} type={type} index={index} />
          ))}
        </div>

        <div className="stats-section animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <div className="stats-grid">
            {[
              { label: "Famílias Apoiadas", value: "1.240+", icon: Users },
              { label: "Voluntários Ativos", value: "850", icon: Heart },
              { label: "ONGs Parceiras", value: "42", icon: Building2 },
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <stat.icon className="stat-icon" />
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
             <div className="footer-icon-wrapper">
              <Heart className="footer-icon" />
            </div>
            <p className="footer-copy">
              © 2024 SolidarBairro. Made for impact.
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
    </div>
  );
}