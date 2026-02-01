const bcrypt = require('bcryptjs');
const firebase = require('./src/config/firebase');

async function adicionarSenhaFamilia() {
  try {
    console.log('🔐 Adicionando senha à família cadastrada...\n');
    
    const db = firebase.getDb();
    const email = 'familia.oliveira.santos@gmail.com';
    const senha = '123456';
    
    // Buscar a família pelo email
    console.log('🔍 Buscando família com email:', email);
    const snapshot = await db.collection('familias')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      console.log('❌ Família não encontrada com esse email');
      return;
    }
    
    const doc = snapshot.docs[0];
    const familiaData = doc.data();
    
    console.log('✅ Família encontrada:', familiaData.nome || familiaData.nomeCompleto);
    console.log('📄 ID:', doc.id);
    
    // Gerar hash da senha
    console.log('🔒 Gerando hash da senha...');
    const senhaHash = await bcrypt.hash(senha, 10);
    
    // Atualizar documento com a senha
    console.log('💾 Atualizando documento com senha...');
    await db.collection('familias').doc(doc.id).update({
      senha: senhaHash,
      password: senha, // Manter também em texto plano para compatibilidade
      updatedAt: new Date()
    });
    
    console.log('✅ Senha adicionada com sucesso!');
    console.log('\n📋 Credenciais de login:');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Senha: ${senha}`);
    
    // Testar login
    console.log('\n🧪 Testando login...');
    const axios = require('axios');
    
    try {
      const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: senha
      });
      
      if (loginResponse.data.success) {
        console.log('✅ Login testado com sucesso!');
        console.log(`👤 Usuário: ${loginResponse.data.data.user?.nome || loginResponse.data.data.user?.nomeCompleto}`);
        console.log(`🏷️ Tipo: ${loginResponse.data.data.user?.tipo}`);
      } else {
        console.log('❌ Falha no teste de login:', loginResponse.data.error);
      }
    } catch (loginError) {
      console.log('❌ Erro no teste de login:', loginError.response?.data?.error || loginError.message);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  adicionarSenhaFamilia();
}

module.exports = { adicionarSenhaFamilia };