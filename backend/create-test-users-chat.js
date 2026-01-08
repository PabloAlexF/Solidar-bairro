const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

const testUsers = [
  {
    email: 'doador@test.com',
    password: 'test123',
    nome: 'João Doador',
    telefone: '11999999999',
    cep: '01234567',
    rua: 'Rua Teste',
    numero: '123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP'
  },
  {
    email: 'receptor@test.com', 
    password: 'test123',
    nome: 'Maria Receptora',
    telefone: '11888888888',
    cep: '01234567',
    rua: 'Rua Teste',
    numero: '456',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP'
  }
];

async function createTestUsers() {
  console.log('👥 Criando usuários de teste...\n');

  for (const user of testUsers) {
    try {
      const response = await axios.post(`${API_BASE}/cidadaos`, user);
      
      if (response.data.success) {
        console.log(`✅ Usuário criado: ${user.nome} (${user.email})`);
      }
    } catch (error) {
      if (error.response?.data?.error?.includes('já existe')) {
        console.log(`ℹ️  Usuário já existe: ${user.nome} (${user.email})`);
      } else {
        console.log(`❌ Erro ao criar ${user.nome}: ${error.response?.data?.error || error.message}`);
      }
    }
  }
  
  console.log('\n✅ Usuários de teste prontos!\n');
}

if (require.main === module) {
  createTestUsers();
}

module.exports = { createTestUsers };