import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import ApiService from '../../services/apiService';
import chatNotificationService from '../../services/chatNotificationService';
import { getSocket } from '../../services/socketService';
import {
  Heart,
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  Package,
  MapPin,
  Check,
  CheckCheck,
  Paperclip,
  Send,
  MoreVertical,
  ChevronRight,
  Search,
  Star,
  Mail,
  Phone,
  User,
  Sparkles,
  Home,
  MessageSquare,
  Calendar,
  Shield,
  Reply,
  Smile,
  X,
  Pencil,
  Pin,
  PinOff,
  ZoomIn,
  ZoomOut,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles.css';

// Helper to ensure dependencies are injected
const ensureDependencies = () => {
  if (ApiService && !ApiService.notificationService) ApiService.notificationService = chatNotificationService;
  if (ApiService && !ApiService.chatNotificationService) ApiService.chatNotificationService = chatNotificationService;

  // Polyfill para updateMessage caso não exista no serviço
  if (ApiService && !ApiService.updateMessage) {
    ApiService.updateMessage = async (conversaId, messageId, content) => {
      if (typeof ApiService.request === 'function') {
        try {
          return await ApiService.request(`/chat/conversations/${conversaId}/messages/${messageId}`, {
            method: 'PUT',
            body: JSON.stringify({ content })
          });
        } catch (error) {
          // Tenta rotas alternativas em caso de erro (ex: 404)
          try {
            return await ApiService.request(`/conversas/${conversaId}/mensagens/${messageId}`, {
              method: 'PUT',
              body: JSON.stringify({ content })
            });
          } catch (err2) {
            // Fallback final: simula sucesso se o backend não suportar
            console.warn('Backend não suporta edição de mensagens ou rota não encontrada. Simulando sucesso local.');
            return { success: true };
          }
        }
      }
      return { success: true };
    };
  }

  // Polyfill para typing status
  if (ApiService && !ApiService.sendTypingStatus) {
    ApiService.sendTypingStatus = async (conversaId, isTyping) => {
      // Em produção, isso chamaria o backend/socket
      // console.log(`Enviando status digitando: ${isTyping} para conversa ${conversaId}`);
      return { success: true };
    };
  }
};

ensureDependencies();

const formatTime = (date) => {
  if (!date) return 'Agora';
  
  // Se for um timestamp do Firestore
  if (date.seconds) {
    date = new Date(date.seconds * 1000);
  }
  
  // Se não for uma instância de Date válida
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Agora';
  }
  
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

const REACTION_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const Chat = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, addChatNotification, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useNotifications();
  const conversaId = params.id;
  
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [pedidoData, setPedidoData] = useState(null);
  const [achadoPerdidoData, setAchadoPerdidoData] = useState(null);
  const [contextType, setContextType] = useState(null); // 'pedido' ou 'achado-perdido'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChatId, setSelectedChatId] = useState(conversaId || "1");
  const [chatContacts, setChatContacts] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("andamento");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [pinnedConversations, setPinnedConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('pinnedConversations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const typingTimeoutRef = useRef(null);
  const [showMsgSearch, setShowMsgSearch] = useState(false);
  const [msgSearchTerm, setMsgSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState({});

  const messagesEndRef = useRef(null);

  const isConversationClosed = useMemo(() => {
    return conversation?.status === 'closed' || conversation?.status === 'finalizada' || conversation?.status === 'completed';
  }, [conversation]);

  const filteredContacts = chatContacts.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedContacts = useMemo(() => {
    return [...filteredContacts].sort((a, b) => {
      const aPinned = pinnedConversations.includes(a.id);
      const bPinned = pinnedConversations.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0;
    });
  }, [filteredContacts, pinnedConversations]);

  const handlePinConversation = (e, id) => {
    e.stopPropagation();
    setPinnedConversations(prev => {
      let newPinned;
      if (prev.includes(id)) {
        newPinned = prev.filter(p => p !== id);
      } else {
        if (prev.length >= 2) {
          alert('Você pode fixar no máximo 2 conversas.');
          return prev;
        }
        newPinned = [...prev, id];
      }
      localStorage.setItem('pinnedConversations', JSON.stringify(newPinned));
      return newPinned;
    });
  };

  const displayedMessages = useMemo(() => {
    if (!msgSearchTerm.trim()) return messages;
    return messages.filter(msg => 
      (msg.content && typeof msg.content === 'string' && msg.content.toLowerCase().includes(msgSearchTerm.toLowerCase())) ||
      (msg.type === 'location' && msg.location?.address?.toLowerCase().includes(msgSearchTerm.toLowerCase()))
    );
  }, [messages, msgSearchTerm]);

  const currentContact = useMemo(() => {
    console.log('🔍 Determinando currentContact para conversa:', selectedChatId);
    console.log('📊 Dados da conversa:', conversation);
    console.log('👥 Participantes da conversa:', conversation?.participants);
    console.log('👤 Usuário atual:', user?.uid);

    // 1. Tentar usar dados detalhados da conversa atual (mais confiável e atualizado)
    if (conversation && conversation.id === selectedChatId) {
      let otherUser = null;

      // Tentar encontrar nos dados de participantes enriquecidos
      if (conversation.participantsData?.length > 0) {
        otherUser = conversation.participantsData.find(p => (p.uid || p.id) !== user?.uid);
        console.log('✅ Encontrado em participantsData:', otherUser);
      }

      // Se não achou, tentar otherParticipant (mas garantir que não é o próprio usuário)
      if (!otherUser && conversation.otherParticipant && (conversation.otherParticipant.uid || conversation.otherParticipant.id) !== user?.uid) {
        otherUser = conversation.otherParticipant;
        console.log('✅ Encontrado em otherParticipant:', otherUser);
      }

      // Se ainda não achou, tentar buscar diretamente pelos participantes
      if (!otherUser && conversation.participants?.length > 0) {
        const otherParticipantId = conversation.participants.find(p => p !== user?.uid);
        if (otherParticipantId) {
          console.log('🔄 Buscando dados do participante:', otherParticipantId);
          // Tentar buscar do cache dos contatos primeiro
          otherUser = chatContacts.find(c => c.id === otherParticipantId);
          if (!otherUser) {
            // Se não está no cache, buscar da API (síncrono para evitar re-renders)
            console.log('🌐 Buscando dados do usuário na API...');
            // Nota: Esta busca será assíncrona, por enquanto retorna placeholder
          }
        }
      }

      if (otherUser) {
        // Priorizar nomeCompleto sobre nome para evitar fallbacks incorretos
        const name = otherUser.nomeCompleto || otherUser.nome || otherUser.razaoSocial || otherUser.name || 'Usuário';
        console.log('🏷️ Nome determinado:', name, 'para usuário:', otherUser);
        console.log('📊 Campos disponíveis:', {
          nome: otherUser.nome,
          nomeCompleto: otherUser.nomeCompleto,
          razaoSocial: otherUser.razaoSocial,
          name: otherUser.name
        });

        // Verificar se o nome é válido (não é placeholder)
        if (name && name !== 'Usuário' && name !== 'Usuario' && name.trim() !== '') {
          // Get the other participant ID for presence status
          const otherParticipantId = conversation.participants?.find(p => p !== user?.uid);
          const presenceData = presenceStatus[otherParticipantId];

          return {
            id: conversation.id,
            name: name,
            initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            type: otherUser.tipo || 'cidadao',
            distance: '0m de você',
            online: presenceData?.isOnline || false
          };
        } else {
          console.log('⚠️ Nome ainda é placeholder, tentando buscar novamente...');
          // Forçar uma busca adicional se o nome ainda for placeholder
          const otherUid = conversation.participants?.find(p => p !== user?.uid);
          if (otherUid) {
            // Busca síncrona adicional (isso pode causar re-renders, mas é necessário)
            console.log('🔄 Fazendo busca adicional para:', otherUid);
            // Nota: Em produção, isso deveria ser feito de forma assíncrona
          }
        }
      }
    }

    // 2. Fallback para a lista de contatos
    const fallbackContact = chatContacts.find(c => c.id === selectedChatId) || chatContacts[0];
    console.log('🔄 Usando fallback do contato:', fallbackContact);
    return fallbackContact;
  }, [conversation, chatContacts, selectedChatId, user?.uid]);

  // Função para obter informações do contexto (pedido ou achado/perdido)
  const getContextInfo = () => {
    if (contextType === 'pedido' && pedidoData) {
      return {
        type: pedidoData?.titulo || pedidoData?.category || pedidoData?.description || "Aguardando informações...",
        urgency: pedidoData?.urgency || pedidoData?.urgencia || "medium",
        bairro: pedidoData?.location?.split(',')[0] || pedidoData?.endereco?.bairro || pedidoData?.bairro || "Carregando...",
        distance: pedidoData?.distance || "Calculando...",
        status: deliveryStatus,
        categoria: pedidoData?.category || "Geral",
        descricao: pedidoData?.description || pedidoData?.descricao || "",
        cidade: pedidoData?.city || (pedidoData?.location ? pedidoData.location.split(',')[1]?.split('-')[0]?.trim() : ""),
        contextType: 'pedido',
        title: 'Resumo da Colaboração'
      };
    } else if (contextType === 'achado-perdido' && achadoPerdidoData) {
      return {
        type: achadoPerdidoData?.title || achadoPerdidoData?.description || "Item de Achados e Perdidos",
        urgency: achadoPerdidoData?.type === 'perdido' ? 'high' : 'medium',
        bairro: achadoPerdidoData?.location?.split(',')[0] || achadoPerdidoData?.endereco?.bairro || achadoPerdidoData?.bairro || "Carregando...",
        distance: achadoPerdidoData?.distance || "Calculando...",
        status: achadoPerdidoData?.resolved ? 'resolvido' : (achadoPerdidoData?.status || 'ativo'),
        categoria: achadoPerdidoData?.category || "Objeto",
        descricao: achadoPerdidoData?.description || "",
        cidade: achadoPerdidoData?.city || (achadoPerdidoData?.location ? achadoPerdidoData.location.split(',')[1]?.split('-')[0]?.trim() : ""),
        contextType: 'achado-perdido',
        title: achadoPerdidoData?.type === 'perdido' ? 'Item Perdido' : 'Item Encontrado',
        itemType: achadoPerdidoData?.type || 'perdido'
      };
    }
    
    return {
      type: "Aguardando informações...",
      urgency: "medium",
      bairro: "Carregando...",
      distance: "Calculando...",
      status: deliveryStatus,
      categoria: "Geral",
      descricao: "",
      cidade: "",
      contextType: null,
      title: 'Contexto da Conversa'
    };
  };

  const helpInfo = getContextInfo();

  // Função para limpar dados do chat (para debug)
  const clearChatData = () => {
    localStorage.removeItem('solidar-conversations');
    localStorage.removeItem('solidar-chat-cache');
    setChatContacts([]);
    setConversation(null);
    setMessages([]);
    console.log('Dados do chat limpos!');
  };

  // Função para limpar banco de dados
  const clearDatabase = async () => {
    if (!window.confirm('ATENÇÃO: Isso irá deletar TODAS as conversas e pedidos do banco de dados. Continuar?')) {
      return;
    }
    
    try {
      // Limpar conversas
      await ApiService.request('/admin/clear-conversations', { method: 'DELETE' });
      // Limpar pedidos
      await ApiService.request('/admin/clear-pedidos', { method: 'DELETE' });
      // Limpar mensagens
      await ApiService.request('/admin/clear-messages', { method: 'DELETE' });
      
      alert('Banco de dados limpo com sucesso!');
      clearChatData();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao limpar banco:', error);
      alert('Erro ao limpar banco de dados');
    }
  };

  // Buscar dados do usuário atual do banco de dados
  useEffect(() => {
    const fetchCurrentUserData = async () => {
      if (user?.uid) {
        try {
          const userResponse = await ApiService.getUserData(user.uid);
          if (userResponse.success && userResponse.data) {
            setCurrentUserData({
              name: userResponse.data.nome || userResponse.data.nomeCompleto || userResponse.data.razaoSocial || "Administrador",
              email: userResponse.data.email || "usuario@email.com",
              phone: userResponse.data.telefone || "(11) 00000-0000",
              type: userResponse.data.tipo || "Pessoa Física",
              address: userResponse.data.endereco || "Endereço não informado",
              points: userResponse.data.pontos || 0,
              initials: (userResponse.data.nome || userResponse.data.nomeCompleto || userResponse.data.razaoSocial || "A").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
              joinDate: userResponse.data.createdAt ? new Date(userResponse.data.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Janeiro 2024",
              isVerified: true,
              isSelf: true
            });
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          // Fallback para dados locais
          setCurrentUserData({
            name: user?.nome || "Administrador",
            email: user?.email || "usuario@email.com",
            phone: user?.telefone || "(11) 00000-0000",
            type: user?.tipo || "Pessoa Física",
            address: user?.endereco || "Endereço não informado",
            points: user?.pontos || 0,
            initials: (user?.nome || "A").split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            joinDate: user?.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Janeiro 2024",
            isVerified: true,
            isSelf: true
          });
        }
      }
    };

    fetchCurrentUserData();
  }, [user?.uid]);

  // Adicionar ao useEffect para limpar cache antigo
  useEffect(() => {
    // Limpar cache antigo na inicialização
    clearChatData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Carregar conversas
  const loadConversations = useCallback(async () => {
    try {
      const response = await ApiService.getConversations();
      if (response.success && response.data) {
        const formattedContacts = await Promise.all(response.data.map(async (conv) => {
          // console.log('Processando conversa:', JSON.stringify(conv, null, 2));
          
          // Garantir que sempre temos um nome válido
          let userName = 'Carregando...';
          
          // Tentar múltiplas fontes para o nome
          if (conv.otherParticipant?.nome && conv.otherParticipant.nome.trim()) {
            userName = conv.otherParticipant.nome;
          } else if (conv.otherParticipant?.nomeCompleto && conv.otherParticipant.nomeCompleto.trim()) {
            userName = conv.otherParticipant.nomeCompleto;
          } else if (conv.participantsData?.length > 0) {
            const otherParticipant = conv.participantsData.find(p => p.uid !== user?.uid);
            if (otherParticipant?.nome && otherParticipant.nome.trim()) {
              userName = otherParticipant.nome;
            } else if (otherParticipant?.nomeCompleto && otherParticipant.nomeCompleto.trim()) {
              userName = otherParticipant.nomeCompleto;
            }
          } else if (conv.participants?.length > 0) {
            const otherParticipant = conv.participants.find(p => p.uid !== user?.uid);
            if (otherParticipant?.nome && otherParticipant.nome.trim()) {
              userName = otherParticipant.nome;
            } else if (otherParticipant?.nomeCompleto && otherParticipant.nomeCompleto.trim()) {
              userName = otherParticipant.nomeCompleto;
            }
          }
          
          // Se ainda não encontrou o nome ou é um placeholder, tentar buscar do banco de dados
          if (userName === 'Carregando...' || userName === 'Usuário' || userName === 'Administrador') {
            const participantUid = conv.otherParticipant?.id || conv.otherParticipant?.uid || conv.participants?.find(p => p !== user?.uid);
            
            if (participantUid && participantUid !== user?.uid) {
              try {
                const userResponse = await ApiService.getUserData(participantUid);
                if (userResponse.success && userResponse.data) {
                  // Tentar múltiplas possibilidades de campos de nome
                  userName = userResponse.data.nome ||
                            userResponse.data.nomeCompleto ||
                            userResponse.data.razaoSocial ||
                            userResponse.data.name ||
                            userResponse.data.fullName ||
                            userResponse.data.displayName ||
                            userResponse.data.email ||
                            'Usuário';
                }
              } catch (error) {
                console.error('Erro ao buscar nome do usuário:', error);
              }
            }
          }
          
          // console.log('Nome final para conversa', conv.id, ':', userName);
          
          return {
            id: conv.id,
            name: userName,
            initials: userName !== 'Carregando...' ? 
              userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'CV',
            type: conv.otherParticipant?.tipo || conv.participants?.find(p => p.uid !== user?.uid)?.tipo || 'cidadao',
            distance: '0m de você',
            online: conv.otherParticipant?.online || false,
            lastMessage: conv.lastMessage?.content || 'Nova conversa',
            lastMessageTime: conv.lastMessage?.createdAt?.seconds ? 
              new Date(conv.lastMessage.createdAt.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Agora',
            unreadCount: conv.unreadCount || 0
          };
        }));
        setChatContacts(formattedContacts);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  }, [user?.uid]);

  // Carregar mensagens da conversa
  const loadMessages = useCallback(async () => {
    if (!conversaId) return;
    
    try {
      setLoading(true);
      const conversationResponse = await ApiService.getConversation(conversaId);
      const messagesResponse = await ApiService.getMessages(conversaId);
      
      console.log('Dados da conversa:', JSON.stringify(conversationResponse.data, null, 2));
      
      if (conversationResponse.success) {
        const convData = conversationResponse.data;
        
        if (!convData) {
          console.error('Dados da conversa vazios');
          return;
        }
        console.log('Dados completos da conversa:', JSON.stringify(convData, null, 2));
        console.log('pedidoId:', convData.pedidoId);
        console.log('itemId:', convData.itemId);
        console.log('itemType:', convData.itemType);
        console.log('otherParticipant:', JSON.stringify(convData.otherParticipant, null, 2));
        console.log('participantsData:', JSON.stringify(convData.participantsData, null, 2));
        console.log('user.uid:', user?.uid);
        console.log('participants array:', convData.participants);
        
        // Dados dos participantes já vêm na conversa, não buscar separadamente
        
        // Buscar dados do contexto (pedido ou achado/perdido)
        if (convData.pedidoId) {
          console.log('Buscando dados do pedido:', convData.pedidoId);
          try {
            const pedidoResponse = await ApiService.getPedido(convData.pedidoId);
            console.log('Resposta do pedido:', pedidoResponse);
            if (pedidoResponse.success && pedidoResponse.data) {
              console.log('Dados do pedido carregados:', pedidoResponse.data);
              setPedidoData(pedidoResponse.data);
              setContextType('pedido');
            }
          } catch (error) {
            console.error('Erro ao buscar dados do pedido:', error);
          }
        } else if (convData.itemId && convData.itemType === 'achado_perdido') {
          console.log('Buscando dados do achado/perdido:', convData.itemId);
          console.log('Tipo do item:', convData.itemType);
          try {
            const achadoResponse = await ApiService.getAchadoPerdido(convData.itemId);
            console.log('Resposta do achado/perdido:', achadoResponse);
            if (achadoResponse.success && achadoResponse.data) {
              console.log('Dados do achado/perdido carregados:', achadoResponse.data);
              setAchadoPerdidoData(achadoResponse.data);
              setContextType('achado-perdido');
            } else {
              console.log('Resposta sem dados válidos:', achadoResponse);
            }
          } catch (error) {
            console.error('Erro ao buscar dados do achado/perdido:', error);
          }
        } else {
          console.log('Conversa sem contexto específico');
          console.log('Dados da conversa:', JSON.stringify({
            pedidoId: convData.pedidoId,
            itemId: convData.itemId,
            itemType: convData.itemType,
            participants: convData.participants,
            otherParticipant: convData.otherParticipant,
            participantsData: convData.participantsData
          }, null, 2));
        }
        
        setConversation(convData);

        // Fetch other participant data if name is not available or is "Usuario"
        if (convData.otherParticipant && (!convData.otherParticipant.nome || convData.otherParticipant.nome === 'Usuario')) {
          try {
            const otherUid = convData.participants.find(p => p !== user?.uid);
            if (otherUid) {
              const userResponse = await ApiService.getUser(otherUid);
              if (userResponse.success && userResponse.data) {
                setConversation({ ...convData, otherParticipant: { ...convData.otherParticipant, ...userResponse.data } });
              }
            }
          } catch (error) {
            console.error('Erro ao buscar dados do outro participante:', error);
          }
        }
      }

      if (messagesResponse.success && messagesResponse.data) {
        const formattedMessages = messagesResponse.data.map(msg => ({
          id: msg.id,
          type: msg.type || 'text',
          sender: msg.senderId === user?.uid ? 'sent' : 'received',
          content: msg.content || msg.text,
          timestamp: msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000) : new Date(),
          read: msg.read || false,
          location: msg.metadata?.location,
          metadata: msg.metadata,
          mediaUrl: msg.mediaUrl
        }));
        setMessages(formattedMessages);
      }
      
      // Marcar conversa como lida
      await ApiService.markConversationAsRead(conversaId);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setError('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
      console.log('Estado final do contexto:', JSON.stringify({
        contextType,
        pedidoData: !!pedidoData,
        achadoPerdidoData: !!achadoPerdidoData,
        conversationData: {
          otherParticipant: conversation?.otherParticipant,
          participantsData: conversation?.participantsData
        }
      }, null, 2));
    }
  }, [conversaId, user?.uid]);

  useEffect(() => {
    if (conversaId) {
      ensureDependencies();
      setSelectedChatId(conversaId);
      loadMessages();

      // Iniciar escuta de novas mensagens
      chatNotificationService.startListening(conversaId, (newMessages) => {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));

          if (uniqueNewMessages.length === 0) return prev;

          return [...prev, ...uniqueNewMessages.map(msg => ({
            id: msg.id,
            type: msg.type || 'text',
            sender: msg.senderId === user?.uid ? 'sent' : 'received',
            content: msg.content || msg.text,
            timestamp: msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000) : new Date(),
            read: msg.read || false,
            location: msg.metadata?.location,
            metadata: msg.metadata,
            mediaUrl: msg.mediaUrl
          }))];
        });
      });

      // Iniciar escuta de "digitando..." (Simulação se o serviço não tiver implementado)
      if (chatNotificationService.subscribeToTyping) {
        const unsubscribeTyping = chatNotificationService.subscribeToTyping(conversaId, (isTypingStatus) => {
          setIsTyping(isTypingStatus);
        });
        return () => { unsubscribeTyping && unsubscribeTyping(); };
      }
    }

    loadConversations();

    return () => {
      if (conversaId) {
        chatNotificationService.stopListening(conversaId);
      }
    };
  }, [conversaId, user?.uid, loadConversations, loadMessages]);

  // Socket listeners for presence updates
  useEffect(() => {
    const socket = getSocket();
    if (socket && user?.uid) {
      const handlePresenceUpdate = (data) => {
        console.log('Presence update received:', data);
        setPresenceStatus(prev => ({
          ...prev,
          [data.userId]: {
            isOnline: data.isOnline,
            lastSeen: data.lastSeen
          }
        }));
      };

      const handlePresenceStatus = (data) => {
        console.log('Presence status received:', data);
        setPresenceStatus(prev => ({
          ...prev,
          [data.userId]: {
            isOnline: data.isOnline,
            lastSeen: data.lastSeen
          }
        }));
      };

      socket.on('presence_update', handlePresenceUpdate);
      socket.on('presence_status', handlePresenceStatus);

      // Request presence status for the current contact
      if (conversation && conversation.participants) {
        const otherParticipantId = conversation.participants.find(p => p !== user?.uid);
        if (otherParticipantId) {
          socket.emit('get_presence', otherParticipantId);
        }
      }

      return () => {
        socket.off('presence_update', handlePresenceUpdate);
        socket.off('presence_status', handlePresenceStatus);
      };
    }
  }, [conversation, user?.uid]);

  const handleReactionClick = (msgId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId) {
        const reactions = { ...(msg.reactions || {}) };
        const currentUsers = reactions[emoji] || [];
        const userId = user?.uid || 'me';
        
        if (currentUsers.includes(userId)) {
          reactions[emoji] = currentUsers.filter(id => id !== userId);
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji] = [...currentUsers, userId];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
    setActiveReactionMessageId(null);
  };

  const handleEditClick = (msg) => {
    setEditingMessage(msg);
    setInputValue(msg.content);
    setReplyingTo(null);
    fileInputRef.current?.focus();
  };

  const handleTypingInput = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (conversaId) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      ApiService.sendTypingStatus(conversaId, true).catch(() => {});
      
      typingTimeoutRef.current = setTimeout(() => {
        ApiService.sendTypingStatus(conversaId, false).catch(() => {});
      }, 2000);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || sendingMessage) return;

    // Verificar se a conversa está encerrada
    if (isConversationClosed) {
      alert('Esta conversa foi encerrada e não aceita mais mensagens.');
      return;
    }

    const messageText = inputValue.trim();

    if (editingMessage) {
      try {
        setSendingMessage(true);
        await ApiService.updateMessage(conversaId, editingMessage.id, messageText);
        setMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, content: messageText, edited: true } : m));
        setEditingMessage(null);
        setInputValue("");
      } catch (error) {
        console.error('Erro ao editar mensagem:', error);
        alert('Erro ao editar mensagem.');
      } finally {
        setSendingMessage(false);
      }
      return;
    }

    setInputValue("");
    setSendingMessage(true);

    try {
      ensureDependencies();
      
      const metadata = {};
      if (replyingTo) {
        metadata.replyTo = {
          id: replyingTo.id,
          content: replyingTo.content,
          senderName: replyingTo.sender === 'sent' ? 'Você' : currentContact?.name || 'Usuário'
        };
      }

      const response = await ApiService.sendMessage(conversaId, messageText, 'text', metadata);
      
      if (response.success) {
        const newMessage = {
          id: response.data.id,
          type: "text",
          sender: "sent",
          content: messageText,
          timestamp: new Date(),
          read: false,
          metadata: metadata
        };
        
        setMessages(prev => {
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
        setReplyingTo(null);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      if (error.message && error.message.includes('encerrada')) {
        alert('Esta conversa foi encerrada e não aceita mais mensagens.');
      } else if (error.message && (error.message.includes('createMessageNotification') || error.message.includes('undefined'))) {
        // Se o erro for apenas na notificação, a mensagem provavelmente foi salva.
        // Recarregamos para mostrar ao usuário.
        console.warn('Mensagem salva, mas erro na notificação. Recarregando...');
        setInputValue(""); // Limpa input pois a mensagem foi salva
        loadMessages();
      } else {
        setInputValue(messageText); // Restaurar texto em caso de erro
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFinishDelivery = async () => {
    setShowFinishModal(false);

    try {
      if (helpInfo.contextType === 'achado-perdido' && conversation?.itemId) {
        // Marcar achado/perdido como resolvido
        console.log('Tentando resolver item:', conversation.itemId);
        const response = await ApiService.resolverAchadoPerdido(conversation.itemId);
        console.log('Resposta da API:', response);
        if (response.success) {
          setAchadoPerdidoData(prev => ({ ...prev, resolved: true, status: 'resolvido' }));
        } else {
          throw new Error(response.error || 'Erro ao resolver item');
        }
      } else if (helpInfo.contextType === 'pedido' && conversation?.pedidoId) {
        // O usuário que clica em "Finalizar Ajuda" é quem deve ter o contador incrementado
        // Este é sempre o solicitante (criador do pedido)
        const usuarioQueFinaliza = user?.uid;

        console.log('Finalizando ajuda - Pedido ID:', conversation.pedidoId, 'Usuário que finaliza:', usuarioQueFinaliza);

        // Finalizar ajuda - incrementar contador do usuário que finaliza e remover pedido
        const response = await ApiService.finalizarAjuda(conversation.pedidoId, usuarioQueFinaliza);
        if (response.success) {
          setDeliveryStatus("entregue");
        } else {
          throw new Error(response.error || 'Erro ao finalizar ajuda');
        }
      } else {
        // Fallback para casos sem contexto específico
        setDeliveryStatus("entregue");
      }

      // Encerrar a conversa automaticamente
      await ApiService.closeConversation(conversaId);

      setShowConfirmation(true);

      // Redirecionar para página de conversas após 3 segundos
      setTimeout(() => {
        setShowConfirmation(false);
        window.location.href = '/conversas'; // Force full reload to show updated conversation status
      }, 3000);
    } catch (error) {
      console.error('Erro ao finalizar:', error);
      const errorMessage = error.message || 'Erro desconhecido';
      alert(`Erro ao finalizar: ${errorMessage}`);
    }
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          ensureDependencies();
          const locationData = {
            lat: latitude,
            lng: longitude,
            name: "Minha Localização",
            address: "Compartilhada em tempo real",
          };
          
          const response = await ApiService.sendMessage(
            conversaId, 
            "📍 Localização compartilhada", 
            "location", 
            { location: locationData }
          );
          
          if (response.success) {
            const newMessage = {
              id: response.data.id,
              type: "location",
              sender: "sent",
              content: "",
              timestamp: new Date(),
              read: false,
              location: locationData,
            };
            
            setMessages(prev => {
              if (prev.some(m => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
          }
        } catch (error) {
          console.error("Erro ao enviar localização:", error);
          if (error.message && (error.message.includes('createMessageNotification') || error.message.includes('undefined'))) {
            console.warn('Localização salva, mas erro na notificação. Recarregando...');
            loadMessages();
          } else {
            alert("Erro ao compartilhar localização. Tente novamente.");
          }
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        alert("Não foi possível obter sua localização. Verifique as permissões.");
        setIsGettingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      alert("Apenas imagens e vídeos são permitidos.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("O arquivo deve ter no máximo 10MB.");
      return;
    }

    setIsUploading(true);

    try {
      ensureDependencies();
      // Simulação de URL local para preview imediato
      const mediaUrl = URL.createObjectURL(file);
      const type = isImage ? 'image' : 'video';
      const content = isImage ? '📷 Imagem' : '🎥 Vídeo';

      // Envia a mensagem com metadados de mídia
      // Nota: Em produção, você faria o upload do arquivo primeiro e enviaria a URL retornada
      const response = await ApiService.sendMessage(conversaId, content, type, { mediaUrl });

      if (response.success) {
        // A mensagem será adicionada via listener ou reload, mas podemos otimizar adicionando localmente se necessário
      }
    } catch (error) {
      console.error("Erro ao enviar mídia:", error);
      if (error.message && (error.message.includes('createMessageNotification') || error.message.includes('undefined'))) {
        console.warn('Mídia salva, mas erro na notificação. Recarregando...');
        loadMessages();
      } else {
        alert("Erro ao enviar arquivo.");
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleNotificationClick = (notification) => {
    // Marcar como lida
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Se for notificação de chat, navegar para a conversa
    if (notification.type === 'chat' && notification.conversationId) {
      navigate(`/chat/${notification.conversationId}`);
      setShowNotifications(false);
    }
  };

  const handleAvatarClick = (isSender) => {
    if (isSender) {
      setViewingProfile(currentUserData);
    } else {
      const otherUser = conversation?.participantsData?.find(p => p.uid !== user?.uid) || conversation?.otherParticipant;
      const userName = otherUser?.nome || otherUser?.nomeCompleto || currentContact?.name || "Carregando...";

      setViewingProfile({
        name: userName,
        email: otherUser?.email || "Informação privada",
        phone: otherUser?.telefone || "Informação privada",
        type: currentContact?.type === 'doador' ? 'Doador' : 'Beneficiário',
        address: otherUser?.endereco || "Localização não informada",
        points: otherUser?.pontos || 0,
        initials: userName !== "Carregando..." ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "CV",
        joinDate: otherUser?.createdAt ? new Date(otherUser.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Recente",
        isVerified: currentContact?.type === 'doador',
        isSelf: false
      });
    }
  };

  return (
    <div className="chat-page-wrapper chat-page-isolated">
      <div className="chat-layout">
        {/* Sidebar */}
        <aside className={`chat-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header" style={{ background: 'linear-gradient(to bottom, #ffffff, #f8fafc)', borderBottom: '1px solid #e2e8f0' }}>
            <div className="sidebar-title-row">
              <h2>Conversas</h2>
              <button className="icon-btn" title="Nova conversa">
                <Heart size={20} />
              </button>
            </div>
            <div className="search-bar-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar vizinhos..." 
                className="search-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="contacts-list">
            {sortedContacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`contact-item ${selectedChatId === contact.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedChatId(contact.id);
                  setChatContacts(prev => prev.map(c => 
                    c.id === contact.id ? { ...c, unreadCount: 0 } : c
                  ));
                  navigate(`/chat/${contact.id}`);
                }}
              >
                <div className="avatar-wrapper">
                  <div className={`contact-avatar ${contact.type}`}>
                    {contact.initials}
                  </div>
                  {pinnedConversations.includes(contact.id) && (
                    <div style={{ position: 'absolute', top: -4, left: -4, background: '#fff', borderRadius: '50%', padding: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><Pin size={12} fill="#64748b" color="#64748b" /></div>
                  )}
                  {contact.online && <span className="online-status-dot" />}
                </div>
                <div className="contact-meta">
                  <div className="contact-name-row">
                    <span className="contact-name">{contact.name === 'Carregando...' || !contact.name ? 'Usuário' : contact.name}</span>
                    <span className="last-time">{contact.lastMessageTime}</span>
                  </div>
                  <div className="contact-preview-row">
                    <p className="last-message">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && selectedChatId !== contact.id && (
                      <span className="unread-count-badge">{contact.unreadCount}</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={(e) => handlePinConversation(e, contact.id)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: pinnedConversations.includes(contact.id) ? '#10b981' : '#94a3b8', padding: 4, alignSelf: 'center', opacity: 1 }}
                  title={pinnedConversations.includes(contact.id) ? "Desafixar conversa" : "Fixar conversa"}
                >
                  {pinnedConversations.includes(contact.id) ? <PinOff size={16} /> : <Pin size={16} />}
                </button>
              </div>
            ))}
          </div>
          
          <div className="sidebar-footer">
             <button className="home-btn" onClick={() => navigate('/')} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', background: '#f1f5f9', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '0.75rem'}}>
               <Home size={18} />
               <span>Voltar para Home</span>
             </button>
             <button className="conversations-btn" onClick={() => navigate('/conversas')} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', background: '#f1f5f9', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '0.75rem'}}>
               <MessageSquare size={18} />
               <span>Voltar para Conversas</span>
             </button>
             <div className="mini-profile" onClick={() => setViewingProfile(currentUserData)}>
               <div className="mini-avatar">EU</div>
               <div className="mini-info">
                 <span className="mini-name">Seu Perfil</span>
                 <span className="mini-status">Disponível</span>
               </div>
             </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="chat-main-content">
          {/* Header */}
          <header className="chat-header-bar">
            <div className="header-left-group">
              <button className="mobile-back-btn" onClick={() => navigate('/conversas')}>
                <ArrowLeft size={24} />
              </button>
              <div className="current-user-info">
                <div className="header-avatar">
                  {currentContact?.initials || 'CV'}
                  {currentContact?.online && <span className="online-indicator" />}
                </div>
                <div className="header-text-details">
                  <div className="header-name-row">
                    <h3>{currentContact?.name || 'Usuário'}</h3>
                    <span className={`role-badge ${currentContact?.type || 'cidadao'}`}>
                      {currentContact?.type === 'doador' ? 'Doador' : currentContact?.type === 'ong' ? 'ONG' : 'Cidadão'}
                    </span>
                  </div>
                  <div className="header-status-pills">
                    <span className="status-pill distance">
                      <MapPin size={12} />
                      {currentContact?.distance || '0m de você'}
                    </span>
                    <span className={`status-pill state ${currentContact?.online ? 'online' : 'offline'}`}>
                      <span className="pulse-dot" />
                      {currentContact?.online ? 'Ativo Agora' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="header-right-group">
              <div className="quick-actions-desktop">
                <div className="notification-wrapper">
                  <button
                    className="notification-btn"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="notification-header">
                        <h3>Notificações</h3>
                        {notifications.length > 0 && (
                          <div className="notification-actions">
                            {unreadCount > 0 && (
                              <button
                                className="action-btn mark-read-btn"
                                onClick={markAllAsRead}
                                title="Marcar todas como lidas"
                              >
                                ✓
                              </button>
                            )}
                            <button
                              className="action-btn clear-btn"
                              onClick={clearNotifications}
                              title="Limpar todas"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="notification-list">
                        {notifications.length === 0 ? (
                          <div className="no-notifications">
                            Nenhuma notificação ainda
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type === 'chat' ? 'chat-notification' : ''}`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="notification-content">
                                <div className="notification-icon">
                                  {notification.type === 'chat' ? '💬' : '🔔'}
                                </div>
                                <div className="notification-text">
                                  <p className="notification-title">{notification.title}</p>
                                  <p className="notification-message">{notification.message}</p>
                                  <span className="notification-time">
                                    {new Date(notification.timestamp).toLocaleString('pt-BR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                              {!notification.read && <div className="unread-dot"></div>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className={`header-action-btn ${showMsgSearch ? 'active' : ''}`}
                  onClick={() => setShowMsgSearch(!showMsgSearch)}
                  title="Buscar na conversa"
                >
                  <Search size={20} />
                </button>
                <button
                  className="header-action-btn danger"
                  onClick={() => setShowReportModal(true)}
                  title="Denunciar ou Bloquear"
                >
                  <AlertTriangle size={20} />
                </button>
                <button className="header-action-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className="connection-banner">
            <ShieldCheck size={16} />
            <span>Conexão segura SolidarBairro • Dados protegidos</span>
          </div>

          {showMsgSearch && (
            <div className="msg-search-bar" style={{ padding: '12px 24px', borderBottom: '1px solid #f1f5f9', background: 'white', display: 'flex', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.2s ease-out' }}>
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Buscar mensagem..."
                value={msgSearchTerm}
                onChange={(e) => setMsgSearchTerm(e.target.value)}
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', color: '#1e293b' }}
                autoFocus
              />
              {msgSearchTerm && (
                <button onClick={() => setMsgSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                  <X size={16} />
                </button>
              )}
              <button onClick={() => { setShowMsgSearch(false); setMsgSearchTerm(''); }} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                Fechar
              </button>
            </div>
          )}

          <div className="chat-content-scroll">
            {/* Context Info Card */}
            {(contextType === 'pedido' || contextType === 'achado-perdido') && (
              <div className="chat-context-card">
                <div className="card-left-section">
                  <div className="card-icon-box">
                    {helpInfo.contextType === 'achado-perdido' ? (
                      helpInfo.itemType === 'perdido' ? (
                        <Search size={24} />
                      ) : (
                        <Package size={24} />
                      )
                    ) : (
                      <Package size={24} />
                    )}
                  </div>
                  <div className="card-info-text">
                    <h4>{helpInfo.title}</h4>
                    <p className="help-title">{helpInfo.type}</p>
                    {helpInfo.descricao && (
                      <p className="help-description">{helpInfo.descricao}</p>
                    )}
                    <div className="help-tags">
                      {helpInfo.contextType === 'achado-perdido' ? (
                        <>
                          <span className={`type-pill ${helpInfo.itemType}`}>
                            {helpInfo.itemType === 'perdido' ? '🔍 Perdido' : '📦 Encontrado'}
                          </span>
                          <span className={`status-pill ${helpInfo.status}`}>
                            {helpInfo.status === 'resolvido' ? '✅ Resolvido' : '🔄 Ativo'}
                          </span>
                        </>
                      ) : (
                        <span className={`urgency-pill ${helpInfo.urgency}`}>
                          Urgência {helpInfo.urgency === "high" ? "Alta" : helpInfo.urgency === "medium" ? "Média" : "Baixa"}
                        </span>
                      )}
                      <span className="neighborhood-pill">
                        {helpInfo.bairro}{helpInfo.cidade && `, ${helpInfo.cidade}`}
                      </span>
                      {helpInfo.categoria && helpInfo.categoria !== "Geral" && (
                        <span className="category-pill">
                          {helpInfo.categoria}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {helpInfo.contextType === 'pedido' && (
                  <div className="card-middle-section">
                    <div className="status-progress-bar">
                      <div className={`status-step ${['aguardando', 'andamento', 'entregue'].includes(deliveryStatus) ? 'completed' : ''}`}>
                        <div className="step-dot" onClick={() => setDeliveryStatus("aguardando")}>1</div>
                        <span className="step-label">Pendente</span>
                      </div>
                      <div className="progress-line" />
                      <div className={`status-step ${['andamento', 'entregue'].includes(deliveryStatus) ? 'completed' : ''}`}>
                        <div className="step-dot" onClick={() => setDeliveryStatus("andamento")}>2</div>
                        <span className="step-label">Em curso</span>
                      </div>
                      <div className="progress-line" />
                      <div className={`status-step ${deliveryStatus === "entregue" ? 'completed' : ''}`}>
                        <div className="step-dot" onClick={() => setDeliveryStatus("entregue")}>3</div>
                        <span className="step-label">Concluído</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="card-right-section">
                  {helpInfo.contextType === 'pedido' ? (
                    deliveryStatus === "andamento" && user?.uid === pedidoData?.userId ? (
                      <button
                        className="finish-collaboration-btn"
                        onClick={() => setShowFinishModal(true)}
                      >
                        <Heart size={16} fill="white" />
                        Finalizar Ajuda
                      </button>
                    ) : (
                      <button className="details-btn">
                        Detalhes <ChevronRight size={16} />
                      </button>
                    )
                  ) : (
                    <button
                      className={`resolve-btn ${helpInfo.status === 'resolvido' ? 'resolved' : ''}`}
                      onClick={() => {
                        if (helpInfo.status !== 'resolvido') {
                          // Lógica para marcar como resolvido
                          setShowFinishModal(true);
                        }
                      }}
                      disabled={helpInfo.status === 'resolvido'}
                    >
                      {helpInfo.status === 'resolvido' ? (
                        <>✅ Resolvido</>
                      ) : (
                        <>🔄 Marcar como Resolvido</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Messages Feed */}
            <div className="messages-container">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: '#64748b', gap: '10px' }}>
                  <div className="mini-loader" />
                  <span>Carregando conversa...</span>
                </div>
              ) : (
              <>
              {!msgSearchTerm && (
                <div className="date-separator">
                  <span>Hoje</span>
                </div>
              )}

              {displayedMessages.map((msg) => {
                if (msg.type === "system") {
                  const isSuccess = msg.content?.includes("confirmado") || msg.content?.includes("sucesso") || msg.content?.includes("resolvido") || msg.content?.includes("encerrada");
                  const isSecurity = msg.content?.includes("seguro") || msg.content?.includes("ambiente");

                  return (
                    <div key={msg.id} className="msg-row system">
                      <div className={`system-bubble ${isSuccess ? 'success' : ''} ${isSecurity ? 'security' : ''}`}>
                        {isSuccess && <Package size={14} />}
                        {isSecurity && <ShieldCheck size={14} />}
                        {!isSuccess && !isSecurity && <ShieldCheck size={14} />}
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                const isSent = msg.sender === 'sent';
                const hasReply = msg.metadata?.replyTo;
                const canEdit = isSent && (new Date() - new Date(msg.timestamp)) < 15 * 60 * 1000 && !isConversationClosed;
                let bubbleContent;

                if (msg.type === "location") {
                  const { lat, lng } = msg.location || { lat: -23.5505, lng: -46.6333 };
                  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.005}%2C${lng + 0.005}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`;

                  bubbleContent = (
                    <div className="msg-bubble location-bubble">
                      <div className="location-map-preview">
                        <iframe
                          title="Localização"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          marginHeight={0}
                          marginWidth={0}
                          src={mapUrl}
                          style={{ border: 0 }}
                        />
                      </div>
                      <div className="location-details">
                        <h5>{msg.location?.name}</h5>
                        <p>{msg.location?.address}</p>
                      </div>
                    </div>
                  );
                } else if (msg.type === "image") {
                  bubbleContent = (
                    <div className="msg-bubble media-bubble">
                      <img 
                        src={msg.metadata?.mediaUrl || msg.mediaUrl || msg.content} 
                        alt="Imagem enviada" 
                        className="msg-media-img" 
                        onClick={() => {
                          setSelectedImage(msg.metadata?.mediaUrl || msg.mediaUrl || msg.content);
                          setZoomLevel(1);
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  );
                } else if (msg.type === "video") {
                  bubbleContent = (
                    <div className="msg-bubble media-bubble">
                      <video src={msg.metadata?.mediaUrl || msg.mediaUrl || msg.content} controls className="msg-media-video" />
                    </div>
                  );
                } else {
                  bubbleContent = (
                    <div className="msg-bubble text-bubble">
                      {hasReply && (
                        <div className="reply-quote">
                          <span className="reply-quote-sender">{hasReply.senderName === 'Você' ? (currentUserData?.name || user?.nome || 'Administrador').length > 15 ? (currentUserData?.name || user?.nome || 'Administrador').substring(0, 15) + '...' : (currentUserData?.name || user?.nome || 'Administrador') : hasReply.senderName}</span>
                          <p className="reply-quote-text">{hasReply.content}</p>
                        </div>
                      )}
                      {msg.content}
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`msg-row ${isSent ? 'sent' : 'received'}`}>
                    {!isSent && (
                      <div className="msg-sender-avatar" onClick={() => handleAvatarClick(false)}>
                        {currentContact?.initials || 'U'}
                      </div>
                    )}
                    {!isSent && (
                    <div className="msg-wrapper">
                      {bubbleContent}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="reactions-display">
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <div key={emoji} className={`reaction-pill ${users.includes(user?.uid || 'me') ? 'active' : ''}`} onClick={() => handleReactionClick(msg.id, emoji)}>
                              {emoji} <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{users.length}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="msg-metadata">
                        {msg.edited && <span className="edited-label">(editado)</span>}
                        <span className="msg-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                    )}

                    {!isSent && !isConversationClosed && (
                      <div className="msg-actions">
                        <button className="msg-action-btn" onClick={() => setReplyingTo(msg)} title="Responder">
                          <Reply size={16} />
                        </button>
                        <div style={{ position: 'relative' }}>
                          <button className="msg-action-btn" onClick={() => setActiveReactionMessageId(activeReactionMessageId === msg.id ? null : msg.id)} title="Reagir">
                            <Smile size={16} />
                          </button>
                          {activeReactionMessageId === msg.id && (
                            <div style={{ position: 'absolute', bottom: '100%', left: 0, background: 'white', padding: '8px', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: '8px', zIndex: 10, marginBottom: '8px' }}>
                              {REACTION_OPTIONS.map(emoji => (
                                <button key={emoji} onClick={() => handleReactionClick(msg.id, emoji)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: 0 }}>{emoji}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {isSent && (
                      <>
                      {!isConversationClosed && (
                      <div className="msg-actions">
                        <div style={{ position: 'relative' }}>
                          <button className="msg-action-btn" onClick={() => setActiveReactionMessageId(activeReactionMessageId === msg.id ? null : msg.id)} title="Reagir">
                            <Smile size={16} />
                          </button>
                          {activeReactionMessageId === msg.id && (
                            <div style={{ position: 'absolute', bottom: '100%', right: 0, background: 'white', padding: '8px', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: '8px', zIndex: 10, marginBottom: '8px' }}>
                              {REACTION_OPTIONS.map(emoji => (
                                <button key={emoji} onClick={() => handleReactionClick(msg.id, emoji)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', padding: 0 }}>{emoji}</button>
                              ))}
                            </div>
                          )}
                        </div>
                        {canEdit && (
                          <button className="msg-action-btn" onClick={() => handleEditClick(msg)} title="Editar">
                            <Pencil size={16} />
                          </button>
                        )}
                        <button className="msg-action-btn" onClick={() => setReplyingTo(msg)} title="Responder">
                          <Reply size={16} />
                        </button>
                      </div>
                      )}
                      <div className="msg-wrapper">
                        {bubbleContent}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className="reactions-display">
                            {Object.entries(msg.reactions).map(([emoji, users]) => (
                              <div key={emoji} className={`reaction-pill ${users.includes(user?.uid || 'me') ? 'active' : ''}`} onClick={() => handleReactionClick(msg.id, emoji)}>
                                {emoji} <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{users.length}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="msg-metadata">
                          {msg.edited && <span className="edited-label">(editado)</span>}
                          <span className="msg-time">{formatTime(msg.timestamp)}</span>
                          <span className="msg-status">
                            {msg.read ? <CheckCheck size={14} className="read" /> : <Check size={14} />}
                          </span>
                        </div>
                      </div>
                      <div className="msg-sender-avatar self" onClick={() => handleAvatarClick(true)}>
                        {currentUserData?.initials || 'EU'}
                      </div>
                      </>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="msg-row received">
                  <div className="msg-bubble typing-bubble">
                    <div className="typing-dots">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                    <span className="typing-text">Digitando...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
              </>
              )}
            </div>
          </div>

          {/* Input Footer */}
          <footer className="chat-input-footer">
            {isConversationClosed ? (
              <div className="conversation-closed-banner">
                <div className="closed-icon">
                  <ShieldCheck size={20} />
                </div>
                <div className="closed-text">
                  <span className="closed-title">Conversa Encerrada</span>
                  <span className="closed-subtitle">Esta conversa foi finalizada após a conclusão da ajuda</span>
                </div>
              </div>
            ) : (
              <div className="input-container">
                {editingMessage && (
                  <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, padding: '0 20px' }}>
                    <div className="reply-preview-bar" style={{ borderLeftColor: '#3b82f6' }}>
                      <div className="reply-info">
                        <span className="reply-sender" style={{ color: '#3b82f6' }}>Editando mensagem</span>
                        <p className="reply-text">{editingMessage.content}</p>
                      </div>
                      <button onClick={() => { setEditingMessage(null); setInputValue(''); }} className="close-reply-btn"><X size={18} /></button>
                    </div>
                  </div>
                )}
                {replyingTo && (
                  <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, padding: '0 20px' }}>
                    <div className="reply-preview-bar">
                      <div className="reply-info">
                        <span className="reply-sender">Respondendo a {replyingTo.sender === 'sent' ? 'Você' : currentContact?.name}</span>
                        <p className="reply-text">{replyingTo.content}</p>
                      </div>
                      <button onClick={() => setReplyingTo(null)} className="close-reply-btn"><X size={18} /></button>
                    </div>
                  </div>
                )}
                <div className="input-actions-left">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*,video/*" 
                    onChange={handleFileSelect}
                  />
                  <button className="action-icon-btn" title="Anexar foto ou vídeo" onClick={handleAttachmentClick} disabled={isUploading}>
                    {isUploading ? <div className="mini-loader" /> : <Paperclip size={20} />}
                  </button>
                  <button 
                    className={`action-icon-btn ${isGettingLocation ? 'loading' : ''}`} 
                    title="Enviar Localização"
                    onClick={handleSendLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <div className="mini-loader" />
                    ) : (
                      <MapPin size={20} />
                    )}
                  </button>
                </div>
                <div className="textarea-wrapper">
                  <textarea
                    className="chat-textarea"
                    placeholder="Digite sua mensagem..."
                    value={inputValue}
                    onChange={handleTypingInput}
                    onKeyDown={handleKeyPress}
                    rows={1}
                  />
                </div>
                <button
                  className={`send-msg-btn ${inputValue.trim() && !sendingMessage ? 'active' : ''}`}
                  onClick={handleSend}
                  disabled={!inputValue.trim() || sendingMessage}
                >
                  {sendingMessage ? (
                    <div className="mini-loader" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
            )}
          </footer>
        </main>
      </div>

      {/* Modals */}
      {showReportModal && (
        <div className="modal-backdrop" onClick={() => setShowReportModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-circle danger">
                <AlertTriangle size={24} />
              </div>
              <h3>Segurança e Denúncia</h3>
            </div>
            <div className="modal-body">
              <p>O que aconteceu? Sua segurança é nossa prioridade.</p>
              <div className="modal-choices">
                <button className="choice-btn">
                  Denunciar comportamento inadequado
                </button>
                <button className="choice-btn danger">
                  Bloquear este vizinho
                </button>
                <button className="choice-btn">
                  Solicitar ajuda da moderação
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-ghost"
                onClick={() => setShowReportModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinishModal && (
        <div className="modal-backdrop" onClick={() => setShowFinishModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-circle success">
                <Heart size={24} fill="white" />
              </div>
              <h3>
                {helpInfo.contextType === 'achado-perdido' 
                  ? 'Marcar como Resolvido' 
                  : 'Finalizar Doação'
                }
              </h3>
            </div>
            <div className="modal-body">
              <p>
                {helpInfo.contextType === 'achado-perdido'
                  ? helpInfo.itemType === 'perdido'
                    ? 'Você encontrou o item perdido ou ele foi devolvido ao dono?'
                    : 'O item encontrado foi entregue ao dono ou às autoridades?'
                  : 'Você confirma que a entrega foi realizada com sucesso?'
                }
              </p>
              <p className="modal-subtext">
                {helpInfo.contextType === 'achado-perdido'
                  ? 'Isso marcará o item como resolvido e encerrará as buscas.'
                  : 'Isso conclui este ciclo de solidariedade no seu bairro.'
                }
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-ghost"
                onClick={() => setShowFinishModal(false)}
              >
                Ainda não
              </button>
              <button className="btn-solid-success" onClick={handleFinishDelivery}>
                {helpInfo.contextType === 'achado-perdido' ? 'Sim, resolvido!' : 'Sim, concluído!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingProfile && (
        <div className="modal-backdrop" onClick={() => setViewingProfile(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button 
                className="close-modal-btn" 
                onClick={() => setViewingProfile(null)}
                style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', zIndex: 10 }}
              >
                <MoreVertical size={16} />
              </button>
              <div className="profile-main-info">
                <div className="profile-large-avatar">{viewingProfile.initials}</div>
                <h3>{viewingProfile.name}</h3>
                <div className="profile-badge-row">
                  <div className="points-badge">
                    <Star size={14} fill="currentColor" />
                    {viewingProfile.points} Pontos Solidários
                  </div>
                  {viewingProfile.isVerified && (
                    <div className="points-badge" style={{ background: '#dcfce7', color: '#166534' }}>
                      <ShieldCheck size={14} />
                      Verificado
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-body profile-modal-content">
              <div className="profile-details-grid">
                <div className="detail-item">
                  <div className="detail-icon-box">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Membro desde</span>
                    <span className="detail-value">{viewingProfile.joinDate}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon-box">
                    <Mail size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Email de Contato</span>
                    <span className="detail-value">{viewingProfile.email}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon-box">
                    <Phone size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Telefone / WhatsApp</span>
                    <span className="detail-value">{viewingProfile.phone}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon-box">
                    <User size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Tipo de Conta</span>
                    <span className="detail-value">{viewingProfile.type}</span>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon-box">
                    <MapPin size={20} />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">Endereço Principal</span>
                    <span className="detail-value">{viewingProfile.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
              {!viewingProfile.isSelf && (
                <button 
                  className="btn-ghost danger" 
                  onClick={() => {
                    setViewingProfile(null);
                    setShowReportModal(true);
                  }}
                >
                  Bloquear
                </button>
              )}
              <button className="btn-solid-success" style={{ flex: 1, padding: '1rem', borderRadius: '1rem', fontSize: '1rem' }} onClick={() => setViewingProfile(null)}>
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="modal-backdrop confirmation-overlay">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                position: 'absolute',
                top: '-10%',
                left: `${Math.random() * 100}%`,
                background: ["#ffd700", "#ffffff", "#10b981", "#fbbf24", "#38bdf8"][Math.floor(Math.random() * 5)],
                width: Math.random() * 8 + 4 + 'px',
                height: Math.random() * 8 + 4 + 'px',
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animation: `confetti-fall ${Math.random() * 2 + 2}s linear infinite`
              }}
            />
          ))}

          <div className="success-announcement">
            <div className="success-icon-ring">
              <Check size={64} strokeWidth={4} />
            </div>
            
            <h2>
              {helpInfo.contextType === 'achado-perdido' 
                ? 'Item Resolvido!' 
                : 'Solidariedade Concluída!'
              }
            </h2>
            
            <p>
              {helpInfo.contextType === 'achado-perdido'
                ? helpInfo.itemType === 'perdido'
                  ? 'Item perdido foi encontrado e devolvido! 🎉'
                  : 'Item encontrado foi entregue ao dono! 🎉'
                : 'Mais um vizinho ajudado com sucesso. ❤️'
              }
            </p>

            <div className="reward-badge">
              <Star className="star-icon" size={20} fill="currentColor" />
              <span>+10 Pontos de Impacto Social</span>
              <Sparkles size={16} className="text-yellow-300" />
            </div>
          </div>
        </div>
      )}

      {/* Image Modal Desktop */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-controls">
              <button onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.25))} title="Diminuir Zoom"><ZoomOut size={20}/></button>
              <button onClick={() => setZoomLevel(z => Math.min(4, z + 0.25))} title="Aumentar Zoom"><ZoomIn size={20}/></button>
              <button onClick={() => setSelectedImage(null)} title="Fechar"><X size={20}/></button>
            </div>
            <div className="image-viewport" style={{ overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <img 
                src={selectedImage} 
                alt="Visualização em tela cheia"
                style={{ 
                  transform: `scale(${zoomLevel})`, 
                  transition: 'transform 0.2s ease-out', 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain' 
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
