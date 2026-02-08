import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReusableHeader from '../../components/layout/ReusableHeader';
import ConversasDesktop from './ConversasDesktop';
import ConversasMobile from './ConversasMobile';
import ApiService from '../../services/apiService';
import chatNotificationService from '../../services/chatNotificationService';
import './styles.css';

const normalizeStatus = (status) => {
  if (!status) return 'ativa';
  const s = String(status).toLowerCase();
  return ['closed', 'finalizada', 'completed', 'resolvido', 'encerrada', 'concluida'].includes(s) ? 'finalizada' : 'ativa';
};

const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Agora';
  let date;
  if (dateInput instanceof Date) date = dateInput;
  else if (dateInput && typeof dateInput === 'object' && dateInput.seconds) date = new Date(dateInput.seconds * 1000);
  else date = new Date(dateInput);
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

export default function ConversasWrapper() {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [activeFilter, setActiveFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('date');
  const [pinnedConversations, setPinnedConversations] = useState(() => {
    const saved = localStorage.getItem('solidar-pinned-conversations');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ajudasConcluidas, setAjudasConcluidas] = useState(0);
  const [neighborhoodStats, setNeighborhoodStats] = useState({ pedidosHoje: 0, doacoesConcluidas: 0, areaSegura: false });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getConversations();
      if (response.success && response.data) {
        const formattedConversations = response.data.map(conv => {
          const otherParticipant = conv.otherParticipant || {};
          const lastMessage = conv.lastMessage || {};
          let userName = 'Usuário';
          if (otherParticipant.nome && otherParticipant.nome.trim()) userName = otherParticipant.nome.split(' ')[0];
          else if (otherParticipant.nomeCompleto && otherParticipant.nomeCompleto.trim()) userName = otherParticipant.nomeCompleto.split(' ')[0];
          return {
            id: conv.id,
            userName,
            userAvatar: otherParticipant.fotoPerfil || null,
            userInitials: userName !== 'Usuário' ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U',
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

  useEffect(() => {
    if (user) {
      loadConversations();
      const interval = chatNotificationService.startConversationPolling(user.uid, (updatedConversations) => {
        if (updatedConversations && updatedConversations.length > 0) {
          const formatted = updatedConversations.map(conv => {
            const otherParticipant = conv.otherParticipant || {};
            const lastMessage = conv.lastMessage || {};
            let userName = 'Usuário';
            if (otherParticipant.nomeCompleto && otherParticipant.nomeCompleto.trim()) userName = otherParticipant.nomeCompleto.split(' ')[0];
            else if (otherParticipant.nome && otherParticipant.nome.trim()) userName = otherParticipant.nome.split(' ')[0];
            return {
              id: conv.id,
              userName,
              userAvatar: otherParticipant.fotoPerfil || null,
              userInitials: userName !== 'Usuário' ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U',
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
        }
      });
      return () => { if (interval) clearInterval(interval); };
    }
  }, [user]);

  const togglePin = (e, convId) => {
    e.stopPropagation();
    setPinnedConversations(prev => {
      const newPinned = prev.includes(convId) ? prev.filter(id => id !== convId) : [...prev, convId];
      localStorage.setItem('solidar-pinned-conversations', JSON.stringify(newPinned));
      return newPinned;
    });
  };

  const handleMarkAllRead = () => {
    setConversations(prev => prev.map(c => ({ ...c, unreadCount: 0 })));
  };

  const commonProps = { user, conversations, loading, error, activeFilter, setActiveFilter, sortBy, setSortBy, searchTerm, setSearchTerm, pinnedConversations, togglePin, handleMarkAllRead, loadConversations, ajudasConcluidas, neighborhoodStats };

  return (
    <div className="conv-page-wrapper">
      <ReusableHeader navigationItems={[{ path: '/contato', label: 'Contato' }]} showLoginButton={true} showAdminButtons={true} showPainelSocial={true} />
      <main className="conv-main-content">
        {isMobile ? <ConversasMobile {...commonProps} /> : <ConversasDesktop {...commonProps} />}
      </main>
    </div>
  );
}
