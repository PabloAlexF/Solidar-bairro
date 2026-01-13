const notificationService = require('../services/notificationService');

class NotificationController {
  async getNotifications(req, res) {
    try {
      const userId = req.user.uid || req.user.id;
      const limit = parseInt(req.query.limit) || 50;
      
      const notifications = await notificationService.getUserNotifications(userId, limit);
      
      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user.uid || req.user.id;
      
      const count = await notificationService.getUnreadCount(userId);
      
      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const userId = req.user.uid || req.user.id;
      const notificationId = req.params.id;
      
      await notificationService.markAsRead(notificationId, userId);
      
      res.json({
        success: true,
        message: 'Notificação marcada como lida'
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const userId = req.user.uid || req.user.id;
      
      const count = await notificationService.markAllAsRead(userId);
      
      res.json({
        success: true,
        message: `${count} notificações marcadas como lidas`
      });
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteNotification(req, res) {
    try {
      const userId = req.user.uid || req.user.id;
      const notificationId = req.params.id;
      
      await notificationService.deleteNotification(notificationId, userId);
      
      res.json({
        success: true,
        message: 'Notificação deletada'
      });
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteAllNotifications(req, res) {
    try {
      const userId = req.user.uid || req.user.id;
      
      const count = await notificationService.deleteAllNotifications(userId);
      
      res.json({
        success: true,
        message: `${count} notificações deletadas`
      });
    } catch (error) {
      console.error('Erro ao deletar todas as notificações:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async createNotification(req, res) {
    try {
      const { userId, type, title, message, data } = req.body;
      
      const notification = await notificationService.createNotification({
        userId,
        type,
        title,
        message,
        data
      });
      
      res.status(201).json({
        success: true,
        data: notification
      });
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new NotificationController();