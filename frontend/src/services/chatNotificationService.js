import apiService from './apiService';

class ChatNotificationService {
  constructor() {
    this.listeners = new Map();
    this.pollingIntervals = new Map();
    this.lastMessageTimes = new Map();
  }

  // Iniciar escuta de uma conversa
  startListening(conversationId, callback) {
    if (this.listeners.has(conversationId)) {
      this.stopListening(conversationId);
    }

    this.listeners.set(conversationId, callback);
    
    // Polling a cada 3 segundos para novas mensagens
    const interval = setInterval(async () => {
      try {
        await this.checkForNewMessages(conversationId);
      } catch (error) {
        console.error('Erro ao verificar novas mensagens:', error);
      }
    }, 3000);

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
          
          // Notificar apenas se não for a primeira verificação
          if (storedLastTime) {
            const callback = this.listeners.get(conversationId);
            if (callback) {
              const newMessages = messages.filter(msg => {
                const msgTime = new Date(msg.createdAt.seconds * 1000).getTime();
                return msgTime > storedLastTime;
              });
              
              if (newMessages.length > 0) {
                callback(newMessages);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar mensagens:', error);
    }
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
    }, 10000); // A cada 10 segundos

    return interval;
  }
}

export default new ChatNotificationService();