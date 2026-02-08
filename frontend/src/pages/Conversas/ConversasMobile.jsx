import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, ArrowRight, MapPin, MessageSquare, Menu, X, Pin, CheckCheck, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConversasMobile.css';

const getAvatarColor = (name) => {
  const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = (name || '').charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function ConversasMobile({ user, conversations, loading, error, activeFilter, setActiveFilter, sortBy, setSortBy, searchTerm, setSearchTerm, pinnedConversations, togglePin, handleMarkAllRead, loadConversations }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = activeFilter === 'todas' || (activeFilter === 'ativas' && conv.status === 'ativa') || (activeFilter === 'finalizadas' && conv.status === 'finalizada') || (activeFilter === 'online' && conv.isOnline);
    const matchesSearch = conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) || conv.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    const isPinnedA = pinnedConversations.includes(a.id);
    const isPinnedB = pinnedConversations.includes(b.id);
    if (isPinnedA && !isPinnedB) return -1;
    if (!isPinnedA && isPinnedB) return 1;
    if (sortBy === 'unread' && b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
    const getTime = (t) => { if (!t) return 0; if (t instanceof Date) return t.getTime(); if (t.seconds) return t.seconds * 1000; return new Date(t).getTime(); };
    return getTime(b.rawTimestamp) - getTime(a.rawTimestamp);
  });

  return (
    <div className="conv-mobile-container">
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />}
      <aside className={`conv-mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-close-container"><button onClick={() => setMobileMenuOpen(false)} className="mobile-menu-close-btn"><X size={24} color="#64748b" /></button></div>
        <div className="conv-profile-card"><div className="profile-bg-gradient" /><div className="profile-content"><div className="profile-avatar-large">{user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}</div><h3>{user?.nomeCompleto ? user.nomeCompleto.split(' ')[0] : 'Usuário'}</h3><div className="profile-rank"><Star size={14} fill="#10b981" /> Nível 3 • Solidário</div></div></div>
        <nav className="conv-nav-menu"><h4 className="nav-section-title">Mensagens</h4><button className={`nav-menu-item ${activeFilter === 'todas' ? 'active' : ''}`} onClick={() => { setActiveFilter('todas'); setMobileMenuOpen(false); }}><MessageSquare size={18} /><span>Todas as conversas</span><span className="count">{conversations.length}</span></button><button className={`nav-menu-item ${activeFilter === 'ativas' ? 'active' : ''}`} onClick={() => { setActiveFilter('ativas'); setMobileMenuOpen(false); }}><Zap size={18} /><span>Em andamento</span><span className="count">{conversations.filter(c => c.status === 'ativa').length}</span></button><button className={`nav-menu-item ${activeFilter === 'online' ? 'active' : ''}`} onClick={() => { setActiveFilter('online'); setMobileMenuOpen(false); }}><div style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 0 2px #d1fae5' }} /></div><span>Online Agora</span><span className="count">{conversations.filter(c => c.isOnline).length}</span></button></nav>
      </aside>
      <section className="conv-mobile-feed">
        <header className="conv-feed-header">
          <div className="feed-header-top"><div className="header-left-group"><button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}><Menu size={24} /></button><h1 className="feed-title">Mensagens</h1></div><div className="conv-actions-group"><select className="conv-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="date">Mais recentes</option><option value="unread">Não lidas</option></select><button className="mark-read-btn" onClick={handleMarkAllRead} title="Marcar todas como lidas"><CheckCheck size={20} /></button></div></div>
          <div className="conv-search-bar"><Search size={18} className="search-icon" /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <div className="mobile-tabs-scroll"><button className={`mobile-tab ${activeFilter === 'todas' ? 'active' : ''}`} onClick={() => setActiveFilter('todas')}>Todas</button><button className={`mobile-tab ${activeFilter === 'ativas' ? 'active' : ''}`} onClick={() => setActiveFilter('ativas')}>Ativas</button><button className={`mobile-tab ${activeFilter === 'online' ? 'active' : ''}`} onClick={() => setActiveFilter('online')}>Online</button></div>
        </header>
        <div className="conv-list-container">{loading ? (<div className="conv-loading-state"><div className="loading-spinner" /><p className="skeleton-pulse">Carregando...</p></div>) : error ? (<div className="conv-error-state"><p>{error}</p><button className="btn-retry" onClick={loadConversations}>Tentar novamente</button></div>) : (<AnimatePresence mode="popLayout">{filteredConversations.length > 0 ? (filteredConversations.map((conv, index) => (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: index * 0.05 }} key={conv.id} className={`conv-bento-card ${conv.unreadCount > 0 ? 'unread' : ''}`} onClick={() => navigate(`/chat/${conv.id}`)}><div className="card-top"><div className={`card-avatar-box ${conv.userType}`} style={{ backgroundColor: conv.userAvatar ? '#f1f5f9' : getAvatarColor(conv.userName), color: '#ffffff', position: 'relative', overflow: 'hidden', border: 'none' }}>{conv.userAvatar ? (<img src={conv.userAvatar} alt={conv.userName} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = getAvatarColor(conv.userName); }} />) : null}<span style={{ position: 'relative', zIndex: 0 }}>{conv.userInitials}</span>{conv.isOnline && <span className="online-dot" style={{ zIndex: 2 }} title="Online" />}{conv.unreadCount > 0 && <span className="unread-dot" style={{ zIndex: 2 }} />}</div><div className="card-user-info"><div className="name-row"><h3>{conv.userName}</h3><span className={`urgency-pill ${conv.urgency}`}>{conv.urgency === 'high' ? 'Urgente' : conv.urgency === 'medium' ? 'Prioridade' : 'Normal'}</span></div><p className="subject-text">📌 {conv.subject}</p></div><div className="card-meta-aside"><button className={`pin-btn ${pinnedConversations.includes(conv.id) ? 'active' : ''}`} onClick={(e) => togglePin(e, conv.id)}><Pin size={16} /></button><span className="time-tag">{conv.time}</span><div className={`status-badge ${conv.status}`}>{conv.status === 'ativa' ? 'Aberto' : 'Concluído'}</div></div></div><div className="card-body">{conv.isTyping ? (<div className="typing-indicator-wrapper"><span className="typing-text">Digitando</span><div className="typing-dots"><span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span></div></div>) : (<p className="last-msg-preview">{conv.lastMessage}</p>)}<div className="card-footer-tags"><span className="location-tag"><MapPin size={12} /> {conv.neighborhood}</span><div className="card-actions-row">{conv.unreadCount > 0 && <span className="msg-count-pill">{conv.unreadCount}</span>}<div className="arrow-box"><ArrowRight size={18} /></div></div></div></div></motion.div>))) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="conv-empty-state-v2"><div className="empty-visual"><Heart size={40} className="floating" /><MessageSquare size={30} className="floating-delay" /></div><h3>Nenhuma conversa</h3><p>Inicie uma conversa com alguém que precisa de ajuda</p><button className="btn-start-action" onClick={() => navigate('/')}>Ver Mapa</button></motion.div>)}</AnimatePresence>)}</div>
      </section>
    </div>
  );
}
