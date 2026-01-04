const bcrypt = require('bcryptjs');
const jwtUtils = require('../utils/jwt');
const firebase = require('../config/firebase');

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

      // Gerar tokens JWT
      const payload = {
        id: userData.uid,
        email: userData.email,
        type: userData.tipo,
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
    const collections = ['cidadaos', 'comercios', 'ongs', 'familias'];
    
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
            tipo: collection.slice(0, -1)
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
}

module.exports = new AuthService();