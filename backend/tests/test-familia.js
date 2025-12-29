const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/familias';

// Exemplo de família para cadastro
const exemploFamilia = {
  nome: 'Família Silva',
  endereco: 'Rua das Flores, 123 - Centro',
  telefone: '(11) 99999-9999',
  email: 'familia.silva@email.com',
  membros: [
    { nome: 'João Silva', idade: 45, parentesco: 'pai' },
    { nome: 'Maria Silva', idade: 42, parentesco: 'mãe' },
    { nome: 'Pedro Silva', idade: 15, parentesco: 'filho' }
  ],
  necessidades: ['alimentação', 'medicamentos']
};

async function testarAPI() {
  try {
    console.log('🧪 Testando API de Famílias...\n');

    // 1. Cadastrar família
    console.log('1. Cadastrando família...');
    const response = await axios.post(BASE_URL, exemploFamilia);
    console.log('✅ Família cadastrada:', response.data);
    
    const familiaId = response.data.data.id;

    // 2. Buscar todas as famílias
    console.log('\n2. Buscando todas as famílias...');
    const todasFamilias = await axios.get(BASE_URL);
    console.log('✅ Total de famílias:', todasFamilias.data.data.length);

    // 3. Buscar família por ID
    console.log('\n3. Buscando família por ID...');
    const familiaEspecifica = await axios.get(`${BASE_URL}/${familiaId}`);
    console.log('✅ Família encontrada:', familiaEspecifica.data.data.nome);

  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  testarAPI();
}

module.exports = { testarAPI, exemploFamilia };