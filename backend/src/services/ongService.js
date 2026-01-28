const firebase = require('../config/firebase');
const ONG = require('../models/ongModel');

class ONGService {
  constructor() {
    this.db = firebase.getDb();
    this.auth = firebase.getAuth();
    this.collection = 'ongs';
  }

  async createONG(data) {
    console.log('Dados recebidos para ONG:', data);
    
    const ong = new ONG(data);
    const errors = ong.validate();
    
    if (errors.length > 0) {
      throw new Error(`Dados inválidos: ${errors.join(', ')}`);
    }

    // Converter para objeto simples sem Firebase Auth
    const ongData = {
      nome: ong.nome,
      cnpj: ong.cnpj,
      email: ong.email,
      telefone: ong.telefone,
      endereco: ong.endereco,
      areasAtuacao: ong.areasAtuacao,
      descricao: ong.descricao,
      responsavel: ong.responsavel,
      tipo: ong.tipo,
      ativo: ong.ativo,
      verificado: ong.verificado,
      statusVerificacao: ong.statusVerificacao,
      status: 'pending',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    const docRef = await this.db.collection(this.collection).add(ongData);
    return { id: docRef.id, ...ongData };
  }

  async getONGs() {
    const snapshot = await this.db.collection(this.collection).get();
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
  }

  async getONGById(uid) {
    const doc = await this.db.collection(this.collection).doc(uid).get();
    if (!doc.exists) {
      throw new Error('ONG não encontrada');
    }
    return { uid: doc.id, ...doc.data() };
  }

  async updateONG(uid, data) {
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

module.exports = new ONGService();