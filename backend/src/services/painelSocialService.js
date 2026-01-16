const firebase = require('../config/firebase');

class PainelSocialService {
  constructor() {
    this.db = firebase.getDb();
  }

  async getDashboardData(bairro) {
    const [familias, pedidos, comercios, ongs] = await Promise.all([
      this.getFamiliasByBairro(bairro),
      this.getPedidosAjuda(bairro),
      this.getComerciosParceiros(bairro),
      this.getOngsAtuantes(bairro)
    ]);

    const stats = this.calculateStats(familias);

    return {
      stats,
      familias,
      pedidos,
      comercios,
      ongs
    };
  }

  async getFamiliasByBairro(bairro) {
    const snapshot = await this.db.collection('familias')
      .where('endereco.bairro', '==', bairro)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lat: doc.data().endereco?.latitude || -19.768,
      lng: doc.data().endereco?.longitude || -43.85
    }));
  }

  async getPedidosAjuda(bairro) {
    let query = this.db.collection('pedidos');
    
    if (bairro) {
      query = query.where('bairro', '==', bairro);
    }
    
    const snapshot = await query.limit(50).get();
    
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        tipo: 'pedido'
      }))
      .filter(p => p.status === 'ativo' || p.status === 'pendente');
  }

  async getComerciosParceiros(bairro) {
    let query = this.db.collection('comercios');
    
    if (bairro) {
      query = query.where('endereco.bairro', '==', bairro);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lat: doc.data().endereco?.latitude || -19.768,
      lng: doc.data().endereco?.longitude || -43.85,
      parceiro: doc.data().parceiro || false,
      moedaSolidaria: doc.data().moedaSolidaria || false
    }));
  }

  async getOngsAtuantes(bairro) {
    let query = this.db.collection('ongs');
    
    if (bairro) {
      query = query.where('endereco.bairro', '==', bairro);
    }
    
    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      lat: doc.data().endereco?.latitude || -19.768,
      lng: doc.data().endereco?.longitude || -43.85
    }));
  }

  calculateStats(familias) {
    const stats = {
      total: familias.length,
      pessoas: 0,
      criancas: 0,
      idosos: 0,
      altaVuln: 0,
      pendentes: 0,
      atendidos: 0
    };

    familias.forEach(f => {
      stats.pessoas += f.composicao?.totalMembros || 0;
      stats.criancas += f.composicao?.criancas || 0;
      stats.idosos += f.composicao?.idosos || 0;
      if (f.vulnerability === 'Alta') stats.altaVuln++;
      if (f.status === 'pendente') stats.pendentes++;
      if (f.status === 'atendido') stats.atendidos++;
    });

    return stats;
  }
}

module.exports = new PainelSocialService();
