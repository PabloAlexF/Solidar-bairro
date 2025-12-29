const axios = require('axios');

async function testarServidor() {
  try {
    console.log('🔍 Testando se servidor está rodando...');
    
    // Testar health check
    const health = await axios.get('http://localhost:3001/health');
    console.log('✅ Servidor OK:', health.data);
    
    // Testar apenas família
    console.log('\n📋 Testando família...');
    const familiaData = {
      nome: 'Família Teste',
      endereco: 'Rua Teste, 123',
      telefone: '(31) 99999-9999',
      email: 'teste@email.com'
    };
    
    const response = await axios.post('http://localhost:3001/api/familias', familiaData);
    console.log('✅ Família cadastrada:', response.data);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testarServidor();