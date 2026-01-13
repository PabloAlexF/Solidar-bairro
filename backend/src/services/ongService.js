const firebase = require('../config/firebase');
const ONG = require('../models/ongModel');

class ONGService {
  constructor() {
    this.db = firebase.getDb();
    this.auth = firebase.getAuth();
    this.collection = 'ongs';
  }

  async createONG(data) {
    const ong = new ONG(data);
    const errors = ong.validate();
    
    if (errors.length > 0) {
      throw new Error(`Dados inválidos: ${errors.join(', ')}`);
    }

    const userRecord = await this.auth.createUser({
      email: data.email,
      password: data.senha,
      displayName: data.nomeEntidade
    });

    // Converter para objeto simples
    const ongData = {
      nomeEntidade: ong.nomeEntidade,
      cnpj: ong.cnpj,
      razaoSocial: ong.razaoSocial,
      areaTrabalho: ong.areaTrabalho,
      descricaoAtuacao: ong.descricaoAtuacao,
      responsavel: ong.responsavel,
      contato: ong.contato,
      endereco: ong.endereco,
      senha: data.senha, // Salvar senha no Firestore
      tipo: ong.tipo,
      ativo: ong.ativo,
      verificado: ong.verificado,
      statusVerificacao: ong.statusVerificacao,
      status: 'pending', // Aguardando aprovação
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    await this.db.collection(this.collection).doc(userRecord.uid).set(ongData);

    return { uid: userRecord.uid, ...ongData };
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
    const updateData = {
      ...data,
      atualizadoEm: new Date()
    };
    
    await this.db.collection(this.collection).doc(uid).update(updateData);
    return { uid, ...updateData };
  }
}

module.exports = new ONGService();