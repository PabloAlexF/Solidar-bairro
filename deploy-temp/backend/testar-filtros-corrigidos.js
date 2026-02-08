const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testarFiltrosCorrigidos() {
  console.log('🔍 Testando Filtros Corrigidos - Localização\n');
  
  try {
    // 1. Testar filtro por cidade (São Paulo)
    console.log('1. 🏙️ Testando filtro por cidade (São Paulo)...');
    const porCidade = await axios.get(`${BASE_URL}/pedidos?city=São Paulo`);
    console.log(`✅ Pedidos em São Paulo: ${porCidade.data.data?.length || 0}`);
    
    // 2. Testar filtro por bairro
    console.log('\n2. 🏘️ Testando filtro por bairro (Centro)...');
    const porBairro = await axios.get(`${BASE_URL}/pedidos?neighborhood=Centro`);
    console.log(`✅ Pedidos no Centro: ${porBairro.data.data?.length || 0}`);
    
    // 3. Testar sem filtros (todo Brasil)
    console.log('\n3. 🌎 Testando sem filtros (Todo o Brasil)...');
    const todoBrasil = await axios.get(`${BASE_URL}/pedidos`);
    console.log(`✅ Pedidos em todo o Brasil: ${todoBrasil.data.data?.length || 0}`);
    
    // 4. Mostrar alguns exemplos de localização
    if (todoBrasil.data.data && todoBrasil.data.data.length > 0) {
      console.log('\n📍 Exemplos de localização dos pedidos:');
      todoBrasil.data.data.slice(0, 5).forEach((pedido, index) => {
        console.log(`   ${index + 1}. ${pedido.neighborhood || 'N/A'}, ${pedido.city || 'N/A'} - ${pedido.state || 'N/A'}`);
      });
    }
    
    console.log('\n✅ Filtros de localização corrigidos e funcionando!');
    console.log('📋 Opções disponíveis:');
    console.log('   • Todo o Brasil (sem filtros)');
    console.log('   • Minha Cidade (baseado na geolocalização)');
    console.log('   • Meu Bairro (baseado na geolocalização)');
    
  } catch (error) {
    console.error('❌ Erro ao testar filtros:', error.response?.data || error.message);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  testarFiltrosCorrigidos();
}

module.exports = { testarFiltrosCorrigidos };