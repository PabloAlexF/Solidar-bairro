const firebaseConnection = require('../config/firebase');

class UserService {
  async createUser(userData) {
    try {
      const auth = firebaseConnection.getAuth();
      const db = firebaseConnection.getDb();
      
      // Criar usuário no Authentication
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.name
      });

      // Salvar dados adicionais no Firestore
      await db.collection('users').doc(userRecord.uid).set({
        name: userData.name,
        email: userData.email,
        createdAt: new Date(),
        active: true
      });

      return { uid: userRecord.uid, ...userData };
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  async createCidadao(userData) {
    try {
      const auth = firebaseConnection.getAuth();
      const db = firebaseConnection.getDb();
      
      // Criar usuário no Authentication
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.nome
      });

      // Dados específicos do cidadão
      const cidadaoData = {
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
        endereco: {
          cep: userData.cep,
          rua: userData.rua,
          numero: userData.numero,
          complemento: userData.complemento || '',
          bairro: userData.bairro,
          cidade: userData.cidade,
          estado: userData.estado
        },
        tipo: 'cidadao',
        ativo: true,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      };

      // Salvar no Firestore na subcoleção cidadaos
      await db.collection('usuarios').doc('cidadaos').collection('cidadaos').doc(userRecord.uid).set(cidadaoData);

      return { uid: userRecord.uid, ...cidadaoData };
    } catch (error) {
      throw new Error(`Erro ao cadastrar cidadão: ${error.message}`);
    }
  }

  async getUserById(uid) {
    try {
      const db = firebaseConnection.getDb();
      const userDoc = await db.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw new Error('Usuário não encontrado');
      }
      return { uid, ...userDoc.data() };
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  async updateUser(uid, updateData) {
    try {
      const db = firebaseConnection.getDb();
      await db.collection('users').doc(uid).update({
        ...updateData,
        updatedAt: new Date()
      });
      return await this.getUserById(uid);
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  async deleteUser(uid) {
    try {
      const auth = firebaseConnection.getAuth();
      const db = firebaseConnection.getDb();
      
      await auth.deleteUser(uid);
      await db.collection('users').doc(uid).delete();
      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}

module.exports = new UserService();