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
    console.log('Dados recebidos para cidadão:', data);
    
    const cidadao = new Cidadao(data);
    const errors = cidadao.validate();
    
    if (errors.length > 0) {
      throw new Error(`Dados inválidos: ${errors.join(', ')}`);
    }

    // Converter para objeto simples sem Firebase Auth
    const cidadaoData = {
      nome: cidadao.nome,
      email: cidadao.email,
      telefone: cidadao.telefone,
      dataNascimento: cidadao.dataNascimento,
      ocupacao: cidadao.ocupacao,
      cpf: cidadao.cpf,
      rg: cidadao.rg,
      endereco: cidadao.endereco,
      disponibilidade: cidadao.disponibilidade,
      interesses: cidadao.interesses,
      proposito: cidadao.proposito,
      ajudasConcluidas: cidadao.ajudasConcluidas,
      tipo: cidadao.tipo,
      ativo: cidadao.ativo,
      status: 'pending',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    const docRef = await this.db.collection(this.collection).add(cidadaoData);
    return { 
      success: true,
      data: { id: docRef.id, ...cidadaoData }
    };
  }

  async getCidadaos(filters = {}) {
    let query = this.db.collection(this.collection);
    
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    
    const snapshot = await query.get();
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
    // Remover campos undefined/null
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

  async getUsuariosAtivosByBairro(bairro) {
    const snapshot = await this.db.collection(this.collection)
      .where('endereco.bairro', '==', bairro)
      .get();
    
    return snapshot.size;
  }
}

module.exports = new CidadaoService();