import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import Header from '../components/layout/Header';

const Heart = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const Search = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MessageCircle = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const Plus = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const Conversas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      try {
        const response = await apiService.getConversations();
        if (response.success) {
          const conversationsData = response.data.map(conv => ({
            id: conv.id,
            name: conv.title || 'Conversa',
            initials: conv.title ? conv.title.substring(0, 2).toUpperCase() : 'CV',
            type: 'conversa',
            online: true,
            lastMessage: conv.lastMessage || 'Nova conversa',
            lastMessageTime: conv.lastMessageAt ? new Date(conv.lastMessageAt.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Agora',
            unreadCount: 0
          }));
          setConversations(conversationsData);
        }
      } catch (error) {
        console.error('Erro ao carregar conversas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user]);

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="chat-page-wrapper">
        <Header showLoginButton={false} />
        <div className="loading-container">
          <p>Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page-wrapper">
      <Header showLoginButton={false} />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Suas Conversas</h1>
          <p>Gerencie suas conversas e continue ajudando sua comunidade.</p>
        </div>

        {conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <MessageCircle size={64} style={{ color: '#10b981', marginBottom: '1rem' }} />
            <h3>Nenhuma conversa ainda</h3>
            <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
              Quando voce ajudar alguem ou pedir ajuda, suas conversas aparecerao aqui.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/quero-ajudar')}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.5rem', 
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem' 
                }}
              >
                <Heart size={16} />
                Quero Ajudar
              </button>
              <button 
                onClick={() => navigate('/preciso-de-ajuda')}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                  color: '#10b981',
                  border: '1px solid #10b981',
                  cursor: 'pointer',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem' 
                }}
              >
                <Plus size={16} />
                Pedir Ajuda
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input 
                type="text" 
                placeholder="Buscar conversas..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem 1rem 0.75rem 3rem', 
                  borderRadius: '0.5rem', 
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              {filteredConversations.map((conversation) => (
                <div 
                  key={conversation.id} 
                  onClick={() => navigate(`/chat/${conversation.id}`)}
                  style={{
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      <div 
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}
                      >
                        {conversation.initials}
                      </div>
                      {conversation.online && (
                        <span 
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#10b981',
                            borderRadius: '50%',
                            border: '2px solid white'
                          }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{conversation.name}</span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{conversation.lastMessageTime}</span>
                      </div>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{conversation.lastMessage}</p>
                      {conversation.unreadCount > 0 && (
                        <span 
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '1rem',
                            marginTop: '0.5rem'
                          }}
                        >
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Conversas;