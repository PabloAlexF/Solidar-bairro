const { db } = require('../config/firebase');

class TipsModel {
  constructor() {
    this.collection = db.collection('tips');
  }

  async create(data) {
    const docRef = await this.collection.add({
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    });
    return { id: docRef.id, ...data };
  }

  async findByItemId(itemId) {
    try {
      const snapshot = await this.collection
        .where('item_id', '==', itemId)
        .orderBy('created_at', 'desc')
        .get();

      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro no findByItemId:', error);
      return [];
    }
  }

  async findById(id) {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async update(id, data) {
    await this.collection.doc(id).update({
      ...data,
      updated_at: new Date()
    });
    return this.findById(id);
  }

  async delete(id) {
    await this.collection.doc(id).delete();
    return true;
  }
}

module.exports = new TipsModel();
