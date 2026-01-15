const pedidoService = require('../services/pedidoService');
const cidadaoService = require('../services/cidadaoService');

class StatsController {
  async getNeighborhoodStats(req, res) {
    try {
      const { db } = require('../config/firebase');
      const userBairro = req.user?.endereco?.bairro || 'Centro';
      
      // Buscar todos os pedidos e filtrar por bairro e data
      const pedidosSnapshot = await db.collection('pedidos').get();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 1);
      
      let pedidosHoje = 0;
      let doacoesConcluidas = 0;
      
      pedidosSnapshot.docs.forEach(doc => {
        const pedido = doc.data();
        const createdAt = pedido.createdAt?.toDate ? pedido.createdAt.toDate() : new Date(pedido.createdAt);
        const updatedAt = pedido.updatedAt?.toDate ? pedido.updatedAt.toDate() : new Date(pedido.updatedAt);
        
        // Contar pedidos de hoje no bairro
        if (pedido.neighborhood === userBairro && createdAt >= today && createdAt < endDate) {
          pedidosHoje++;
        }
        
        // Contar doações concluídas hoje no bairro
        if (pedido.neighborhood === userBairro && pedido.status === 'concluido' && updatedAt >= today && updatedAt < endDate) {
          doacoesConcluidas++;
        }
      });
      
      // Contar usuários do bairro
      const cidadaosSnapshot = await db.collection('cidadaos')
        .where('endereco.bairro', '==', userBairro)
        .get();
      
      res.json({
        success: true,
        data: {
          pedidosHoje,
          doacoesConcluidas,
          areaSegura: cidadaosSnapshot.size >= 5,
          bairro: userBairro
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas do bairro:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new StatsController();