const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rotas públicas
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

// Rotas protegidas
router.post('/verify', authenticateToken, authController.verify);
router.post('/logout', authController.logout);
router.delete('/conta', authenticateToken, authController.deleteAccount);

module.exports = router;
