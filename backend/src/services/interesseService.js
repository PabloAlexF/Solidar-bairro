const interesseModel = require('../models/interesseModel');

class InteresseService {
  validateInteresseData(data, isForConversation = false) {
    const errors = [];
    
    if (!data.pedidoId?.trim()) {
      errors.push('ID do pedido é obrigatório');
    }
    
    if (!data.ajudanteId?.trim()) {
      errors.push('ID do ajudante é obrigatório');
    }
    
    // Se for para conversa, mensagem é opcional
    if (!isForConversation) {
      if (!data.mensagem?.trim()) {
        errors.push('Mensagem é obrigatória');
      } else if (data.mensagem.trim().length < 5) {
        errors.push('Mensagem deve ter pelo menos 5 caracteres');
      }
    }
    
    return errors;
  }

  sanitizeInteresseData(data) {
    return {
      pedidoId: data.pedidoId?.trim(),
      ajudanteId: data.ajudanteId?.trim(),
      mensagem: data.mensagem?.trim(),
      contato: data.contato?.trim() || null
    };
  }

  async createInteresse(interesseData, isForConversation = false) {
    const sanitizedData = this.sanitizeInteresseData(interesseData);
    const errors = this.validateInteresseData(sanitizedData, isForConversation);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    return await interesseModel.create(sanitizedData);
  }

  async getInteressesByPedido(pedidoId) {
    if (!pedidoId?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }
    
    return await interesseModel.findByPedidoId(pedidoId);
  }

  async getInteressesByUser(userId) {
    if (!userId?.trim()) {
      throw new Error('ID do usuário é obrigatório');
    }
    
    return await interesseModel.findByUserId(userId);
  }

  async getInteresseById(id) {
    if (!id?.trim()) {
      throw new Error('ID do interesse é obrigatório');
    }
    
    return await interesseModel.findById(id);
  }

  async updateInteresse(id, updateData) {
    if (!id?.trim()) {
      throw new Error('ID do interesse é obrigatório');
    }
    
    const sanitizedData = this.sanitizeInteresseData(updateData);
    return await interesseModel.update(id, sanitizedData);
  }
}

module.exports = new InteresseService();