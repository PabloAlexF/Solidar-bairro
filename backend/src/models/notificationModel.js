const firebase = require('../config/firebase');

class NotificationModel {
  constructor() {
    this.db = firebase.getDb();
    this.collection = 'notifications';
  }

  async createNotification(data) {
    try {
      const notification = {
        userId: data.userId,
        type: data.type || 'general',
        title: data.title,
        message: data.message,
        data: data.data || {},
        read: false,
        createdAt: firebase.getTimestamp(),
        updatedAt: firebase.getTimestamp()
      };

      const docRef = await this.db.collection(this.collection).add(notification);
      
      return {
        id: docRef.id,
        ...notification
      };
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      throw error;
    }
  }

  async getUserNotifications(userId, limit = 50) {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  }

  async markAsRead(notificationId, userId) {
    try {
      const docRef = this.db.collection(this.collection).doc(notificationId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Notificação não encontrada');
      }

      const notification = doc.data();
      if (notification.userId !== userId) {
        throw new Error('Acesso negado');
      }

      await docRef.update({
        read: true,
        updatedAt: firebase.getTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  }

  async markAllAsRead(userId) {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where('userId', '==', userId)
        .where('read', '==', false)
        .get();

      const batch = this.db.batch();

      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          read: true,
          updatedAt: firebase.getTimestamp()
        });
      });

      await batch.commit();
      return snapshot.docs.length;
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId, userId) {
    try {
      const docRef = this.db.collection(this.collection).doc(notificationId);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Notificação não encontrada');
      }

      const notification = doc.data();
      if (notification.userId !== userId) {
        throw new Error('Acesso negado');
      }

      await docRef.delete();
      return true;
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  }

  async getUnreadCount(userId) {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where('userId', '==', userId)
        .where('read', '==', false)
        .get();

      return snapshot.size;
    } catch (error) {
      console.error('Erro ao contar notificações não lidas:', error);
      throw error;
    }
  }

  async deleteAllNotifications(userId) {
    try {
      const snapshot = await this.db
        .collection(this.collection)
        .where('userId', '==', userId)
        .get();

      const batch = this.db.batch();

      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      return snapshot.docs.length;
    } catch (error) {
      console.error('Erro ao deletar todas as notificações:', error);
      throw error;
    }
  }
}

module.exports = new NotificationModel();