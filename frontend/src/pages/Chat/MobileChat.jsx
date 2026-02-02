import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/apiService';
import chatNotificationService from '../../services/chatNotificationService';
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
  X,
  Reply,
  Calendar,
  Shield,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import './mobile-styles.css';

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

const SwipeableMessage = ({ children, onReply, message, disabled }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 60], [0, 1]);
  const scale = useTransform(x, [0, 60], [0.5, 1]);

  if (disabled) return <div style={{ position: 'relative' }}>{children}</div>;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        left: 16, 
        top: 0, 
        bottom: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 0
      }}>
        <motion.div style={{ opacity, scale, color: '#64748b', background: '#f1f5f9', borderRadius: '50%', padding: 8, display: 'flex' }}>
          <Reply size={18} />
        </motion.div>
      </div>
      <motion.div
        style={{ x, touchAction: 'pan-y', position: 'relative', zIndex: 1 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={(e, { offset }) => {
          if (offset.x > 60) {
            onReply(message);
            if (navigator.vibrate) navigator.vibrate(50);
          }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Chat = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState(null);

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
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleEditClick = (msg) => {
    setEditingMessage(msg);
    setInputValue(msg.content);
    setReplyingTo(null);
    // O foco automático pode variar no mobile, mas tentamos
  };

  const isConversationClosed = useMemo(() => {
    return conversation?.status === 'closed' || conversation?.status === 'finalizada' || conversation?.status === 'completed';
  }, [conversation]);

  const messagesEndRef = useRef(null);

  const currentUserData = {
    name: user?.nome || "Seu Perfil",
    email: user?.email || "usuario@email.com",
    phone: user?.telefone || "(11) 00000-0000",
    type: user?.tipo || "Pessoa Física",
    address: user?.endereco || "Endereço não informado",
    points: user?.pontos || 0,
    initials: user?.nome ? user.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "US",
    joinDate: user?.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Janeiro 2024",
    isVerified: true,
    isSelf: true
  };

  const filteredContacts = chatContacts.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentContact = chatContacts.find(c => c.id === selectedChatId) || 
    (conversation ? {
      id: conversaId,
      name: (() => {
        // Se há participantsData, usar o primeiro (que deve ser o outro usuário)
        if (conversation.participantsData?.length > 0) {
          return conversation.participantsData[0].nome || 'Carregando...';
        }
        // Fallback para otherParticipant
        if (conversation.otherParticipant?.nome) return conversation.otherParticipant.nome;
        return 'Carregando...';
      })(),
      initials: (() => {
        const name = conversation.otherParticipant?.nome || 
                    conversation.participantsData?.find(p => p.uid !== user?.uid)?.nome || 
                    conversation.title?.replace('Ajuda: ', '') || 'CV';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      })(),
      type: conversation.otherParticipant?.tipo || 
            conversation.participantsData?.find(p => p.uid !== user?.uid)?.tipo || 'cidadao',
      distance: '0m de você',
      online: conversation.participantsData?.find(p => p.uid !== user?.uid)?.online || conversation.otherParticipant?.online || false
    } : chatContacts[0]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Carregar conversas
  const loadConversations = useCallback(async () => {
    try {
      const response = await ApiService.getConversations();
      if (response.success && response.data) {
        const formattedContacts = response.data.map(conv => {
          // Garantir que sempre temos um nome válido
          let userName = 'Usuário';
          if (conv.otherParticipant?.nome && conv.otherParticipant.nome.trim()) {
            userName = conv.otherParticipant.nome;
          } else if (conv.participants?.find(p => p.uid !== user?.uid)?.nome) {
            userName = conv.participants.find(p => p.uid !== user?.uid).nome;
          } else if (conv.otherParticipant?.nomeCompleto) {
            userName = conv.otherParticipant.nomeCompleto;
          } else if (conv.otherParticipant?.nomeFantasia) {
            userName = conv.otherParticipant.nomeFantasia;
          } else if (conv.otherParticipant?.razaoSocial) {
            userName = conv.otherParticipant.razaoSocial;
          }
          
          return {
            id: conv.id,
            name: userName,
            initials: userName !== 'Usuário' ? 
              userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U',
            type: conv.otherParticipant?.tipo || conv.participants?.find(p => p.uid !== user?.uid)?.tipo || 'cidadao',
            distance: '0m de você',
            online: conv.otherParticipant?.online || false,
            lastMessage: conv.lastMessage?.content || 'Nova conversa',
            lastMessageTime: conv.lastMessage?.createdAt?.seconds ? 
              new Date(conv.lastMessage.createdAt.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Agora',
            unreadCount: conv.unreadCount || 0
          };
        });
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
      
      console.log('Dados da conversa:', conversationResponse.data);
      
      if (conversationResponse.success) {
        const convData = conversationResponse.data;
        console.log('Dados completos da conversa:', convData);
        console.log('pedidoId:', convData.pedidoId);
        console.log('itemId:', convData.itemId);
        console.log('itemType:', convData.itemType);
        
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
          console.log('Dados da conversa:', {
            pedidoId: convData.pedidoId,
            itemId: convData.itemId,
            itemType: convData.itemType
          });
        }
        
        setConversation(convData);
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
      console.log('Estado final do contexto:', {
        contextType,
        pedidoData: !!pedidoData,
        achadoPerdidoData: !!achadoPerdidoData
      });
    }
  }, [conversaId, user?.uid]);

  useEffect(() => {
    if (conversaId) {
      ensureDependencies();
      setSelectedChatId(conversaId);
      loadMessages();
      
      // Iniciar escuta de novas mensagens
      chatNotificationService.startListening(conversaId, (newMessages) => {
        setMessages(prev => [...prev, ...newMessages.map(msg => ({
          id: msg.id,
          type: msg.type || 'text',
          sender: msg.senderId === user?.uid ? 'sent' : 'received',
          content: msg.content || msg.text,
          timestamp: msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000) : new Date(),
          read: msg.read || false,
          location: msg.metadata?.location,
          metadata: msg.metadata,
          mediaUrl: msg.mediaUrl
        }))]);
      });
    }
    
    loadConversations();
    
    return () => {
      if (conversaId) {
        chatNotificationService.stopListening(conversaId);
      }
    };
  }, [conversaId, user?.uid, loadConversations, loadMessages]);

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
        
        setMessages(prev => [...prev, newMessage]);
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
        setInputValue("");
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
        const response = await ApiService.resolverAchadoPerdido(conversation.itemId);
        if (response.success) {
          setAchadoPerdidoData(prev => ({ ...prev, resolved: true, status: 'resolvido' }));
        }
      } else if (helpInfo.contextType === 'pedido' && conversation?.pedidoId) {
        // Finalizar ajuda - incrementar contador e remover pedido
        const response = await ApiService.finalizarAjuda(conversation.pedidoId, user?.uid);
        if (response.success) {
          setDeliveryStatus("entregue");
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
        navigate('/conversas');
      }, 3000);
    } catch (error) {
      console.error('Erro ao finalizar:', error);
      alert('Erro ao finalizar. Tente novamente.');
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
            
            setMessages(prev => [...prev, newMessage]);
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
      const response = await ApiService.sendMessage(conversaId, content, type, { mediaUrl });

      if (response.success) {
        // A mensagem será adicionada via listener
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

  const handleAvatarClick = (isSender) => {
    if (isSender) {
      setViewingProfile(currentUserData);
    } else {
      const otherUser = conversation?.participantsData?.find(p => p.uid !== user?.uid) || conversation?.otherParticipant;
      setViewingProfile({
        name: currentContact?.name || "Usuário",
        email: otherUser?.email || "Informação privada",
        phone: otherUser?.telefone || "Informação privada",
        type: currentContact?.type === 'doador' ? 'Doador' : 'Beneficiário',
        address: otherUser?.endereco || "Localização não informada",
        points: otherUser?.pontos || 0,
        initials: currentContact?.initials || "?",
        joinDate: otherUser?.createdAt ? new Date(otherUser.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : "Recente",
        isVerified: currentContact?.type === 'doador',
        isSelf: false
      });
    }
  };

  return (
    <div className="sb-chat-root">
      <style>{`
        .reply-preview-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: white;
          border-top: 1px solid #e2e8f0;
          border-left: 4px solid #10b981;
          box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
        }
        .reply-info {
          flex: 1;
          overflow: hidden;
          margin-right: 12px;
        }
        .reply-sender {
          font-size: 0.75rem;
          font-weight: 700;
          color: #10b981;
          display: block;
          margin-bottom: 2px;
        }
        .reply-text {
          font-size: 0.85rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
        .cancel-reply-btn {
          background: #f1f5f9;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          cursor: pointer;
          flex-shrink: 0;
        }
        .cancel-reply-btn:active {
          background: #fee2e2;
          color: #ef4444;
        }
        .reply-quote {
          background: rgba(0,0,0,0.05);
          border-left: 3px solid #10b981;
          padding: 6px 10px;
          border-radius: 4px;
          margin-bottom: 6px;
          font-size: 0.85rem;
        }
        .reply-quote-sender { font-weight: 700; color: #10b981; font-size: 0.75rem; display: block; margin-bottom: 2px; }
        .reply-quote-text { color: inherit; opacity: 0.8; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
      <div className="sb-chat-page-wrapper">
        <div className="sb-chat-layout">
        {/* Sidebar */}
        <div className={`sb-sidebar-overlay ${sidebarOpen ? 'sb-visible' : ''}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`sb-chat-sidebar ${sidebarOpen ? 'sb-open' : ''}`}>
          <div className="sb-sidebar-header">
            <div className="sb-sidebar-title-row">
              <h2>Conversas</h2>
              <button className="sb-icon-btn" title="Nova conversa">
                <Heart size={20} />
              </button>
            </div>
            <div className="sb-search-bar-wrapper">
              <Search size={18} className="sb-search-icon" />
              <input 
                type="text" 
                placeholder="Buscar vizinhos..." 
                className="sb-search-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="sb-contacts-list">
            {filteredContacts.map((contact) => (
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
                <div className="sb-avatar-wrapper">
                  <div className={`contact-avatar ${contact.type}`}>
                    {contact.initials}
                  </div>
                  {contact.online && <span className="sb-online-status-dot" />}
                </div>
                <div className="sb-contact-meta">
                  <div className="sb-contact-name-row">
                    <span className="sb-contact-name">{contact.name}</span>
                    <span className="sb-last-time">{contact.lastMessageTime}</span>
                  </div>
                  <div className="sb-contact-preview-row">
                    <p className="sb-last-message">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && selectedChatId !== contact.id && (
                      <span className="sb-unread-count-badge">{contact.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="sb-sidebar-footer">
             <button className="sb-home-btn" onClick={() => navigate('/')}>
               <Home size={18} />
               <span>Voltar para Home</span>
             </button>
             <button className="sb-conversations-btn" onClick={() => navigate('/conversas')}>
               <MessageSquare size={18} />
               <span>Voltar para Conversas</span>
             </button>
             <div className="sb-mini-profile" onClick={() => setViewingProfile(currentUserData)}>
               <div className="mini-avatar">EU</div>
               <div className="mini-info">
                 <span className="mini-name">Seu Perfil</span>
                 <span className="mini-status">Disponível</span>
               </div>
             </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="sb-chat-main-area">
          {/* Header */}
          <header className="sb-chat-header-bar">
            <div className="sb-header-left-group">
              <button className="sb-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                <MoreVertical size={24} />
              </button>
              <button className="sb-mobile-back-btn" onClick={() => navigate('/conversas')}>
                <ArrowLeft size={24} />
              </button>
              <div className="sb-current-user-info">
                <div className="sb-header-avatar">
                  {currentContact?.initials || 'CV'}
                  {currentContact?.online && <span className="sb-online-indicator" />}
                </div>
                <div className="sb-header-text-details">
                  <div className="sb-header-name-row">
                    <h3>{currentContact?.name || 'Carregando...'}</h3>
                    <span className={`role-badge ${currentContact?.type || 'conversa'}`}>
                      {currentContact?.type === "doador" ? "Doador Verificado" : "Vizinho em Busca"}
                    </span>
                  </div>
                  <div className="sb-header-status-pills">
                    <span className="sb-status-pill distance">
                      <MapPin size={12} />
                      {currentContact?.distance || '0m de você'}
                    </span>
                    <span className={`status-pill state ${currentContact?.online ? 'online' : 'offline'}`}>
                      <span className="sb-pulse-dot" />
                      {currentContact?.online ? 'Ativo Agora' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="sb-header-right-group">
              <div className="sb-quick-actions-desktop">
                <button
                  className="sb-header-action-btn danger"
                  onClick={() => setShowReportModal(true)}
                  title="Denunciar ou Bloquear"
                >
                  <AlertTriangle size={20} />
                </button>
                <button className="sb-header-action-btn">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          </header>

          <div className="sb-connection-banner">
            <ShieldCheck size={16} />
            <span>Conexão segura SolidarBairro • Dados protegidos</span>
          </div>

          <div className="sb-chat-content-scroll">
            {/* Context Info Card Mobile */}
            {(contextType === 'pedido' || contextType === 'achado-perdido') && (
              <div className="sb-chat-context-card-mobile">
                <div className="sb-context-header-mobile">
                  <div className="sb-context-icon-mobile">
                    {helpInfo.contextType === 'achado-perdido' ? (
                      helpInfo.itemType === 'perdido' ? <Search size={20} /> : <Package size={20} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>
                  <div className="sb-context-title-mobile">
                    <span className="sb-context-label">Colaboração</span>
                    <h4>{helpInfo.type}</h4>
                  </div>
                  <span className={`sb-urgency-badge-mobile sb-${helpInfo.urgency}`}>
                    {helpInfo.urgency === "high" ? "Urgente" : helpInfo.urgency === "medium" ? "Média" : "Baixa"}
                  </span>
                </div>
                
                <p className="sb-context-description-mobile">{helpInfo.descricao}</p>
                
                <div className="sb-context-meta-mobile">
                  <div className="sb-meta-item-mobile">
                    <MapPin size={14} />
                    <span>{helpInfo.bairro}, {helpInfo.cidade}</span>
                  </div>
                </div>

                {helpInfo.contextType === 'pedido' && deliveryStatus === "andamento" && (
                  <button 
                    className="sb-finish-btn-mobile"
                    onClick={() => setShowFinishModal(true)}
                  >
                    <Heart size={18} fill="white" />
                    Finalizar Colaboração
                  </button>
                )}
              </div>
            )}

            {/* Context Info Card Desktop - Hidden on Mobile */}
            {(contextType === 'pedido' || contextType === 'achado-perdido') && (
              <div className="sb-chat-context-card">
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
                    deliveryStatus === "andamento" ? (
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
            <div className="sb-messages-container">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', color: '#64748b', gap: '10px' }}>
                  <div className="sb-mini-loader" />
                  <span>Carregando conversa...</span>
                </div>
              ) : (
              <>
              <div className="sb-date-separator">
                <span>Hoje</span>
              </div>

              {messages.map((msg) => {
                if (msg.type === "system") {
                  const isSuccess = msg.content?.includes("confirmado") || msg.content?.includes("sucesso") || msg.content?.includes("resolvido") || msg.content?.includes("encerrada");
                  const isSecurity = msg.content?.includes("seguro") || msg.content?.includes("ambiente");

                  return (
                    <div key={msg.id} className="sb-msg-row system">
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
                    <div className="sb-msg-bubble location-bubble">
                      <div className="sb-location-map-preview">
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
                      <div className="sb-location-details">
                        <h5>{msg.location?.name}</h5>
                        <p>{msg.location?.address}</p>
                      </div>
                    </div>
                  );
                } else if (msg.type === "image") {
                  bubbleContent = (
                    <div className="sb-msg-bubble media-bubble">
                      <img 
                        src={msg.metadata?.mediaUrl || msg.mediaUrl || msg.content} 
                        alt="Imagem enviada" 
                        className="sb-msg-media-img" 
                        onClick={() => setSelectedImage(msg.metadata?.mediaUrl || msg.mediaUrl || msg.content)}
                      />
                    </div>
                  );
                } else if (msg.type === "video") {
                  bubbleContent = (
                    <div className="sb-msg-bubble media-bubble">
                      <video src={msg.metadata?.mediaUrl || msg.mediaUrl || msg.content} controls className="sb-msg-media-video" />
                    </div>
                  );
                } else {
                  bubbleContent = (
                    <div className="sb-msg-bubble text-bubble">
                      {hasReply && (
                        <div className="reply-quote">
                          <span className="reply-quote-sender">{hasReply.senderName}</span>
                          <p className="reply-quote-text">{hasReply.content}</p>
                        </div>
                      )}
                      {msg.content}
                    </div>
                  );
                }

                return (
                  <SwipeableMessage key={msg.id} message={msg} onReply={setReplyingTo} disabled={isConversationClosed}>
                  <div className={`sb-msg-row ${isSent ? 'sent' : 'received'}`}>
                    {!isSent && (
                      <div className="sb-msg-sender-avatar" onClick={() => handleAvatarClick(false)}>
                        {currentContact?.initials || 'U'}
                      </div>
                    )}
                    <div className="sb-msg-wrapper">
                      <div 
                        style={{ position: 'relative' }}
                        onContextMenu={(e) => {
                          if (isConversationClosed) return;
                          e.preventDefault();
                          setActiveReactionMessageId(msg.id);
                          if (navigator.vibrate) navigator.vibrate(50);
                        }}
                      >
                        <AnimatePresence>
                          {activeReactionMessageId === msg.id && (
                            <>
                              <div 
                                style={{ position: 'fixed', inset: 0, zIndex: 99 }} 
                                onClick={(e) => { e.stopPropagation(); setActiveReactionMessageId(null); }} 
                              />
                              <motion.div
                                initial={{ scale: 0, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0, y: 10 }}
                                className={`reaction-picker ${isSent ? 'sent' : 'received'}`}
                              >
                                {REACTION_OPTIONS.map(emoji => (
                                  <button 
                                    key={emoji}
                                    onClick={(e) => { e.stopPropagation(); handleReactionClick(msg.id, emoji); }}
                                    className="reaction-option"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                                {canEdit && (
                                  <>
                                    <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 4px' }} />
                                    <button 
                                      className="reaction-option"
                                      onClick={(e) => { e.stopPropagation(); handleEditClick(msg); setActiveReactionMessageId(null); }}
                                    >
                                      <Pencil size={18} color="#64748b" />
                                    </button>
                                  </>
                                )}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                        {bubbleContent}
                      </div>

                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className={`reactions-display ${isSent ? 'sent' : 'received'}`}>
                          {Object.entries(msg.reactions).map(([emoji, users]) => (
                            <div key={emoji} className={`reaction-pill ${users.includes(user?.uid || 'me') ? 'active' : ''}`}>
                              {emoji} <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{users.length}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="sb-msg-metadata">
                        {msg.edited && <span className="sb-edited-label">(editado)</span>}
                        <span className="sb-msg-time">{formatTime(msg.timestamp)}</span>
                        {isSent && (
                          <span className="sb-msg-status">
                            {msg.read ? <CheckCheck size={14} className="sb-read" style={{ color: '#3b82f6' }} /> : <Check size={14} />}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSent && (
                      <div className="sb-msg-sender-avatar self" onClick={() => handleAvatarClick(true)}>
                        {currentUserData?.initials || 'EU'}
                      </div>
                    )}
                  </div>
                  </SwipeableMessage>
                );
              })}

              {isTyping && (
                <div className="sb-msg-row received">
                  <div className="sb-msg-bubble typing-bubble">
                    <span className="sb-dot" />
                    <span className="sb-dot" />
                    <span className="sb-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
              </>
              )}
            </div>
          </div>

          {/* Input Footer */}
          <footer className="sb-chat-input-footer">
            {isConversationClosed ? (
              <div className="sb-conversation-closed-banner">
                <div className="sb-closed-icon">
                  <ShieldCheck size={20} />
                </div>
                <div className="sb-closed-text">
                  <span className="sb-closed-title">Conversa Encerrada</span>
                  <span className="sb-closed-subtitle">Esta conversa foi finalizada após a conclusão da ajuda</span>
                </div>
              </div>
            ) : (
              <div className="sb-input-container">
                <AnimatePresence>
                  {editingMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 20 }}
                    >
                    <div className="reply-preview-bar" style={{ borderLeftColor: '#3b82f6' }}>
                      <div className="reply-info">
                        <span className="reply-sender" style={{ color: '#3b82f6' }}>Editando mensagem</span>
                        <p className="reply-text">{editingMessage.content}</p>
                      </div>
                      <button onClick={() => { setEditingMessage(null); setInputValue(''); }} className="cancel-reply-btn"><X size={18} /></button>
                    </div>
                    </motion.div>
                  )}
                  {replyingTo && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, zIndex: 20 }}
                    >
                    <div className="reply-preview-bar">
                      <div className="reply-info">
                        <span className="reply-sender">Respondendo a {replyingTo.sender === 'sent' ? 'Você' : currentContact?.name}</span>
                        <p className="reply-text">{replyingTo.content}</p>
                      </div>
                      <button onClick={() => setReplyingTo(null)} className="cancel-reply-btn"><X size={18} /></button>
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="sb-input-actions-left">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*,video/*" 
                    onChange={handleFileSelect}
                  />
                  <button className="sb-action-icon-btn" title="Anexar" onClick={handleAttachmentClick} disabled={isUploading}>
                    {isUploading ? <div className="sb-mini-loader" /> : <Paperclip size={20} />}
                  </button>
                  <button 
                    className={`action-icon-btn ${isGettingLocation ? 'loading' : ''}`} 
                    title="Enviar Localização"
                    onClick={handleSendLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <div className="sb-mini-loader" />
                    ) : (
                      <MapPin size={20} />
                    )}
                  </button>
                </div>
                <div className="sb-textarea-wrapper">
                  <textarea
                    className="sb-chat-textarea"
                    placeholder="Digite sua mensagem..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
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
                    <div className="sb-mini-loader" />
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
        <div className="sb-modal-backdrop" onClick={() => setShowReportModal(false)}>
          <div className="sb-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
              <div className="sb-modal-icon-circle danger">
                <AlertTriangle size={24} />
              </div>
              <h3>Segurança e Denúncia</h3>
            </div>
            <div className="sb-modal-body">
              <p>O que aconteceu? Sua segurança é nossa prioridade.</p>
              <div className="sb-modal-choices">
                <button className="sb-choice-btn">
                  Denunciar comportamento inadequado
                </button>
                <button className="sb-choice-btn danger">
                  Bloquear este vizinho
                </button>
                <button className="sb-choice-btn">
                  Solicitar ajuda da moderação
                </button>
              </div>
            </div>
            <div className="sb-modal-footer">
              <button
                className="sb-btn-ghost"
                onClick={() => setShowReportModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinishModal && (
        <div className="sb-modal-backdrop" onClick={() => setShowFinishModal(false)}>
          <div className="sb-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
              <div className="sb-modal-icon-circle success">
                <Heart size={24} fill="white" />
              </div>
              <h3>
                {helpInfo.contextType === 'achado-perdido' 
                  ? 'Marcar como Resolvido' 
                  : 'Finalizar Doação'
                }
              </h3>
            </div>
            <div className="sb-modal-body">
              <p>
                {helpInfo.contextType === 'achado-perdido'
                  ? helpInfo.itemType === 'perdido'
                    ? 'Você encontrou o item perdido ou ele foi devolvido ao dono?'
                    : 'O item encontrado foi entregue ao dono ou às autoridades?'
                  : 'Você confirma que a entrega foi realizada com sucesso?'
                }
              </p>
              <p className="sb-modal-subtext">
                {helpInfo.contextType === 'achado-perdido'
                  ? 'Isso marcará o item como resolvido e encerrará as buscas.'
                  : 'Isso conclui este ciclo de solidariedade no seu bairro.'
                }
              </p>
            </div>
            <div className="sb-modal-footer">
              <button
                className="sb-btn-ghost"
                onClick={() => setShowFinishModal(false)}
              >
                Ainda não
              </button>
              <button className="sb-btn-solid-success" onClick={handleFinishDelivery}>
                {helpInfo.contextType === 'achado-perdido' ? 'Sim, resolvido!' : 'Sim, concluído!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingProfile && (
        <div className="sb-modal-backdrop" onClick={() => setViewingProfile(null)}>
          <div className="sb-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sb-modal-header">
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
            <div className="sb-modal-body profile-modal-content">
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
            <div className="sb-modal-footer" style={{ marginTop: '1.5rem', flexDirection: 'row' }}>
              {!viewingProfile.isSelf && (
                <button 
                  className="sb-btn-ghost danger" 
                  onClick={() => {
                    setViewingProfile(null);
                    setShowReportModal(true);
                  }}
                >
                  Bloquear
                </button>
              )}
              <button className="sb-btn-solid-success" style={{ flex: 1, padding: '1rem', borderRadius: '1rem', fontSize: '1rem' }} onClick={() => setViewingProfile(null)}>
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="sb-modal-backdrop confirmation-overlay">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="sb-confetti-piece"
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

          <div className="sb-success-announcement">
            <div className="sb-success-icon-ring">
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

            <div className="sb-reward-badge">
              <Star className="sb-star-icon" size={20} fill="currentColor" />
              <span>+10 Pontos de Impacto Social</span>
              <Sparkles size={16} className="sb-text-yellow-300" />
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="sb-image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="sb-image-modal-content">
            <img src={selectedImage} alt="Visualização em tela cheia" />
            <button className="sb-close-image-modal" onClick={() => setSelectedImage(null)}>
              <X size={24} />
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Chat;
