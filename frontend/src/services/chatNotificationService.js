import apiService from './apiService';

class ChatNotificationService {
  constructor() {
    this.listeners = new Map();
    this.pollingIntervals = new Map();
    this.lastMessageTimes = new Map();
    this.notificationCallback = null;
    this.currentUserId = null;
  }

  // Configurar callback para notificações
  setNotificationCallback(callback) {
    this.notificationCallback = callback;
  }

  // Configurar usuário atual
  setCurrentUser(userId) {
    this.currentUserId = userId;
  }

  // Iniciar escuta de uma conversa
  startListening(conversationId, callback) {
    if (this.listeners.has(conversationId)) {
      this.stopListening(conversationId);
    }

    this.listeners.set(conversationId, callback);
    
    // Polling a cada 15 segundos para novas mensagens (reduzido para evitar rate limiting)
    const interval = setInterval(async () => {
      try {
        await this.checkForNewMessages(conversationId);
      } catch (error) {
        console.error('Erro ao verificar novas mensagens:', error);
      }
    }, 15000);

    this.pollingIntervals.set(conversationId, interval);
  }

  // Parar escuta de uma conversa
  stopListening(conversationId) {
    const interval = this.pollingIntervals.get(conversationId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(conversationId);
    }
    
    this.listeners.delete(conversationId);
    this.lastMessageTimes.delete(conversationId);
  }

  // Verificar novas mensagens
  async checkForNewMessages(conversationId) {
    try {
      const response = await apiService.getMessages(conversationId, 10);
      
      if (response.success && response.data.length > 0) {
        const messages = response.data;
        const lastMessage = messages[messages.length - 1];
        const lastMessageTime = new Date(lastMessage.createdAt.seconds * 1000).getTime();
        
        const storedLastTime = this.lastMessageTimes.get(conversationId);
        
        if (!storedLastTime || lastMessageTime > storedLastTime) {
          this.lastMessageTimes.set(conversationId, lastMessageTime);
          
          // Notificar apenas se não for a primeira verificação e não for mensagem própria
          if (storedLastTime && lastMessage.senderId !== this.currentUserId) {
            const callback = this.listeners.get(conversationId);
            if (callback) {
              const newMessages = messages.filter(msg => {
                const msgTime = new Date(msg.createdAt.seconds * 1000).getTime();
                return msgTime > storedLastTime && msg.senderId !== this.currentUserId;
              });
              
              if (newMessages.length > 0) {
                callback(newMessages);
                
                // Adicionar notificação se não estiver na conversa ativa
                if (this.notificationCallback && !this.isCurrentConversation(conversationId)) {
                  const senderName = await this.getSenderName(lastMessage.senderId);
                  this.notificationCallback(conversationId, senderName, lastMessage.content);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar mensagens:', error);
    }
  }

  // Verificar se é a conversa atual (usuário está vendo)
  isCurrentConversation(conversationId) {
    const currentPath = window.location.pathname;
    return currentPath.includes(`/chat/${conversationId}`);
  }

  // Obter nome do remetente
  async getSenderName(senderId) {
    try {
      const response = await apiService.getUserData(senderId);
      if (response.success && response.data) {
        return response.data.nome || response.data.nomeCompleto || response.data.nomeFantasia || 'Usuário';
      }
    } catch (error) {
      console.error('Erro ao buscar nome do usuário:', error);
    }
    return 'Usuário';
  }

  // Limpar todos os listeners
  cleanup() {
    this.pollingIntervals.forEach(interval => clearInterval(interval));
    this.listeners.clear();
    this.pollingIntervals.clear();
    this.lastMessageTimes.clear();
  }

  // Notificação de nova conversa
  async checkForNewConversations(userId, callback) {
    try {
      const response = await apiService.getConversations();
      
      if (response.success) {
        callback(response.data);
      }
    } catch (error) {
      console.error('Erro ao verificar conversas:', error);
    }
  }

  // Iniciar polling para conversas
  startConversationPolling(userId, callback) {
    const interval = setInterval(async () => {
      await this.checkForNewConversations(userId, callback);
    }, 30000); // A cada 30 segundos (reduzido para evitar rate limiting)

    return interval;
  }

  // Iniciar monitoramento global de mensagens
  startGlobalMessageMonitoring(userId, notificationCallback) {
    this.setCurrentUser(userId);
    this.setNotificationCallback(notificationCallback);
    
    // Polling global para novas mensagens em todas as conversas
    const globalInterval = setInterval(async () => {
      try {
        const conversationsResponse = await apiService.getConversations();
        if (conversationsResponse.success && conversationsResponse.data) {
          for (const conversation of conversationsResponse.data) {
            if (!this.listeners.has(conversation.id)) {
              await this.checkForNewMessages(conversation.id);
            }
          }
        }
      } catch (error) {
        console.error('Erro no monitoramento global:', error);
      }
    }, 30000); // A cada 30 segundos (reduzido para evitar rate limiting)

    return globalInterval;
  }

  // Método para criar notificação de mensagem (polyfill)
  async createMessageNotification(conversationId, senderId, content) {
    try {
      // Este método é chamado pelo apiService, mas não precisa fazer nada
      // pois as notificações são gerenciadas pelo polling
      console.log('📬 Notificação de mensagem:', { conversationId, senderId, content });
      return { success: true };
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ChatNotificationService();