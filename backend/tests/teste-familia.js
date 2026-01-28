const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testarFamilia() {
  console.log('👨👩👧👦 Testando cadastro de família...\n');

  const familiaData = {
    nomeCompleto: `Família Teste ${Date.now()}`, // Mudando de 'nome' para 'nomeCompleto'
    endereco: 'Rua das Palmeiras, 987',
    bairro: 'Centro',
    telefone: '(31) 99887-7665',
    email: `familia.teste.${Date.now()}@email.com`,
    criancas: 2,
    jovens: 1,
    adultos: 2,
    idosos: 0,
    rendaFamiliar: '1-a-2-salarios',
    necessidades: ['alimentação', 'roupas', 'medicamentos', 'material escolar']
  };

  try {
    // Cadastrar família
    console.log('1. Cadastrando família...');
    const response = await axios.post(`${BASE_URL}/familias`, familiaData);
    console.log('✅ Família cadastrada com sucesso!');
    console.log('   ID:', response.data.data.id);
    console.log('   Nome:', response.data.data.nomeCompleto);
    console.log('   Total de membros:', response.data.data.composicao.totalMembros);
    console.log('   Necessidades:', response.data.data.necessidades?.length || 0, 'itens');

    const familiaId = response.data.data.id;

    // Buscar família por ID
    console.log('\n2. Buscando família por ID...');
    const familia = await axios.get(`${BASE_URL}/familias/${familiaId}`);
    console.log('✅ Família encontrada:', familia.data.data.nomeCompleto);

    // Listar todas as famílias
    console.log('\n3. Listando todas as famílias...');
    const todasFamilias = await axios.get(`${BASE_URL}/familias`);
    console.log('✅ Total de famílias:', todasFamilias.data.data.length);

  } catch (error) {
    console.error('❌ Erro:', error.response?.data?.error || error.message);
  }
}

testarFamilia();