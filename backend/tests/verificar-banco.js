const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function verificarBanco() {
  console.log('🕵️‍♀️ Verificando integridade dos cadastros no banco de dados...\n');

  const endpoints = [
    { 
      tipo: 'Cidadão', 
      url: '/cidadaos', 
      campoNome: 'nome',
      camposExtras: ['cpf', 'ocupacao', 'rua'] 
    },
    { 
      tipo: 'Comércio', 
      url: '/comercios', 
      campoNome: 'nomeEstabelecimento',
      camposExtras: ['cnpj', 'responsavelNome', 'tipoComercio']
    },
    { 
      tipo: 'ONG', 
      url: '/ongs', 
      campoNome: 'nomeEntidade',
      camposExtras: ['cnpj', 'areaTrabalho', 'responsavelNome']
    },
    { 
      tipo: 'Família', 
      url: '/familias', 
      campoNome: 'nomeCompleto',
      camposExtras: ['telefone', 'necessidades']
    }
  ];

  for (const item of endpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${item.url}`);
      const registros = response.data.data || [];
      const total = registros.length;

      console.log(`📊 ${item.tipo.toUpperCase()}: ${total} registros encontrados`);

      if (total > 0) {
        // Pega o último registro para conferência
        const ultimo = registros[total - 1];
        console.log(`   ✅ Último registro cadastrado:`);
        console.log(`      ID: ${ultimo.id}`);
        console.log(`      Nome (${item.campoNome}): ${ultimo[item.campoNome]}`);
        console.log(`      Email: ${ultimo.email}`);
        
        // Verifica campos extras para garantir que foram salvos
        item.camposExtras.forEach(campo => {
          const valor = ultimo[campo];
          // Verifica se o valor existe (não é null ou undefined)
          const status = (valor !== null && valor !== undefined) ? '✅ OK' : '⚠️ Ausente/Null';
          console.log(`      ${campo}: ${JSON.stringify(valor)} (${status})`);
        });
      } else {
        console.log(`   ⚠️ Nenhum registro encontrado para ${item.tipo}.`);
      }
    } catch (error) {
      console.log(`❌ Erro ao consultar ${item.tipo}: ${error.message}`);
    }
    console.log('--------------------------------------------------');
  }
}

verificarBanco();