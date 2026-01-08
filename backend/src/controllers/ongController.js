const ongService = require('../services/ongService');
const authService = require('../services/authService');

class ONGController {
  async createONG(req, res) {
    try {
      // Hash da senha antes de passar para o service
      if (req.body.senha) {
        req.body.senha = await authService.hashPassword(req.body.senha);
      }
      
      const ong = await ongService.createONG(req.body);
      res.status(201).json({ success: true, data: ong });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getONGs(req, res) {
    try {
      const ongs = await ongService.getONGs();
      res.json({ success: true, data: ongs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getONGById(req, res) {
    try {
      const ong = await ongService.getONGById(req.params.uid);
      res.json({ success: true, data: ong });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  async updateONG(req, res) {
    try {
      const ong = await ongService.updateONG(req.params.uid, req.body);
      res.json({ success: true, data: ong });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new ONGController();