const comercioService = require('../services/comercioService');
const authService = require('../services/authService');

class ComercioController {
  async createComercio(req, res) {
    try {
      // Hash da senha antes de passar para o service
      if (req.body.senha) {
        req.body.senha = await authService.hashPassword(req.body.senha);
      }
      
      const comercio = await comercioService.createComercio(req.body);
      res.status(201).json({ success: true, data: comercio });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getComercios(req, res) {
    try {
      const comercios = await comercioService.getComercios();
      res.json({ success: true, data: comercios });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getComercioById(req, res) {
    try {
      const comercio = await comercioService.getComercioById(req.params.uid);
      res.json({ success: true, data: comercio });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ComercioController();