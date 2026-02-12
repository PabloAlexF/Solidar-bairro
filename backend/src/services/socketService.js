const socketIo = require('socket.io');
const chatService = require('./chatService');
const presenceService = require('./presenceService');
const notificationService = require('./notificationService');
const logger = require('./loggerService');

let io;

const init = (httpServer) => {
  io = socketIo(httpServer, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        process.env.FRONTEND_URL
      ].filter(Boolean),
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;
    logger.info(`🔌 Usuário conectado: ${userId} (socket: ${socket.id})`);

    // Entrar nas salas do usuário
    if (userId) {
      socket.join(userId);
      socket.join(`user_${userId}`);
      logger.info(`📬 Usuário ${userId} entrou nas salas: [${userId}, user_${userId}]`);
      
      // Debug: Listar todas as salas do socket
      const rooms = Array.from(socket.rooms);
      logger.info(`📊 Salas do socket ${socket.id}: ${rooms.join(', ')}`);

      // Marcar usuário como online
      presenceService.userConnected(userId, socket.id)
        .then(() => {
          io.emit('presence_update', {
            userId,
            isOnline: true,
            lastSeen: null
          });
        })
        .catch(error => {
          logger.error('Erro ao marcar usuário como online:', error);
        });

      // Buscar conversas do usuário e entrar nas salas
      try {
        const conversations = await chatService.getConversations(userId);
        if (conversations && Array.isArray(conversations)) {
          conversations.forEach(conv => {
            socket.join(`conversation_${conv.id}`);
          });
        }
      } catch (error) {
        logger.error('Erro ao buscar conversas para socket:', error);
      }
    }

    // Evento para entrar na sala do usuário (redundante mas útil)
    socket.on('join_user_room', (targetUserId) => {
      socket.join(targetUserId);
      socket.join(`user_${targetUserId}`);
      logger.info(`Usuário ${targetUserId} entrou na própria sala`);
    });

    // Evento para entrar em uma conversa específica
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      logger.info(`Usuário ${userId} entrou na conversa ${conversationId}`);
    });

    // Evento para sair de uma conversa
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
      logger.info(`Usuário ${userId} saiu da conversa ${conversationId}`);
    });

    // Evento para enviar mensagem
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, messageData } = data;
        const message = await chatService.sendMessage(conversationId, userId, messageData);

        // Emitir para todos na conversa
        io.to(`conversation_${conversationId}`).emit('new_message', {
          conversationId,
          message
        });

        // Forçar recarregamento das mensagens para todos os participantes
        io.to(`conversation_${conversationId}`).emit('force_reload_messages', {
          conversationId,
          reason: 'new_message_sent'
        });

        // Notificar outros participantes
        const conversation = await chatService.getConversation(conversationId);
        const otherParticipants = conversation.participants.filter(p => p !== userId);

      } catch (error) {
        logger.error('Erro ao enviar mensagem via socket:', error);
        socket.emit('message_error', { error: error.message });
      }
    });

    // Evento para marcar como lida
    socket.on('mark_as_read', async (conversationId) => {
      try {
        await chatService.markAsRead(conversationId, userId);
        // Notificar outros participantes que a conversa foi lida
        socket.to(`conversation_${conversationId}`).emit('conversation_read', {
          conversationId,
          userId
        });
      } catch (error) {
        logger.error('Erro ao marcar conversa como lida:', error);
      }
    });

    // Evento de desconexão
    socket.on('disconnect', async () => {
      logger.info(`🔌 Usuário desconectado: ${userId} (socket: ${socket.id})`);

      // Marcar usuário como offline
      if (userId) {
        try {
          await presenceService.userDisconnected(userId, socket.id);
          const presence = await presenceService.getUserPresence(userId);
          
          // Apenas emitir se o usuário ainda estiver online (outras abas/dispositivos)
          // Se estiver offline (sem conexões), o presenceService emitirá o evento após o timeout de tolerância
          if (presence.isOnline) {
            io.emit('presence_update', {
              userId,
              isOnline: presence.isOnline,
              lastSeen: presence.lastSeen
            });
          }
        } catch (error) {
          logger.error('Erro ao marcar usuário como offline:', error);
        }
      }
    });

    // Evento para consultar status de presença
    socket.on('get_presence', async (targetUserId) => {
      try {
        const presence = await presenceService.getUserPresence(targetUserId);
        socket.emit('presence_status', {
          userId: targetUserId,
          isOnline: presence.isOnline,
          lastSeen: presence.lastSeen
        });
      } catch (error) {
        logger.error('Erro ao consultar presença:', error);
      }
    });

    // Evento de digitação (Typing Status)
    socket.on('typing', (data) => {
      const { conversationId, userId, isTyping } = data;
      // Envia para todos na sala da conversa, exceto o remetente (socket.to faz o broadcast exceto sender)
      socket.to(`conversation_${conversationId}`).emit('typing', {
        conversationId,
        userId,
        isTyping
      });
    });
  });

  logger.info('✅ Socket.IO server initialized');
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

module.exports = {
  init,
  getIo
};
