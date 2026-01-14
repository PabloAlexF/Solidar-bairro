const cidadaoService = require('../services/cidadaoService');
const authService = require('../services/authService');

class CidadaoController {
  async createCidadao(req, res) {
    try {
      // Hash da senha antes de passar para o service
      if (req.body.password) {
        req.body.senha = await authService.hashPassword(req.body.password);
        delete req.body.password;
      }
      
      const cidadao = await cidadaoService.createCidadao(req.body);
      res.status(201).json({ success: true, data: cidadao });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getCidadaos(req, res) {
    try {
      const filters = {};
      if (req.query.status) {
        filters.status = req.query.status;
      }
      const cidadaos = await cidadaoService.getCidadaos(filters);
      res.json({ success: true, data: cidadaos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getCidadaoById(req, res) {
    try {
      const cidadao = await cidadaoService.getCidadaoById(req.params.uid);
      res.json({ success: true, data: cidadao });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  async updateCidadao(req, res) {
    try {
      const cidadao = await cidadaoService.updateCidadao(req.params.uid, req.body);
      res.json({ success: true, data: cidadao });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getAjudasConcluidas(req, res) {
    try {
      const { uid } = req.params;
      const cidadao = await cidadaoService.getCidadaoById(uid);
      res.json({ 
        success: true, 
        data: { 
          ajudasConcluidas: cidadao.ajudasConcluidas || 0 
        } 
      });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
}

module.exports = new CidadaoController();