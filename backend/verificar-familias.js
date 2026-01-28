const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function verificarDadosNoBanco() {
  try {
    console.log('🔍 Verificando dados das famílias no banco...\n');
    
    const response = await axios.get(`${BASE_URL}/familias`);
    const familias = response.data.data;
    
    console.log(`📊 Total de famílias encontradas: ${familias.length}\n`);
    
    // Mostrar as últimas 3 famílias cadastradas
    const ultimasFamilias = familias.slice(-3);
    
    ultimasFamilias.forEach((familia, index) => {
      console.log(`👨‍👩‍👧‍👦 Família ${index + 1}:`);
      console.log('   ID:', familia.id);
      console.log('   Nome:', familia.nomeCompleto);
      console.log('   Email:', familia.email || 'Não informado');
      console.log('   Telefone:', familia.telefone || 'Não informado');
      console.log('   CPF:', familia.cpf || 'Não informado');
      console.log('   Endereço:', familia.endereco?.logradouro || 'Não informado');
      console.log('   Bairro:', familia.endereco?.bairro || 'Não informado');
      console.log('   Composição:');
      console.log('     - Total:', familia.composicao?.totalMembros || 'Não calculado');
      console.log('     - Crianças:', familia.composicao?.criancas || 0);
      console.log('     - Jovens:', familia.composicao?.jovens || 0);
      console.log('     - Adultos:', familia.composicao?.adultos || 0);
      console.log('     - Idosos:', familia.composicao?.idosos || 0);
      console.log('   Renda:', familia.rendaFamiliar || 'Não informado');
      console.log('   Necessidades:', familia.necessidades?.length || 0, 'itens');
      console.log('   Status:', familia.status);
      console.log('   Criado em:', familia.criadoEm);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar dados:', error.response?.data?.error || error.message);
  }
}

verificarDadosNoBanco();