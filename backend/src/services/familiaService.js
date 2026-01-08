const firebase = require('../config/firebase');
const Familia = require('../models/familiaModel');

class FamiliaService {
  constructor() {
    this.db = firebase.getDb();
    this.auth = firebase.getAuth();
    this.collection = 'familias';
  }

  async createFamilia(data) {
    console.log('Dados recebidos:', data);
    
    const familia = new Familia(data);
    const errors = familia.validate();
    
    if (errors.length > 0) {
      console.log('Erros de validação:', errors);
      throw new Error(`Dados inválidos: ${errors.join(', ')}`);
    }

    // Criar usuário no Firebase Auth se tiver email
    let userRecord = null;
    if (data.email) {
      userRecord = await this.auth.createUser({
        email: data.email,
        password: data.telefone || '123456', // Senha padrão baseada no telefone
        displayName: data.nomeCompleto
      });
    }

    const familiaData = {
      nomeCompleto: familia.nomeCompleto,
      cpf: familia.cpf,
      telefone: familia.telefone,
      email: familia.email,
      tipoCadastro: familia.tipoCadastro,
      endereco: familia.endereco,
      composicao: familia.composicao,
      situacaoSocioeconomica: familia.situacaoSocioeconomica,
      necessidades: familia.necessidades,
      vulnerabilidade: familia.vulnerabilidade,
      status: familia.status,
      tipo: 'familia',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    if (userRecord) {
      // Salvar com UID do Firebase Auth
      await this.db.collection(this.collection).doc(userRecord.uid).set(familiaData);
      return { uid: userRecord.uid, ...familiaData };
    } else {
      // Salvar sem autenticação (apenas no Firestore)
      const docRef = await this.db.collection(this.collection).add(familiaData);
      return { id: docRef.id, ...familiaData };
    }
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
    const updateData = {
      ...data,
      atualizadoEm: new Date()
    };
    
    await this.db.collection(this.collection).doc(id).update(updateData);
    return { id, ...updateData };
  }
}

module.exports = new FamiliaService();