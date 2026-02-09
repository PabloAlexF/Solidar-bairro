const firebase = require('./src/config/firebase');

async function checkUser() {
  const db = firebase.getDb();
  const userId = '4b7oaeYmjPNO7CtcvZDu';
  
  console.log(`\n🔍 Verificando usuário: ${userId}\n`);
  
  // Verificar em cidadãos
  const cidadaoDoc = await db.collection('cidadaos').doc(userId).get();
  if (cidadaoDoc.exists) {
    console.log('✅ Encontrado em cidadãos:', cidadaoDoc.data());
  } else {
    console.log('❌ NÃO encontrado em cidadãos');
  }
  
  // Listar todos os cidadãos
  console.log('\n📋 Listando todos os cidadãos cadastrados:\n');
  const cidadaosSnapshot = await db.collection('cidadaos').get();
  cidadaosSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id} | Nome: ${data.nome} | Email: ${data.email}`);
  });
  
  process.exit(0);
}

checkUser().catch(console.error);
