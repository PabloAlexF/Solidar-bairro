const firebase = require('./src/config/firebase');
const bcrypt = require('bcryptjs');

async function updateAllUsersWithPassword() {
  try {
    console.log('🔧 Verificando e atualizando usuários sem senha...\n');
    
    const db = firebase.getDb();
    const collections = ['cidadaos', 'comercios', 'ongs'];
    let totalUpdated = 0;
    
    for (const collectionName of collections) {
      console.log(`📋 Verificando ${collectionName}...`);
      const snapshot = await db.collection(collectionName).get();
      let updated = 0;
      
      for (const doc of snapshot.docs) {
        const data = doc.data();
        
        // Se não tem senha e tem email, adicionar senha padrão
        if (!data.senha && data.email) {
          const defaultPassword = '123456';
          const hashedPassword = await bcrypt.hash(defaultPassword, 10);
          
          await db.collection(collectionName).doc(doc.id).update({
            senha: hashedPassword,
            atualizadoEm: new Date()
          });
          
          const name = data.nome || data.nomeComercio || data.nomeEstabelecimento;
          console.log(`  ✅ ${name} (${data.email}) - senha adicionada`);
          updated++;
        }
      }
      
      console.log(`  📊 ${updated} registros atualizados em ${collectionName}\n`);
      totalUpdated += updated;
    }
    
    console.log(`🎉 Total: ${totalUpdated} usuários atualizados com senha padrão: 123456`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

updateAllUsersWithPassword();