const achadosPerdidosModel = require('../models/achadosPerdidosModel');

class AchadosPerdidosService {
  async createItem(data, userId) {
    // Validação básica
    if (!data.title || !data.description || !data.category || !data.type || !data.contact_info) {
      throw new Error('Campos obrigatórios: title, description, category, type, contact_info');
    }

    if (!['lost', 'found'].includes(data.type)) {
      throw new Error('Tipo deve ser "lost" ou "found"');
    }

    const validCategories = [
      'Eletrônicos', 'Documentos', 'Pets', 'Chaves', 'Vestuário',
      'Carteiras', 'Bolsas/Mochilas', 'Joias/Relógios', 'Outros'
    ];

    if (!validCategories.includes(data.category)) {
      throw new Error('Categoria inválida');
    }

    // Preparar dados para salvar
    const itemData = {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      type: data.type,
      location: data.location?.trim() || '',
      date_occurrence: data.date_occurrence || new Date().toISOString().split('T')[0],
      contact_info: data.contact_info.trim(),
      image_url: data.image_url || '',
      reward: data.reward?.trim() || '',
      tags: Array.isArray(data.tags) ? data.tags.filter(tag => tag.trim()) : [],
      user_id: userId,
      city: data.city || '',
      state: data.state || '',
      neighborhood: data.neighborhood || ''
    };

    return await achadosPerdidosModel.create(itemData);
  }

  async getAllItems(filters = {}) {
    return await achadosPerdidosModel.findAll(filters);
  }

  async getItemById(id) {
    const item = await achadosPerdidosModel.findById(id);
    if (!item) {
      throw new Error('Item não encontrado');
    }
    return item;
  }

  async updateItem(id, data, userId) {
    const item = await achadosPerdidosModel.findById(id);
    if (!item) {
      throw new Error('Item não encontrado');
    }

    if (item.user_id !== userId) {
      throw new Error('Não autorizado a editar este item');
    }

    const updateData = {};
    if (data.title) updateData.title = data.title.trim();
    if (data.description) updateData.description = data.description.trim();
    if (data.location) updateData.location = data.location.trim();
    if (data.contact_info) updateData.contact_info = data.contact_info.trim();
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    if (data.reward !== undefined) updateData.reward = data.reward.trim();
    if (data.tags) updateData.tags = Array.isArray(data.tags) ? data.tags.filter(tag => tag.trim()) : [];

    return await achadosPerdidosModel.update(id, updateData);
  }

  async deleteItem(id, userId) {
    const item = await achadosPerdidosModel.findById(id);
    if (!item) {
      throw new Error('Item não encontrado');
    }

    if (item.user_id !== userId) {
      throw new Error('Não autorizado a deletar este item');
    }

    return await achadosPerdidosModel.delete(id);
  }

  async getUserItems(userId) {
    return await achadosPerdidosModel.findByUser(userId);
  }

  async searchItems(searchTerm, filters = {}) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return await this.getAllItems(filters);
    }
    return await achadosPerdidosModel.search(searchTerm.trim(), filters);
  }

  async markAsResolved(id, userId) {
    const item = await achadosPerdidosModel.findById(id);
    if (!item) {
      throw new Error('Item não encontrado');
    }

    if (item.user_id !== userId) {
      throw new Error('Não autorizado a resolver este item');
    }

    return await achadosPerdidosModel.update(id, { status: 'resolved' });
  }
}

module.exports = new AchadosPerdidosService();