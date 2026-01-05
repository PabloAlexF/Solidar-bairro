const { db } = require('../config/firebase');
const authService = require('../services/authService');

class PedidoModel {
  constructor() {
    this.collection = db.collection('pedidos');
  }

  async getUserData(userId) {
    try {
      const collections = ['cidadaos', 'comercios', 'ongs', 'familias'];
      
      for (const collection of collections) {
        const doc = await db.collection(collection).doc(userId).get();
        if (doc.exists) {
          const userData = doc.data();
          return {
            nome: userData.nome || userData.nomeEstabelecimento || userData.nomeEntidade || userData.nomeCompleto || 'Usuário',
            tipo: collection.slice(0, -1)
          };
        }
      }
      
      return { nome: 'Usuário', tipo: 'cidadao' };
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return { nome: 'Usuário', tipo: 'cidadao' };
    }
  }

  async create(pedidoData) {
    try {
      const docRef = await this.collection.add({
        ...pedidoData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'ativo'
      });
      
      return {
        id: docRef.id,
        ...pedidoData
      };
    } catch (error) {
      throw new Error(`Erro ao criar pedido: ${error.message}`);
    }
  }

  async findAll() {
    try {
      const snapshot = await this.collection.get();
      
      const pedidos = [];
      for (const doc of snapshot.docs) {
        const pedidoData = doc.data();
        const userData = await this.getUserData(pedidoData.userId);
        
        pedidos.push({
          id: doc.id,
          ...pedidoData,
          usuario: userData
        });
      }
      
      return pedidos;
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      const pedidoData = doc.data();
      const userData = await this.getUserData(pedidoData.userId);
      
      return {
        id: doc.id,
        ...pedidoData,
        usuario: userData
      };
    } catch (error) {
      throw new Error(`Erro ao buscar pedido: ${error.message}`);
    }
  }

  async findByUserId(userId) {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .get();
      
      const pedidos = [];
      for (const doc of snapshot.docs) {
        const pedidoData = doc.data();
        const userData = await this.getUserData(pedidoData.userId);
        
        pedidos.push({
          id: doc.id,
          ...pedidoData,
          usuario: userData
        });
      }
      
      return pedidos;
    } catch (error) {
      throw new Error(`Erro ao buscar pedidos do usuário: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      await this.collection.doc(id).update({
        ...updateData,
        updatedAt: new Date()
      });
      
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Erro ao atualizar pedido: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar pedido: ${error.message}`);
    }
  }
}

module.exports = new PedidoModel();