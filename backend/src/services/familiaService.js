const firebase = require('../config/firebase');
const Familia = require('../models/familiaModel');

class FamiliaService {
  constructor() {
    this.db = firebase.getDb();
    this.collection = 'familias';
  }

  async createFamilia(data) {
    const familia = new Familia(data);
    const errors = familia.validate();
    
    if (errors.length > 0) {
      throw new Error(`Dados inválidos: ${errors.join(', ')}`);
    }

    const docRef = await this.db.collection(this.collection).add({
      ...familia,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { id: docRef.id, ...familia };
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
}

module.exports = new FamiliaService();