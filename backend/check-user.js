const firebase = require('./src/config/firebase');

async function checkUser() {
  try {
    const db = firebase.getDb();
    
    console.log('🔍 Verificando usuários no banco...');
    
    const snapshot = await db.collection('cidadaos')
      .where('email', '==', 'maria@teste.com')
      .get();
    
    if (snapshot.empty) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('📄 Dados do usuário:');
      console.log('ID:', doc.id);
      console.log('Nome:', data.nome);
      console.log('Email:', data.email);
      console.log('Senha (hash):', data.senha ? data.senha.substring(0, 20) + '...' : 'Não definida');
      console.log('Password:', data.password ? 'Existe' : 'Não existe');
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

checkUser();