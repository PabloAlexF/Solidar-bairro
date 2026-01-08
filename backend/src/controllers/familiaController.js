const familiaService = require('../services/familiaService');

class FamiliaController {
  async createFamilia(req, res) {
    try {
      const familia = await familiaService.createFamilia(req.body);
      res.status(201).json({ success: true, data: familia });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getFamilias(req, res) {
    try {
      const familias = await familiaService.getFamilias();
      res.json({ success: true, data: familias });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getFamiliaById(req, res) {
    try {
      const familia = await familiaService.getFamiliaById(req.params.id);
      res.json({ success: true, data: familia });
    } catch (error) {
      res.status(404).json({ success: false, error: error.message });
    }
  }

  async updateFamilia(req, res) {
    try {
      const familia = await familiaService.updateFamilia(req.params.id, req.body);
      res.json({ success: true, data: familia });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = new FamiliaController();