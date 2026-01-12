const chatModel = require('../models/chatModel');
const firebase = require('../config/firebase');

class ChatService {
  constructor() {
    this.db = firebase.getDb();
  }
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

    const conversation = await chatModel.createConversation({
      ...data,
      participants: validParticipants
    });

    // Se há uma mensagem inicial, enviá-la
    if (data.initialMessage && data.senderId) {
      await chatModel.createMessage({
        conversationId: conversation.id,
        senderId: data.senderId,
        type: 'text',
        content: data.initialMessage
      });
    }

    return conversation;
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

  async findConversationByItem(currentUserId, participantId, itemId, itemType) {
    try {
      // Buscar conversas do usuário atual
      const conversations = await chatModel.getConversationsByUser(currentUserId);
      
      // Procurar conversa que contenha os dois participantes e o mesmo item
      return conversations.find(conv => {
        const hasParticipants = conv.participants.includes(currentUserId) && 
                              conv.participants.includes(participantId);
        const sameItem = conv.itemId === itemId && conv.itemType === itemType;
        
        return hasParticipants && sameItem;
      });
    } catch (error) {
      console.error('Erro ao buscar conversa por item:', error);
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
    const enrichedConversations = [];
    
    for (const conv of conversations) {
      const otherParticipantIds = conv.participants.filter(p => p !== userId);
      
      // Buscar dados do outro participante
      let otherParticipant = null;
      if (otherParticipantIds.length > 0) {
        otherParticipant = await this.getUserData(otherParticipantIds[0]);
      }
      
      enrichedConversations.push({
        ...conv,
        otherParticipant
      });
    }
    
    return enrichedConversations;
  }

  async getUserData(id) {
    try {
      // Buscar em cidadãos
      const cidadaoDoc = await this.db.collection('cidadaos').doc(id).get();
      
      if (cidadaoDoc.exists) {
        const cidadaoData = cidadaoDoc.data();
        return {
          id: cidadaoDoc.id,
          nome: cidadaoData.nome,
          tipo: 'cidadao',
          bairro: cidadaoData.endereco?.bairro
        };
      }

      // Buscar em comércios
      const comercioDoc = await this.db.collection('comercios').doc(id).get();
      
      if (comercioDoc.exists) {
        const comercioData = comercioDoc.data();
        return {
          id: comercioDoc.id,
          nome: comercioData.nomeFantasia || comercioData.razaoSocial,
          tipo: 'comercio',
          bairro: comercioData.endereco?.bairro
        };
      }

      // Buscar em ONGs
      const ongDoc = await this.db.collection('ongs').doc(id).get();
      
      if (ongDoc.exists) {
        const ongData = ongDoc.data();
        return {
          id: ongDoc.id,
          nome: ongData.nome,
          tipo: 'ong',
          bairro: ongData.endereco?.bairro
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }

  async getConversation(conversationId) {
    const conversation = await chatModel.getConversation(conversationId);
    
    // Enriquecer com dados dos participantes
    const participantsData = [];
    
    for (const participantId of conversation.participants) {
      const userData = await this.getUserData(participantId);
      if (userData) {
        participantsData.push(userData);
      }
    }
    
    return {
      ...conversation,
      participantsData
    };
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