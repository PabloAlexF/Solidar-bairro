const chatService = require('../services/chatService');

class ChatController {
  async createConversation(req, res) {
    try {
      const { participants, pedidoId, type, title, initialMessage } = req.body;
      
      // Garantir array válido e adicionar usuário atual
      const validParticipants = Array.isArray(participants) ? [...participants] : [];
      
      // Usar uid do usuário autenticado
      const currentUserId = req.user.uid || req.user.id;
      
      if (!validParticipants.includes(currentUserId)) {
        validParticipants.push(currentUserId);
      }
      
      const conversation = await chatService.createConversation({
        participants: validParticipants.filter(p => p),
        pedidoId,
        type,
        title,
        initialMessage,
        senderId: currentUserId
      });
      
      res.status(201).json({ success: true, data: conversation });
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async createOrGetConversation(req, res) {
    try {
      const { participantId, itemId, itemType, title } = req.body;
      const currentUserId = req.user.uid || req.user.id;
      
      // Buscar conversa existente
      const existingConversation = await chatService.findConversationByItem(
        currentUserId, 
        participantId, 
        itemId, 
        itemType
      );
      
      if (existingConversation) {
        return res.json({ success: true, data: existingConversation });
      }
      
      // Criar nova conversa
      const conversation = await chatService.createConversation({
        participants: [currentUserId, participantId],
        itemId,
        itemType,
        title,
        senderId: currentUserId
      });
      
      res.status(201).json({ success: true, data: conversation });
    } catch (error) {
      console.error('Erro ao criar/buscar conversa:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getConversations(req, res) {
    try {
      const conversations = await chatService.getConversations(req.user.uid);
      res.json({ success: true, data: conversations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getConversation(req, res) {
    try {
      const conversation = await chatService.getConversation(req.params.id);
      
      // Verificar se o usuário faz parte da conversa
      if (!conversation.participants.includes(req.user.uid)) {
        return res.status(403).json({ success: false, error: 'Acesso negado' });
      }
      
      res.json({ success: true, data: conversation });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const message = await chatService.sendMessage(
        req.params.id, 
        req.user.uid, 
        req.body
      );
      res.status(201).json({ success: true, data: message });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getMessages(req, res) {
    try {
      const { limit, lastMessageId } = req.query;
      const messages = await chatService.getMessages(
        req.params.id,
        req.user.uid,
        parseInt(limit) || 50,
        lastMessageId
      );
      res.json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async markAsRead(req, res) {
    try {
      await chatService.markAsRead(req.params.id, req.user.uid);
      res.json({ success: true, message: 'Mensagens marcadas como lidas' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ChatController();