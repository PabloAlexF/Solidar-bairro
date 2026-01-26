const firebase = require('../config/firebase');

class FamiliaService {
  constructor() {
    this.db = firebase.getDb();
    this.auth = firebase.getAuth();
    this.collection = 'familias';
  }

  async createFamilia(data) {
    console.log('Dados recebidos:', data);
    
    // Validação simples
    if (!data.nomeCompleto?.trim()) {
      throw new Error('Nome da família é obrigatório');
    }

    const familiaData = {
      nomeCompleto: data.nomeCompleto,
      vulnerability: data.vulnerability || 'Média',
      composicao: {
        totalMembros: parseInt(data.composicao?.totalMembros) || 1,
        criancas: parseInt(data.composicao?.criancas) || 0,
        jovens: parseInt(data.composicao?.jovens) || 0,
        adultos: parseInt(data.composicao?.adultos) || 1,
        idosos: parseInt(data.composicao?.idosos) || 0
      },
      rendaFamiliar: data.rendaFamiliar || 'Sem renda',
      telefone: data.telefone || '',
      endereco: {
        logradouro: data.endereco?.logradouro || '',
        bairro: data.endereco?.bairro || 'São Benedito',
        latitude: data.endereco?.latitude || -19.768,
        longitude: data.endereco?.longitude || -43.85
      },
      status: data.status || 'ativo',
      tipo: 'familia',
      ativo: true,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    // Salvar no Firestore
    const docRef = await this.db.collection(this.collection).add(familiaData);
    return { id: docRef.id, ...familiaData };
  }

  async getFamilias() {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getFamiliaById(id) {
    const doc = await this.db.collection(this.collection).doc(id).get();
    if (!doc.exists) {
      throw new Error('Família não encontrada');
    }
    return { id: doc.id, ...doc.data() };
  }

  async updateFamilia(id, data) {
    const updateData = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== undefined && data[key] !== null) {
        acc[key] = data[key];
      }
      return acc;
    }, {});
    
    updateData.atualizadoEm = new Date();
    
    await this.db.collection(this.collection).doc(id).update(updateData);
    return { id, ...updateData };
  }

  async deleteFamilia(id) {
    await this.db.collection(this.collection).doc(id).delete();
  }

  async getFamiliasByBairro(bairro) {
    const snapshot = await this.db.collection(this.collection).get();
    const allFamilias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`✅ ${allFamilias.length} famílias carregadas do banco`);
    return allFamilias;
  }

  async getStatsByBairro(bairro) {
    const familias = await this.getFamiliasByBairro(bairro);
    
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

module.exports = new FamiliaService();