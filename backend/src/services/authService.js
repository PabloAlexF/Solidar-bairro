const firebase = require('../config/firebase');

class AuthService {
  constructor() {
    this.auth = firebase.getAuth();
    this.db = firebase.getDb();
  }

  async login(email, password) {
    try {
      console.log('AuthService login:', { email, password: '***' });
      
      // Em desenvolvimento, fazer login simplificado
      if (firebase.isDevelopmentMode()) {
        console.log('Development mode login');
        const userData = await this.getUserData('mock-user');
        return {
          uid: 'mock-user',
          email: email,
          ...userData
        };
      }
      
      // Buscar dados do usuário no Firestore primeiro
      const userData = await this.getUserDataByEmail(email);
      console.log('User data found:', userData ? 'Yes' : 'No');
      console.log('Full user data:', userData);
      
      if (!userData) {
        throw new Error('Usuário não encontrado');
      }

      console.log('Comparing passwords:', {
        provided: password,
        stored_senha: userData.senha,
        stored_password: userData.password
      });

      // Verificar senha (comparação simples - em produção usar hash)
      if (userData.senha !== password && userData.password !== password) {
        throw new Error('Senha incorreta');
      }

      console.log('Password match successful');

      // Retornar dados do usuário sem a senha
      const { senha, password: pwd, ...userWithoutPassword } = userData;
      
      return {
        uid: userData.uid,
        email: email,
        ...userWithoutPassword
      };
    } catch (error) {
      console.log('AuthService error:', error.message);
      throw error;
    }
  }

  async getUserData(uid) {
    // Buscar em todas as coleções possíveis
    const collections = ['cidadaos', 'comercios', 'ongs', 'familias'];
    
    for (const collection of collections) {
      try {
        const doc = await this.db.collection(collection).doc(uid).get();
        if (doc.exists) {
          return {
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

  async verifyToken(token) {
    try {
      // Em desenvolvimento, aceitar qualquer token
      if (firebase.isDevelopmentMode()) {
        return { uid: 'mock-user', email: 'test@example.com' };
      }
      
      const decodedToken = await this.auth.verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

module.exports = new AuthService();