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
      console.log('AuthService login:', { email, password: '***' });
      
      // Buscar dados do usuário no Firestore
      const userData = await this.getUserDataByEmail(email);
      console.log('User data found:', userData ? 'Yes' : 'No');
      
      if (!userData) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar senha
      let isValidPassword = false;
      if (userData.senha) {
        // Tentar comparar com hash
        try {
          isValidPassword = await bcrypt.compare(password, userData.senha);
        } catch (error) {
          // Se falhar, comparar diretamente (senha não hasheada)
          isValidPassword = userData.senha === password;
        }
      } else if (userData.password) {
        isValidPassword = userData.password === password;
      }

      if (!isValidPassword) {
        throw new Error('Senha incorreta');
      }

      // Usuários registrados podem fazer login imediatamente (exceto admin)
      // A aprovação é automática no cadastro

      // Gerar tokens JWT
      const payload = {
        id: userData.uid,
        email: userData.email,
        type: userData.tipo,
        role: userData.tipo === 'admin' ? 'admin' : 'user',
        nome: userData.nome || userData.nomeEstabelecimento || userData.nomeEntidade
      };

      const { accessToken, refreshToken } = jwtUtils.generateTokens(payload);

      // Remover senha dos dados
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
}

module.exports = new AuthService();