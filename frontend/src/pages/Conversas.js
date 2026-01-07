import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../styles/pages/ConversationsList.css';

// Ícones SVG convertidos
const Heart = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Search = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const MapPin = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CheckCircle = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const MessageSquare = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Zap = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ShieldCheck = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const Trophy = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34" />
    <path d="M2 14a6 6 0 0 0 6-6V6h8v2a6 6 0 0 0 6 6" />
  </svg>
);

const Users = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Conversas = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: '1',
      userName: 'Ana Paula Silva',
      userInitials: 'AN',
      userType: 'receptor',
      time: '19h',
      subject: 'Cesta Básica',
      neighborhood: 'São Lucas',
      status: 'ativa',
      lastMessage: 'Obrigada! Posso buscar hoje à tarde?',
      unreadCount: 1,
      urgency: 'high'
    },
    {
      id: '2',
      userName: 'Dr. Carlos Mendes',
      userInitials: 'DR',
      userType: 'doador',
      time: '1d',
      subject: 'Remédios',
      neighborhood: 'Centro',
      status: 'finalizada',
      lastMessage: 'Ajuda finalizada com sucesso! 🎉',
      unreadCount: 0,
      urgency: 'low'
    },
    {
      id: '3',
      userName: 'Ricardo Souza',
      userInitials: 'RS',
      userType: 'doador',
      time: '3h',
      subject: 'Móveis',
      neighborhood: 'Vila Nova',
      status: 'ativa',
      lastMessage: 'Consigo levar o sofá no sábado.',
      unreadCount: 3,
      urgency: 'medium'
    },
  ];

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = 
      activeFilter === 'todas' || 
      (activeFilter === 'ativas' && conv.status === 'ativa') || 
      (activeFilter === 'finalizadas' && conv.status === 'finalizada');
    
    const matchesSearch = 
      conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      conv.subject.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="conv-page-wrapper">
      <Header showLoginButton={false} />
      
      <main className="conv-main-content">
        <div className="conv-dashboard-grid">
          {/* Left Column: Stats & Profile (Desktop) */}
          <aside className="conv-sidebar left">
            <div className="conv-profile-card">
              <div className="profile-bg-gradient" />
              <div className="profile-content">
                <div className="profile-avatar-large">V</div>
                <h3>Seu Perfil Solidário</h3>
                <p className="profile-rank">⭐ Super Vizinho</p>
                <div className="profile-stats-mini">
                  <div className="stat-mini-item">
                    <span className="stat-value">12</span>
                    <span className="stat-label">Ajudas</span>
                  </div>
                  <div className="stat-mini-item">
                    <span className="stat-value">4.9</span>
                    <span className="stat-label">Nota</span>
                  </div>
                </div>
              </div>
            </div>

            <nav className="conv-nav-menu">
              <h4 className="nav-section-title">Filtros Rápidos</h4>
              <button 
                className={`nav-menu-item ${activeFilter === 'todas' ? 'active' : ''}`}
                onClick={() => setActiveFilter('todas')}
              >
                <MessageSquare size={18} />
                <span>Todas as Conversas</span>
                <span className="count">{conversations.length}</span>
              </button>
              <button 
                className={`nav-menu-item ${activeFilter === 'ativas' ? 'active' : ''}`}
                onClick={() => setActiveFilter('ativas')}
              >
                <Zap size={18} />
                <span>Conversas Ativas</span>
                <span className="count">{conversations.filter(c => c.status === 'ativa').length}</span>
              </button>
              <button 
                className={`nav-menu-item ${activeFilter === 'finalizadas' ? 'active' : ''}`}
                onClick={() => setActiveFilter('finalizadas')}
              >
                <CheckCircle size={18} />
                <span>Finalizadas</span>
                <span className="count">{conversations.filter(c => c.status === 'finalizada').length}</span>
              </button>
            </nav>
          </aside>

          {/* Center Column: Feed */}
          <section className="conv-feed-column">
            <header className="conv-feed-header">
              <div className="feed-header-top">
                <h1 className="feed-title">Central de Mensagens</h1>
                <div className="conv-search-bar">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Buscar vizinho ou assunto..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Tabs (only visible on small screens) */}
              <div className="mobile-tabs-scroll">
                <button className={`mobile-tab ${activeFilter === 'todas' ? 'active' : ''}`} onClick={() => setActiveFilter('todas')}>Todas</button>
                <button className={`mobile-tab ${activeFilter === 'ativas' ? 'active' : ''}`} onClick={() => setActiveFilter('ativas')}>Ativas</button>
                <button className={`mobile-tab ${activeFilter === 'finalizadas' ? 'active' : ''}`} onClick={() => setActiveFilter('finalizadas')}>Finalizadas</button>
              </div>
            </header>

            <div className="conv-list-container">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv, index) => (
                  <div 
                    key={conv.id} 
                    className={`conv-bento-card ${conv.unreadCount > 0 ? 'unread' : ''}`} 
                    onClick={() => navigate(`/chat/${conv.id}`)}
                  >
                    <div className="card-top">
                      <div className={`card-avatar-box ${conv.userType}`}>
                        {conv.userInitials}
                        {conv.unreadCount > 0 && <span className="unread-dot" />}
                      </div>
                      <div className="card-user-info">
                        <div className="name-row">
                          <h3>{conv.userName}</h3>
                          <span className={`urgency-pill ${conv.urgency}`}>
                            {conv.urgency === 'high' ? 'Urgente' : conv.urgency === 'medium' ? 'Prioridade' : 'Normal'}
                          </span>
                        </div>
                        <p className="subject-text">📌 {conv.subject}</p>
                      </div>
                      <div className="card-meta-aside">
                        <span className="time-tag">{conv.time}</span>
                        <div className={`status-badge ${conv.status}`}>
                          {conv.status === 'ativa' ? 'Em aberto' : 'Concluído'}
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <p className="last-msg-preview">{conv.lastMessage}</p>
                      <div className="card-footer-tags">
                        <span className="location-tag">
                          <MapPin size={12} /> {conv.neighborhood}
                        </span>
                        <div className="card-actions-row">
                          {conv.unreadCount > 0 && <span className="msg-count-pill">{conv.unreadCount} novas</span>}
                          <div className="arrow-box">
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="conv-empty-state-v2">
                  <div className="empty-visual">
                    <Heart size={40} className="floating" />
                    <MessageSquare size={30} className="floating-delay" />
                  </div>
                  <h3>Silêncio por aqui...</h3>
                  <p>Que tal iniciar uma conversa com alguém que precisa de ajuda?</p>
                  <button className="btn-start-action" onClick={() => navigate('/')}>Ver Mapa de Ajuda</button>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Insights (Desktop) */}
          <aside className="conv-sidebar right">
            <div className="insight-card trophy-card">
              <div className="insight-icon">
                <Trophy size={24} />
              </div>
              <div className="insight-text">
                <h4>Conquista da Semana</h4>
                <p>Você ajudou 3 vizinhos nos últimos 7 dias. Continue assim!</p>
              </div>
            </div>

            <div className="neighborhood-snapshot">
              <h4>No seu Bairro</h4>
              <div className="snapshot-item">
                <Users size={16} />
                <span><strong>12</strong> novos pedidos hoje</span>
              </div>
              <div className="snapshot-item">
                <Heart size={16} />
                <span><strong>8</strong> doações concluídas</span>
              </div>
              <div className="snapshot-item">
                <ShieldCheck size={16} />
                <span>Área Segura e Ativa</span>
              </div>
            </div>

            <div className="safety-banner-mini">
              <ShieldCheck size={20} />
              <div>
                <h5>Dica de Segurança</h5>
                <p>Sempre combine encontros em locais públicos e movimentados.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Conversas;