const firebase = require('../config/firebase');
const Comercio = require('../models/comercioModel');

class ComercioService {
  constructor() {
    this.db = firebase.getDb();
    this.auth = firebase.getAuth();
    this.collection = 'comercios';
  }

  async createComercio(data) {
    console.log('Dados recebidos para comércio:', data);
    
    const comercio = new Comercio(data);
    const errors = comercio.validate();
    
    if (errors.length > 0) {
      throw new Error(`Dados inválidos: ${errors.join(', ')}`);
    }

    // Converter para objeto simples sem Firebase Auth
    const comercioData = {
      nomeComercio: comercio.nomeComercio,
      cnpj: comercio.cnpj,
      email: comercio.email,
      telefone: comercio.telefone,
      endereco: comercio.endereco,
      categoria: comercio.categoria,
      descricao: comercio.descricao,
      horarioFuncionamento: comercio.horarioFuncionamento,
      tipo: comercio.tipo,
      ativo: comercio.ativo,
      verificado: comercio.verificado,
      status: 'pending',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    const docRef = await this.db.collection(this.collection).add(comercioData);
    return { id: docRef.id, ...comercioData };
  }

  async getComercios() {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  }

  async getComercioById(uid) {
    const doc = await this.db.collection(this.collection).doc(uid).get();
    if (!doc.exists) {
      throw new Error('Comércio não encontrado');
    }
    return { uid: doc.id, ...doc.data() };
  }

  async updateComercio(uid, data) {
    const updateData = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== undefined && data[key] !== null) {
        acc[key] = data[key];
      }
      return acc;
    }, {});
    
    updateData.atualizadoEm = new Date();
    
    await this.db.collection(this.collection).doc(uid).update(updateData);
    return { uid, ...updateData };
  }
}

module.exports = new ComercioService();