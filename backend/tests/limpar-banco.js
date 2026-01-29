const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function limparBanco() {
  console.log('🧹 Iniciando limpeza de usuários de teste...\n');

  const endpoints = ['cidadaos', 'comercios', 'ongs', 'familias'];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${BASE_URL}/${endpoint}`);
      const registros = response.data.data || [];
      
      // Filtra registros que parecem ser de teste (baseado em timestamp no email ou nome "Teste")
      const paraDeletar = registros.filter(item => 
        (item.email && /\d{10,}/.test(item.email)) || // Timestamp no email
        (item.nome && item.nome.includes('Teste')) ||
        (item.nomeEstabelecimento && item.nomeEstabelecimento.includes('Teste')) ||
        (item.nomeEntidade && item.nomeEntidade.includes('Teste')) ||
        (item.nomeCompleto && item.nomeCompleto.includes('Teste'))
      );

      if (paraDeletar.length > 0) {
        console.log(`🗑️ Deletando ${paraDeletar.length} registros de teste em ${endpoint}...`);
        for (const item of paraDeletar) {
          try {
            await axios.delete(`${BASE_URL}/${endpoint}/${item.id}`);
            process.stdout.write('.');
          } catch (err) {
            process.stdout.write('x');
          }
        }
        console.log('\n   ✅ Concluído.');
      } else {
        console.log(`   ℹ️ Nenhum registro de teste encontrado em ${endpoint}.`);
      }
    } catch (error) {
      console.log(`❌ Erro ao processar ${endpoint}: ${error.message}`);
    }
  }
  console.log('\n✨ Limpeza finalizada!');
}

limparBanco();