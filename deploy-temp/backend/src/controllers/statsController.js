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

      pedidosSnapshot.docs.forEach(doc => {
        const pedido = doc.data();
        const createdAt = pedido.createdAt?.toDate ? pedido.createdAt.toDate() : new Date(pedido.createdAt);

        // Contar pedidos de hoje no bairro
        if (pedido.neighborhood === userBairro && createdAt >= today && createdAt < endDate) {
          pedidosHoje++;
        }
      });

      // Contar doações concluídas: somar ajudasConcluidas de todos os usuários (global)
      let doacoesConcluidas = 0;
      const cidadaosSnapshot = await db.collection('cidadaos').get();

      cidadaosSnapshot.docs.forEach(doc => {
        const user = doc.data();
        doacoesConcluidas += user.ajudasConcluidas || 0;
      });

      // Também contar de comércios e ONGs
      const comercioSnapshot = await db.collection('comercios').get();

      comercioSnapshot.docs.forEach(doc => {
        const user = doc.data();
        doacoesConcluidas += user.ajudasConcluidas || 0;
      });

      const ongSnapshot = await db.collection('ongs').get();

      ongSnapshot.docs.forEach(doc => {
        const user = doc.data();
        doacoesConcluidas += user.ajudasConcluidas || 0;
      });

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