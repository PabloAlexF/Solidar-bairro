const achadosPerdidosService = require('../services/achadosPerdidosService');

const createItem = async (req, res) => {
  try {
    const userId = req.user?.uid || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const item = await achadosPerdidosService.createItem(req.body, userId);
    res.status(201).json({
      success: true,
      message: 'Item criado com sucesso',
      data: item
    });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

const getAllItems = async (req, res) => {
  try {
    const filters = {};
    
    if (req.query.type) filters.type = req.query.type;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.city) filters.city = req.query.city;

    let items;
    if (req.query.search) {
      items = await achadosPerdidosService.searchItems(req.query.search, filters);
    } else {
      items = await achadosPerdidosService.getAllItems(filters);
    }

    res.json({
      success: true,
      data: items,
      total: items.length
    });
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await achadosPerdidosService.getItemById(req.params.id);
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Erro ao buscar item:', error);
    if (error.message === 'Item não encontrado') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const userId = req.user?.uid || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const item = await achadosPerdidosService.updateItem(req.params.id, req.body, userId);
    res.json({
      success: true,
      message: 'Item atualizado com sucesso',
      data: item
    });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    if (error.message === 'Item não encontrado') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    if (error.message === 'Não autorizado a editar este item') {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const userId = req.user?.uid || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    await achadosPerdidosService.deleteItem(req.params.id, userId);
    res.json({
      success: true,
      message: 'Item deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    if (error.message === 'Item não encontrado') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    if (error.message === 'Não autorizado a deletar este item') {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

const getUserItems = async (req, res) => {
  try {
    const userId = req.user?.uid || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const items = await achadosPerdidosService.getUserItems(userId);
    res.json({
      success: true,
      data: items,
      total: items.length
    });
  } catch (error) {
    console.error('Erro ao buscar itens do usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

const markAsResolved = async (req, res) => {
  try {
    const userId = req.user?.uid || req.user?.id;
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Usuário não autenticado' 
      });
    }

    console.log('Tentando resolver item:', req.params.id, 'por usuário:', userId);
    const item = await achadosPerdidosService.markAsResolved(req.params.id, userId);
    
    res.json({
      success: true,
      message: 'Item marcado como resolvido',
      data: item
    });
  } catch (error) {
    console.error('Erro ao resolver item:', error);
    
    if (error.message === 'Item não encontrado') {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    // Remove the specific authorization check since we changed the service
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getUserItems,
  markAsResolved
};