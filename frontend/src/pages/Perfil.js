import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PerfilModern.css';
const Perfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Simular busca de dados do usuário
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Aqui seria a chamada real para a API
        // const response = await fetch('/api/user/profile');
        // const userData = await response.json();
        
        // Simulando dados não encontrados no banco
        setTimeout(() => {
          setUser({
            name: "Usuário não identificado",
            email: "Não informado",
            memberSince: "Data não disponível",
            location: "Localização não informada",
            avatar: null,
            bio: "Biografia não cadastrada",
            stats: {
              helpsGiven: 0,
              requestsMade: 0,
              impactPoints: 0
            },
            isVerified: false
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Erro ao carregar dados do perfil');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar perfil</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-modern">
      {/* Header */}
      <div className="perfil-header-nav">
        <div className="max-w-6xl mx-auto px-4">
          <button 
            onClick={() => navigate('/')}
            className="perfil-back-btn"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para Início
          </button>
        </div>
      </div>

      <div className="perfil-container">
        {/* Profile Hero Section */}
        <div className="perfil-hero">
          {/* Avatar */}
          <div className="perfil-avatar-container">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="perfil-avatar"
              />
            ) : (
              <div className="perfil-avatar">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <button className="perfil-avatar-edit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          
          {/* User Info */}
          <div className="perfil-user-info">
            <div className="perfil-name-container">
              <h1 className="perfil-name">{user.name}</h1>
              <div className={`perfil-verification ${user.isVerified ? 'verified' : 'unverified'}`}>
                {user.isVerified ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
            
            <div className="perfil-type-badge">
              Tipo de conta não definido
            </div>
            
            {/* Contact Info */}
            <div className="perfil-contact-info">
              <div className="perfil-contact-item">
                <svg className="perfil-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="perfil-contact-text">{user.email}</span>
              </div>
              
              <div className="perfil-contact-item">
                <svg className="perfil-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9" />
                </svg>
                <span className="perfil-contact-text">{user.memberSince}</span>
              </div>
              
              <div className="perfil-contact-item">
                <svg className="perfil-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="perfil-contact-text">{user.location}</span>
              </div>
            </div>
            
            <button className="perfil-complete-btn">
              Completar Perfil
            </button>
          </div>
        </div>
        
        {/* Grid Layout */}
        <div className="perfil-grid">
          {/* Impact Card */}
          <div className="perfil-impact-card">
            <div className="perfil-impact-header">Seu Impacto</div>
            <div className="perfil-impact-points">
              <span className="perfil-impact-number">{user.stats.impactPoints}</span>
              <span className="perfil-impact-label">pontos</span>
            </div>
            <p className="perfil-impact-description">
              Você ainda não possui atividades registradas. Comece ajudando ou pedindo ajuda para acumular pontos!
            </p>
            <div className="perfil-impact-progress">
              <div className="perfil-impact-progress-bar" style={{ width: '0%' }} />
            </div>
            <p className="perfil-impact-tip">🚀 Comece sua jornada solidária</p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="perfil-stats-grid">
          <div className="perfil-stat-card">
            <div className="perfil-stat-icon">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="perfil-stat-content">
              <div className="perfil-stat-number">{user.stats.helpsGiven}</div>
              <div className="perfil-stat-label">Nenhuma ajuda oferecida ainda</div>
            </div>
          </div>
          
          <div className="perfil-stat-card">
            <div className="perfil-stat-icon">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"/>
                <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h11c1.1 0 2.1-.4 2.8-1.2l5.1-5.1c.4-.4.4-1 0-1.4s-1-.4-1.4 0L15 15"/>
              </svg>
            </div>
            <div className="perfil-stat-content">
              <div className="perfil-stat-number">{user.stats.requestsMade}</div>
              <div className="perfil-stat-label">Nenhum pedido realizado ainda</div>
            </div>
          </div>
        </div>
        
        {/* Details Card */}
        <div className="perfil-details-card">
          <div className="perfil-details-header">
            <h2 className="perfil-details-title">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Detalhes da Conta
            </h2>
          </div>
          
          <div className="perfil-details-content">
            {/* Bio Section */}
            <div className="perfil-bio-section">
              <label className="perfil-section-label">Sobre Você</label>
              <div className="perfil-bio-content">
                <p className="perfil-bio-text">"{user.bio}"</p>
              </div>
            </div>
            
            <div className="perfil-divider" />
            
            <div className="perfil-security-grid">
              {/* Security Section */}
              <div>
                <label className="perfil-section-label">Segurança</label>
                <div className="perfil-security-item">
                  <div className="perfil-security-info">
                    <svg className="perfil-security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <div className="perfil-security-text">Senha</div>
                      <div className="perfil-security-status">Não configurada</div>
                    </div>
                  </div>
                  <button className="perfil-security-action">
                    Definir
                  </button>
                </div>
              </div>
              
              {/* Status Section */}
              <div>
                <label className="perfil-section-label">Status da Conta</label>
                <div className="perfil-security-item perfil-status-unverified">
                  <div className="perfil-security-info">
                    <svg className="perfil-security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <div className="perfil-security-text">Não Verificada</div>
                      <div className="perfil-security-status">Complete seu perfil para verificação</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Welcome Card */}
        <div className="perfil-welcome-card">
          <div className="perfil-welcome-header">
            <div className="perfil-welcome-icon">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h3 className="perfil-welcome-title">🎆 Bem-vindo ao Solidar Bairro!</h3>
          </div>
          <p className="perfil-welcome-description">
            Sua jornada solidária começa agora! Conecte-se com sua comunidade, ajude seus vizinhos e construa um bairro mais unido. Cada ação conta e faz a diferença.
          </p>
          <div className="perfil-welcome-actions">
            <button 
              onClick={() => navigate('/preciso-de-ajuda')}
              className="perfil-welcome-btn primary"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"/>
                <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h11c1.1 0 2.1-.4 2.8-1.2l5.1-5.1c.4-.4.4-1 0-1.4s-1-.4-1.4 0L15 15"/>
              </svg>
              Preciso de Ajuda
            </button>
            <button 
              onClick={() => navigate('/quero-ajudar')}
              className="perfil-welcome-btn secondary"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              Quero Ajudar
            </button>
          </div>
          <div className="perfil-welcome-tip">
            <div className="perfil-tip-indicator"></div>
            <span className="perfil-tip-label">Dica:</span>
            <span className="perfil-tip-text">Comece oferecendo ajuda para ganhar seus primeiros pontos e conquistar o selo "Vizinho Amigo"</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;