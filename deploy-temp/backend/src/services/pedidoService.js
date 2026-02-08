const pedidoModel = require('../models/pedidoModel');

class PedidoService {
  validatePedidoData(data) {
    const errors = [];
    
    if (!data.category?.trim()) {
      errors.push('Categoria é obrigatória');
    }
    
    if (!data.description?.trim() || data.description.length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }
    
    if (!data.urgency?.trim()) {
      errors.push('Urgência é obrigatória');
    }
    
    if (!data.visibility || !Array.isArray(data.visibility) || data.visibility.length === 0) {
      errors.push('Pelo menos uma opção de visibilidade é obrigatória');
    }
    
    if (!data.userId?.trim()) {
      errors.push('ID do usuário é obrigatório');
    }
    
    return errors;
  }

  sanitizePedidoData(data) {
    return {
      userId: data.userId?.trim(),
      category: data.category?.trim(),
      subCategory: Array.isArray(data.subCategory) ? data.subCategory : [],
      size: data.size?.trim() || null,
      style: data.style?.trim() || null,
      subQuestionAnswers: data.subQuestionAnswers || {},
      description: data.description?.trim(),
      urgency: data.urgency?.trim(),
      visibility: Array.isArray(data.visibility) ? data.visibility : [],
      specialists: Array.isArray(data.specialists) ? data.specialists : [],
      isPublic: data.isPublic !== undefined ? data.isPublic : true,
      radius: data.radius || 5,
      // Estrutura de localização corrigida
      location: data.location?.address || data.locationString || 'Localização não informada',
      coordinates: data.location?.coordinates || data.coordinates || null,
      city: data.location?.city || data.city?.trim() || null,
      state: data.location?.state || data.state?.trim() || null,
      neighborhood: data.location?.neighborhood || data.neighborhood?.trim() || null
    };
  }

  async createPedido(pedidoData) {
    const sanitizedData = this.sanitizePedidoData(pedidoData);
    const errors = this.validatePedidoData(sanitizedData);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    const pedido = await pedidoModel.create(sanitizedData);
    
    // Incrementar contador de pedidos criados
    const { db } = require('../config/firebase');
    const cidadaoRef = db.collection('cidadaos').doc(sanitizedData.userId);
    const cidadaoDoc = await cidadaoRef.get();
    
    if (cidadaoDoc.exists) {
      const currentCount = cidadaoDoc.data().pedidosCriados || 0;
      await cidadaoRef.update({
        pedidosCriados: currentCount + 1,
        atualizadoEm: new Date()
      });
    }
    
    return pedido;
  }

  async getAllPedidos(filters = {}) {
    return await pedidoModel.findAll(filters);
  }

  async getPedidoById(id) {
    if (!id?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }
    
    const pedido = await pedidoModel.findById(id);
    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }
    
    return pedido;
  }

  async getPedidosByUserId(userId) {
    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }
    
    return await pedidoModel.findByUserId(userId);
  }

  async updatePedido(id, updateData) {
    if (!id?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }
    
    const existingPedido = await pedidoModel.findById(id);
    if (!existingPedido) {
      throw new Error('Pedido não encontrado');
    }
    
    const sanitizedData = this.sanitizePedidoData(updateData);
    const errors = this.validatePedidoData(sanitizedData);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    return await pedidoModel.update(id, sanitizedData);
  }

  async deletePedido(id) {
    if (!id?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }
    
    const existingPedido = await pedidoModel.findById(id);
    if (!existingPedido) {
      throw new Error('Pedido não encontrado');
    }
    
    return await pedidoModel.delete(id);
  }

  async finalizarAjuda(pedidoId, ajudanteId) {
    if (!pedidoId?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }

    if (!ajudanteId?.trim()) {
      throw new Error('ID do ajudante é obrigatório');
    }

    const existingPedido = await pedidoModel.findById(pedidoId);
    if (!existingPedido) {
      throw new Error('Pedido não encontrado');
    }

    const { db } = require('../config/firebase');
    const cidadaoRef = db.collection('cidadaos').doc(ajudanteId);
    const cidadaoDoc = await cidadaoRef.get();

    if (cidadaoDoc.exists) {
      const currentAjudas = cidadaoDoc.data().ajudasConcluidas || 0;
      const currentPontos = cidadaoDoc.data().pontos || 0;
      await cidadaoRef.update({
        ajudasConcluidas: currentAjudas + 1,
        pontos: currentPontos + 10,
        atualizadoEm: new Date()
      });
    }

    // Fechar a conversa relacionada ao pedido
    const chatService = require('./chatService');
    try {
      const conversation = await chatService.findConversationByPedido(pedidoId, [existingPedido.userId, ajudanteId]);
      if (conversation) {
        await chatService.closeConversation(conversation.id, ajudanteId);
      }
    } catch (error) {
      console.warn('Erro ao fechar conversa:', error.message);
      // Não falhar a finalização da ajuda por causa da conversa
    }

    return await pedidoModel.delete(pedidoId);
  }

  async getPedidosByBairroAndDate(bairro, date) {
    const { db } = require('../config/firebase');
    const snapshot = await db.collection('pedidos').get();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 1);
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(pedido => {
        const createdAt = pedido.createdAt?.toDate ? pedido.createdAt.toDate() : new Date(pedido.createdAt);
        return pedido.neighborhood === bairro && 
               createdAt >= today && 
               createdAt < endDate;
      });
  }

  async getDoacoesConcluidasHoje(bairro) {
    const { db } = require('../config/firebase');
    const snapshot = await db.collection('pedidos').get();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 1);
    
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(pedido => {
        const updatedAt = pedido.updatedAt?.toDate ? pedido.updatedAt.toDate() : new Date(pedido.updatedAt);
        return pedido.neighborhood === bairro && 
               pedido.status === 'concluido' &&
               updatedAt >= today && 
               updatedAt < endDate;
      });
  }
}

module.exports = new PedidoService();