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

    // Entrar nas salas das conversas do usuário
    if (userId) {
      socket.join(userId); // Sala principal do usuário
      socket.join(`user_${userId}`); // Sala alternativa

      // Marcar usuário como online
      presenceService.userConnected(userId, socket.id).catch(error => {
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

        otherParticipants.forEach(async (participantId) => {
          // Criar notificação no banco de dados
          try {
            await notificationService.createChatNotification(conversationId, userId, participantId, messageData.content || messageData.text);
          } catch (error) {
            logger.error('Erro ao criar notificação de chat:', error);
          }

          // Emitir notificação via socket
          io.to(`user_${participantId}`).emit('notification', {
            conversationId,
            message: messageData.content || messageData.text,
            senderId: userId,
            type: 'chat',
            title: `Nova mensagem`,
            message: messageData.content || messageData.text,
            createdAt: new Date()
          });
        });

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
    socket.on('disconnect', () => {
      logger.info(`🔌 Usuário desconectado: ${userId} (socket: ${socket.id})`);

      // Marcar usuário como offline
      if (userId) {
        presenceService.userDisconnected(userId, socket.id).catch(error => {
          logger.error('Erro ao marcar usuário como offline:', error);
        });
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
