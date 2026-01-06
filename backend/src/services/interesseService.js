const interesseModel = require('../models/interesseModel');

class InteresseService {
  validateInteresseData(data) {
    const errors = [];
    
    if (!data.pedidoId?.trim()) {
      errors.push('ID do pedido é obrigatório');
    }
    
    if (!data.ajudanteId?.trim()) {
      errors.push('ID do ajudante é obrigatório');
    }
    
    if (!data.mensagem?.trim() || data.mensagem.length < 10) {
      errors.push('Mensagem deve ter pelo menos 10 caracteres');
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

  async createInteresse(interesseData) {
    const sanitizedData = this.sanitizeInteresseData(interesseData);
    const errors = this.validateInteresseData(sanitizedData);
    
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

  async updateInteresse(id, updateData) {
    if (!id?.trim()) {
      throw new Error('ID do interesse é obrigatório');
    }
    
    const sanitizedData = this.sanitizeInteresseData(updateData);
    return await interesseModel.update(id, sanitizedData);
  }
}

module.exports = new InteresseService();