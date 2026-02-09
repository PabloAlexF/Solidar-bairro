const axios = require('axios');

async function checkDataStructure() {
  console.log('🔍 VERIFICANDO ESTRUTURA DOS DADOS\n');

  const API_BASE = 'http://localhost:3001/api';

  // Login
  let token = null;
  try {
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'joao@teste.com',
      password: '123456'
    });
    token = loginResponse.data.token;
  } catch (error) {
    console.log('❌ Erro no login');
    return;
  }

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Verificar estrutura dos cidadãos
  try {
    const cidadaosResponse = await axios.get(`${API_BASE}/cidadaos`, { headers: authHeaders });
    const cidadaos = cidadaosResponse.data.data || cidadaosResponse.data || [];
    
    if (cidadaos.length > 0) {
      const firstCidadao = cidadaos[0];
      console.log('📋 ESTRUTURA DO CIDADÃO:');
      console.log(JSON.stringify(firstCidadao, null, 2));
      
      // Identificar qual campo é o ID
      const possibleIds = ['id', 'uid', '_id', 'docId'];
      let realId = null;
      
      for (const field of possibleIds) {
        if (firstCidadao[field]) {
          realId = firstCidadao[field];
          console.log(`\n✅ ID encontrado no campo: ${field}`);
          console.log(`   Valor: ${realId}`);
          break;
        }
      }
      
      if (realId) {
        console.log(`\n🧪 Testando com ID correto: ${realId}`);
        try {
          const testResponse = await axios.patch(
            `${API_BASE}/cidadaos/${realId}/analyze`, 
            {}, 
            { headers: authHeaders }
          );
          console.log('✅ SUCESSO! API funcionando');
        } catch (error) {
          console.log(`❌ Erro: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
        }
      }
    }
  } catch (error) {
    console.log('❌ Erro ao buscar cidadãos');
  }
}

checkDataStructure().catch(console.error);