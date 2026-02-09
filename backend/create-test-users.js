const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function createAllTestData() {
  console.log('🎯 Criando dados completos para teste do sistema\n');

  // 1. CIDADÃO
  console.log('👤 Criando Cidadão...');
  try {
    const cidadaoResponse = await axios.post(`${API_BASE}/cidadaos`, {
      nome: 'João Silva',
      email: 'joao@teste.com',
      telefone: '(31) 99999-1111',
      cpf: '123.456.789-01',
      dataNascimento: '1990-05-15',
      endereco: {
        cep: '30112-000',
        logradouro: 'Rua da Bahia',
        numero: '123',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        estado: 'MG'
      },
      senha: '123456'
    });
    console.log('✅ Cidadão criado:', cidadaoResponse.data.data.nome);
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error?.includes('já existe')) {
      console.log('⚠️ Cidadão já existe');
    } else {
      console.log('❌ Erro ao criar cidadão:', error.response?.data?.error || error.message);
    }
  }

  // 2. FAMÍLIA
  console.log('\n👨👩👧👦 Criando Família...');
  try {
    const familiaResponse = await axios.post(`${API_BASE}/familias`, {
      nomeCompleto: 'Maria Santos',
      email: 'maria@teste.com',
      telefone: '(31) 99999-2222',
      cpf: '987.654.321-09',
      quantidadeMembros: 4,
      rendaFamiliar: 'até 2 salários mínimos',
      endereco: {
        cep: '30130-010',
        logradouro: 'Rua dos Carijós',
        numero: '456',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        estado: 'MG'
      },
      necessidades: ['alimentação', 'medicamentos'],
      senha: '123456'
    });
    console.log('✅ Família criada:', familiaResponse.data.data.nomeCompleto);
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error?.includes('já existe')) {
      console.log('⚠️ Família já existe');
    } else {
      console.log('❌ Erro ao criar família:', error.response?.data?.error || error.message);
    }
  }

  // 3. ONG
  console.log('\n🏢 Criando ONG...');
  try {
    const ongResponse = await axios.post(`${API_BASE}/ongs`, {
      nome: 'Solidariedade BH',
      cnpj: '12.345.678/0001-90',
      email: 'contato@solidariedadebh.org',
      telefone: '(31) 99999-3333',
      endereco: 'Avenida Afonso Pena, 789, Centro, Belo Horizonte, MG',
      areasAtuacao: ['assistência social', 'educação'],
      descricao: 'ONG dedicada a ajudar famílias em situação de vulnerabilidade social',
      senha: '123456'
    });
    console.log('✅ ONG criada:', ongResponse.data.data.nome);
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.error?.includes('já existe')) {
      console.log('⚠️ ONG já existe');
    } else {
      console.log('❌ Erro ao criar ONG:', error.response?.data?.error || error.message);
    }
  }

  // 4. TESTE DE LOGIN
  console.log('\n🔐 Testando sistema de login...\n');

  const testUsers = [
    { email: 'joao@teste.com', password: '123456', tipo: 'Cidadão' },
    { email: 'maria@teste.com', password: '123456', tipo: 'Família' },
    { email: 'contato@solidariedadebh.org', password: '123456', tipo: 'ONG' }
  ];

  for (const user of testUsers) {
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      console.log(`✅ Login ${user.tipo} - ${user.email}:`);
      if (loginResponse.data.token) {
        console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);
      }
      if (loginResponse.data.user) {
        console.log(`   Tipo: ${loginResponse.data.user.tipo}`);
        console.log(`   Nome: ${loginResponse.data.user.nome || loginResponse.data.user.nomeResponsavel || loginResponse.data.user.nomeFantasia}`);
      }
    } catch (error) {
      console.log(`❌ Erro login ${user.tipo}:`, error.response?.data?.error || error.message);
    }
  }

  console.log('\n🎉 Sistema de teste configurado com sucesso!');
  console.log('\n📋 CREDENCIAIS PARA TESTE:');
  console.log('👤 Cidadão: joao@teste.com / 123456');
  console.log('👨👩👧👦 Família: maria@teste.com / 123456');
  console.log('🏢 ONG: contato@solidariedadebh.org / 123456');
  
  console.log('\n🌐 PRÓXIMOS PASSOS:');
  console.log('1. Acesse: http://localhost:3000');
  console.log('2. Clique em "Entrar" ou "Login"');
  console.log('3. Use qualquer uma das credenciais acima');
  console.log('4. Explore o dashboard específico de cada tipo');
  
  console.log('\n📊 FUNCIONALIDADES TESTÁVEIS:');
  console.log('• Sistema de login/logout');
  console.log('• Dashboard personalizado por tipo');
  console.log('• Dados do perfil do usuário');
  console.log('• Navegação entre páginas');
}

createAllTestData().catch(console.error);