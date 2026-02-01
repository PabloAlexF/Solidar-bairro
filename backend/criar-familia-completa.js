const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Família completa com todos os campos preenchidos
const familiaCompleta = {
  nome: 'Família Oliveira Santos',
  endereco: 'Rua das Palmeiras, 456 - Bairro Esperança - São Paulo/SP - CEP: 01234-567',
  telefone: '(11) 98765-4321',
  email: 'familia.oliveira.santos@gmail.com',
  membros: [
    {
      nome: 'Carlos Eduardo Oliveira Santos',
      idade: 38,
      parentesco: 'pai'
    },
    {
      nome: 'Ana Paula Silva Santos',
      idade: 35,
      parentesco: 'mãe'
    },
    {
      nome: 'Lucas Oliveira Santos',
      idade: 12,
      parentesco: 'filho'
    },
    {
      nome: 'Sophia Oliveira Santos',
      idade: 8,
      parentesco: 'filha'
    },
    {
      nome: 'Maria José Silva',
      idade: 67,
      parentesco: 'avó'
    }
  ],
  necessidades: [
    'alimentação',
    'medicamentos',
    'roupas',
    'material escolar',
    'produtos de higiene',
    'material de limpeza',
    'móveis',
    'eletrodomésticos'
  ],
  status: 'ativa',
  observacoes: 'Família em situação de vulnerabilidade social. Pai desempregado há 6 meses, mãe trabalha como diarista. Avó com diabetes e hipertensão. Crianças estudam na escola pública local.',
  renda: 'até 1 salário mínimo',
  tipoMoradia: 'alugada',
  numeroComodos: 3,
  temAgua: true,
  temLuz: true,
  temEsgoto: false,
  temInternet: false,
  beneficioSocial: 'Auxílio Brasil',
  contato: {
    preferencia: 'WhatsApp',
    melhorHorario: 'manhã',
    observacoes: 'Ligar preferencialmente pela manhã, após 8h'
  }
};

async function cadastrarFamiliaCompleta() {
  try {
    console.log('🏠 Cadastrando família completa...\n');
    console.log('📋 Dados da família:');
    console.log(`Nome: ${familiaCompleta.nome}`);
    console.log(`Endereço: ${familiaCompleta.endereco}`);
    console.log(`Telefone: ${familiaCompleta.telefone}`);
    console.log(`Email: ${familiaCompleta.email}`);
    console.log(`Membros: ${familiaCompleta.membros.length} pessoas`);
    console.log(`Necessidades: ${familiaCompleta.necessidades.join(', ')}`);
    console.log('\n⏳ Enviando dados...');

    const response = await axios.post(`${BASE_URL}/familias`, familiaCompleta);
    
    if (response.data.success) {
      console.log('✅ Família cadastrada com sucesso!');
      console.log(`📄 ID: ${response.data.data.id}`);
      console.log(`📅 Criada em: ${new Date(response.data.data.createdAt).toLocaleString('pt-BR')}`);
      
      return response.data.data;
    } else {
      console.log('❌ Erro no cadastro:', response.data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao cadastrar família:', error.response?.data || error.message);
    return null;
  }
}

async function testarLogin() {
  try {
    console.log('\n🔐 Testando sistema de login...\n');
    
    // Primeiro, vamos verificar se existe algum usuário cadastrado
    console.log('1. Verificando usuários cadastrados...');
    
    try {
      const cidadaos = await axios.get(`${BASE_URL}/cidadaos`);
      console.log(`✅ Cidadãos encontrados: ${cidadaos.data.data?.length || 0}`);
      
      if (cidadaos.data.data && cidadaos.data.data.length > 0) {
        const primeiroUsuario = cidadaos.data.data[0];
        console.log(`👤 Primeiro usuário: ${primeiroUsuario.nome || primeiroUsuario.nomeCompleto}`);
        console.log(`📧 Email: ${primeiroUsuario.email}`);
        
        // Tentar login com dados do primeiro usuário
        console.log('\n2. Testando login...');
        const loginData = {
          email: primeiroUsuario.email,
          password: '123456' // Senha padrão dos testes
        };
        
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
        
        if (loginResponse.data.success) {
          console.log('✅ Login realizado com sucesso!');
          console.log(`🎫 Token: ${loginResponse.data.token ? 'Gerado' : 'Não gerado'}`);
          console.log(`👤 Usuário: ${loginResponse.data.user?.nome || loginResponse.data.user?.nomeCompleto}`);
          console.log(`🏷️ Tipo: ${loginResponse.data.user?.tipo || 'cidadao'}`);
        } else {
          console.log('❌ Falha no login:', loginResponse.data.error);
        }
      } else {
        console.log('⚠️ Nenhum usuário encontrado para testar login');
        console.log('💡 Criando usuário de teste...');
        
        const usuarioTeste = {
          nome: 'João Silva Teste',
          email: 'joao.teste@email.com',
          telefone: '(11) 99999-9999',
          endereco: 'Rua Teste, 123',
          password: '123456'
        };
        
        const novoUsuario = await axios.post(`${BASE_URL}/cidadaos`, usuarioTeste);
        
        if (novoUsuario.data.success) {
          console.log('✅ Usuário de teste criado!');
          
          // Tentar login com o novo usuário
          const loginData = {
            email: usuarioTeste.email,
            password: usuarioTeste.password
          };
          
          const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
          
          if (loginResponse.data.success) {
            console.log('✅ Login com usuário de teste realizado com sucesso!');
            console.log(`🎫 Token: ${loginResponse.data.token ? 'Gerado' : 'Não gerado'}`);
            console.log(`👤 Usuário: ${loginResponse.data.user?.nome}`);
          } else {
            console.log('❌ Falha no login com usuário de teste:', loginResponse.data.error);
          }
        } else {
          console.log('❌ Erro ao criar usuário de teste:', novoUsuario.data.error);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao verificar usuários:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste de login:', error.response?.data || error.message);
  }
}

async function verificarSistema() {
  try {
    console.log('🔍 Verificando se o servidor está rodando...');
    // Testa uma API simples para verificar se o servidor está funcionando
    const response = await axios.get(`${BASE_URL}/cidadaos`);
    console.log('✅ Servidor está funcionando!');
    return true;
  } catch (error) {
    console.log('❌ Servidor não está respondendo. Verifique se está rodando na porta 3001');
    console.log('💡 Execute: cd backend && npm start');
    return false;
  }
}

async function executarTestes() {
  console.log('🚀 Iniciando testes do SolidarBrasil...\n');
  
  // Verificar se servidor está rodando
  const servidorOk = await verificarSistema();
  if (!servidorOk) {
    return;
  }
  
  // Cadastrar família completa
  const familia = await cadastrarFamiliaCompleta();
  
  // Testar login
  await testarLogin();
  
  console.log('\n🎉 Testes concluídos!');
  console.log('\n📊 Resumo:');
  console.log(`✅ Família cadastrada: ${familia ? 'Sim' : 'Não'}`);
  console.log('✅ Login testado: Sim');
  
  if (familia) {
    console.log('\n📋 Dados da família cadastrada:');
    console.log(`ID: ${familia.id}`);
    console.log(`Nome: ${familia.nome}`);
    console.log(`Membros: ${familia.membros?.length || 0}`);
    console.log(`Status: ${familia.status}`);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  executarTestes();
}

module.exports = { cadastrarFamiliaCompleta, testarLogin, familiaCompleta };