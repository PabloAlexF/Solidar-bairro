const chatModel = require('../models/chatModel');
const notificationService = require('./notificationService');
const firebase = require('../config/firebase');
const userService = require('./userService');

class ChatService {
  constructor() {
    this.db = firebase.getDb();
  }
  async createConversation(data) {
    // Validar participantes - permitir 2 ou mais
    const validParticipants = (data.participants || []).filter(p => p && typeof p === 'string');

    if (validParticipants.length < 2) {
      throw new Error('Uma conversa deve ter pelo menos dois participantes');
    }

    // Se há um pedidoId, verificar se já existe uma conversa para este pedido
    if (data.pedidoId) {
      const existingConversation = await this.findConversationByPedido(data.pedidoId, validParticipants);
      if (existingConversation) {
        return existingConversation;
      }
    }

    const conversation = await chatModel.createConversation({
      ...data,
      participants: validParticipants
    });

    // Se há uma mensagem inicial, enviá-la
    if (data.initialMessage && data.senderId) {
      await this.sendMessage(conversation.id, data.senderId, {
        content: data.initialMessage,
        type: 'text'
      });
    }

    return conversation;
  }

  async findConversationByPedido(pedidoId, participants) {
    try {
      const conversations = await chatModel.getConversationsByPedido(pedidoId);
      
      // Procurar uma conversa que contenha todos os participantes
      return conversations.find(conv => {
        return participants.every(p => conv.participants.includes(p));
      });
    } catch (error) {
      console.error('Erro ao buscar conversa por pedido:', error);
      return null;
    }
  }

  async findConversationByItem(currentUserId, participantId, itemId, itemType) {
    try {
      // Buscar conversas do usuário atual
      const conversations = await chatModel.getConversationsByUser(currentUserId);
      
      // Procurar conversa que contenha os dois participantes e o mesmo item
      return conversations.find(conv => {
        const hasParticipants = conv.participants.includes(currentUserId) && 
                              conv.participants.includes(participantId);
        const sameItem = conv.itemId === itemId && conv.itemType === itemType;
        
        return hasParticipants && sameItem;
      });
    } catch (error) {
      console.error('Erro ao buscar conversa por item:', error);
      return null;
    }
  }

  async findExistingConversation(participants, pedidoId = null) {
    // Buscar todas as conversas do primeiro participante
    const snapshot = await chatModel.getConversationsByUser(participants[0]);
    
    return snapshot.find(conv => {
      const sameParticipants = participants.every(p => conv.participants.includes(p)) &&
                              conv.participants.length === participants.length;
      const samePedido = pedidoId ? conv.pedidoId === pedidoId : !conv.pedidoId;
      
      return sameParticipants && samePedido;
    });
  }

  async getConversations(userId) {
    const conversations = await chatModel.getConversationsByUser(userId);
    
    // Enriquecer com informações dos participantes
    const enrichedConversations = [];
    
    for (const conv of conversations) {
      const otherParticipantIds = conv.participants.filter(p => p !== userId);
      
      // Buscar dados do outro participante
      let otherParticipant = null;
      if (otherParticipantIds.length > 0) {
        otherParticipant = await userService.getUserData(otherParticipantIds[0]);
      }
      
      enrichedConversations.push({
        ...conv,
        otherParticipant
      });
    }
    
    return enrichedConversations;
  }

  async getUserData(id) {
    try {
      console.log('🔍 getUserData called with ID:', id);
      if (!id) return null;

      console.log('🔍 Buscando dados do usuário ID:', id);

      // Buscar em cidadãos
      console.log('📋 Verificando coleção cidadãos...');
      const cidadaoDoc = await this.db.collection('cidadaos').doc(id).get();

      if (cidadaoDoc.exists) {
        const cidadaoData = cidadaoDoc.data();
        console.log('✅ Usuário encontrado em cidadãos:', {
          id: cidadaoDoc.id,
          nome: cidadaoData.nome,
          email: cidadaoData.email,
          tipo: cidadaoData.tipo
        });
        return {
          id: cidadaoDoc.id,
          nome: cidadaoData.nome,
          nomeCompleto: cidadaoData.nomeCompleto,
          tipo: 'cidadao',
          bairro: cidadaoData.endereco?.bairro,
          isOnline: true // Temporário: considerar todos online
        };
      } else {
        console.log('❌ Usuário não encontrado em cidadãos');
      }

      // Buscar em comércios
      console.log('🏪 Verificando coleção comercios...');
      const comercioDoc = await this.db.collection('comercios').doc(id).get();

      if (comercioDoc.exists) {
        const comercioData = comercioDoc.data();
        console.log('✅ Usuário encontrado em comércios:', {
          id: comercioDoc.id,
          nomeFantasia: comercioData.nomeFantasia,
          razaoSocial: comercioData.razaoSocial,
          email: comercioData.email
        });
        return {
          id: comercioDoc.id,
          nome: comercioData.nomeFantasia || comercioData.razaoSocial,
          nomeCompleto: comercioData.razaoSocial,
          tipo: 'comercio',
          bairro: comercioData.endereco?.bairro,
          isOnline: true // Temporário: considerar todos online
        };
      } else {
        console.log('❌ Usuário não encontrado em comercios');
      }

      // Buscar em ONGs
      console.log('🏢 Verificando coleção ongs...');
      const ongDoc = await this.db.collection('ongs').doc(id).get();

      if (ongDoc.exists) {
        const ongData = ongDoc.data();
        console.log('✅ Usuário encontrado em ONGs:', {
          id: ongDoc.id,
          nome: ongData.nome,
          email: ongData.email
        });
        return {
          id: ongDoc.id,
          nome: ongData.nome,
          nomeCompleto: ongData.nome,
          tipo: 'ong',
          bairro: ongData.endereco?.bairro,
          isOnline: true // Temporário: considerar todos online
        };
      } else {
        console.log('❌ Usuário não encontrado em ongs');
      }

      // Buscar em famílias
      console.log('🏠 Verificando coleção familias...');
      const familiaDoc = await this.db.collection('familias').doc(id).get();

      if (familiaDoc.exists) {
        const familiaData = familiaDoc.data();
        console.log('✅ Usuário encontrado em familias:', {
          id: familiaDoc.id,
          nome: familiaData.nomeCompleto || familiaData.nome,
          email: familiaData.email
        });
        return {
          id: familiaDoc.id,
          nome: familiaData.nomeCompleto || familiaData.nome,
          nomeCompleto: familiaData.nomeCompleto || familiaData.nome,
          tipo: 'familia',
          bairro: familiaData.endereco?.bairro,
          isOnline: true // Temporário: considerar todos online
        };
      } else {
        console.log('❌ Usuário não encontrado em familias');
      }

      // Buscar em admins
      console.log('🛡️ Verificando coleção admins...');
      const adminDoc = await this.db.collection('admins').doc(id).get();

      if (adminDoc.exists) {
        const adminData = adminDoc.data();
        console.log('✅ Usuário encontrado em admins:', {
          id: adminDoc.id,
          nome: adminData.nome,
          email: adminData.email
        });
        return {
          id: adminDoc.id,
          nome: adminData.nome || 'Administrador',
          nomeCompleto: adminData.nome || 'Administrador',
          tipo: 'admin',
          bairro: 'Sede',
          isOnline: true // Temporário: considerar todos online
        };
      } else {
        console.log('❌ Usuário não encontrado em admins');
      }

      console.log('🚨 Usuário não encontrado em nenhuma coleção:', id);

      // Tentar buscar por email se o ID parecer ser um email
      if (id.includes('@')) {
        console.log('📧 ID parece ser um email, tentando buscar por email...');
        try {
          const userByEmail = await this.getUserDataByEmail(id);
          if (userByEmail) {
            console.log('✅ Usuário encontrado por email:', userByEmail);
            return userByEmail;
          }
        } catch (emailError) {
          console.log('❌ Erro ao buscar por email:', emailError.message);
        }
      }

      // Verificar se o ID pode ser um ID do Firebase Auth (mais longo)
      if (id.length > 20) {
        console.log('🔄 ID parece ser do Firebase Auth, tentando buscar em todas as coleções novamente...');
        // Tentar uma busca mais ampla
        try {
          const allCollections = ['cidadaos', 'comercios', 'ongs', 'familias', 'admins'];
          for (const collectionName of allCollections) {
            const snapshot = await this.db.collection(collectionName).where('uid', '==', id).limit(1).get();
            if (!snapshot.empty) {
              const doc = snapshot.docs[0];
              const data = doc.data();
              console.log(`✅ Usuário encontrado por UID em ${collectionName}:`, {
                id: doc.id,
                nome: data.nome || data.nomeCompleto || data.razaoSocial || data.nomeFantasia,
                tipo: data.tipo
              });
              return this.formatUserData(doc.id, data, collectionName.slice(0, -1)); // Remove 's' do plural
            }
          }
        } catch (uidError) {
          console.log('❌ Erro ao buscar por UID:', uidError.message);
        }
      }

      // Listar alguns documentos de cada coleção para debug (apenas em desenvolvimento)
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔍 Debug: Listando alguns documentos das coleções...');
        try {
          const cidadaosSnapshot = await this.db.collection('cidadaos').limit(3).get();
          console.log('📋 Cidadãos encontrados:', cidadaosSnapshot.docs.map(doc => ({ id: doc.id, nome: doc.data().nome })));

          const comerciosSnapshot = await this.db.collection('comercios').limit(3).get();
          console.log('🏪 Comércios encontrados:', comerciosSnapshot.docs.map(doc => ({ id: doc.id, nome: doc.data().nomeFantasia || doc.data().razaoSocial })));

          const ongsSnapshot = await this.db.collection('ongs').limit(3).get();
          console.log('🏢 ONGs encontradas:', ongsSnapshot.docs.map(doc => ({ id: doc.id, nome: doc.data().nome })));
        } catch (debugError) {
          console.error('Erro no debug das coleções:', debugError);
        }
      }

      // Retornar dados com melhor fallback baseado no contexto
      console.log('⚠️ Retornando dados padrão para usuário não encontrado');
      return {
        id: id,
        nome: this.getFallbackName(id),
        nomeCompleto: this.getFallbackName(id),
        tipo: 'cidadao',
        bairro: 'Não informado',
        notFound: true // Flag para indicar que o usuário não foi encontrado
      };
    } catch (error) {
      console.error('💥 Erro ao buscar dados do usuário:', error);
      // Retornar dados padrão em caso de erro
      return {
        id: id,
        nome: 'Usuário',
        nomeCompleto: 'Usuário',
        tipo: 'cidadao',
        bairro: 'Não informado'
      };
    }
  }

  async getConversation(conversationId) {
    const conversation = await chatModel.getConversation(conversationId);
    
    // Enriquecer com dados dos participantes
    const participantsData = [];
    
    for (const participantId of conversation.participants) {
      const userData = await this.getUserData(participantId);
      if (userData) {
        participantsData.push(userData);
      }
    }
    
    return {
      ...conversation,
      participantsData
    };
  }

  async sendMessage(conversationId, senderId, messageData) {
    // Verificar se o usuário faz parte da conversa
    const conversation = await chatModel.getConversation(conversationId);
    
    // Verificar com uid ou id
    const isParticipant = conversation.participants.includes(senderId) || 
                         conversation.participants.includes(senderId);
    
    if (!isParticipant) {
      console.log('Participantes da conversa:', conversation.participants);
      console.log('ID do usuário:', senderId);
      throw new Error('Usuário não autorizado nesta conversa');
    }

    const message = await chatModel.createMessage({
      conversationId,
      senderId,
      type: messageData.type || 'text',
      content: messageData.text || messageData.content,
      metadata: messageData.metadata
    });

    // Verificar se a conversa está encerrada
    if (conversation.status === 'closed') {
      throw new Error('Esta conversa foi encerrada e não aceita mais mensagens');
    }

    // Criar notificações para outros participantes
    try {
      const otherParticipants = conversation.participants.filter(p => p !== senderId);
      
      for (const participantId of otherParticipants) {
        await notificationService.createChatNotification(
          conversationId,
          senderId,
          participantId,
          messageData.text || messageData.content || 'Nova mensagem'
        );
      }
    } catch (error) {
      console.error('Erro ao criar notificações de chat:', error);
      // Não falhar o envio da mensagem por causa da notificação
    }

    return message;
  }

  async getMessages(conversationId, userId, limit = 50, lastMessageId = null) {
    // Verificar se o usuário faz parte da conversa
    const conversation = await chatModel.getConversation(conversationId);
    
    const isParticipant = conversation.participants.includes(userId);
    
    if (!isParticipant) {
      console.log('Participantes da conversa:', conversation.participants);
      console.log('ID do usuário:', userId);
      throw new Error('Usuário não autorizado nesta conversa');
    }

    return await chatModel.getMessages(conversationId, limit, lastMessageId);
  }

  async markAsRead(conversationId, userId) {
    return await chatModel.markConversationAsRead(conversationId, userId);
  }

  async closeConversation(conversationId, userId) {
    try {
      // Verificar se o usuário faz parte da conversa
      const conversation = await chatModel.getConversation(conversationId);
      
      if (!conversation.participants.includes(userId)) {
        throw new Error('Usuário não autorizado nesta conversa');
      }

      // Marcar conversa como encerrada
      await this.db.collection('conversations').doc(conversationId).update({
        status: 'closed',
        closedAt: new Date(),
        closedBy: userId
      });

      // Determinar mensagem baseada no contexto
      let messageContent = '✅ Conversa encerrada.';
      if (conversation.pedidoId) {
        messageContent = '✅ Ajuda concluída com sucesso! Conversa encerrada.';
      } else if (conversation.itemId) {
        messageContent = '✅ Item resolvido! Conversa encerrada.';
      }

      // Enviar mensagem de sistema informando o encerramento
      await chatModel.createMessage({
        conversationId,
        senderId: 'system',
        type: 'system',
        content: messageContent
      });

      return { success: true, message: 'Conversa encerrada com sucesso' };
    } catch (error) {
      console.error('Erro ao encerrar conversa:', error);
      throw error;
    }
  }
}

module.exports = new ChatService();