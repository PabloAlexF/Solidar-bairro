const express = require('express');
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Conversas
router.post('/conversations', authenticateToken, chatController.createConversation);
router.post('/conversations/create-or-get', authenticateToken, chatController.createOrGetConversation);
router.get('/conversations', authenticateToken, chatController.getConversations);
router.get('/conversations/:id', authenticateToken, chatController.getConversation);

// Mensagens
router.post('/conversations/:id/messages', authenticateToken, chatController.sendMessage);
router.get('/conversations/:id/messages', authenticateToken, chatController.getMessages);
router.put('/conversations/:id/read', authenticateToken, chatController.markAsRead);

module.exports = router;