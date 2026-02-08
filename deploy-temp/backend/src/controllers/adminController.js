const firebase = require('../config/firebase');
const db = firebase.getDb();

class AdminController {
  async getDashboardStats(req, res) {
    try {
      const [ongsSnapshot, comerciosSnapshot, familiasSnapshot, cidadaosSnapshot] = await Promise.all([
        db.collection('ongs').get(),
        db.collection('comercios').get(),
        db.collection('familias').get(),
        db.collection('cidadaos').get()
      ]);

      const stats = {
        totalOngs: ongsSnapshot.size,
        totalComercios: comerciosSnapshot.size,
        totalFamilias: familiasSnapshot.size,
        totalCidadaos: cidadaosSnapshot.size
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }



  async getAllEntities(req, res) {
    try {
      const { entityType } = req.params;

      if (!['ongs', 'comercios', 'familias', 'cidadaos'].includes(entityType)) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de entidade inválido'
        });
      }

      const snapshot = await db.collection(entityType).get();

      const entities = [];

      snapshot.forEach(doc => {
        entities.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort in memory by creation date
      entities.sort((a, b) => {
        const dateA = new Date(a.criadoEm || a.created_at || a.createdAt || 0);
        const dateB = new Date(b.criadoEm || b.created_at || b.createdAt || 0);
        return dateB - dateA;
      });

      res.json({
        success: true,
        data: entities
      });
    } catch (error) {
      console.error('Erro ao buscar entidades:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new AdminController();