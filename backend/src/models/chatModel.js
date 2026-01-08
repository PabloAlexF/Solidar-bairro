const firebase = require('../config/firebase');

class ChatModel {
  constructor() {
    this.db = firebase.getDb();
  }

  // Conversas
  async createConversation(data) {
    // Limpar dados para evitar undefined
    const cleanData = {
      participants: (data.participants || []).filter(p => p && typeof p === 'string'),
      pedidoId: data.pedidoId || null,
      type: data.type || 'direct',
      title: data.title || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: null,
      lastMessageAt: null,
      isActive: true
    };

    const docRef = await this.db.collection('conversations').add(cleanData);
    return { id: docRef.id, ...cleanData };
  }

  async getConversationsByUser(userId) {
    const snapshot = await this.db.collection('conversations')
      .where('participants', 'array-contains', userId)
      .get();
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(conv => conv.isActive !== false)
      .sort((a, b) => {
        const dateA = a.updatedAt?.seconds || 0;
        const dateB = b.updatedAt?.seconds || 0;
        return dateB - dateA;
      });
  }

  async getConversationsByPedido(pedidoId) {
    const snapshot = await this.db.collection('conversations')
      .where('pedidoId', '==', pedidoId)
      .get();
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(conv => conv.isActive !== false);
  }

  async getConversation(conversationId) {
    const doc = await this.db.collection('conversations').doc(conversationId).get();
    if (!doc.exists) {
      throw new Error('Conversa não encontrada');
    }
    return { id: doc.id, ...doc.data() };
  }

  async updateConversation(conversationId, data) {
    await this.db.collection('conversations').doc(conversationId).update({
      ...data,
      updatedAt: new Date()
    });
  }

  // Mensagens
  async createMessage(data) {
    const messageData = {
      conversationId: data.conversationId,
      senderId: data.senderId,
      type: data.type || 'text',
      content: data.content,
      metadata: data.metadata || null,
      createdAt: new Date(),
      readBy: [data.senderId]
    };

    const docRef = await this.db.collection('messages').add(messageData);
    
    // Atualizar conversa
    await this.updateConversation(data.conversationId, {
      lastMessage: messageData.content,
      lastMessageAt: messageData.createdAt
    });

    return { id: docRef.id, ...messageData };
  }

  async getMessages(conversationId, limit = 50, lastMessageId = null) {
    let query = this.db.collection('messages')
      .where('conversationId', '==', conversationId)
      .limit(limit);

    if (lastMessageId) {
      const lastDoc = await this.db.collection('messages').doc(lastMessageId).get();
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Ordenar no código ao invés do Firestore
    return messages.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateA - dateB;
    });
  }

  async markMessageAsRead(messageId, userId) {
    const messageRef = this.db.collection('messages').doc(messageId);
    const doc = await messageRef.get();
    
    if (doc.exists) {
      const data = doc.data();
      const readBy = data.readBy || [];
      
      if (!readBy.includes(userId)) {
        await messageRef.update({
          readBy: [...readBy, userId]
        });
      }
    }
  }

  async markConversationAsRead(conversationId, userId) {
    // Buscar mensagens sem usar queries complexas
    const snapshot = await this.db.collection('messages')
      .where('conversationId', '==', conversationId)
      .get();

    const batch = this.db.batch();
    let updateCount = 0;

    snapshot.docs.forEach(doc => {
      const message = doc.data();
      const readBy = message.readBy || [];
      
      if (!readBy.includes(userId)) {
        batch.update(doc.ref, {
          readBy: [...readBy, userId]
        });
        updateCount++;
      }
    });

    if (updateCount > 0) {
      await batch.commit();
    }
  }
}

module.exports = new ChatModel();