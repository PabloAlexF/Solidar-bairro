const firebase = require('./src/config/firebase');
const bcrypt = require('bcryptjs');

async function updateFamiliasWithPassword() {
  try {
    console.log('🔧 Atualizando famílias sem senha...');
    
    const db = firebase.getDb();
    const snapshot = await db.collection('familias').get();
    
    let updated = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      // Se não tem senha e tem email, adicionar senha padrão
      if (!data.senha && data.email) {
        const defaultPassword = '123456'; // Senha padrão
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        
        await db.collection('familias').doc(doc.id).update({
          senha: hashedPassword,
          atualizadoEm: new Date()
        });
        
        console.log(`✅ Família ${data.nomeCompleto} (${data.email}) - senha adicionada`);
        updated++;
      }
    }
    
    console.log(`\n🎉 ${updated} famílias atualizadas com senha padrão: 123456`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

updateFamiliasWithPassword();