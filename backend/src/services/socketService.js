const socketIo = require('socket.io');
const chatService = require('./chatService');
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

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    logger.info(`🔌 Usuário conectado: ${userId} (socket: ${socket.id})`);

    // Entrar nas salas das conversas do usuário
    if (userId) {
      socket.join(`user_${userId}`);

      // Buscar conversas do usuário e entrar nas salas
      chatService.getConversations(userId).then(conversations => {
        conversations.forEach(conv => {
          socket.join(`conversation_${conv.id}`);
        });
      }).catch(error => {
        logger.error('Erro ao buscar conversas para socket:', error);
      });
    }

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

        // Notificar outros participantes
        const conversation = await chatService.getConversation(conversationId);
        const otherParticipants = conversation.participants.filter(p => p !== userId);

        otherParticipants.forEach(participantId => {
          io.to(`user_${participantId}`).emit('message_notification', {
            conversationId,
            message: messageData.content || messageData.text,
            senderId: userId
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
