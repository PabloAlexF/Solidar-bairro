import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element">💝</div>
            <div className="floating-element">🤝</div>
            <div className="floating-element">🏠</div>
            <div className="floating-element">❤️</div>
            <div className="floating-element">🌟</div>
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🚀 Plataforma em desenvolvimento</span>
            </div>
            <h1 className="hero-title">
              <span className="highlight">SolidarBairro</span>
              <br />Sua comunidade unida
            </h1>
            <p className="hero-subtitle">
              A plataforma que conecta vizinhos, fortalece lacos e transforma bairros 
              em verdadeiras redes de apoio mutuo.
            </p>
            <div className="hero-actions">
              <button 
                className="btn btn-primary pulse"
                onClick={() => navigate('/cadastro')}
              >
                <span>Participar agora</span>
                <span className="btn-icon">→</span>
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/login')}
              >
                Fazer login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>Como funciona</h2>
            <p>Tres passos simples para comecar a ajudar e ser ajudado</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Cadastre-se</h3>
                <p>Crie sua conta em menos de 2 minutos e faca parte da rede solidaria</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Conecte-se</h3>
                <p>Encontre pessoas proximas que precisam de ajuda ou podem te ajudar</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Transforme</h3>
                <p>Participe de acoes que fortalecem sua comunidade e criam impacto real</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="features">
        <div className="container">
          <div className="section-header">
            <h2>Tudo que voce precisa</h2>
            <p>Ferramentas completas para uma comunidade mais unida</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🆘</div>
              <h3>Pedidos de ajuda</h3>
              <p>Publique suas necessidades e receba apoio da vizinhanca rapidamente</p>
              <ul>
                <li>Geolocalizacao inteligente</li>
                <li>Categorias organizadas</li>
                <li>Notificacoes em tempo real</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤲</div>
              <h3>Ofertas solidarias</h3>
              <p>Compartilhe recursos, tempo e conhecimento com quem precisa</p>
              <ul>
                <li>Doacao de itens</li>
                <li>Servicos voluntarios</li>
                <li>Apoio emocional</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Mapa interativo</h3>
              <p>Visualize todas as atividades solidarias acontecendo ao seu redor</p>
              <ul>
                <li>Filtros personalizados</li>
                <li>Distancia em tempo real</li>
                <li>Rotas otimizadas</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Impacto mensuravel</h3>
              <p>Acompanhe o crescimento da solidariedade no seu bairro</p>
              <ul>
                <li>Relatorios detalhados</li>
                <li>Metricas de engajamento</li>
                <li>Historico de acoes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para fazer a diferenca?</h2>
            <p>Junte-se ao futuro da solidariedade comunitaria</p>
            <div className="cta-actions">
              <button 
                className="btn btn-primary large"
                onClick={() => navigate('/cadastro')}
              >
                Comecar gratuitamente
              </button>
              <div className="cta-note">
                <span>✓ Gratuito para sempre</span>
                <span>✓ Sem compromisso</span>
                <span>✓ Impacto imediato</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;