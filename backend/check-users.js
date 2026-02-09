const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://solidar-bairro-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

async function checkCollections() {
  console.log('🔍 Verificando coleções no Firestore...');

  const collections = ['cidadaos', 'comercios', 'ongs', 'familias', 'admins'];

  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName).limit(10).get();
      console.log(`📋 ${collectionName}: ${snapshot.size} documentos`);

      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`  - ${doc.id}: nome=${data.nome || data.nomeCompleto || data.razaoSocial || 'N/A'}, tipo=${data.tipo || 'N/A'}`);
      });
    } catch (error) {
      console.log(`❌ Erro na coleção ${collectionName}:`, error.message);
    }
  }

  // Verificar usuários específicos do chat
  console.log('\n🔍 Verificando usuários específicos do chat...');
  const userIds = ['sXj4BM7rrKkciVdeXTcu', 'Ss4yJlj0AXNmdZeE4goi'];

  for (const userId of userIds) {
    console.log(`\n👤 Verificando usuário: ${userId}`);
    let found = false;

    for (const collectionName of collections) {
      try {
        const doc = await db.collection(collectionName).doc(userId).get();
        if (doc.exists) {
          const data = doc.data();
          console.log(`  ✅ Encontrado em ${collectionName}:`, {
            id: doc.id,
            nome: data.nome || data.nomeCompleto || data.razaoSocial,
            nomeCompleto: data.nomeCompleto,
            tipo: data.tipo
          });
          found = true;
          break;
        }
      } catch (error) {
        console.log(`  ❌ Erro ao verificar ${collectionName}:`, error.message);
      }
    }

    if (!found) {
      console.log(`  🚨 Usuário ${userId} NÃO encontrado em nenhuma coleção!`);
    }
  }

  process.exit(0);
}

checkCollections().catch(console.error);
