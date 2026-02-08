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
      let query = this.collection.where('status', '==', 'ativo');

      // Aplicar filtros de localização no nível da query
      if (filters.city) {
        query = query.where('city', '==', filters.city);
      }

      if (filters.state) {
        query = query.where('state', '==', filters.state);
      }

      if (filters.neighborhood) {
        query = query.where('neighborhood', '==', filters.neighborhood);
      }

      if (filters.category && filters.category !== 'Todas') {
        query = query.where('category', '==', filters.category);
      }

      if (filters.urgency) {
        query = query.where('urgency', '==', filters.urgency);
      }

      // Aplicar filtro de tempo se necessário
      if (filters.onlyNew) {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        query = query.where('createdAt', '>=', yesterday);
      }

      // Ordenar por data de criação (mais recente primeiro) como padrão
      query = query.orderBy('createdAt', 'desc');

      const snapshot = await query.get();

      const pedidos = [];
      for (const doc of snapshot.docs) {
        const pedidoData = doc.data();
        const userData = await this.getUserData(pedidoData.userId);

        const pedido = {
          id: doc.id,
          ...pedidoData,
          usuario: userData
        };

        // Filtros adicionais que não podem ser feitos na query (se necessário)
        let incluir = true;

        // Filtro de tempo adicional se timeframe for especificado
        if (filters.timeframe && !filters.onlyNew) {
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

        if (incluir) {
          pedidos.push(pedido);
        }
      }

      // Ordenar por proximidade geográfica se localização do usuário for fornecida
      if (filters.userCity && filters.userState) {
        pedidos.sort((a, b) => {
          // Função auxiliar para calcular "distância" baseada em localização
          const calculateProximityScore = (pedido) => {
            let score = 0;

            // Prioridade máxima: mesma cidade
            if (pedido.city === filters.userCity) {
              score += 1000;
            }

            // Prioridade alta: mesmo estado
            if (pedido.state === filters.userState) {
              score += 100;
            }

            // Prioridade média: mesmo bairro (se disponível)
            if (filters.userNeighborhood && pedido.neighborhood === filters.userNeighborhood) {
              score += 50;
            }

            // Se não tem coordenadas exatas, usar matching de strings para proximidade regional
            if (!pedido.coordinates && pedido.city && filters.userCity) {
              // Mesmo estado mas cidade diferente: score menor
              if (pedido.state === filters.userState && pedido.city !== filters.userCity) {
                score += 10;
              }
            }

            return score;
          };

          const scoreA = calculateProximityScore(a);
          const scoreB = calculateProximityScore(b);

          // Primeiro ordenar por score de proximidade (maior primeiro)
          if (scoreA !== scoreB) {
            return scoreB - scoreA;
          }

          // Segundo critério: urgência (crítico > urgente > moderada > tranquilo > recorrente)
          const urgencyOrder = { 'critico': 0, 'urgente': 1, 'moderada': 2, 'tranquilo': 3, 'recorrente': 4 };
          const aUrgency = urgencyOrder[a.urgency] || 5;
          const bUrgency = urgencyOrder[b.urgency] || 5;

          if (aUrgency !== bUrgency) return aUrgency - bUrgency;

          // Terceiro critério: Data de criação (mais recente primeiro)
          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);

          return bDate - aDate;
        });
      }

      return pedidos;
    } catch (error) {
      console.error('Erro detalhado no findAll:', error);

      // Fallback: se a query falhar devido a índices, tentar busca sem filtros complexos
      if (error.message.includes('index')) {
        console.warn('Índice não encontrado, usando busca alternativa...');
        return await this.findAllFallback(filters);
      }

      throw new Error(`Erro ao buscar pedidos: ${error.message}`);
    }
  }

  // Método fallback para quando índices não existem
  async findAllFallback(filters = {}) {
    try {
      console.log('Usando método fallback para busca de pedidos');

      // Busca básica ordenada por data
      const snapshot = await this.collection
        .where('status', '==', 'ativo')
        .orderBy('createdAt', 'desc')
        .limit(500) // Limitar para performance
        .get();

      const pedidos = [];
      for (const doc of snapshot.docs) {
        const pedidoData = doc.data();
        const userData = await this.getUserData(pedidoData.userId);

        const pedido = {
          id: doc.id,
          ...pedidoData,
          usuario: userData
        };

        // Aplicar filtros básicos em memória
        let incluir = true;

        if (filters.category && filters.category !== 'Todas' && pedidoData.category !== filters.category) {
          incluir = false;
        }

        if (filters.urgency && pedidoData.urgency !== filters.urgency) {
          incluir = false;
        }

        // Filtros de localização mais permissivos no fallback
        if (filters.city && pedidoData.city !== filters.city) {
          incluir = false;
        }

        if (filters.state && pedidoData.state !== filters.state) {
          incluir = false;
        }

        if (filters.neighborhood && pedidoData.neighborhood !== filters.neighborhood) {
          incluir = false;
        }

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

      // Mesmo algoritmo de ordenação por proximidade
      if (filters.userCity && filters.userState) {
        pedidos.sort((a, b) => {
          const calculateProximityScore = (pedido) => {
            let score = 0;

            if (pedido.city === filters.userCity) score += 1000;
            if (pedido.state === filters.userState) score += 100;
            if (filters.userNeighborhood && pedido.neighborhood === filters.userNeighborhood) score += 50;

            if (!pedido.coordinates && pedido.city && filters.userCity) {
              if (pedido.state === filters.userState && pedido.city !== filters.userCity) {
                score += 10;
              }
            }

            return score;
          };

          const scoreA = calculateProximityScore(a);
          const scoreB = calculateProximityScore(b);

          if (scoreA !== scoreB) return scoreB - scoreA;

          const urgencyOrder = { 'critico': 0, 'urgente': 1, 'moderada': 2, 'tranquilo': 3, 'recorrente': 4 };
          const aUrgency = urgencyOrder[a.urgency] || 5;
          const bUrgency = urgencyOrder[b.urgency] || 5;

          if (aUrgency !== bUrgency) return aUrgency - bUrgency;

          const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);

          return bDate - aDate;
        });
      }

      return pedidos;
    } catch (error) {
      console.error('Erro no fallback findAll:', error);
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