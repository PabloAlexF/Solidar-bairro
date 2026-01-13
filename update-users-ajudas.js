const { db } = require('./backend/src/config/firebase');

async function updateExistingUsers() {
  try {
    console.log('🔄 Atualizando usuários existentes...');
    
    const cidadaosRef = db.collection('cidadaos');
    const snapshot = await cidadaosRef.get();
    
    const batch = db.batch();
    let count = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.ajudasConcluidas === undefined) {
        batch.update(doc.ref, { ajudasConcluidas: 0 });
        count++;
      }
    });
    
    if (count > 0) {
      await batch.commit();
      console.log(`✅ ${count} usuários atualizados com campo ajudasConcluidas`);
    } else {
      console.log('ℹ️ Todos os usuários já possuem o campo ajudasConcluidas');
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar usuários:', error);
  }
}

updateExistingUsers();