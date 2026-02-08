const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function criarRegistrosPendentes() {
  console.log('📝 CRIANDO REGISTROS PENDENTES PARA TESTE\n');

  // 1. Criar ONG pendente
  try {
    const ongData = {
      nome_fantasia: 'ONG Teste Pendente',
      razao_social: 'ONG Teste Pendente LTDA',
      cnpj: '12.345.678/0001-90',
      email: 'ong.pendente@teste.com',
      telefone: '(31) 99999-0001',
      endereco: 'Rua Teste, 123, Centro, Belo Horizonte, MG',
      areas_cobertura: ['Belo Horizonte'],
      causas: ['assistência social'],
      status: 'pending',
      senha: '123456'
    };

    await axios.post(`${API_BASE}/ongs`, ongData);
    console.log('✅ ONG pendente criada');
  } catch (error) {
    console.log('⚠️ ONG pendente já existe ou erro:', error.response?.data?.error || error.message);
  }

  // 2. Criar Família pendente
  try {
    const familiaData = {
      nomeCompleto: 'Família Teste Pendente',
      email: 'familia.pendente@teste.com',
      telefone: '(31) 99999-0002',
      cpf: '123.456.789-01',
      endereco: 'Rua Família, 456, Centro, Belo Horizonte, MG',
      bairro: 'Centro',
      rendaFamiliar: 'até 1 salário mínimo',
      necessidades: ['alimentação', 'moradia'],
      status: 'pending',
      senha: '123456'
    };

    await axios.post(`${API_BASE}/familias`, familiaData);
    console.log('✅ Família pendente criada');
  } catch (error) {
    console.log('⚠️ Família pendente já existe ou erro:', error.response?.data?.error || error.message);
  }

  // 3. Criar Cidadão pendente
  try {
    const cidadaoData = {
      nome: 'Cidadão Teste Pendente',
      email: 'cidadao.pendente@teste.com',
      telefone: '(31) 99999-0003',
      cpf: '987.654.321-01',
      dataNascimento: '1990-01-01',
      endereco: {
        cep: '30112-000',
        logradouro: 'Rua Cidadão',
        numero: '789',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        estado: 'MG'
      },
      status: 'pending',
      senha: '123456'
    };

    await axios.post(`${API_BASE}/cidadaos`, cidadaoData);
    console.log('✅ Cidadão pendente criado');
  } catch (error) {
    console.log('⚠️ Cidadão pendente já existe ou erro:', error.response?.data?.error || error.message);
  }

  // 4. Verificar dados atualizados
  console.log('\n📊 VERIFICANDO DADOS ATUALIZADOS...\n');

  const apis = [
    { name: 'ONGs', url: '/ongs', icon: '🏛️' },
    { name: 'Comércios', url: '/comercios', icon: '🏪' },
    { name: 'Famílias', url: '/familias', icon: '👨👩👧👦' },
    { name: 'Cidadãos', url: '/cidadaos', icon: '👥' }
  ];

  let totalPendentes = 0;

  for (const api of apis) {
    try {
      const response = await axios.get(`${API_BASE}${api.url}`);
      const data = response.data.data || response.data || [];
      const pendentes = data.filter(item => item.status === 'pending').length;
      
      totalPendentes += pendentes;
      
      console.log(`${api.icon} ${api.name}: ${data.length} total, ${pendentes} pendentes`);
      
      // Mostrar exemplos de pendentes
      const pendentesExemplos = data.filter(item => item.status === 'pending');
      pendentesExemplos.forEach(item => {
        const nome = item.nome_fantasia || item.nomeCompleto || item.nome || item.full_name || 'Nome não encontrado';
        console.log(`   - ${nome} (pendente)`);
      });
      
    } catch (error) {
      console.log(`❌ ${api.name}: Erro na API`);
    }
  }

  console.log(`\n📋 Total de registros pendentes: ${totalPendentes}`);

  if (totalPendentes > 0) {
    console.log('\n✅ AGORA O DASHBOARD MOBILE DEVE MOSTRAR:');
    console.log('   📊 Cards com os números atualizados');
    console.log('   📈 Meta de aprovação atualizada');
    console.log('   ⏳ Lista "Aguardando Ação" com os itens pendentes');
    console.log('   🔔 Badge de notificação no sino');
    
    console.log('\n🧪 TESTE NO NAVEGADOR:');
    console.log('1. Acesse: http://localhost:3000/admin');
    console.log('2. Login: joao@teste.com / 123456');
    console.log('3. Ative modo mobile (F12)');
    console.log('4. Vá para "Início"');
    console.log('5. Deve ver os itens pendentes na seção "Aguardando Ação"');
    console.log('6. Clique em "Analisar" para testar os modais');
  } else {
    console.log('\n⚠️ Nenhum registro pendente foi criado');
  }

  console.log('\n🎉 REGISTROS DE TESTE CRIADOS!');
}

criarRegistrosPendentes().catch(console.error);