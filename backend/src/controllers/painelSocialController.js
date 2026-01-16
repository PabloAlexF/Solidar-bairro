const painelSocialService = require('../services/painelSocialService');

class PainelSocialController {
  async getDashboardData(req, res) {
    try {
      const { bairro } = req.params;
      const data = await painelSocialService.getDashboardData(bairro);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getPedidosAjuda(req, res) {
    try {
      const { bairro } = req.query;
      const pedidos = await painelSocialService.getPedidosAjuda(bairro);
      res.json({ success: true, data: pedidos });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getComerciosParceiros(req, res) {
    try {
      const { bairro } = req.query;
      const comercios = await painelSocialService.getComerciosParceiros(bairro);
      res.json({ success: true, data: comercios });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getOngsAtuantes(req, res) {
    try {
      const { bairro } = req.query;
      const ongs = await painelSocialService.getOngsAtuantes(bairro);
      res.json({ success: true, data: ongs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new PainelSocialController();
