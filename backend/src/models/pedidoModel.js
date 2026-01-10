const firebase = require('../config/firebase');
const authService = require('../services/authService');

class PedidoModel {
  constructor() {
    this.db = firebase.getDb();
    this.collection = this.db.collection('pedidos');
  }

  async getUserData(userId) {
    try {
      const collections = ['cidadaos', 'comercios', 'ongs', 'familias'];
      
      for (const collection of collections) {
        const doc = await this.db.collection(collection).doc(userId).get();
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

  async findAll(filters = {}) {
    try {
      // Buscar todos os pedidos primeiro (sem filtros complexos)
      const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
      
      const pedidos = [];
      for (const doc of snapshot.docs) {
        const pedidoData = doc.data();
        const userData = await this.getUserData(pedidoData.userId);
        
        const pedido = {
          id: doc.id,
          ...pedidoData,
          usuario: userData
        };
        
        // Aplicar filtros no código (temporário até criar índices)
        let incluir = true;
        
        if (filters.category && filters.category !== 'Todas' && pedidoData.category !== filters.category) {
          incluir = false;
        }
        
        if (filters.urgency && pedidoData.urgency !== filters.urgency) {
          incluir = false;
        }
        
        if (filters.city) {
          let pedidoCity = pedidoData.city;
          
          // Se não tem city direto, extrair da location
          if (!pedidoCity && pedidoData.location) {
            // Formato esperado: "Bairro, Cidade - Estado"
            const parts = pedidoData.location.split(',');
            if (parts.length >= 2) {
              const secondPart = parts[1].trim();
              if (secondPart.includes('-')) {
                pedidoCity = secondPart.split('-')[0].trim();
              } else {
                pedidoCity = secondPart;
              }
            }
          }
          
          if (pedidoCity !== filters.city) {
            incluir = false;
          }
        }
        
        if (filters.state) {
          let pedidoState = pedidoData.state;
          
          // Se não tem state direto, extrair da location
          if (!pedidoState && pedidoData.location) {
            // Formato esperado: "Bairro, Cidade - Estado"
            const parts = pedidoData.location.split(',');
            if (parts.length >= 2) {
              const secondPart = parts[1].trim();
              if (secondPart.includes('-')) {
                pedidoState = secondPart.split('-')[1].trim();
              }
            }
          }
          
          if (pedidoState !== filters.state) {
            incluir = false;
          }
        }
        
        // Filtro de tempo
        if (filters.timeframe) {
          const now = new Date();
          const createdAt = pedidoData.createdAt?.toDate ? pedidoData.createdAt.toDate() : new Date(pedidoData.createdAt);
          
          let startDate;
          switch (filters.timeframe) {
            case 'hoje':
              startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              break;
            case 'semana':
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case 'mes':
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
          }
          
          if (startDate && createdAt < startDate) {
            incluir = false;
          }
        }
        
        // Filtro "apenas novos" (últimas 24h)
        if (filters.onlyNew) {
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const createdAt = pedidoData.createdAt?.toDate ? pedidoData.createdAt.toDate() : new Date(pedidoData.createdAt);
          
          if (createdAt < yesterday) {
            incluir = false;
          }
        }
        
        if (incluir) {
          pedidos.push(pedido);
        }
      }
      
      return pedidos;
    } catch (error) {
      console.error('Erro detalhado no findAll:', error);
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