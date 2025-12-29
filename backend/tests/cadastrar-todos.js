const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function cadastrarTodos() {
  console.log('🚀 Cadastrando todos os tipos...\n');

  // Cidadão
  try {
    console.log('👤 Cadastrando cidadão...');
    const cidadao = await axios.post(`${BASE_URL}/cidadaos`, {
      nome: 'Maria Silva',
      email: 'maria.silva@email.com',
      telefone: '(31) 98765-4321',
      password: '123456',
      cep: '33400-000',
      rua: 'Rua das Acácias',
      numero: '456',
      bairro: 'Centro',
      cidade: 'Lagoa Santa',
      estado: 'MG'
    });
    console.log('✅ Cidadão cadastrado:', cidadao.data.data.nome);
  } catch (error) {
    console.log('❌ Erro cidadão:', error.response?.data?.error || error.message);
  }

  // Comércio
  try {
    console.log('\n🏪 Cadastrando comércio...');
    const comercio = await axios.post(`${BASE_URL}/comercios`, {
      nomeEstabelecimento: 'Farmácia Central',
      cnpj: '11.222.333/0001-44',
      razaoSocial: 'Farmácia Central Ltda',
      tipoComercio: 'Farmácia',
      descricaoAtividade: 'Medicamentos e produtos de saúde',
      responsavelNome: 'Carlos Santos',
      responsavelCpf: '111.222.333-44',
      telefone: '(31) 3344-5566',
      email: 'farmacia@email.com',
      senha: '123456',
      endereco: 'Av. Central, 789',
      bairro: 'Centro',
      cidade: 'Lagoa Santa'
    });
    console.log('✅ Comércio cadastrado:', comercio.data.data.nomeEstabelecimento);
  } catch (error) {
    console.log('❌ Erro comércio:', error.response?.data?.error || error.message);
  }

  // ONG
  try {
    console.log('\n🏛️ Cadastrando ONG...');
    const ong = await axios.post(`${BASE_URL}/ongs`, {
      nomeEntidade: 'Associação Esperança',
      cnpj: '55.666.777/0001-88',
      razaoSocial: 'Associação Esperança de Lagoa Santa',
      areaTrabalho: 'Educação',
      descricaoAtuacao: 'Reforço escolar para crianças',
      responsavelNome: 'Ana Costa',
      responsavelCpf: '555.666.777-88',
      telefone: '(31) 2233-4455',
      email: 'esperanca@email.com',
      senha: '123456',
      endereco: 'Rua da Educação, 321',
      bairro: 'Vila Nova',
      cidade: 'Lagoa Santa',
      cep: '33400-200'
    });
    console.log('✅ ONG cadastrada:', ong.data.data.nomeEntidade);
  } catch (error) {
    console.log('❌ Erro ONG:', error.response?.data?.error || error.message);
  }

  // Família
  try {
    console.log('\n👨‍👩‍👧‍👦 Cadastrando família...');
    const familia = await axios.post(`${BASE_URL}/familias`, {
      nome: 'Família Costa',
      endereco: 'Rua da Paz, 654',
      telefone: '(31) 7777-8888',
      email: 'familia.costa@email.com',
      membros: [
        { nome: 'Roberto Costa', idade: 35, parentesco: 'pai' },
        { nome: 'Lucia Costa', idade: 32, parentesco: 'mãe' },
        { nome: 'Bruno Costa', idade: 8, parentesco: 'filho' }
      ],
      necessidades: ['alimentação', 'material escolar']
    });
    console.log('✅ Família cadastrada:', familia.data.data.nome);
  } catch (error) {
    console.log('❌ Erro família:', error.response?.data?.error || error.message);
  }

  console.log('\n🎉 Cadastros concluídos!');
}

cadastrarTodos();