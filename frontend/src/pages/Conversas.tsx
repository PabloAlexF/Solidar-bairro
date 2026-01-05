import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/ConversationsList.css';

type UserType = 'doador' | 'receptor';
type ConvStatus = 'ativa' | 'finalizada';

interface Conversation {
  id: string;
  userName: string;
  userInitials: string;
  userType: UserType;
  lastMessage: string;
  time: string;
  subject: string;
  neighborhood: string;
  status: ConvStatus;
  unreadCount: number;
}

const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function Conversas() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'todas' | 'ativas' | 'finalizadas'>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations: Conversation[] = [
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
    <div className="conv-page-container">
      <div className="conv-max-width">
        <header className="conv-header">
          <div className="conv-title-group">
            <div className="conv-icon-bg">
              <HeartIcon />
            </div>
            <div>
              <h1>Minhas Conversas</h1>
              <p>Gerencie suas conversas de ajuda</p>
            </div>
          </div>
          
          <div className="conv-search-box">
            <SearchIcon />
            <input 
              type="text" 
              placeholder="Buscar por nome ou assunto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <nav className="conv-tabs">
          <button 
            className={`conv-tab ${activeFilter === 'todas' ? 'active' : ''}`}
            onClick={() => setActiveFilter('todas')}
          >
            Todas <span>({conversations.length})</span>
          </button>
          <button 
            className={`conv-tab ${activeFilter === 'ativas' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ativas')}
          >
            Ativas <span>({conversations.filter(c => c.status === 'ativa').length})</span>
          </button>
          <button 
            className={`conv-tab ${activeFilter === 'finalizadas' ? 'active' : ''}`}
            onClick={() => setActiveFilter('finalizadas')}
          >
            Finalizadas <span>({conversations.filter(c => c.status === 'finalizada').length})</span>
          </button>
        </nav>

        <div className="conv-list">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div key={conv.id} className="conv-card" onClick={() => navigate(`/chat/${conv.id}`)}>
                <div className="conv-card-left">
                  <div className={`conv-avatar ${conv.userType}`}>
                    {conv.userInitials}
                  </div>
                  <div className="conv-main-info">
                    <div className="conv-name-row">
                      <span className="conv-user-name">{conv.userName}</span>
                      <span className={`conv-user-tag ${conv.userType}`}>
                        {conv.userType === 'doador' ? 'Doadora' : 'Precisa de Ajuda'}
                      </span>
                    </div>
                    <div className="conv-subject-row">
                      <span className="conv-item">📌 {conv.subject}</span>
                      <span className="conv-dot">•</span>
                      <span className="conv-location">📍 {conv.neighborhood}</span>
                    </div>
                    <p className="conv-last-msg">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="conv-card-right">
                  <div className="conv-meta-top">
                    <span className="conv-time">{conv.time}</span>
                    <div className={`conv-status-badge ${conv.status}`}>
                      {conv.status === 'ativa' ? '🟢 Ativa' : '✅ Finalizada'}
                    </div>
                  </div>
                  <div className="conv-actions">
                    {conv.unreadCount > 0 && (
                      <span className="conv-unread">{conv.unreadCount}</span>
                    )}
                    <div className="conv-arrow">
                      <ArrowRightIcon />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="conv-empty">
              <p>Nenhuma conversa encontrada para o filtro selecionado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}