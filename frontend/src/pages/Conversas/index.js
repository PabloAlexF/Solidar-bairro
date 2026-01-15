import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
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
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

const Conversas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ajudasConcluidas, setAjudasConcluidas] = useState(0);

  // Carregar conversas
  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getConversations();
      
      if (response.success && response.data) {
        const formattedConversations = response.data.map(conv => {
          const otherParticipant = conv.otherParticipant || {};
          const lastMessage = conv.lastMessage || {};
          
          return {
            id: conv.id,
            userName: otherParticipant.nome || 'Usuário',
            userInitials: otherParticipant.nome ? 
              otherParticipant.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US',
            userType: otherParticipant.tipo || 'cidadao',
            time: lastMessage.createdAt ? 
              formatTimeAgo(new Date(lastMessage.createdAt.seconds * 1000)) : 'Agora',
            subject: conv.subject || 'Conversa',
            neighborhood: otherParticipant.bairro || 'Não informado',
            status: conv.status || 'ativa',
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
  const formatTimeAgo = (date) => {
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
              
              return {
                id: conv.id,
                userName: otherParticipant.nome || 'Usuário',
                userInitials: otherParticipant.nome ? 
                  otherParticipant.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'US',
                userType: otherParticipant.tipo || 'cidadao',
                time: lastMessage.createdAt ? 
                  formatTimeAgo(new Date(lastMessage.createdAt.seconds * 1000)) : 'Agora',
                subject: conv.subject || 'Conversa',
                neighborhood: otherParticipant.bairro || 'Não informado',
                status: conv.status || 'ativa',
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
        const response = await ApiService.getAjudasConcluidas(user.uid);
        if (response.success) {
          setAjudasConcluidas(response.data.ajudasConcluidas || 0);
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
      <main className="conv-main-content">
        <div className="conv-dashboard-grid">
          {/* Left Column: Stats & Profile (Desktop) */}
          <aside className="conv-sidebar left">
            <div className="conv-profile-card">
              <div className="profile-bg-gradient" />
              <div className="profile-content">
                <div className="profile-avatar-large">
                  {user?.nome ? user.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'V'}
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
              {loading ? (
                <div className="conv-loading-state">
                  <div className="loading-spinner"></div>
                  <p>Carregando conversas...</p>
                </div>
              ) : error ? (
                <div className="conv-error-state">
                  <p>{error}</p>
                  <button onClick={loadConversations} className="btn-retry">Tentar novamente</button>
                </div>
              ) : (
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
                <p>Você ajudou {ajudasConcluidas} vizinhos nos últimos 7 dias. Continue assim!</p>
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