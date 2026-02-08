const firebase = require('../config/firebase');

class PresenceService {
  constructor() {
    this.onlineUsers = new Map(); // userId -> { socketId, lastSeen, isOnline }
    this.db = firebase.getDb();
    this.presenceCollection = 'user_presence';
  }

  // Quando um usuário conecta
  async userConnected(userId, socketId) {
    try {
      const now = new Date();
      const userPresence = {
        userId,
        socketId,
        isOnline: true,
        lastSeen: now,
        connectedAt: now,
        updatedAt: firebase.getTimestamp()
      };

      // Atualizar mapa em memória
      this.onlineUsers.set(userId, {
        socketId,
        lastSeen: now,
        isOnline: true,
        connectedAt: now
      });

      // Salvar no Firestore
      await this.db.collection(this.presenceCollection).doc(userId).set(userPresence, { merge: true });

      console.log(`👤 Usuário ${userId} ficou online (socket: ${socketId})`);

      // Notificar contatos sobre mudança de status
      await this.notifyContactsStatusChange(userId, true);

      return userPresence;
    } catch (error) {
      console.error('Erro ao marcar usuário como online:', error);
      throw error;
    }
  }

  // Quando um usuário desconecta
  async userDisconnected(userId, socketId) {
    try {
      const userPresence = this.onlineUsers.get(userId);

      if (userPresence && userPresence.socketId === socketId) {
        const now = new Date();

        // Marcar como offline após um delay para reconexões rápidas
        setTimeout(async () => {
          const currentPresence = this.onlineUsers.get(userId);
          if (currentPresence && currentPresence.socketId === socketId) {
            // Usuário ainda não reconectou, marcar como offline
            this.onlineUsers.set(userId, {
              ...currentPresence,
              isOnline: false,
              lastSeen: now
            });

            // Atualizar no Firestore
            await this.db.collection(this.presenceCollection).doc(userId).update({
              isOnline: false,
              lastSeen: firebase.getTimestamp(),
              updatedAt: firebase.getTimestamp()
            });

            console.log(`👤 Usuário ${userId} ficou offline`);

            // Notificar contatos sobre mudança de status
            await this.notifyContactsStatusChange(userId, false);
          }
        }, 5000); // 5 segundos de tolerância para reconexão
      }
    } catch (error) {
      console.error('Erro ao marcar usuário como offline:', error);
      throw error;
    }
  }

  // Verificar se usuário está online
  isUserOnline(userId) {
    const presence = this.onlineUsers.get(userId);
    return presence ? presence.isOnline : false;
  }

  // Obter status de presença de um usuário
  async getUserPresence(userId) {
    try {
      // Primeiro verificar na memória
      const memoryPresence = this.onlineUsers.get(userId);
      if (memoryPresence) {
        return {
          userId,
          isOnline: memoryPresence.isOnline,
          lastSeen: memoryPresence.lastSeen
        };
      }

      // Se não estiver na memória, buscar no Firestore
      const doc = await this.db.collection(this.presenceCollection).doc(userId).get();
      if (doc.exists) {
        const data = doc.data();
        return {
          userId,
          isOnline: data.isOnline || false,
          lastSeen: data.lastSeen?.toDate() || new Date()
        };
      }

      // Usuário nunca conectou
      return {
        userId,
        isOnline: false,
        lastSeen: null
      };
    } catch (error) {
      console.error('Erro ao obter presença do usuário:', error);
      return {
        userId,
        isOnline: false,
        lastSeen: null
      };
    }
  }

  // Obter status de presença de múltiplos usuários
  async getUsersPresence(userIds) {
    try {
      const results = {};

      for (const userId of userIds) {
        results[userId] = await this.getUserPresence(userId);
      }

      return results;
    } catch (error) {
      console.error('Erro ao obter presença de múltiplos usuários:', error);
      return {};
    }
  }

  // Notificar contatos sobre mudança de status
  async notifyContactsStatusChange(userId, isOnline) {
    try {
      const io = require('./socketService').getIo();

      // Buscar conversas do usuário para encontrar contatos
      const conversations = await this.getUserConversations(userId);

      // Para cada conversa, notificar o outro participante
      for (const conv of conversations) {
        const otherParticipantId = conv.participants.find(p => p !== userId);
        if (otherParticipantId) {
          // Enviar notificação para o contato
          io.to(`user_${otherParticipantId}`).emit('user_status_change', {
            userId,
            isOnline,
            lastSeen: new Date()
          });
        }
      }
    } catch (error) {
      console.error('Erro ao notificar mudança de status:', error);
    }
  }

  // Buscar conversas do usuário (método auxiliar)
  async getUserConversations(userId) {
    try {
      const snapshot = await this.db.collection('conversations')
        .where('participants', 'array-contains', userId)
        .limit(50)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar conversas do usuário:', error);
      return [];
    }
  }

  // Limpar usuários offline há muito tempo
  async cleanupOfflineUsers() {
    try {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 horas

      // Buscar usuários offline há mais de 24 horas no Firestore
      const snapshot = await this.db.collection(this.presenceCollection)
        .where('isOnline', '==', false)
        .where('lastSeen', '<', firebase.getTimestampFromDate(cutoffTime))
        .get();

      const batch = this.db.batch();

      snapshot.docs.forEach(doc => {
        // Remover da memória se existir
        this.onlineUsers.delete(doc.id);
        // Remover do Firestore
        batch.delete(doc.ref);
      });

      await batch.commit();

      if (snapshot.docs.length > 0) {
        console.log(`🧹 Limpos ${snapshot.docs.length} usuários offline antigos`);
      }
    } catch (error) {
      console.error('Erro ao limpar usuários offline:', error);
    }
  }

  // Ping para manter usuário online
  async pingUser(userId) {
    try {
      const presence = this.onlineUsers.get(userId);
      if (presence) {
        presence.lastSeen = new Date();

        // Atualizar no Firestore
        await this.db.collection(this.presenceCollection).doc(userId).update({
          lastSeen: firebase.getTimestamp(),
          updatedAt: firebase.getTimestamp()
        });
      }
    } catch (error) {
      console.error('Erro ao fazer ping do usuário:', error);
    }
  }

  // Inicializar limpeza automática
  startCleanupInterval() {
    // Limpar usuários offline a cada hora
    setInterval(() => {
      this.cleanupOfflineUsers();
    }, 60 * 60 * 1000); // 1 hora
  }
}

module.exports = new PresenceService();
