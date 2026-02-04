const notificationModel = require('../models/notificationModel');
const userService = require('./userService');

class NotificationService {
  async createNotification(data) {
    return await notificationModel.createNotification(data);
  }

  async createChatNotification(conversationId, senderId, receiverId, message) {
    try {
      // Buscar dados do remetente
      const senderData = await userService.getUserData(senderId);
      const senderName = senderData?.nome || 'Usuário';

      // Criar notificação para o destinatário
      const notification = await notificationModel.createNotification({
        userId: receiverId,
        type: 'chat',
        title: `Nova mensagem de ${senderName}`,
        message: message.length > 50 ? `${message.substring(0, 50)}...` : message,
        data: {
          conversationId,
          senderId,
          senderName
        }
      });

      return notification;
    } catch (error) {
      console.error('Erro ao criar notificação de chat:', error);
      throw error;
    }
  }

  async getUserNotifications(userId, limit = 50) {
    return await notificationModel.getUserNotifications(userId, limit);
  }

  async markAsRead(notificationId, userId) {
    return await notificationModel.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId) {
    return await notificationModel.markAllAsRead(userId);
  }

  async deleteNotification(notificationId, userId) {
    return await notificationModel.deleteNotification(notificationId, userId);
  }

  async getUnreadCount(userId) {
    return await notificationModel.getUnreadCount(userId);
  }

  async deleteAllNotifications(userId) {
    return await notificationModel.deleteAllNotifications(userId);
  }

  // Notificações específicas do sistema
  async createPedidoNotification(pedidoId, ownerId, interestedUserId, type) {
    try {
      const interestedUserData = await userService.getUserData(interestedUserId);
      const userName = interestedUserData?.nome || 'Usuário';

      let title, message;
      
      switch (type) {
        case 'new_interest':
          title = 'Novo interesse no seu pedido';
          message = `${userName} demonstrou interesse em ajudar você`;
          break;
        case 'interest_accepted':
          title = 'Seu interesse foi aceito';
          message = 'Sua oferta de ajuda foi aceita! Você pode iniciar uma conversa.';
          break;
        default:
          title = 'Nova atividade no seu pedido';
          message = 'Há uma nova atividade relacionada ao seu pedido';
      }

      return await notificationModel.createNotification({
        userId: type === 'interest_accepted' ? interestedUserId : ownerId,
        type: 'pedido',
        title,
        message,
        data: {
          pedidoId,
          type,
          relatedUserId: type === 'interest_accepted' ? ownerId : interestedUserId
        }
      });
    } catch (error) {
      console.error('Erro ao criar notificação de pedido:', error);
      throw error;
    }
  }

  async createAchadoPerdidoNotification(itemId, ownerId, interestedUserId, type) {
    try {
      const interestedUserData = await userService.getUserData(interestedUserId);
      const userName = interestedUserData?.nome || 'Usuário';

      let title, message;
      
      switch (type) {
        case 'item_found':
          title = 'Alguém pode ter encontrado seu item';
          message = `${userName} relatou ter encontrado um item similar`;
          break;
        case 'item_claimed':
          title = 'Alguém reivindicou seu item encontrado';
          message = `${userName} disse que o item encontrado é dele`;
          break;
        default:
          title = 'Nova atividade no seu item';
          message = 'Há uma nova atividade relacionada ao seu item';
      }

      return await notificationModel.createNotification({
        userId: ownerId,
        type: 'achado_perdido',
        title,
        message,
        data: {
          itemId,
          type,
          relatedUserId: interestedUserId
        }
      });
    } catch (error) {
      console.error('Erro ao criar notificação de achado/perdido:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();