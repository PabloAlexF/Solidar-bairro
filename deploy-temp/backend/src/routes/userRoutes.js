const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const chatService = require('../services/chatService');
const authController = require('../controllers/authController');

const router = express.Router();

// Buscar dados do usuário por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userData = await chatService.getUserData(req.params.id);

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// Solicitar mudança de email
router.post('/:userId/request-email-change', authenticateToken, authController.requestEmailChange);

// Confirmar mudança de email
router.post('/:userId/confirm-email-change', authenticateToken, authController.confirmEmailChange);

module.exports = router;
