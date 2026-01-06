const interesseService = require('../services/interesseService');

class InteresseController {
  async create(req, res) {
    try {
      const interesseData = {
        ...req.body,
        ajudanteId: req.user.id
      };
      
      const interesse = await interesseService.createInteresse(interesseData);
      
      res.status(201).json({
        success: true,
        message: 'Interesse registrado com sucesso',
        data: interesse
      });
    } catch (error) {
      console.error('Erro ao criar interesse:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getByPedido(req, res) {
    try {
      const { pedidoId } = req.params;
      const interesses = await interesseService.getInteressesByPedido(pedidoId);
      
      res.json({
        success: true,
        data: interesses
      });
    } catch (error) {
      console.error('Erro ao buscar interesses:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getByUser(req, res) {
    try {
      const userId = req.user.id;
      const interesses = await interesseService.getInteressesByUser(userId);
      
      res.json({
        success: true,
        data: interesses
      });
    } catch (error) {
      console.error('Erro ao buscar interesses do usuário:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const interesse = await interesseService.updateInteresse(id, req.body);
      
      res.json({
        success: true,
        message: 'Interesse atualizado com sucesso',
        data: interesse
      });
    } catch (error) {
      console.error('Erro ao atualizar interesse:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new InteresseController();