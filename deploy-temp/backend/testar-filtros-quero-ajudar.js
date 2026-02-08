const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testarFiltros() {
  console.log('🔍 Testando Filtros da Página "Quero Ajudar"\n');
  
  try {
    // 1. Testar busca sem filtros
    console.log('1. 📋 Testando busca sem filtros...');
    const semFiltros = await axios.get(`${BASE_URL}/pedidos`);
    console.log(`✅ Total de pedidos: ${semFiltros.data.data?.length || 0}`);
    
    if (semFiltros.data.data && semFiltros.data.data.length > 0) {
      const primeiro = semFiltros.data.data[0];
      console.log(`   📄 Primeiro pedido: ${primeiro.category} - ${primeiro.usuario?.nome}`);
      console.log(`   📍 Localização: ${primeiro.city || 'N/A'}, ${primeiro.state || 'N/A'}`);
      console.log(`   🚨 Urgência: ${primeiro.urgency}`);
    }
    
    // 2. Testar filtro por categoria
    console.log('\n2. 🏷️ Testando filtro por categoria (Alimentos)...');
    const porCategoria = await axios.get(`${BASE_URL}/pedidos?category=Alimentos`);
    console.log(`✅ Pedidos de Alimentos: ${porCategoria.data.data?.length || 0}`);
    
    // 3. Testar filtro por urgência
    console.log('\n3. 🚨 Testando filtro por urgência (urgente)...');
    const porUrgencia = await axios.get(`${BASE_URL}/pedidos?urgency=urgente`);
    console.log(`✅ Pedidos urgentes: ${porUrgencia.data.data?.length || 0}`);
    
    // 4. Testar filtro por cidade
    console.log('\n4. 🏙️ Testando filtro por cidade (São Paulo)...');
    const porCidade = await axios.get(`${BASE_URL}/pedidos?city=São Paulo`);
    console.log(`✅ Pedidos em São Paulo: ${porCidade.data.data?.length || 0}`);
    
    // 5. Testar filtro por estado
    console.log('\n5. 🗺️ Testando filtro por estado (SP)...');
    const porEstado = await axios.get(`${BASE_URL}/pedidos?state=SP`);
    console.log(`✅ Pedidos em SP: ${porEstado.data.data?.length || 0}`);
    
    // 6. Testar filtro "apenas novos"
    console.log('\n6. ✨ Testando filtro "apenas novos"...');
    const apenasNovos = await axios.get(`${BASE_URL}/pedidos?onlyNew=true`);
    console.log(`✅ Pedidos novos (últimas 24h): ${apenasNovos.data.data?.length || 0}`);
    
    // 7. Testar combinação de filtros
    console.log('\n7. 🔗 Testando combinação de filtros (Alimentos + urgente)...');
    const combinados = await axios.get(`${BASE_URL}/pedidos?category=Alimentos&urgency=urgente`);
    console.log(`✅ Alimentos urgentes: ${combinados.data.data?.length || 0}`);
    
    // 8. Testar ordenação por proximidade
    console.log('\n8. 📍 Testando ordenação por proximidade (usuário em São Paulo)...');
    const proximidade = await axios.get(`${BASE_URL}/pedidos?userCity=São Paulo&userState=SP`);
    console.log(`✅ Pedidos ordenados por proximidade: ${proximidade.data.data?.length || 0}`);
    
    if (proximidade.data.data && proximidade.data.data.length > 0) {
      console.log('   📊 Primeiros 3 pedidos por proximidade:');
      proximidade.data.data.slice(0, 3).forEach((pedido, index) => {
        console.log(`   ${index + 1}. ${pedido.city}, ${pedido.state} - ${pedido.category} (${pedido.urgency})`);
      });
    }
    
    // 9. Testar filtros inválidos
    console.log('\n9. ❌ Testando filtros com valores inválidos...');
    const filtrosInvalidos = await axios.get(`${BASE_URL}/pedidos?category=CategoriaInexistente&urgency=urgenciaInvalida`);
    console.log(`✅ Pedidos com filtros inválidos: ${filtrosInvalidos.data.data?.length || 0}`);
    
    // 10. Resumo dos testes
    console.log('\n📊 RESUMO DOS TESTES:');
    console.log(`✅ Sem filtros: ${semFiltros.data.data?.length || 0} pedidos`);
    console.log(`✅ Por categoria: ${porCategoria.data.data?.length || 0} pedidos`);
    console.log(`✅ Por urgência: ${porUrgencia.data.data?.length || 0} pedidos`);
    console.log(`✅ Por cidade: ${porCidade.data.data?.length || 0} pedidos`);
    console.log(`✅ Por estado: ${porEstado.data.data?.length || 0} pedidos`);
    console.log(`✅ Apenas novos: ${apenasNovos.data.data?.length || 0} pedidos`);
    console.log(`✅ Combinados: ${combinados.data.data?.length || 0} pedidos`);
    console.log(`✅ Por proximidade: ${proximidade.data.data?.length || 0} pedidos`);
    
  } catch (error) {
    console.error('❌ Erro ao testar filtros:', error.response?.data || error.message);
  }
}

async function criarPedidosTeste() {
  console.log('🏗️ Criando pedidos de teste para filtros...\n');
  
  const pedidosTeste = [
    {
      category: 'Alimentos',
      description: 'Preciso de cesta básica para minha família',
      urgency: 'urgente',
      visibility: ['bairro'],
      userId: 'test-user-1',
      location: 'Centro, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Centro'
    },
    {
      category: 'Roupas',
      description: 'Roupas de inverno para crianças',
      urgency: 'moderada',
      visibility: ['proximos'],
      userId: 'test-user-2',
      location: 'Copacabana, Rio de Janeiro - RJ',
      city: 'Rio de Janeiro',
      state: 'RJ',
      neighborhood: 'Copacabana'
    },
    {
      category: 'Medicamentos',
      description: 'Remédios para diabetes',
      urgency: 'critico',
      visibility: ['todos'],
      userId: 'test-user-3',
      location: 'Savassi, Belo Horizonte - MG',
      city: 'Belo Horizonte',
      state: 'MG',
      neighborhood: 'Savassi'
    },
    {
      category: 'Alimentos',
      description: 'Leite para bebê',
      urgency: 'critico',
      visibility: ['bairro'],
      userId: 'test-user-4',
      location: 'Vila Madalena, São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
      neighborhood: 'Vila Madalena'
    }
  ];
  
  try {
    for (let i = 0; i < pedidosTeste.length; i++) {
      const pedido = pedidosTeste[i];
      console.log(`Criando pedido ${i + 1}: ${pedido.category} - ${pedido.city}`);
      
      try {
        const response = await axios.post(`${BASE_URL}/pedidos`, pedido);
        if (response.data.success) {
          console.log(`✅ Pedido criado: ${response.data.data.id}`);
        } else {
          console.log(`❌ Erro: ${response.data.error}`);
        }
      } catch (error) {
        console.log(`❌ Erro ao criar pedido: ${error.response?.data?.error || error.message}`);
      }
    }
    
    console.log('\n✅ Pedidos de teste criados!\n');
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

async function executarTestes() {
  console.log('🚀 Iniciando Testes de Filtros - SolidarBrasil\n');
  
  // Verificar se servidor está rodando
  try {
    await axios.get(`${BASE_URL}/pedidos`);
    console.log('✅ Servidor está funcionando!\n');
  } catch (error) {
    console.log('❌ Servidor não está respondendo. Verifique se está rodando na porta 3001');
    return;
  }
  
  // Criar alguns pedidos de teste
  await criarPedidosTeste();
  
  // Executar testes de filtros
  await testarFiltros();
  
  console.log('\n🎉 Testes de filtros concluídos!');
}

// Executar se chamado diretamente
if (require.main === module) {
  executarTestes();
}

module.exports = { testarFiltros, criarPedidosTeste };