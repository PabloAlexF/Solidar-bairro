const pedidoService = require('../services/pedidoService');

class PedidoController {
  async create(req, res) {
    try {
      // Adicionar o userId do usuário autenticado
      const pedidoData = {
        ...req.body,
        userId: req.user.id // Usar 'id' que vem do token JWT
      };
      
      const pedido = await pedidoService.createPedido(pedidoData);
      
      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: pedido
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAll(req, res) {
    try {
      const filters = {
        category: req.query.category,
        urgency: req.query.urgency,
        city: req.query.city,
        state: req.query.state,
        timeframe: req.query.timeframe,
        onlyNew: req.query.onlyNew === 'true'
      };
      
      const pedidos = await pedidoService.getAllPedidos(filters);
      
      res.json({
        success: true,
        data: pedidos
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const pedido = await pedidoService.getPedidoById(id);
      
      res.json({
        success: true,
        data: pedido
      });
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      const status = error.message.includes('não encontrado') ? 404 : 500;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  async getByUserId(req, res) {
    try {
      const userId = req.user.id; // Pegar do usuário autenticado
      const pedidos = await pedidoService.getPedidosByUserId(userId);
      
      res.json({
        success: true,
        data: pedidos
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos do usuário:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        userId: req.user.id // Garantir que o userId não seja alterado
      };
      
      const pedido = await pedidoService.updatePedido(id, updateData);
      
      res.json({
        success: true,
        message: 'Pedido atualizado com sucesso',
        data: pedido
      });
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      const status = error.message.includes('não encontrado') ? 404 : 400;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await pedidoService.deletePedido(id);
      
      res.json({
        success: true,
        message: 'Pedido deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
      const status = error.message.includes('não encontrado') ? 404 : 500;
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new PedidoController();