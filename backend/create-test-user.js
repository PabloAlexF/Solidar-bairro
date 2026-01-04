const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function createTestUser() {
  try {
    console.log('🔄 Criando usuário de teste...');
    
    const userData = {
      nome: 'Maria Santos',
      email: 'maria@teste.com',
      telefone: '(31) 88888-8888',
      password: '123456',
      rua: 'Rua das Rosas',
      numero: '456',
      bairro: 'Centro',
      cidade: 'Lagoa Santa',
      estado: 'MG',
      cep: '33400-000'
    };

    const response = await axios.post(`${API_URL}/cidadaos`, userData);
    
    if (response.data.success) {
      console.log('✅ Usuário de teste criado com sucesso!');
      console.log('📧 Email: joao@teste.com');
      console.log('🔑 Senha: 123456');
    } else {
      console.log('❌ Erro ao criar usuário:', response.data.error);
    }
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error?.includes('já existe')) {
      console.log('ℹ️  Usuário de teste já existe!');
      console.log('📧 Email: maria@teste.com');
      console.log('🔑 Senha: 123456');
      console.log('⚠️  ATENÇÃO: Use estes dados para fazer login no frontend');
    } else {
      console.error('❌ Erro:', error.response?.data?.error || error.message);
    }
  }
}

async function testLogin() {
  try {
    console.log('\n🔄 Testando login...');
    
    const loginData = {
      email: 'maria@teste.com',
      password: '123456'
    };

    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    
    if (response.data.success) {
      console.log('✅ Login realizado com sucesso!');
      console.log('🎯 Token:', response.data.data.token.substring(0, 20) + '...');
    }
  } catch (error) {
    console.error('❌ Erro no login:', error.response?.data?.error || error.message);
  }
}

async function main() {
  await createTestUser();
  await testLogin();
}

main();