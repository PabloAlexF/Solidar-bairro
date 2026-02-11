const firebase = require('../config/firebase');

class PresenceService {
  constructor() {
    this.onlineUsers = new Map(); // userId -> { sockets: Set<socketId>, lastSeen: Date }
    this.db = firebase.getDb();
    this.presenceCollection = 'user_presence';
  }

  // Quando um usuário conecta
  async userConnected(userId, socketId) {
    try {
      const now = new Date();
      
      // Gerenciar conexões em memória (suporte a múltiplas abas/dispositivos)
      let userEntry = this.onlineUsers.get(userId);
      if (!userEntry) {
        userEntry = { sockets: new Set(), lastSeen: now };
        this.onlineUsers.set(userId, userEntry);
      }
      userEntry.sockets.add(socketId);
      userEntry.lastSeen = now;

      const userPresence = {
        userId,
        isOnline: true,
        lastSeen: now,
        connectedAt: now,
        updatedAt: firebase.getTimestamp()
      };

      // Salvar no Firestore
      await this.db.collection(this.presenceCollection).doc(userId).set(userPresence, { merge: true });

      console.log(`👤 Usuário ${userId} conectado (socket: ${socketId}). Conexões ativas: ${userEntry.sockets.size}`);

      return userPresence;
    } catch (error) {
      console.error('Erro ao marcar usuário como online:', error);
      throw error;
    }
  }

  // Quando um usuário desconecta
  async userDisconnected(userId, socketId) {
    try {
      const userEntry = this.onlineUsers.get(userId);

      if (userEntry && userEntry.sockets.has(socketId)) {
        userEntry.sockets.delete(socketId);
        const now = new Date();
        userEntry.lastSeen = now;

        console.log(`👤 Usuário ${userId} desconectou socket ${socketId}. Restantes: ${userEntry.sockets.size}`);

        // Se não há mais conexões, marcar como offline após delay
        if (userEntry.sockets.size === 0) {
          // Marcar como offline após um delay para reconexões rápidas
          setTimeout(async () => {
            const currentEntry = this.onlineUsers.get(userId);
            // Verifica se ainda está vazio (pode ter reconectado)
            if (currentEntry && currentEntry.sockets.size === 0) {

              // Atualizar no Firestore
              await this.db.collection(this.presenceCollection).doc(userId).update({
                isOnline: false,
                lastSeen: firebase.getTimestamp(),
                updatedAt: firebase.getTimestamp()
              });

              // Remover da memória para evitar vazamento e garantir consistência
              this.onlineUsers.delete(userId);

              console.log(`👤 Usuário ${userId} ficou totalmente offline`);

              // Emitir evento de offline globalmente via Socket.IO
              try {
                // Require dinâmico para evitar dependência circular
                const { getIo } = require('./socketService');
                const io = getIo();
                io.emit('presence_update', {
                  userId,
                  isOnline: false,
                  lastSeen: now
                });
              } catch (e) {
                console.error('Erro ao emitir evento de offline:', e);
              }
            }
          }, 5000); // 5 segundos de tolerância para reconexão
        }
      }
    } catch (error) {
      console.error('Erro ao marcar usuário como offline:', error);
      throw error;
    }
  }

  // Verificar se usuário está online
  isUserOnline(userId) {
    const userEntry = this.onlineUsers.get(userId);
    return userEntry ? userEntry.sockets.size > 0 : false;
  }

  // Obter status de presença de um usuário
  async getUserPresence(userId) {
    try {
      // Primeiro verificar na memória
      const userEntry = this.onlineUsers.get(userId);
      if (userEntry) {
        return {
          userId,
          isOnline: userEntry.sockets.size > 0,
          lastSeen: userEntry.lastSeen
        };
      }

      // Se não estiver na memória, buscar no Firestore
      const doc = await this.db.collection(this.presenceCollection).doc(userId).get();
      if (doc.exists) {
        const data = doc.data();
        return {
          userId,
          // Se não está na memória, assumimos offline (evita falso positivo após reinício do servidor)
          isOnline: false,
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
