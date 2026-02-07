import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableHeader from '../../components/layout/ReusableHeader';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/apiService';
import chatNotificationService from '../../services/chatNotificationService';
import { getSocket } from '../../services/socketService';
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
  X,
  Pin,
  CheckCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

// Patch ApiService to handle missing endpoint causing 404 in LandingHeader
if (ApiService && !ApiService._patchedInteresses) {
  const originalRequest = ApiService.request;
  ApiService.request = async (endpoint, options = {}) => {
    if (endpoint === '/interesses/meus' || endpoint.includes('/interesses/meus')) {
      console.warn('Patched: Mocking /interesses/meus response to prevent 404');
      return { success: true, data: [] };
    }
    return originalRequest.call(ApiService, endpoint, options);
  };
  ApiService._patchedInteresses = true;
}

const getAvatarColor = (name) => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', 
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = (name || '').charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const normalizeStatus = (status) => {
  if (!status) return 'ativa';
  const s = String(status).toLowerCase();
  return ['closed', 'finalizada', 'completed', 'resolvido', 'encerrada', 'concluida'].includes(s) ? 'finalizada' : 'ativa';
};

const Conversas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('date');
  const [pinnedConversations, setPinnedConversations] = useState(() => {
    const saved = localStorage.getItem('solidar-pinned-conversations');
    return saved ? JSON.parse(saved) : [];
  });
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
                userName = otherParticipant.nome.split(' ')[0]; // Abrevia para o primeiro nome
              } else if (otherParticipant.nomeCompleto && otherParticipant.nomeCompleto.trim()) {
                userName = otherParticipant.nomeCompleto.split(' ')[0]; // Abrevia para o primeiro nome
              }
          
          return {
            id: conv.id,
            userName: userName,
            userAvatar: otherParticipant.fotoPerfil || null,
            userInitials: userName !== 'Usuário' ? 
              userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U',
            userType: otherParticipant.tipo || 'cidadao',
            isOnline: otherParticipant.isOnline,
            isTyping: conv.isTyping,
              time: formatTimeAgo(lastMessage.createdAt),
            subject: conv.subject || 'Conversa',
            neighborhood: otherParticipant.bairro || 'Não informado',
            status: normalizeStatus(conv.status),
            lastMessage: lastMessage.content || 'Nova conversa iniciada',
            unreadCount: conv.unreadCount || 0,
            urgency: conv.urgency || 'medium',
            rawTimestamp: lastMessage.createdAt
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
              if (otherParticipant.nomeCompleto && otherParticipant.nomeCompleto.trim()) {
                userName = otherParticipant.nomeCompleto.split(' ')[0]; // Abrevia para o primeiro nome
              } else if (otherParticipant.nome && otherParticipant.nome.trim()) {
                userName = otherParticipant.nome.split(' ')[0]; // Abrevia para o primeiro nome
              }

              return {
                id: conv.id,
                userName: userName,
                userAvatar: otherParticipant.fotoPerfil || null,
                userInitials: userName !== 'Usuário' ?
                  userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U',
                userType: otherParticipant.tipo || 'cidadao',
                isOnline: otherParticipant.isOnline,
                isTyping: conv.isTyping,
                time: formatTimeAgo(lastMessage.createdAt),
                subject: conv.subject || 'Conversa',
                neighborhood: otherParticipant.bairro || 'Não informado',
                status: normalizeStatus(conv.status),
                lastMessage: lastMessage.content || 'Nova conversa iniciada',
                unreadCount: conv.unreadCount || 0,
                urgency: conv.urgency || 'medium',
                rawTimestamp: lastMessage.createdAt
              };
            });
            setConversations(formatted);
            // Recarregar estatísticas quando conversas são atualizadas
            loadUserStats();
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
        console.log('Carregando estatísticas para usuário:', user.uid);
        
        // Tentar múltiplos endpoints para obter as estatísticas
        let ajudasCount = 0;
        
        try {
          // Tentar endpoint principal
          const ajudasResponse = await ApiService.getAjudasConcluidas(user.uid);
          console.log('Resposta de ajudas concluídas (principal):', ajudasResponse);
          
          if (ajudasResponse.success && ajudasResponse.data) {
            ajudasCount = ajudasResponse.data.ajudasConcluidas || ajudasResponse.data.count || 0;
          }
        } catch (error) {
          console.warn('Endpoint principal falhou, tentando alternativo:', error.message);
          
          try {
            // Tentar endpoint alternativo
            const statsResponse = await ApiService.getUserStats(user.uid);
            console.log('Resposta de stats do usuário:', statsResponse);
            
            if (statsResponse.success && statsResponse.data) {
              ajudasCount = statsResponse.data.ajudasConcluidas || statsResponse.data.helpCount || 0;
            }
          } catch (error2) {
            console.warn('Endpoint alternativo falhou, tentando /me/stats:', error2.message);
            
            try {
              // Tentar endpoint /me/stats
              const myStatsResponse = await ApiService.getMyStats();
              console.log('Resposta de minhas stats:', myStatsResponse);
              
              if (myStatsResponse.success && myStatsResponse.data) {
                ajudasCount = myStatsResponse.data.ajudasConcluidas || myStatsResponse.data.helpCount || 0;
              }
            } catch (error3) {
              console.warn('Todos os endpoints falharam:', error3.message);
            }
          }
        }
        
        console.log('Número final de ajudas concluídas:', ajudasCount);
        setAjudasConcluidas(ajudasCount);
        
        // Carregar stats do bairro
        try {
          const statsResponse = await ApiService.getNeighborhoodStats();
          if (statsResponse.success) {
            setNeighborhoodStats(statsResponse.data);
          }
        } catch (error) {
          console.warn('Erro ao carregar stats do bairro:', error.message);
        }
      }
    } catch (error) {
      console.error('Erro geral ao carregar estatísticas:', error);
      setAjudasConcluidas(0);
    }
  };

  const togglePin = (e, convId) => {
    e.stopPropagation();
    setPinnedConversations(prev => {
      const newPinned = prev.includes(convId) 
        ? prev.filter(id => id !== convId)
        : [...prev, convId];
      localStorage.setItem('solidar-pinned-conversations', JSON.stringify(newPinned));
      return newPinned;
    });
  };

  const handleMarkAllRead = () => {
    setConversations(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
    // Aqui você pode adicionar a chamada para a API se disponível
    // ApiService.markAllAsRead(user.uid).catch(console.error);
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = 
      activeFilter === 'todas' || 
      (activeFilter === 'ativas' && conv.status === 'ativa') || 
      (activeFilter === 'finalizadas' && conv.status === 'finalizada') ||
      (activeFilter === 'online' && conv.isOnline);
    
    const matchesSearch = 
      conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      conv.subject.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    const isPinnedA = pinnedConversations.includes(a.id);
    const isPinnedB = pinnedConversations.includes(b.id);

    if (isPinnedA && !isPinnedB) return -1;
    if (!isPinnedA && isPinnedB) return 1;

    if (sortBy === 'unread') {
      if (b.unreadCount !== a.unreadCount) {
        return b.unreadCount - a.unreadCount;
      }
    }
    
    const getTime = (t) => {
      if (!t) return 0;
      if (t instanceof Date) return t.getTime();
      if (t.seconds) return t.seconds * 1000;
      return new Date(t).getTime();
    };

    return getTime(b.rawTimestamp) - getTime(a.rawTimestamp);
  });

  return (
    <div className="conv-page-wrapper">
      <ReusableHeader
        navigationItems={[
          { path: '/contato', label: 'Contato' }
        ]}
        showLoginButton={true}
        showAdminButtons={true}
        showPainelSocial={true}
      />
      <main className="conv-main-content">
        <div className="conv-dashboard-grid">
          {/* Mobile Overlay */}
          {mobileMenuOpen && (
            <div 
              className="mobile-menu-overlay"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Left Column: Stats & Profile (Desktop) */}
          <aside className={`conv-sidebar left ${mobileMenuOpen ? 'open' : ''}`}>
            {mobileMenuOpen && (
              <div className="mobile-menu-close-container">
                <button onClick={() => setMobileMenuOpen(false)} className="mobile-menu-close-btn">
                  <X size={24} color="#64748b" />
                </button>
              </div>
            )}
            <div className="conv-profile-card">
              <div className="profile-bg-gradient" />
              <div className="profile-content">
                <div className="profile-avatar-large">
                  {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3>{user?.nomeCompleto ? user.nomeCompleto.split(' ')[0] : 'Usuário'}</h3>
                <div className="profile-rank">
                  <Star size={14} fill="#10b981" /> Nível 3 • Solidário
                </div>
              </div>
            </div>

            <nav className="conv-nav-menu">
              <h4 className="nav-section-title">Mensagens</h4>
              <button 
                className={`nav-menu-item ${activeFilter === 'todas' ? 'active' : ''}`}
                onClick={() => setActiveFilter('todas')}
              >
                <MessageSquare size={18} />
                <span>Todas as conversas</span>
                <span className="count">{conversations.length}</span>
              </button>
              <button 
                className={`nav-menu-item ${activeFilter === 'ativas' ? 'active' : ''}`}
                onClick={() => setActiveFilter('ativas')}
              >
                <Zap size={18} />
                <span>Em andamento</span>
                <span className="count">{conversations.filter(c => c.status === 'ativa').length}</span>
              </button>
              <button 
                className={`nav-menu-item ${activeFilter === 'online' ? 'active' : ''}`}
                onClick={() => setActiveFilter('online')}
              >
                <div style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 2px #d1fae5' }} />
                </div>
                <span>Online Agora</span>
                <span className="count">{conversations.filter(c => c.isOnline).length}</span>
              </button>
            </nav>
          </aside>

          {/* Middle Column: Feed */}
          <section className="conv-feed-column">
            <header className="conv-feed-header">
              <div className="feed-header-top">
                <div className="header-left-group">
                  <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
                    <Menu size={24} />
                  </button>
                  <h1 className="feed-title">Central de Mensagens</h1>
                </div>
                
                <div className="header-right-group">
                  <div className="conv-actions-group">
                    <div className="conv-sort-box">
                      <select 
                        className="conv-sort-select"
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="date">Mais recentes</option>
                        <option value="unread">Não lidas</option>
                      </select>
                    </div>
                    <button 
                      className="mark-read-btn"
                      onClick={handleMarkAllRead}
                      title="Marcar todas como lidas"
                    >
                      <CheckCheck size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="conv-search-bar">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Buscar vizinho ou assunto..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="mobile-tabs-scroll">
                <button className={`mobile-tab ${activeFilter === 'todas' ? 'active' : ''}`} onClick={() => setActiveFilter('todas')}>Todas</button>
                <button className={`mobile-tab ${activeFilter === 'ativas' ? 'active' : ''}`} onClick={() => setActiveFilter('ativas')}>Ativas</button>
                <button className={`mobile-tab ${activeFilter === 'online' ? 'active' : ''}`} onClick={() => setActiveFilter('online')}>Online</button>
              </div>
            </header>

            <div className="conv-list-container">
              {loading ? (
                <div className="conv-loading-state">
                  <div className="loading-spinner" />
                  <p className="skeleton-pulse">Carregando suas conversas...</p>
                </div>
              ) : error ? (
                <div className="conv-error-state">
                  <p>{error}</p>
                  <button className="btn-retry" onClick={loadConversations}>Tentar novamente</button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conv, index) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        key={conv.id} 
                        className={`conv-bento-card ${conv.unreadCount > 0 ? 'unread' : ''}`} 
                        onClick={() => {
                          console.log('Clicando na conversa:', conv.id, conv);
                          if (!conv.id) {
                            console.error('ERRO: Conversa sem ID!', conv);
                            alert('Erro: Esta conversa não possui um ID válido.');
                            return;
                          }
                          navigate(`/chat/${conv.id}`);
                        }}
                      >
                        <div className="card-top">
                          <div 
                            className={`card-avatar-box ${conv.userType}`}
                            style={{
                              backgroundColor: conv.userAvatar ? '#f1f5f9' : getAvatarColor(conv.userName),
                              color: '#ffffff',
                              position: 'relative',
                              overflow: 'hidden',
                              border: 'none'
                            }}
                          >
                            {conv.userAvatar ? (
                              <img 
                                src={conv.userAvatar} 
                                alt={conv.userName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.style.backgroundColor = getAvatarColor(conv.userName);
                                }}
                              />
                            ) : null}
                            <span style={{ position: 'relative', zIndex: 0 }}>{conv.userInitials}</span>
                            {conv.isOnline && <span className="online-dot" style={{ zIndex: 2 }} title="Online" />}
                            {conv.unreadCount > 0 && <span className="unread-dot" style={{ zIndex: 2 }} />}
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
                            <button 
                              className={`pin-btn ${pinnedConversations.includes(conv.id) ? 'active' : ''}`}
                              onClick={(e) => togglePin(e, conv.id)}
                              title={pinnedConversations.includes(conv.id) ? "Desafixar" : "Fixar no topo"}
                            >
                              <Pin size={16} className={pinnedConversations.includes(conv.id) ? "pinned-icon" : ""} />
                            </button>
                            <span className="time-tag">{conv.time}</span>
                            <div className={`status-badge ${conv.status}`}>
                              {conv.status === 'ativa' ? 'Em aberto' : 'Concluído'}
                            </div>
                          </div>
                        </div>

                        <div className="card-body">
                          {conv.isTyping ? (
                            <div className="typing-indicator-wrapper">
                              <span className="typing-text">Digitando</span>
                              <div className="typing-dots">
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                              </div>
                            </div>
                          ) : (
                            <p className="last-msg-preview">{conv.lastMessage}</p>
                          )}
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
                <p>Você está entre os 5% que mais respondem rápido!</p>
              </div>
            </div>

            <div className="neighborhood-snapshot">
              <h4>Seu Bairro em Números</h4>
              <div className="snapshot-item">
                <MessageSquare size={16} />
                <span><strong>{neighborhoodStats.pedidosHoje}</strong> novos pedidos hoje</span>
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