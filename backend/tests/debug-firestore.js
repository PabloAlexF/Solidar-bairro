const firebase = require('./src/config/firebase');

async function debugFirestore() {
  console.log('🔍 Verificando dados no Firestore...\n');
  
  const db = firebase.getDb();
  const collections = ['cidadaos', 'comercios', 'ongs', 'familias'];
  
  for (const collection of collections) {
    try {
      const snapshot = await db.collection(collection).get();
      console.log(`${collection.toUpperCase()}:`);
      console.log(`  Total documentos: ${snapshot.size}`);
      
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`  - ID: ${doc.id}`);
        console.log(`    Nome: ${data.nome || data.nomeEstabelecimento || data.nomeEntidade}`);
      });
      console.log('');
    } catch (error) {
      console.log(`${collection.toUpperCase()}: ❌ Erro - ${error.message}\n`);
    }
  }
}

debugFirestore();