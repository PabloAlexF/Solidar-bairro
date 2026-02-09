const admin = require('firebase-admin');
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

async function createTestData() {
  try {
    console.log('🔧 Criando dados de teste...');

    // 1. Cidadão
    const cidadao = {
      uid: 'test-cidadao-001',
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
      tipo: 'cidadao',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('cidadaos').doc(cidadao.uid).set(cidadao);
    console.log('✅ Cidadão criado:', cidadao.nome);

    // 2. Família
    const familia = {
      uid: 'test-familia-001',
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
      tipo: 'familia',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('familias').doc(familia.uid).set(familia);
    console.log('✅ Família criada:', familia.nomeResponsavel);

    // 3. ONG
    const ong = {
      uid: 'test-ong-001',
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
      tipo: 'ong',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('ongs').doc(ong.uid).set(ong);
    console.log('✅ ONG criada:', ong.nomeFantasia);

    console.log('\n🎉 Dados de teste criados com sucesso!');
    console.log('\n📋 Credenciais para teste:');
    console.log('👤 Cidadão: joao@teste.com');
    console.log('👨‍👩‍👧‍👦 Família: maria@teste.com');
    console.log('🏢 ONG: contato@solidariedadebh.org');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
    process.exit(1);
  }
}

createTestData();