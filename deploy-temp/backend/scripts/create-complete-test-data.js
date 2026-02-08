const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();
const auth = admin.auth();

const API_BASE = 'http://localhost:3001/api';
const HEALTH_URL = 'http://localhost:3001/health';

async function createCompleteTestData() {
  try {
    console.log('🔧 Criando dados completos de teste...\n');

    // 1. CIDADÃO
    console.log('👤 Criando Cidadão...');
    const cidadaoData = {
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
    };

    try {
      const cidadaoResponse = await axios.post(`${API_BASE}/cidadaos`, cidadaoData);
      console.log('✅ Cidadão criado:', cidadaoResponse.data.message);
    } catch (error) {
      console.log('⚠️ Cidadão já existe ou erro:', error.response?.data?.message || error.message);
    }

    // 2. FAMÍLIA
    console.log('\n👨👩👧👦 Criando Família...');
    const familiaData = {
      nomeResponsavel: 'Maria Santos',
      email: 'maria@teste.com',
      telefone: '(31) 99999-2222',
      cpfResponsavel: '987.654.321-09',
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
    };

    try {
      const familiaResponse = await axios.post(`${API_BASE}/familias`, familiaData);
      console.log('✅ Família criada:', familiaResponse.data.message);
    } catch (error) {
      console.log('⚠️ Família já existe ou erro:', error.response?.data?.message || error.message);
    }

    // 3. ONG
    console.log('\n🏢 Criando ONG...');
    const ongData = {
      razaoSocial: 'Instituto Solidariedade',
      nomeFantasia: 'Solidariedade BH',
      email: 'contato@solidariedadebh.org',
      telefone: '(31) 99999-3333',
      cnpj: '12.345.678/0001-90',
      endereco: {
        cep: '30140-071',
        logradouro: 'Avenida Afonso Pena',
        numero: '789',
        bairro: 'Centro',
        cidade: 'Belo Horizonte',
        estado: 'MG'
      },
      areaAtuacao: ['assistência social', 'educação'],
      descricao: 'ONG dedicada a ajudar famílias em situação de vulnerabilidade',
      senha: '123456'
    };

    try {
      const ongResponse = await axios.post(`${API_BASE}/ongs`, ongData);
      console.log('✅ ONG criada:', ongResponse.data.message);
    } catch (error) {
      console.log('⚠️ ONG já existe ou erro:', error.response?.data?.message || error.message);
    }

    // 4. TESTE DE LOGIN
    console.log('\n🔐 Testando sistema de login...\n');

    const testUsers = [
      { email: 'joao@teste.com', senha: '123456', tipo: 'Cidadão' },
      { email: 'maria@teste.com', senha: '123456', tipo: 'Família' },
      { email: 'contato@solidariedadebh.org', senha: '123456', tipo: 'ONG' }
    ];

    for (const user of testUsers) {
      try {
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: user.email,
          senha: user.senha
        });
        
        console.log(`✅ Login ${user.tipo} - ${user.email}:`);
        console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);
        console.log(`   Tipo: ${loginResponse.data.user.tipo}`);
        console.log(`   Nome: ${loginResponse.data.user.nome || loginResponse.data.user.nomeResponsavel || loginResponse.data.user.nomeFantasia}`);
      } catch (error) {
        console.log(`❌ Erro login ${user.tipo}:`, error.response?.data?.message || error.message);
      }
    }

    console.log('\n🎉 Processo completo finalizado!');
    console.log('\n📋 Credenciais para teste no frontend:');
    console.log('👤 Cidadão: joao@teste.com / 123456');
    console.log('👨👩👧👦 Família: maria@teste.com / 123456');
    console.log('🏢 ONG: contato@solidariedadebh.org / 123456');
    
    console.log('\n🌐 Acesse o frontend em: http://localhost:3000');
    console.log('📊 Dashboard disponível após login');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    process.exit(1);
  }
}

// Verificar se o servidor está rodando
async function checkServer() {
  try {
    await axios.get(HEALTH_URL);
    console.log('✅ Servidor backend está rodando\n');
    return true;
  } catch (error) {
    console.log('❌ Servidor backend não está rodando!');
    console.log('   Execute: cd backend && npm start');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await createCompleteTestData();
  } else {
    process.exit(1);
  }
}

main();