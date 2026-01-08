const firebase = require('../config/firebase');
const Comercio = require('../models/comercioModel');

class ComercioService {
  constructor() {
    this.db = firebase.getDb();
    this.auth = firebase.getAuth();
    this.collection = 'comercios';
  }

  async createComercio(data) {
    const comercio = new Comercio(data);
    const errors = comercio.validate();
    
    if (errors.length > 0) {
      throw new Error(`Dados inválidos: ${errors.join(', ')}`);
    }

    const email = data.email || `${data.cnpj.replace(/\D/g, '')}@comercio.local`;
    
    const userRecord = await this.auth.createUser({
      email: email,
      password: data.senha,
      displayName: data.nomeEstabelecimento
    });

    // Converter para objeto simples
    const comercioData = {
      nomeEstabelecimento: comercio.nomeEstabelecimento,
      cnpj: comercio.cnpj,
      razaoSocial: comercio.razaoSocial,
      tipoComercio: comercio.tipoComercio,
      descricaoAtividade: comercio.descricaoAtividade,
      responsavel: comercio.responsavel,
      contato: comercio.contato,
      endereco: comercio.endereco,
      senha: data.senha, // Salvar senha no Firestore
      tipo: comercio.tipo,
      ativo: comercio.ativo,
      verificado: comercio.verificado,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    await this.db.collection(this.collection).doc(userRecord.uid).set(comercioData);

    return { uid: userRecord.uid, ...comercioData };
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
    const updateData = {
      ...data,
      atualizadoEm: new Date()
    };
    
    await this.db.collection(this.collection).doc(uid).update(updateData);
    return { uid, ...updateData };
  }
}

module.exports = new ComercioService();