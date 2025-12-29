const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testarFamilia() {
  console.log('👨👩👧👦 Testando cadastro de família...\n');

  const familiaData = {
    nome: `Família Teste ${Date.now()}`,
    endereco: 'Rua das Palmeiras, 987',
    telefone: '(31) 99887-7665',
    email: `familia.teste.${Date.now()}@email.com`,
    membros: [
      { nome: 'José Silva', idade: 42, parentesco: 'pai' },
      { nome: 'Clara Silva', idade: 39, parentesco: 'mãe' },
      { nome: 'Lucas Silva', idade: 12, parentesco: 'filho' },
      { nome: 'Sofia Silva', idade: 8, parentesco: 'filha' }
    ],
    necessidades: ['alimentação', 'roupas', 'medicamentos', 'material escolar']
  };

  try {
    // Cadastrar família
    console.log('1. Cadastrando família...');
    const response = await axios.post(`${BASE_URL}/familias`, familiaData);
    console.log('✅ Família cadastrada com sucesso!');
    console.log('   ID:', response.data.data.id);
    console.log('   Nome:', response.data.data.nome);
    console.log('   Membros:', response.data.data.membros.length);
    console.log('   Necessidades:', response.data.data.necessidades.join(', '));

    const familiaId = response.data.data.id;

    // Buscar família por ID
    console.log('\n2. Buscando família por ID...');
    const familia = await axios.get(`${BASE_URL}/familias/${familiaId}`);
    console.log('✅ Família encontrada:', familia.data.data.nome);

    // Listar todas as famílias
    console.log('\n3. Listando todas as famílias...');
    const todasFamilias = await axios.get(`${BASE_URL}/familias`);
    console.log('✅ Total de famílias:', todasFamilias.data.data.length);

  } catch (error) {
    console.error('❌ Erro:', error.response?.data?.error || error.message);
  }
}

testarFamilia();