import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import ApiService from '../../services/apiService';
import ChatDesktop from './DesktopChat';
import ChatMobile from './MobileChat';
import './styles.css';

const Chat = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [conversations, setConversations] = useState([]);
  const [currentChatInfo, setCurrentChatInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const parseDate = (dateInput) => {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) return dateInput;
    if (dateInput && typeof dateInput === 'object' && dateInput.seconds) {
      return new Date(dateInput.seconds * 1000);
    }
    return new Date(dateInput);
  };

  // 1. Carregar lista de conversas (Sidebar) - Executa apenas quando o usuário muda
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      try {
        const convResponse = await ApiService.getConversations();
        if (convResponse.success) {
          setConversations(convResponse.data);
        }
      } catch (error) {
        console.error("Erro ao carregar lista de conversas:", error);
      }
    };
    loadConversations();
  }, [user]);

  // 2. Atualizar info do chat atual quando a lista ou ID mudar
  useEffect(() => {
    if (conversations.length > 0 && id) {
      const current = conversations.find(c => c.id === id);
      if (current) setCurrentChatInfo(current);
    }
  }, [conversations, id]);

  // 3. Carregar mensagens do chat atual
  useEffect(() => {
    const loadMessages = async () => {
      if (!user || !id) return;
      setLoading(true);
      try {
        const response = await ApiService.getMessages(id);
        if (response.success) {
          setMessages(response.data.map(msg => ({
            ...msg,
            timestamp: parseDate(msg.createdAt || msg.timestamp),
          })));
        }
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [id, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    // Optimistic UI update
    const msg = {
      id: Date.now(),
      text: newMessage,
      senderId: user?.uid,
      type: 'text',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');

    try {
      await ApiService.sendMessage(id, { content: msg.text, type: 'text' });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      // Opcional: Mostrar erro ou reverter estado
    }
  };

  const handleFileSelect = async (file) => {
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      
      // Preview Otimista
      reader.onloadend = () => {
        const msg = {
          id: Date.now(),
          text: isVideo ? 'Vídeo enviado' : 'Foto enviada',
          mediaUrl: reader.result,
          mediaType: isVideo ? 'video' : 'image',
          senderId: user?.uid,
          type: 'media',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, msg]);
      };
      reader.readAsDataURL(file);

      // Envio Real para o Backend
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', isVideo ? 'video' : 'image');
        
        // Usa fetch direto para garantir o envio correto de multipart/form-data
        const token = localStorage.getItem('authToken');
        await fetch(`http://localhost:3001/api/chat/${id}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      } catch (error) {
        console.error("Erro ao fazer upload:", error);
      }
    }
  };

  const props = {
    conversations,
    currentChatInfo,
    messages,
    newMessage,
    setNewMessage,
    loading,
    messagesEndRef,
    fileInputRef,
    handleSendMessage,
    handleFileSelect,
    user,
    id
  };

  if (isMobile) {
    return <ChatMobile {...props} />;
  }
  return <ChatDesktop {...props} />;
};

export default Chat;