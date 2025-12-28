const { db, auth } = require('../config/firebase');

class UserService {
  async createUser(userData) {
    try {
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

  async getUserById(uid) {
    try {
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
      await auth.deleteUser(uid);
      await db.collection('users').doc(uid).delete();
      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}

module.exports = new UserService();