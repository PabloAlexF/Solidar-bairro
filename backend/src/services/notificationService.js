const notificationModel = require('../models/notificationModel');
const userService = require('./userService');
const firebase = require('../config/firebase');

class NotificationService {
  async createNotification(data) {
    const notification = await notificationModel.createNotification(data);

    // Emitir notificação via Socket.IO em tempo real
    try {
      const { getIo } = require('./socketService');
      const io = getIo();
      if (io && data.userId) {
        // Emitir para múltiplas salas para garantir entrega
        io.to(data.userId).emit('notification', notification);
        io.to(`user_${data.userId}`).emit('notification', notification);
        console.log(`📢 Notificação emitida para ${data.userId}:`, notification.title);
      }
    } catch (error) {
      console.error('Erro ao emitir notificação via socket:', error);
    }

    // Tentar enviar Push Notification (FCM) para mobile/background
    this.sendPushNotification(data.userId, data.title, data.message, data.data).catch(() => {});

    return notification;
  }

  async createChatNotification(conversationId, senderId, receiverId, message, timestamp = new Date(), isOnline = false) {
    try {
      // Buscar dados do remetente
      const senderData = await userService.getUserData(senderId);
      const senderName = senderData?.nome || 'Usuário';
      const senderPhoto = senderData?.foto || senderData?.photoUrl;

      // Criar notificação para o destinatário
      const notification = await notificationModel.createNotification({
        userId: receiverId,
        type: 'chat',
        title: `Nova mensagem de ${senderName}`,
        message: message.length > 50 ? `${message.substring(0, 50)}...` : message,
        createdAt: timestamp,
        data: {
          conversationId,
          senderId,
          senderName,
          senderPhoto,
          timestamp: timestamp.toISOString()
        }
      });

      // Emitir via Socket.IO
      try {
        const { getIo } = require('./socketService');
        const io = getIo();
        if (io) {
          // Emitir para múltiplas salas
          io.to(receiverId).emit('notification', notification);
          io.to(`user_${receiverId}`).emit('notification', notification);
          console.log(`💬 Notificação de chat emitida para ${receiverId}`);
        }
      } catch (error) {
        console.error('Erro ao emitir notificação de chat via socket:', error);
      }

      // Enviar Push Notification APENAS se o usuário estiver OFFLINE
      if (!isOnline) {
        this.sendPushNotification(receiverId, `Nova mensagem de ${senderName}`, message, { 
          conversationId, 
          senderId, 
          type: 'chat',
          timestamp: timestamp.toISOString(),
          ...(senderPhoto && { icon: senderPhoto })
        }).catch(() => {});
      }

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
    const result = await notificationModel.markAsRead(notificationId, userId);

    // Emitir evento de notificação lida via socket
    try {
      const { getIo } = require('./socketService');
      const io = getIo();
      if (io && userId) {
        io.to(userId).emit('notification_read', { notificationId });
        io.to(`user_${userId}`).emit('notification_read', { notificationId });
        console.log(`✅ Notificação ${notificationId} marcada como lida para ${userId}`);
      }
    } catch (error) {
      console.error('Erro ao emitir notificação lida via socket:', error);
    }

    return result;
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

  // Helper para enviar Push Notification via Firebase Cloud Messaging (FCM)
  async sendPushNotification(userId, title, body, data = {}) {
    try {
      // 1. Buscar dados do usuário para obter o token FCM
      const user = await userService.getUserData(userId);
      
      // O token deve estar salvo no perfil do usuário (campo fcmToken ou array fcmTokens)
      const tokens = [];
      if (user.fcmToken) tokens.push(user.fcmToken);
      if (user.fcmTokens && Array.isArray(user.fcmTokens)) tokens.push(...user.fcmTokens);
      
      // Remover duplicatas e nulos
      const uniqueTokens = [...new Set(tokens.filter(t => t))];

      if (uniqueTokens.length === 0) return;

      // 2. Obter instância do Messaging
      let messaging;
      if (firebase.getMessaging) {
        messaging = firebase.getMessaging();
      } else {
        // Fallback para firebase-admin direto se não exposto no config
        const admin = require('firebase-admin');
        // Verifica se já foi inicializado para evitar erro
        messaging = admin.messaging();
      }

      // 3. Enviar mensagem
      const messagePayload = {
        notification: { 
          title, 
          body,
          ...(data.image && { image: data.image }) // Inclui imagem grande se disponível
        },
        data: Object.keys(data).reduce((acc, key) => {
          acc[key] = String(data[key]); // FCM requer strings nos dados
          return acc;
        }, {}),
        tokens: uniqueTokens
      };

      const response = await messaging.sendMulticast(messagePayload);
      console.log(`📲 Push enviado para ${userId}: ${response.successCount} sucessos`);
      
    } catch (error) {
      // Silenciar erro para não travar o fluxo principal
      // console.error('Erro ao enviar push notification:', error.message);
    }
  }
}

module.exports = new NotificationService();