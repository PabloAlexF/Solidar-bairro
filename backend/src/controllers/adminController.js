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
        totalCidadaos: cidadaosSnapshot.size,
        pendingOngs: 0,
        pendingComercios: 0,
        pendingFamilias: 0,
        pendingCidadaos: 0
      };

      // Contar pendentes
      ongsSnapshot.forEach(doc => {
        if (doc.data().status === 'pending') stats.pendingOngs++;
      });
      
      comerciosSnapshot.forEach(doc => {
        if (doc.data().status === 'pending') stats.pendingComercios++;
      });
      
      familiasSnapshot.forEach(doc => {
        if (doc.data().status === 'pending') stats.pendingFamilias++;
      });
      
      cidadaosSnapshot.forEach(doc => {
        if (doc.data().status === 'pending') stats.pendingCidadaos++;
      });

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

  async updateEntityStatus(req, res) {
    try {
      const { entityType, entityId } = req.params;
      const { status, reason } = req.body;

      if (!['ongs', 'comercios', 'familias', 'cidadaos'].includes(entityType)) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de entidade inválido'
        });
      }

      if (!['verified', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status inválido'
        });
      }

      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        admin_id: req.user.id
      };

      if (status === 'rejected' && reason) {
        updateData.rejection_reason = reason;
      }

      await db.collection(entityType).doc(entityId).update(updateData);

      res.json({
        success: true,
        message: `${entityType} ${status === 'verified' ? 'aprovado' : 'rejeitado'} com sucesso`
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  async getPendingEntities(req, res) {
    try {
      const { entityType } = req.params;

      if (!['ongs', 'comercios', 'familias', 'cidadaos'].includes(entityType)) {
        return res.status(400).json({
          success: false,
          error: 'Tipo de entidade inválido'
        });
      }

      const snapshot = await db.collection(entityType)
        .where('status', '==', 'pending')
        .get();

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
      console.error('Erro ao buscar entidades pendentes:', error);
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
      const updatePromises = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        
        // Se não tem status, adiciona 'pending' como padrão
        if (!data.status) {
          updatePromises.push(
            db.collection(entityType).doc(doc.id).update({ status: 'pending' })
          );
          data.status = 'pending';
        }
        
        entities.push({
          id: doc.id,
          ...data
        });
      });
      
      // Atualiza documentos sem status em background
      if (updatePromises.length > 0) {
        Promise.all(updatePromises).catch(err => 
          console.error('Erro ao atualizar status:', err)
        );
      }

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