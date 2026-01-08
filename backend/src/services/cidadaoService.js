const firebase = require('../config/firebase');
const authService = require('./authService');
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

    // Converter para objeto simples
    const cidadaoData = {
      nome: cidadao.nome,
      email: cidadao.email,
      telefone: cidadao.telefone,
      endereco: cidadao.endereco,
      senha: data.senha, // Senha já vem hasheada do controller
      tipo: cidadao.tipo,
      ativo: cidadao.ativo,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    const docRef = await this.db.collection(this.collection).add(cidadaoData);

    return { 
      success: true,
      data: { uid: docRef.id, ...cidadaoData }
    };
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

  async updateCidadao(uid, data) {
    const updateData = {
      ...data,
      atualizadoEm: new Date()
    };
    
    await this.db.collection(this.collection).doc(uid).update(updateData);
    return { uid, ...updateData };
  }
}

module.exports = new CidadaoService();