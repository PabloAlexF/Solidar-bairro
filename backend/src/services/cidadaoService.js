const firebase = require('../config/firebase');
const Cidadao = require('../models/cidadaoModel');

class CidadaoService {
  constructor() {
    this.db = firebase.getDb();
    this.auth = firebase.getAuth();
    this.collection = 'cidadaos';
  }

  async createCidadao(data) {
    const cidadao = new Cidadao(data);
    const errors = cidadao.validate();
    
    if (errors.length > 0) {
      throw new Error(`Dados inválidos: ${errors.join(', ')}`);
    }

    const userRecord = await this.auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.nome
    });

    // Converter para objeto simples
    const cidadaoData = {
      nome: cidadao.nome,
      email: cidadao.email,
      telefone: cidadao.telefone,
      endereco: cidadao.endereco,
      tipo: cidadao.tipo,
      ativo: cidadao.ativo,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    await this.db.collection(this.collection).doc(userRecord.uid).set(cidadaoData);

    return { uid: userRecord.uid, ...cidadaoData };
  }

  async getCidadaos() {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  }

  async getCidadaoById(uid) {
    const doc = await this.db.collection(this.collection).doc(uid).get();
    if (!doc.exists) {
      throw new Error('Cidadão não encontrado');
    }
    return { uid: doc.id, ...doc.data() };
  }
}

module.exports = new CidadaoService();