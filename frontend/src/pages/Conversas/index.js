import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/LandingHeader';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/apiService';
import chatNotificationService from '../../services/chatNotificationService';
import { 
  Heart, 
  Search, 
  ArrowRight, 
  MapPin, 
  CheckCircle, 
  Clock,
  MessageSquare,
  ShieldCheck,
  Zap,
  Star,
  Trophy,
  Users,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

const Conversas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('todas');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ajudasConcluidas, setAjudasConcluidas] = useState(0);
  const [neighborhoodStats, setNeighborhoodStats] = useState({
    pedidosHoje: 0,
    doacoesConcluidas: 0,
    areaSegura: false
  });

  // Carregar conversas
  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getConversations();
      
      if (response.success && response.data) {
        const formattedConversations = response.data.map(conv => {
          const otherParticipant = conv.otherParticipant || {};
          const lastMessage = conv.lastMessage || {};
          
          // Garantir que sempre temos um nome válido
          let userName = 'Usuário';
          if (otherParticipant.nome && otherParticipant.nome.trim()) {
            userName = otherParticipant.nome;
          }
          
          return {
            id: conv.id,
            userName: userName,
            userInitials: userName !== 'Usuário' ? 
              userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U',
            userType: otherParticipant.tipo || 'cidadao',
              time: formatTimeAgo(lastMessage.createdAt),
            subject: conv.subject || 'Conversa',
            neighborhood: otherParticipant.bairro || 'Não informado',
            status: conv.status === 'closed' ? 'finalizada' : 'ativa',
            lastMessage: lastMessage.content || 'Nova conversa iniciada',
            unreadCount: conv.unreadCount || 0,
            urgency: conv.urgency || 'medium'
          };
        });
        
        setConversations(formattedConversations);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      setError('Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  // Formatar tempo relativo
  const formatTimeAgo = (dateInput) => {
    if (!dateInput) return 'Agora';

    let date;
    // Tratamento robusto para diferentes formatos de data
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (dateInput && typeof dateInput === 'object' && dateInput.seconds) {
      date = new Date(dateInput.seconds * 1000);
    } else {
      date = new Date(dateInput);
    }

    if (isNaN(date.getTime())) return 'Data inválida';

    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  useEffect(() => {
    if (user) {
      loadConversations();
      loadUserStats();
      
      // Configurar polling para novas conversas
      const interval = chatNotificationService.startConversationPolling(
        user.uid, 
        (updatedConversations) => {
          if (updatedConversations && updatedConversations.length > 0) {
            const formatted = updatedConversations.map(conv => {
              const otherParticipant = conv.otherParticipant || {};
              const lastMessage = conv.lastMessage || {};
              
              // Garantir que sempre temos um nome válido
              let userName = 'Usuário';
              if (otherParticipant.nome && otherParticipant.nome.trim()) {
                userName = otherParticipant.nome;
              }
              
              return {
                id: conv.id,
                userName: userName,
                userInitials: userName !== 'Usuário' ? 
                  userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U',
                userType: otherParticipant.tipo || 'cidadao',
                time: formatTimeAgo(lastMessage.createdAt),
                subject: conv.subject || 'Conversa',
                neighborhood: otherParticipant.bairro || 'Não informado',
                status: conv.status === 'closed' ? 'finalizada' : 'ativa',
                lastMessage: lastMessage.content || 'Nova conversa iniciada',
                unreadCount: conv.unreadCount || 0,
                urgency: conv.urgency || 'medium'
              };
            });
            setConversations(formatted);
          }
        }
      );
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      if (user?.uid) {
        const [ajudasResponse, statsResponse] = await Promise.all([
          ApiService.getAjudasConcluidas(user.uid),
          ApiService.getNeighborhoodStats()
        ]);
        
        if (ajudasResponse.success) {
          setAjudasConcluidas(ajudasResponse.data.ajudasConcluidas || 0);
        }
        
        if (statsResponse.success) {
          setNeighborhoodStats(statsResponse.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

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
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .skeleton-pulse {
          animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Mobile Tabs Base */
        .mobile-tabs-scroll {
          display: none;
        }

        /* Responsive Layout */
        @media (max-width: 1200px) {
          .conv-dashboard-grid {
            grid-template-columns: 260px 1fr !important;
            gap: 24px !important;
          }
          .conv-sidebar.right {
            display: none !important;
          }
        }

        @media (max-width: 850px) {
          .conv-dashboard-grid {
            display: flex !important;
            flex-direction: column !important;
            padding: 0 16px 80px 16px !important;
          }
          
          .conv-sidebar.left {
            display: none !important;
          }
          
          .conv-sidebar.left.open {
            display: flex !important;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            z-index: 1000;
            background: #f8fafc;
            padding: 20px;
            box-shadow: 4px 0 12px rgba(0,0,0,0.1);
            overflow-y: auto;
          }

          .conv-feed-column {
            width: 100% !important;
            max-width: 100% !important;
          }

          .feed-header-top {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
            margin-bottom: 12px !important;
          }
          
          .feed-title {
            font-size: 24px !important;
          }

          .mobile-menu-btn {
            display: flex !important;
            background: white;
            border: 1px solid #e2e8f0;
            padding: 8px;
            border-radius: 8px;
            color: #1e293b;
          }

          .conv-search-bar {
            width: 100% !important;
            max-width: none !important;
          }

          .mobile-tabs-scroll {
            display: flex !important;
            overflow-x: auto;
            padding: 4px 4px 12px 4px;
            gap: 10px;
            margin: 0 -4px 16px -4px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          
          .mobile-tabs-scroll::-webkit-scrollbar {
            display: none;
          }
          
          .mobile-tab {
            white-space: nowrap;
            padding: 8px 20px;
            border-radius: 100px;
            background: #fff;
            border: 1px solid #e2e8f0;
            font-size: 14px;
            font-weight: 600;
            color: #64748b;
            transition: all 0.2s;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          
          .mobile-tab.active {
            background: #0f172a;
            color: white;
            border-color: #0f172a;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
          }

          .conv-bento-card {
            padding: 16px !important;
          }
          
          .card-user-info h3 {
            font-size: 16px !important;
          }
          
          .subject-text {
            font-size: 13px !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 200px;
          }
          
          .card-meta-aside {
            flex-direction: row !important;
            gap: 8px !important;
            align-items: center !important;
          }
          
          .status-badge {
            padding: 2px 8px !important;
            font-size: 11px !important;
          }
        }

        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <Header scrolled={true} />
      <main className="conv-main-content">
        <div className="conv-dashboard-grid">
          {/* Mobile Overlay */}
          {mobileMenuOpen && (
            <div 
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} 
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Left Column: Stats & Profile (Desktop) */}
          <aside className={`conv-sidebar left ${mobileMenuOpen ? 'open' : ''}`}>
            {mobileMenuOpen && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', padding: '4px' }}>
                  <X size={24} color="#64748b" />
                </button>
              </div>
            )}
            <div className="conv-profile-card">
              <div className="profile-bg-gradient" />
              <div className="profile-content">
                <div className="profile-avatar-large">
                  {user?.fotoPerfil ? (
                    <img 
                      src={user.fotoPerfil} 
                      alt="Foto do perfil" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = user?.nome ? user.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'V';
                      }}
                    />
                  ) : (
                    user?.nome ? user.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'V'
                  )}
                </div>
                <h3>Seu Perfil Solidário</h3>
                <p className="profile-rank">⭐ Super Vizinho</p>
                <div className="profile-stats-mini">
                  <div className="stat-mini-item">
                    <span className="stat-value">{ajudasConcluidas}</span>
                    <span className="stat-label">Ajudas</span>
                  </div>
                  <div className="stat-mini-item">
                    <span className="stat-value">{user?.avaliacao || '5.0'}</span>
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
                <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
                  <Menu size={24} />
                </button>
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
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="conv-bento-card" style={{ pointerEvents: 'none' }}>
                        <div className="card-top">
                          <div className="card-avatar-box skeleton-pulse" style={{ backgroundColor: '#f1f5f9', border: 'none' }} />
                          <div className="card-user-info" style={{ flex: 1 }}>
                            <div className="name-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <div className="skeleton-pulse" style={{ width: '120px', height: '20px', backgroundColor: '#f1f5f9', borderRadius: '4px' }} />
                              <div className="skeleton-pulse" style={{ width: '60px', height: '20px', backgroundColor: '#f1f5f9', borderRadius: '12px' }} />
                            </div>
                            <div className="skeleton-pulse" style={{ width: '60%', height: '16px', backgroundColor: '#f1f5f9', borderRadius: '4px' }} />
                          </div>
                          <div className="card-meta-aside">
                            <div className="skeleton-pulse" style={{ width: '40px', height: '14px', backgroundColor: '#f1f5f9', borderRadius: '4px', marginBottom: '8px' }} />
                            <div className="skeleton-pulse" style={{ width: '70px', height: '20px', backgroundColor: '#f1f5f9', borderRadius: '12px' }} />
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="skeleton-pulse" style={{ width: '100%', height: '16px', backgroundColor: '#f1f5f9', borderRadius: '4px', marginBottom: '8px' }} />
                          <div className="skeleton-pulse" style={{ width: '80%', height: '16px', backgroundColor: '#f1f5f9', borderRadius: '4px' }} />
                          <div className="card-footer-tags" style={{ marginTop: '16px' }}>
                            <div className="skeleton-pulse" style={{ width: '100px', height: '16px', backgroundColor: '#f1f5f9', borderRadius: '4px' }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="conv-error-state"
                  >
                    <p>{error}</p>
                    <button onClick={loadConversations} className="btn-retry">Tentar novamente</button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredConversations.length > 0 ? (
                        filteredConversations.map((conv, index) => (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            key={conv.id} 
                            className={`conv-bento-card ${conv.unreadCount > 0 ? 'unread' : ''}`} 
                            onClick={() => navigate(`/chat/${conv.id}`)}
                          >
                            <div className="card-top">
                              <div className={`card-avatar-box ${conv.userType}`}>
                                {conv.userInitials}
                                {conv.unreadCount > 0 && <span className="unread-dot" />}
                              </div>
                              <div className="card-user-info" style={{ minWidth: 0 }}>
                                <div className="name-row">
                                  <h3>{conv.userName}</h3>
                                  <span className={`urgency-pill ${conv.urgency}`}>
                                    {conv.urgency === 'high' ? 'Urgente' : conv.urgency === 'medium' ? 'Prioridade' : 'Normal'}
                                  </span>
                                </div>
                                <p className="subject-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>📌 {conv.subject}</p>
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
                          </motion.div>
                        ))
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="conv-empty-state-v2"
                        >
                          <div className="empty-visual">
                            <Heart size={40} className="floating" />
                            <MessageSquare size={30} className="floating-delay" />
                          </div>
                          <h3>Silêncio por aqui...</h3>
                          <p>Que tal iniciar uma conversa com alguém que precisa de ajuda?</p>
                          <button className="btn-start-action" onClick={() => navigate('/')}>Ver Mapa de Ajuda</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
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
                <p>Você ajudou {ajudasConcluidas} vizinhos nos últimos 7 dias. Continue assim!</p>
              </div>
            </div>

            <div className="neighborhood-snapshot">
              <h4>No seu Bairro</h4>
              <div className="snapshot-item">
                <Users size={16} />
                <span><strong>{neighborhoodStats.pedidosHoje}</strong> novos pedidos hoje</span>
              </div>
              <div className="snapshot-item">
                <Heart size={16} />
                <span><strong>{neighborhoodStats.doacoesConcluidas}</strong> doações concluídas</span>
              </div>
              <div className="snapshot-item">
                <ShieldCheck size={16} />
                <span>{neighborhoodStats.areaSegura ? 'Área Segura e Ativa' : 'Área em Crescimento'}</span>
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