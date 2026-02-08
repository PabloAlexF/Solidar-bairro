const achadosPerdidosModel = require('../models/achadosPerdidosModel');
const tipsModel = require('../models/tipsModel');
const { db } = require('../config/firebase');

class AchadosPerdidosService {
  async createItem(data, userId) {
    // Validação básica com verificação de tipo
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      throw new Error('Título é obrigatório e deve ser uma string válida');
    }
    if (!data.description || typeof data.description !== 'string' || !data.description.trim()) {
      throw new Error('Descrição é obrigatória e deve ser uma string válida');
    }
    if (!data.category || !data.type || !data.contact_info) {
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

    // Preparar dados para salvar com validação de tipos
    const itemData = {
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      type: data.type,
      location: (data.location && typeof data.location === 'string') ? data.location.trim() : '',
      date_occurrence: data.date_occurrence || new Date().toISOString().split('T')[0],
      contact_info: (typeof data.contact_info === 'string') ? data.contact_info.trim() : String(data.contact_info).trim(),
      image_url: data.image_url || '',
      reward: (data.reward && typeof data.reward === 'string') ? data.reward.trim() : (data.reward ? String(data.reward).trim() : ''),
      tags: Array.isArray(data.tags) ? data.tags.filter(tag => typeof tag === 'string' && tag.trim()) : [],
      user_id: userId,
      created_by: userId, // Adicionar campo created_by para consistência
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

    // Buscar nome do usuário
    let userName = 'Usuário SolidarBairro';
    if (item.user_id) {
      try {
        // Tentar buscar na coleção de cidadãos
        const cidadaoDoc = await db.collection('cidadaos').doc(item.user_id).get();
        if (cidadaoDoc.exists) {
          userName = cidadaoDoc.data().nome || 'Usuário SolidarBairro';
        } else {
          // Tentar buscar na coleção de famílias
          const familiaDoc = await db.collection('familias').doc(item.user_id).get();
          if (familiaDoc.exists) {
            userName = familiaDoc.data().nomeCompleto || 'Usuário SolidarBairro';
          }
        }
      } catch (error) {
        console.error('Erro ao buscar nome do usuário:', error);
      }
    }

    // Buscar dicas
    const tips = await tipsModel.findByItemId(id);

    return {
      ...item,
      user_name: userName,
      tips: tips
    };
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
    if (data.title && typeof data.title === 'string') updateData.title = data.title.trim();
    if (data.description && typeof data.description === 'string') updateData.description = data.description.trim();
    if (data.location && typeof data.location === 'string') updateData.location = data.location.trim();
    if (data.contact_info && typeof data.contact_info === 'string') updateData.contact_info = data.contact_info.trim();
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    if (data.reward !== undefined) {
      updateData.reward = (typeof data.reward === 'string') ? data.reward.trim() : String(data.reward).trim();
    }
    if (data.tags && Array.isArray(data.tags)) {
      updateData.tags = data.tags.filter(tag => typeof tag === 'string' && tag.trim());
    }

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

    // Allow both the item owner and authenticated users to resolve items
    // This enables collaborative resolution in chat contexts
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    return await achadosPerdidosModel.update(id, { status: 'resolved', resolved: true });
  }

  async createTip(data) {
    if (!data.item_id || !data.user_id || !data.text || !data.text.trim()) {
      throw new Error('Campos obrigatórios: item_id, user_id, text');
    }

    // Verificar se o item existe
    const item = await achadosPerdidosModel.findById(data.item_id);
    if (!item) {
      throw new Error('Item não encontrado');
    }

    return await tipsModel.create(data);
  }

  async getTipsByItemId(itemId) {
    return await tipsModel.findByItemId(itemId);
  }
}

module.exports = new AchadosPerdidosService();
