const { db } = require('../config/firebase');

class InteresseModel {
  constructor() {
    this.collection = db.collection('interesses');
  }

  async create(interesseData) {
    try {
      const docRef = await this.collection.add({
        ...interesseData,
        createdAt: new Date(),
        status: 'pendente'
      });
      
      return {
        id: docRef.id,
        ...interesseData
      };
    } catch (error) {
      throw new Error(`Erro ao criar interesse: ${error.message}`);
    }
  }

  async findByPedidoId(pedidoId) {
    try {
      const snapshot = await this.collection
        .where('pedidoId', '==', pedidoId)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Erro ao buscar interesses: ${error.message}`);
    }
  }

  async findByUserId(userId) {
    try {
      const snapshot = await this.collection
        .where('ajudanteId', '==', userId)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Erro ao buscar interesses do usuário: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      await this.collection.doc(id).update({
        ...updateData,
        updatedAt: new Date()
      });
      
      const doc = await this.collection.doc(id).get();
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Erro ao atualizar interesse: ${error.message}`);
    }
  }
}

module.exports = new InteresseModel();