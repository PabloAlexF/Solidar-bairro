const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function quickNotificationTest() {
  console.log('🔔 TESTE RÁPIDO - Sistema de Notificações\n');
  
  const results = {
    server: '❌',
    routes: '❌',
    auth: '❌'
  };
  
  try {
    // 1. Verificar se o servidor está rodando
    console.log('1. Verificando servidor...');
    try {
      await axios.get(`${BASE_URL.replace('/api', '')}/health`);
      results.server = '✅';
      console.log('   ✅ Servidor online');
    } catch (error) {
      console.log('   ❌ Servidor offline ou sem rota /health');
    }
    
    // 2. Verificar se as rotas de notificação existem
    console.log('\\n2. Verificando rotas de notificação...');
    try {
      await axios.get(`${BASE_URL}/notifications`);
    } catch (error) {
      if (error.response?.status === 401) {
        results.routes = '✅';
        results.auth = '✅';
        console.log('   ✅ Rotas existem e autenticação está funcionando');
      } else if (error.response?.status === 404) {
        console.log('   ❌ Rotas de notificação não encontradas');
      } else {
        console.log('   ⚠️ Erro inesperado:', error.message);
      }
    }
    
    // 3. Teste com usuário existente (se houver)
    console.log('\\n3. Testando com credenciais de exemplo...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'admin@solidarbairro.com',
        senha: 'admin123'
      });
      
      const token = loginResponse.data.data.token;
      
      const notificationsResponse = await axios.get(`${BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(`   ✅ Sistema funcionando! ${notificationsResponse.data.data.length} notificação(ões) encontrada(s)`);
      
    } catch (error) {
      console.log('   ℹ️ Usuário admin não existe ou credenciais incorretas');
      console.log('   💡 Use o teste completo para criar um usuário de teste');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
  
  // Resumo
  console.log('\\n📊 RESUMO DO TESTE:');
  console.log(`   Servidor: ${results.server}`);
  console.log(`   Rotas: ${results.routes}`);
  console.log(`   Autenticação: ${results.auth}`);
  
  if (results.server === '✅' && results.routes === '✅' && results.auth === '✅') {
    console.log('\\n🎉 Sistema de notificações está FUNCIONANDO!');
    console.log('\\n💡 Para teste completo, execute: node test-notification-system.js');
  } else {
    console.log('\\n⚠️ Alguns componentes podem não estar funcionando corretamente');
  }
}

// Executar o teste
quickNotificationTest();