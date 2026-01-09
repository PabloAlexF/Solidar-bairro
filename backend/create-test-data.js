const admin = require('firebase-admin');

// Dados de teste para ONG
const testONG = {
  nome_fantasia: "Instituto Esperança",
  razao_social: "Instituto Esperança de Desenvolvimento Social LTDA",
  cnpj: "12.345.678/0001-90",
  email: "contato@institutoesperanca.org",
  telefone: "(11) 98765-4321",
  data_fundacao: "2015-03-15",
  website: "https://institutoesperanca.org",
  sede: "Rua das Flores, 123 - Centro, São Paulo - SP",
  areas_cobertura: ["Centro", "Zona Norte", "Periferia"],
  num_voluntarios: 45,
  colaboradores_fixos: 8,
  causas: ["Segurança Alimentar", "Educação e Cultura", "Direitos Humanos"],
  status: "pending",
  created_at: new Date().toISOString()
};

// Dados de teste para Comércio
const testComercio = {
  nome_fantasia: "Padaria do Bairro",
  razao_social: "Padaria e Confeitaria do Bairro LTDA",
  cnpj: "98.765.432/0001-10",
  segmento: "Alimentação",
  responsavel_legal: "João Silva Santos",
  telefone: "(11) 91234-5678",
  email: "contato@padariabairro.com",
  endereco: "Av. Principal, 456 - Vila Nova, São Paulo - SP",
  horario_funcionamento: "Segunda a Sábado das 06h às 20h",
  contribuicoes: [
    "Ponto de Coleta de Doações",
    "Descontos para Famílias Cadastradas",
    "Doação de Excedentes (Alimentos)"
  ],
  observacoes: "Disponível para parcerias sociais",
  status: "pending",
  created_at: new Date().toISOString()
};

// Dados de teste para Família
const testFamilia = {
  nomeCompleto: "Maria Santos Silva",
  dataNascimento: "1985-07-20",
  estadoCivil: "Casado(a)",
  profissao: "Diarista",
  cpf: "123.456.789-00",
  rg: "12.345.678-9",
  nis: "123.45678.90-1",
  rendaFamiliar: "501_1000",
  telefone: "(11) 99876-5432",
  whatsapp: "(11) 99876-5432",
  email: "maria.santos@email.com",
  horarioContato: "Tarde",
  endereco: "Rua das Palmeiras, 789",
  bairro: "Jardim Esperança",
  pontoReferencia: "Próximo ao posto de saúde",
  tipoMoradia: "Casa Alugada",
  criancas: 2,
  jovens: 1,
  adultos: 2,
  idosos: 0,
  necessidades: ["Alimentação", "Material Escolar", "Roupas"],
  status: "pending",
  created_at: new Date().toISOString()
};

// Dados de teste para Cidadão
const testCidadao = {
  nomeCompleto: "Carlos Eduardo Oliveira",
  email: "carlos.oliveira@email.com",
  telefone: "(11) 94567-8901",
  cpf: "987.654.321-00",
  dataNascimento: "1990-12-10",
  profissao: "Engenheiro de Software",
  endereco: "Rua dos Desenvolvedores, 321 - Tech Valley, São Paulo - SP",
  disponibilidade: ["Fins de semana", "Noites"],
  interesses: ["Educação e Cultura", "Meio Ambiente", "Tecnologia Social"],
  proposito: "Quero usar minhas habilidades técnicas para ajudar ONGs com soluções digitais",
  status: "pending",
  created_at: new Date().toISOString()
};

async function createTestData() {
  try {
    const db = admin.firestore();
    
    // Criar ONG
    const ongRef = await db.collection('ongs').add(testONG);
    console.log('✅ ONG criada com ID:', ongRef.id);
    
    // Criar Comércio
    const comercioRef = await db.collection('comercios').add(testComercio);
    console.log('✅ Comércio criado com ID:', comercioRef.id);
    
    // Criar Família
    const familiaRef = await db.collection('familias').add(testFamilia);
    console.log('✅ Família criada com ID:', familiaRef.id);
    
    // Criar Cidadão
    const cidadaoRef = await db.collection('cidadaos').add(testCidadao);
    console.log('✅ Cidadão criado com ID:', cidadaoRef.id);
    
    console.log('\n🎉 Todos os dados de teste foram criados com sucesso!');
    console.log('Agora você pode testar o dashboard administrativo.');
    
  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  createTestData();
}

module.exports = { createTestData };