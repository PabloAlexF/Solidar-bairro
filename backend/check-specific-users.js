const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://solidar-bairro-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

async function checkSpecificUsers() {
  console.log('🔍 Verificando usuários específicos...');

  const userIds = ['sXj4BM7rrKkciVdeXTcu', 'Ss4yJlj0AXNmdZeE4goi'];
  const collections = ['cidadaos', 'comercios', 'ongs', 'familias', 'admins'];

  for (const userId of userIds) {
    console.log(`\n👤 Verificando usuário: ${userId}`);

    for (const collection of collections) {
      try {
        const doc = await db.collection(collection).doc(userId).get();
        if (doc.exists) {
          const data = doc.data();
          console.log(`  ✅ Encontrado em ${collection}:`, {
            id: doc.id,
            nome: data.nome || data.nomeCompleto || data.razaoSocial || 'N/A',
            email: data.email || 'N/A',
            tipo: data.tipo || collection.slice(0, -1)
          });
          break; // Found in this collection, no need to check others
        }
      } catch (error) {
        console.log(`  ❌ Erro ao verificar ${collection}:`, error.message);
      }
    }
    console.log(`  🚨 Usuário ${userId} não encontrado em nenhuma coleção!`);
  }

  process.exit(0);
}

checkSpecificUsers().catch(console.error);
