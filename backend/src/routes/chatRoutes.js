const express = require('express');
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Debug: Log when routes are being registered
console.log('🔧 Registrando rotas de chat...');

// Conversas
router.post('/conversations', authenticateToken, chatController.createConversation);
router.post('/conversations/create-or-get', authenticateToken, chatController.createOrGetConversation);
router.get('/conversations', authenticateToken, chatController.getConversations);
router.get('/conversations/:id', authenticateToken, chatController.getConversation);

// Mensagens
router.post('/conversations/:id/messages', authenticateToken, chatController.sendMessage);
router.get('/conversations/:id/messages', authenticateToken, chatController.getMessages);
router.put('/conversations/:id/read', authenticateToken, chatController.markAsRead);
router.put('/conversations/:id/close', authenticateToken, chatController.closeConversation);

// Upload de mídia
const uploadService = require('../services/uploadService');
router.post('/conversations/:id/upload', authenticateToken, uploadService.getChatMediaConfig().single('file'), chatController.uploadMedia);

console.log('✅ Rotas de chat registradas, incluindo PUT /conversations/:id/close');

module.exports = router;