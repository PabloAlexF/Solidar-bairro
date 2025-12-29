const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Mapeamento dos dados para cada tipo
const exemplosDados = {
  cidadao: {
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(31) 99999-9999',
    password: '123456',
    cep: '33400-000',
    rua: 'Rua das Flores',
    numero: '123',
    bairro: 'Centro',
    cidade: 'Lagoa Santa',
    estado: 'MG'
  },
  comercio: {
    nomeEstabelecimento: 'Padaria do João',
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Padaria João Ltda',
    tipoComercio: 'Alimentação',
    descricaoAtividade: 'Padaria e confeitaria',
    responsavelNome: 'João Santos',
    responsavelCpf: '123.456.789-00',
    telefone: '(31) 3333-3333',
    email: 'padaria@email.com',
    senha: '123456',
    endereco: 'Av. Principal, 456',
    bairro: 'Centro',
    cidade: 'Lagoa Santa'
  },
  ong: {
    nomeEntidade: 'Instituto Solidário',
    cnpj: '98.765.432/0001-10',
    razaoSocial: 'Instituto Solidário de Lagoa Santa',
    areaTrabalho: 'Assistência Social',
    descricaoAtuacao: 'Apoio a famílias em vulnerabilidade',
    responsavelNome: 'Maria Santos',
    responsavelCpf: '987.654.321-00',
    telefone: '(31) 2222-2222',
    email: 'instituto@email.com',
    senha: '123456',
    endereco: 'Rua da Solidariedade, 789',
    bairro: 'Vila Nova',
    cidade: 'Lagoa Santa',
    cep: '33400-100'
  },
  familia: {
    nome: 'Família Santos',
    endereco: 'Rua da Esperança, 321',
    telefone: '(31) 8888-8888',
    email: 'familia.santos@email.com',
    membros: [
      { nome: 'Pedro Santos', idade: 40, parentesco: 'pai' },
      { nome: 'Ana Santos', idade: 38, parentesco: 'mãe' }
    ],
    necessidades: ['alimentação', 'roupas']
  }
};

async function testarTodasAPIs() {
  console.log('🧪 Testando todas as APIs do Solidar Bairro...\n');

  const tipos = ['cidadaos', 'comercios', 'ongs', 'familias'];
  
  for (const tipo of tipos) {
    try {
      console.log(`📋 === ${tipo.toUpperCase()} ===`);
      
      // 1. Cadastrar
      console.log(`1. Cadastrando ${tipo.slice(0, -1)}...`);
      const response = await axios.post(`${BASE_URL}/${tipo}`, exemplosDados[tipo.slice(0, -1)]);
      console.log(`✅ Cadastrado com sucesso:`, response.data.success);
      
      const id = response.data.data.uid || response.data.data.id;
      
      // 2. Listar todos
      console.log(`2. Listando todos os ${tipo}...`);
      const lista = await axios.get(`${BASE_URL}/${tipo}`);
      console.log(`✅ Total encontrado:`, lista.data.data.length);
      
      // 3. Buscar por ID (se tiver ID)
      if (id) {
        console.log(`3. Buscando ${tipo.slice(0, -1)} por ID...`);
        const individual = await axios.get(`${BASE_URL}/${tipo}/${id}`);
        console.log(`✅ Encontrado:`, individual.data.data.nome || individual.data.data.nomeEstabelecimento || individual.data.data.nomeEntidade);
      }
      
      console.log('\n');
    } catch (error) {
      console.error(`❌ Erro em ${tipo}:`, error.response?.data?.error || error.message);
      console.log('\n');
    }
  }
  
  console.log('🎉 Teste concluído!');
}

if (require.main === module) {
  testarTodasAPIs();
}

module.exports = { testarTodasAPIs, exemplosDados };