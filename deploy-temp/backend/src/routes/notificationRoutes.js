const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// GET /api/notifications - Buscar notificações do usuário
router.get('/', notificationController.getNotifications);

// GET /api/notifications/unread-count - Contar notificações não lidas
router.get('/unread-count', notificationController.getUnreadCount);

// PUT /api/notifications/:id/read - Marcar notificação como lida
router.put('/:id/read', notificationController.markAsRead);

// PUT /api/notifications/mark-all-read - Marcar todas como lidas
router.put('/mark-all-read', notificationController.markAllAsRead);

// DELETE /api/notifications/:id - Deletar notificação específica
router.delete('/:id', notificationController.deleteNotification);

// DELETE /api/notifications - Deletar todas as notificações
router.delete('/', notificationController.deleteAllNotifications);

// POST /api/notifications - Criar notificação (para uso interno/admin)
router.post('/', notificationController.createNotification);

module.exports = router;