const cidadaoService = require('../services/cidadaoService');

class CidadaoController {
  async createCidadao(req, res) {
    try {
      const cidadao = await cidadaoService.createCidadao(req.body);
      res.status(201).json({ success: true, data: cidadao });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getCidadaos(req, res) {
    try {
      const cidadaos = await cidadaoService.getCidadaos();
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
}

module.exports = new CidadaoController();