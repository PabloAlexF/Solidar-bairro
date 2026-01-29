const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
const timestamp = Date.now();

// --- Funções para gerar dados válidos (evita erro 400) ---
function gerarCPF() {
  const rnd = (n) => Math.floor(Math.random() * n);
  const n = Array(9).fill(0).map(() => rnd(9));
  const d = (nums) => {
    let s = 0, p = 2;
    for (let i = nums.length - 1; i >= 0; i--) { s += nums[i] * p++; if (p > 9) p = 2; }
    let r = 11 - (s % 11); return r >= 10 ? 0 : r;
  };
  n.push(d(n)); n.push(d(n));
  return n.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function gerarCNPJ() {
  const rnd = (n) => Math.floor(Math.random() * n);
  const n = Array(8).fill(0).map(() => rnd(9));
  n.push(0, 0, 0, 1);
  const d = (nums) => {
    let s = 0, p = 2;
    for (let i = nums.length - 1; i >= 0; i--) { s += nums[i] * p++; if (p > 9) p = 2; }
    let r = 11 - (s % 11); return r >= 10 ? 0 : r;
  };
  n.push(d(n)); n.push(d(n));
  return n.join('').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
// ---------------------------------------------------------

async function testarLoginCompleto() {
  console.log('🔐 Testando Cadastro + Login para todos os perfis...\n');

  // Função auxiliar para tentar login
  const tentarLogin = async (email, senha, tipo) => {
    try {
      console.log(`   🔑 Tentando login como ${tipo}...`);
      // Envia 'password' diretamente, pois sabemos que o controller exige isso
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password: senha
      });
      console.log(`   ✅ Login ${tipo}: SUCESSO!`);
      if (response.data.token) {
        console.log(`      Token: ${response.data.token.substring(0, 15)}...`);
      }

      if (response.data.user) {
        const u = response.data.user;
        console.log(`      👤 Dados do Usuário recebidos:`);
        console.log(`         ID: ${u.id} | Tipo: ${u.tipo}`);
        console.log(`         Nome: ${u.nome || u.nomeEstabelecimento || u.nomeEntidade || u.nomeCompleto}`);
      } else {
        console.log(`      ⚠️ Objeto 'user' não encontrado na resposta. Chaves: ${Object.keys(response.data).join(', ')}`);
      }
    } catch (error) {
      console.log(`   ❌ Login ${tipo}: FALHA`);
      console.log(`      Erro: ${error.response?.data?.error || error.message}`);
    }
  };

  // 1. CIDADÃO
  try {
    const emailCidadao = `cidadao.login.${timestamp}@email.com`;
    console.log('1️⃣ Cadastrando Cidadão...');
    const resCid = await axios.post(`${BASE_URL}/cidadaos`, {
      nome: 'Cidadão Teste Login',
      email: emailCidadao,
      cpf: gerarCPF(), // Adicionado CPF válido
      rg: 'MG-12.345.678',
      dataNascimento: '1990-01-01',
      ocupacao: 'Tester',
      telefone: '(31) 99999-1111',
      password: '123456', // Nota: Cidadão usa 'password' no cadastro
      senha: '123456',    // Enviando ambos para garantir
      endereco: {
        rua: 'Rua Teste',
        numero: '100',
        bairro: 'Centro',
        cidade: 'Lagoa Santa',
        estado: 'MG',
        cep: '33400-000'
      },
      disponibilidade: ['noite'],
      interesses: ['saúde']
    });
    console.log(`   ✅ Cadastro OK (ID: ${resCid.data.data?.id || '?'})`);
    await tentarLogin(emailCidadao, '123456', 'Cidadão');
  } catch (e) { 
    console.log('Erro fluxo cidadão:', e.message);
    if (e.response) console.log('   ❌ Detalhes:', JSON.stringify(e.response.data, null, 2));
  }

  console.log('-----------------------------------');

  // 2. COMÉRCIO
  try {
    const emailComercio = `comercio.login.${timestamp}@email.com`;
    console.log('2️⃣ Cadastrando Comércio...');
    const resCom = await axios.post(`${BASE_URL}/comercios`, {
      nomeComercio: 'Comércio Teste Login',
      cnpj: gerarCNPJ(), // Adicionado CNPJ válido
      razaoSocial: 'Comércio Teste Ltda',
      email: emailComercio,
      telefone: '(31) 99999-2222',
      endereco: 'Av. Comercial, 200',
      bairro: 'Centro',
      cidade: 'Lagoa Santa',
      tipoComercio: 'Padaria',
      descricaoAtividade: 'Pães e doces',
      responsavelNome: 'José Dono',
      responsavelCpf: '111.222.333-44',
      senha: '123456',
      password: '123456' // Enviando ambos para garantir
    });
    console.log(`   ✅ Cadastro OK (ID: ${resCom.data.data?.id || '?'})`);
    await tentarLogin(emailComercio, '123456', 'Comércio');
  } catch (e) { 
    console.log('Erro fluxo comércio:', e.message);
    if (e.response) console.log('   ❌ Detalhes:', JSON.stringify(e.response.data, null, 2));
  }

  console.log('-----------------------------------');

  // 3. ONG
  try {
    const emailOng = `ong.login.${timestamp}@email.com`;
    console.log('3️⃣ Cadastrando ONG...');
    const resOng = await axios.post(`${BASE_URL}/ongs`, {
      nome: 'ONG Teste Login',
      cnpj: gerarCNPJ(), // Adicionado CNPJ válido
      razaoSocial: 'Associação ONG Teste',
      email: emailOng,
      telefone: '(31) 99999-3333',
      endereco: 'Rua da Ajuda, 300',
      bairro: 'Vila Social',
      cidade: 'Lagoa Santa',
      cep: '33400-100',
      areaTrabalho: 'Saúde',
      descricaoAtuacao: 'Apoio à saúde',
      responsavelNome: 'Maria Presidente',
      responsavelCpf: '999.888.777-66',
      senha: '123456',
      password: '123456' // Enviando ambos para garantir
    });
    console.log(`   ✅ Cadastro OK (ID: ${resOng.data.data?.id || '?'})`);
    await tentarLogin(emailOng, '123456', 'ONG');
  } catch (e) { 
    console.log('Erro fluxo ONG:', e.message);
    if (e.response) console.log('   ❌ Detalhes:', JSON.stringify(e.response.data, null, 2));
  }
}

testarLoginCompleto();