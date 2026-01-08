const chatModel = require('../models/chatModel');

class ChatService {
  async createConversation(data) {
    // Validar participantes - permitir 1 ou mais
    const validParticipants = (data.participants || []).filter(p => p && typeof p === 'string');
    
    if (validParticipants.length === 0) {
      throw new Error('Pelo menos um participante é necessário');
    }

    // Se há um pedidoId, verificar se já existe uma conversa para este pedido
    if (data.pedidoId) {
      const existingConversation = await this.findConversationByPedido(data.pedidoId, validParticipants);
      if (existingConversation) {
        return existingConversation;
      }
    }

    return await chatModel.createConversation({
      ...data,
      participants: validParticipants
    });
  }

  async findConversationByPedido(pedidoId, participants) {
    try {
      const conversations = await chatModel.getConversationsByPedido(pedidoId);
      
      // Procurar uma conversa que contenha todos os participantes
      return conversations.find(conv => {
        return participants.every(p => conv.participants.includes(p));
      });
    } catch (error) {
      console.error('Erro ao buscar conversa por pedido:', error);
      return null;
    }
  }

  async findExistingConversation(participants, pedidoId = null) {
    // Buscar todas as conversas do primeiro participante
    const snapshot = await chatModel.getConversationsByUser(participants[0]);
    
    return snapshot.find(conv => {
      const sameParticipants = participants.every(p => conv.participants.includes(p)) &&
                              conv.participants.length === participants.length;
      const samePedido = pedidoId ? conv.pedidoId === pedidoId : !conv.pedidoId;
      
      return sameParticipants && samePedido;
    });
  }

  async getConversations(userId) {
    const conversations = await chatModel.getConversationsByUser(userId);
    
    // Enriquecer com informações dos participantes
    return conversations.map(conv => ({
      ...conv,
      otherParticipants: conv.participants.filter(p => p !== userId)
    }));
  }

  async getConversation(conversationId) {
    return await chatModel.getConversation(conversationId);
  }

  async sendMessage(conversationId, senderId, messageData) {
    // Verificar se o usuário faz parte da conversa
    const conversation = await chatModel.getConversation(conversationId);
    
    // Verificar com uid ou id
    const isParticipant = conversation.participants.includes(senderId) || 
                         conversation.participants.includes(senderId);
    
    if (!isParticipant) {
      console.log('Participantes da conversa:', conversation.participants);
      console.log('ID do usuário:', senderId);
      throw new Error('Usuário não autorizado nesta conversa');
    }

    const message = await chatModel.createMessage({
      conversationId,
      senderId,
      type: messageData.type || 'text',
      content: messageData.text || messageData.content,
      metadata: messageData.metadata
    });

    return message;
  }

  async getMessages(conversationId, userId, limit = 50, lastMessageId = null) {
    // Verificar se o usuário faz parte da conversa
    const conversation = await chatModel.getConversation(conversationId);
    
    const isParticipant = conversation.participants.includes(userId);
    
    if (!isParticipant) {
      console.log('Participantes da conversa:', conversation.participants);
      console.log('ID do usuário:', userId);
      throw new Error('Usuário não autorizado nesta conversa');
    }

    return await chatModel.getMessages(conversationId, limit, lastMessageId);
  }

  async markAsRead(conversationId, userId) {
    return await chatModel.markConversationAsRead(conversationId, userId);
  }
}

module.exports = new ChatService();