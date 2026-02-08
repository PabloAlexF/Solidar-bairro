const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
const timestamp = Date.now();

// --- Funções para gerar dados válidos ---
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
// ----------------------------------------

async function cadastrarTodos() {
  console.log('🚀 Cadastrando todos os tipos...\n');

  // Cidadão
  try {
    console.log('👤 Cadastrando cidadão...');
    const cidadao = await axios.post(`${BASE_URL}/cidadaos`, {
      nome: 'Maria Silva',
      email: `maria.silva.${timestamp}@email.com`,
      cpf: gerarCPF(),
      rg: 'MG-12.345.678',
      dataNascimento: '1990-01-01',
      ocupacao: 'Professor',
      telefone: '(31) 98765-4321',
      password: '123456',
      endereco: {
        rua: 'Rua das Acácias',
        numero: '456',
        bairro: 'Centro',
        cidade: 'Lagoa Santa',
        estado: 'MG',
        cep: '33400-000'
      },
      disponibilidade: ['manhã'],
      interesses: ['educação'],
      proposito: 'Ajudar a comunidade',
    });
    console.log('✅ Cidadão cadastrado:', cidadao.data.data.nome);
  } catch (error) {
    console.log('❌ Erro cidadão:', error.response?.data?.error || error.message);
  }

  // Comércio
  try {
    console.log('\n🏪 Cadastrando comércio...');
    const comercio = await axios.post(`${BASE_URL}/comercios`, {
      nomeComercio: 'Farmácia Central',
      cnpj: gerarCNPJ(),
      razaoSocial: 'Farmácia Central Ltda',
      email: `farmacia.${timestamp}@email.com`,
      telefone: '(31) 3344-5566',
      endereco: 'Av. Central, 789',
      bairro: 'Centro',
      cidade: 'Lagoa Santa',
      tipoComercio: 'Farmácia',
      descricaoAtividade: 'Medicamentos e produtos de saúde',
      responsavelNome: 'Carlos Santos',
      responsavelCpf: '111.222.333-44',
      senha: '123456'
    });
    console.log('✅ Comércio cadastrado:', comercio.data.data.nomeComercio);
  } catch (error) {
    console.log('❌ Erro comércio:', error.response?.data?.error || error.message);
  }

  // ONG
  try {
    console.log('\n🏛️ Cadastrando ONG...');
    const ong = await axios.post(`${BASE_URL}/ongs`, {
      nome: 'Associação Esperança',
      cnpj: gerarCNPJ(),
      razaoSocial: 'Associação Esperança de Lagoa Santa',
      email: `esperanca.${timestamp}@email.com`,
      telefone: '(31) 2233-4455',
      endereco: 'Rua da Educação, 321',
      bairro: 'Vila Nova',
      cidade: 'Lagoa Santa',
      cep: '33400-200',
      areaTrabalho: 'Educação',
      descricaoAtuacao: 'Reforço escolar para crianças',
      responsavelNome: 'Ana Costa',
      responsavelCpf: '555.666.777-88',
      senha: '123456'
    });
    console.log('✅ ONG cadastrada:', ong.data.data.nome);
  } catch (error) {
    console.log('❌ Erro ONG:', error.response?.data?.error || error.message);
  }

  // Família
  try {
    console.log('\n👨👩👧👦 Cadastrando família...');
    const familia = await axios.post(`${BASE_URL}/familias`, {
      nomeCompleto: `Família Costa ${timestamp}`,
      endereco: 'Rua da Paz, 654',
      telefone: '(31) 7777-8888',
      email: `familia.costa.${timestamp}@email.com`,
      membros: [
        { nome: 'Roberto Costa', idade: 35, parentesco: 'pai' },
        { nome: 'Lucia Costa', idade: 32, parentesco: 'mãe' },
        { nome: 'Bruno Costa', idade: 8, parentesco: 'filho' }
      ],
      necessidades: ['alimentação', 'material escolar']
    });
    console.log('✅ Família cadastrada:', familia.data.data.nomeCompleto);
  } catch (error) {
    console.log('❌ Erro família:', error.response?.data?.error || error.message);
  }

  console.log('\n🎉 Cadastros concluídos!');
}

cadastrarTodos();