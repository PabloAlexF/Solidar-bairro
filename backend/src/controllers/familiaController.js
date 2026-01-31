const familiaService = require('../services/familiaService');
const emailService = require('../services/emailService');

class FamiliaController {
  async createFamilia(req, res) {
    try {
      const familia = await familiaService.createFamilia(req.body);

      // Enviar email de boas-vindas
      try {
        const nome = req.body.nomeCompleto || req.body.nome;
        await emailService.sendWelcomeEmail(req.body.email, nome);
        console.log('Email de boas-vindas enviado para:', req.body.email);
      } catch (emailError) {
        console.error('Erro ao enviar email de boas-vindas:', emailError);
        // Não falhar o cadastro por causa do email
      }

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

  async deleteFamilia(req, res) {
    try {
      await familiaService.deleteFamilia(req.params.id);
      res.json({ success: true, message: 'Família excluída com sucesso' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async getFamiliasByBairro(req, res) {
    try {
      const familias = await familiaService.getFamiliasByBairro(req.params.bairro);
      res.json({ success: true, data: familias });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getStatsByBairro(req, res) {
    try {
      const stats = await familiaService.getStatsByBairro(req.params.bairro);
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new FamiliaController();