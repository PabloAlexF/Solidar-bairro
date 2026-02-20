const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwtUtils = require('../utils/jwt');
const firebase = require('../config/firebase');
const emailService = require('./emailService');

class AuthService {
  constructor() {
    this.auth = firebase.getAuth();
    this.db = firebase.getDb();
  }

  async login(email, password) {
    try {
      console.log('=== LOGIN DEBUG ===');
      console.log('Email:', email);
      console.log('Password:', password);
      
      const userData = await this.getUserDataByEmail(email);
      console.log('User found:', !!userData);
      
      if (!userData) {
        throw new Error('Usuário não encontrado');
      }

      console.log('User type:', userData.tipo);
      console.log('Has senha field:', !!userData.senha);
      console.log('Has password field:', !!userData.password);

      let isValidPassword = false;
      if (userData.senha) {
        console.log('Testing with bcrypt...');
        isValidPassword = await bcrypt.compare(password, userData.senha);
        console.log('Bcrypt result:', isValidPassword);
      } else if (userData.password) {
        console.log('Testing direct comparison...');
        isValidPassword = userData.password === password;
        console.log('Direct comparison result:', isValidPassword);
      } else {
        console.log('No password field found!');
      }

      if (!isValidPassword) {
        console.log('=== LOGIN FAILED ===');
        throw new Error('Senha incorreta');
      }

      console.log('=== LOGIN SUCCESS ===');
      const payload = {
        id: userData.uid,
        email: userData.email,
        type: userData.tipo,
        role: userData.tipo === 'admin' ? 'admin' : 'user',
        nome: userData.nome || userData.nomeCompleto || userData.nomeEstabelecimento || userData.nomeEntidade
      };

      const { accessToken, refreshToken } = jwtUtils.generateTokens(payload);
      const { senha, password: pwd, ...userWithoutPassword } = userData;
      
      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token: accessToken,
          refreshToken
        }
      };
    } catch (error) {
      console.log('AuthService error:', error.message);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwtUtils.verifyRefreshToken(refreshToken);
      
      const payload = {
        id: decoded.id,
        email: decoded.email,
        type: decoded.type,
        nome: decoded.nome
      };

      const { accessToken, refreshToken: newRefreshToken } = jwtUtils.generateTokens(payload);

      return {
        success: true,
        data: {
          token: accessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      throw new Error('Refresh token inválido');
    }
  }

  async verifyToken(token) {
    try {
      const decoded = jwtUtils.verifyAccessToken(token);
      return {
        success: true,
        data: decoded
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserDataByEmail(email) {
    const collections = ['admins', 'cidadaos', 'comercios', 'ongs', 'familias'];
    
    for (const collection of collections) {
      try {
        const snapshot = await this.db.collection(collection)
          .where('email', '==', email)
          .limit(1)
          .get();
          
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          return {
            uid: doc.id,
            ...doc.data(),
            tipo: collection === 'admins' ? 'admin' : collection.slice(0, -1)
          };
        }
      } catch (error) {
        console.log(`Erro ao buscar em ${collection}:`, error.message);
      }
    }
    
    return null;
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  // Gerar código de confirmação de 6 dígitos
  generateConfirmationCode() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Enviar código de confirmação por email
  async sendConfirmationCode(userId, newEmail) {
    try {
      console.log('Enviando código de confirmação para:', newEmail);

      // Verificar se o usuário existe
      const userData = await this.getUserDataById(userId);
      if (!userData) {
        throw new Error('Usuário não encontrado');
      }

      // Gerar código
      const code = this.generateConfirmationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      // Salvar código no Firestore
      await this.db.collection('emailConfirmations').doc(userId).set({
        userId,
        newEmail,
        code,
        expiresAt,
        createdAt: new Date()
      });

      // Tentar enviar email (não quebrar se falhar)
      try {
        await emailService.sendConfirmationCode(newEmail, code);
      } catch (emailError) {
        console.log('⚠️ Email não enviado, mas código salvo:', emailError.message);
        console.log('🔢 CÓDIGO MANUAL para', newEmail, ':', code);
      }

      return {
        success: true,
        message: 'Código de confirmação enviado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao enviar código de confirmação:', error);
      throw error;
    }
  }

  // Verificar código de confirmação
  async verifyConfirmationCode(userId, newEmail, code) {
    try {
      console.log('Verificando código de confirmação para usuário:', userId);

      // Buscar código no Firestore
      const confirmationDoc = await this.db.collection('emailConfirmations').doc(userId).get();

      if (!confirmationDoc.exists) {
        throw new Error('Código de confirmação não encontrado');
      }

      const confirmationData = confirmationDoc.data();

      // Verificar se o código expirou
      if (confirmationData.expiresAt.toDate() < new Date()) {
        // Remover código expirado
        await this.db.collection('emailConfirmations').doc(userId).delete();
        throw new Error('Código de confirmação expirado');
      }

      // Verificar código e email
      if (confirmationData.code !== code || confirmationData.newEmail !== newEmail) {
        throw new Error('Código de confirmação inválido');
      }

      // Atualizar email do usuário
      const userData = await this.getUserDataById(userId);
      if (!userData) {
        throw new Error('Usuário não encontrado');
      }

      // Determinar coleção baseada no tipo
      let collectionName;
      if (userData.tipo === 'admin') {
        collectionName = 'admins';
      } else {
        collectionName = userData.tipo + 's'; // cidadaos, comercios, ongs, familias
      }

      // Atualizar email
      await this.db.collection(collectionName).doc(userId).update({
        email: newEmail,
        updatedAt: new Date()
      });

      // Remover código usado
      await this.db.collection('emailConfirmations').doc(userId).delete();

      return {
        success: true,
        message: 'Email atualizado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao verificar código de confirmação:', error);
      throw error;
    }
  }

  // Buscar dados do usuário por ID
  async getUserDataById(userId) {
    const collections = ['admins', 'cidadaos', 'comercios', 'ongs', 'familias'];

    for (const collection of collections) {
      try {
        const doc = await this.db.collection(collection).doc(userId).get();
        if (doc.exists) {
          const data = doc.data();
          return {
            uid: doc.id,
            ...data,
            tipo: collection === 'admins' ? 'admin' : collection.slice(0, -1)
          };
        }
      } catch (error) {
        console.log(`Erro ao buscar em ${collection}:`, error.message);
      }
    }

    return null;
  }

  // Excluir conta do usuário
  async deleteAccount(userId) {
    try {
      console.log('🗑️ Iniciando exclusão de conta para:', userId);

      // 1. Buscar dados do usuário
      const userData = await this.getUserDataById(userId);
      if (!userData) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }

      console.log('📋 Usuário encontrado:', { id: userId, tipo: userData.tipo, email: userData.email });

      // 2. Deletar conversas e mensagens do usuário
      await this.deleteUserConversations(userId);

      // 3. Deletar pedidos criados pelo usuário
      await this.deleteUserPedidos(userId);

      // 4. Deletar interesses do usuário
      await this.deleteUserInteresses(userId);

      // 5. Deletar notificações do usuário
      await this.deleteUserNotifications(userId);

      // 6. Deletar dados do usuário da coleção correta
      let collectionName;
      if (userData.tipo === 'admin') {
        collectionName = 'admins';
      } else {
        collectionName = userData.tipo + 's'; // cidadaos, comercios, ongs, familias
      }

      console.log('🗑️ Deletando documento da coleção:', collectionName);
      await this.db.collection(collectionName).doc(userId).delete();

      // 7. Tentar deletar do Firebase Auth (pode falhar se não tiver permissões)
      try {
        if (firebase.getAuth()) {
          await firebase.getAuth().deleteUser(userId);
          console.log('✅ Usuário deletado do Firebase Auth');
        }
      } catch (authError) {
        console.log('⚠️ Não foi possível deletar do Firebase Auth:', authError.message);
        // Continuar mesmo se falhar - o documento principal já foi deletado
      }

      console.log('✅ Conta excluída com sucesso');
      return {
        success: true,
        message: 'Conta excluída com sucesso'
      };

    } catch (error) {
      console.error('💥 Erro ao excluir conta:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Deletar conversas do usuário
  async deleteUserConversations(userId) {
    try {
      console.log('🗑️ Deletando conversas do usuário:', userId);

      // Buscar conversas onde o usuário é participante
      const conversationsSnapshot = await this.db.collection('conversations')
        .where('participants', 'array-contains', userId)
        .get();

      if (conversationsSnapshot.empty) {
        console.log('Nenhuma conversa encontrada para este usuário');
        return;
      }

      console.log(`Encontradas ${conversationsSnapshot.size} conversas`);

      // Para cada conversa, deletar as mensagens
      for (const convDoc of conversationsSnapshot.docs) {
        const conversationId = convDoc.id;
        console.log('Processando conversa:', conversationId);

        // Deletar todas as mensagens da conversa
        const messagesSnapshot = await this.db.collection('messages')
          .where('conversationId', '==', conversationId)
          .get();

        const deletePromises = messagesSnapshot.docs.map(msgDoc => 
          msgDoc.ref.delete()
        );
        await Promise.all(deletePromises);
        console.log(`Deletadas ${messagesSnapshot.size} mensagens da conversa ${conversationId}`);

        // Deletar a conversa
        await convDoc.ref.delete();
        console.log('Conversa', conversationId, 'deletada');
      }

      console.log('✅ Conversas deletadas com sucesso');
    } catch (error) {
      console.error('Erro ao deletar conversas:', error);
    }
  }

  // Deletar pedidos do usuário
  async deleteUserPedidos(userId) {
    try {
      console.log('🗑️ Deletando pedidos do usuário:', userId);

      // Buscar pedidos criados pelo usuário
      const pedidosSnapshot = await this.db.collection('pedidos')
        .where('userId', '==', userId)
        .get();

      if (pedidosSnapshot.empty) {
        console.log('Nenhum pedido encontrado para este usuário');
        return;
      }

      console.log(`Encontrados ${pedidosSnapshot.size} pedidos`);

      // Deletar cada pedido
      for (const pedidoDoc of pedidosSnapshot.docs) {
        // Deletar interesses relacionados ao pedido
        const interessesSnapshot = await this.db.collection('interesses')
          .where('pedidoId', '==', pedidoDoc.id)
          .get();

        const deleteInteressePromises = interessesSnapshot.docs.map(intDoc => 
          intDoc.ref.delete()
        );
        await Promise.all(deleteInteressePromises);

        // Deletar o pedido
        await pedidoDoc.ref.delete();
      }

      console.log('✅ Pedidos deletados com sucesso');
    } catch (error) {
      console.error('Erro ao deletar pedidos:', error);
    }
  }

  // Deletar interesses do usuário
  async deleteUserInteresses(userId) {
    try {
      console.log('🗑️ Deletando interesses do usuário:', userId);

      // Buscar interesses do usuário
      const interessesSnapshot = await this.db.collection('interesses')
        .where('userId', '==', userId)
        .get();

      if (interessesSnapshot.empty) {
        console.log('Nenhum interesse encontrado para este usuário');
        return;
      }

      console.log(`Encontrados ${interessesSnapshot.size} interesses`);

      // Deletar cada interesse
      const deletePromises = interessesSnapshot.docs.map(intDoc => 
        intDoc.ref.delete()
      );
      await Promise.all(deletePromises);

      console.log('✅ Interesses deletados com sucesso');
    } catch (error) {
      console.error('Erro ao deletar interesses:', error);
    }
  }

  // Deletar notificações do usuário
  async deleteUserNotifications(userId) {
    try {
      console.log('🗑️ Deletando notificações do usuário:', userId);

      // Buscar notificações do usuário
      const notificationsSnapshot = await this.db.collection('notifications')
        .where('userId', '==', userId)
        .get();

      if (notificationsSnapshot.empty) {
        console.log('Nenhuma notificação encontrada para este usuário');
        return;
      }

      console.log(`Encontradas ${notificationsSnapshot.size} notificações`);

      // Deletar cada notificação
      const deletePromises = notificationsSnapshot.docs.map(notifDoc => 
        notifDoc.ref.delete()
      );
      await Promise.all(deletePromises);

      console.log('✅ Notificações deletadas com sucesso');
    } catch (error) {
      console.error('Erro ao deletar notificações:', error);
    }
  }
}

module.exports = new AuthService();
