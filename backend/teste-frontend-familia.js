const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Dados exatamente como enviados pelo formulário do frontend
const dadosFormulario = {
  nomeCompleto: 'Maria da Silva Santos',
  dataNascimento: '1985-03-20',
  estadoCivil: 'casado',
  profissao: 'Diarista',
  cpf: '123.456.789-00',
  rg: '12.345.678-9',
  nis: '12345678901',
  rendaFamiliar: 'ate-1-salario',
  telefone: '(11) 99999-8888',
  whatsapp: '(11) 99999-8888',
  email: 'maria.silva@email.com',
  password: '123456',
  horarioContato: 'manha',
  endereco: 'Rua das Acácias, 456, Casa 2',
  bairro: 'Vila Nova',
  pontoReferencia: 'Próximo à escola municipal',
  tipoMoradia: 'casa-alugada',
  criancas: 3,
  jovens: 0,
  adultos: 2,
  idosos: 1,
  necessidades: ['Alimentação Básica', 'Material Escolar', 'Medicamentos', 'Roupas e Calçados']
};

async function testarCadastroFrontend() {
  try {
    console.log('🧪 Testando cadastro de família (simulando frontend)...\n');
    
    console.log('📋 Dados do formulário:');
    console.log('   Nome:', dadosFormulario.nomeCompleto);
    console.log('   Email:', dadosFormulario.email);
    console.log('   Telefone:', dadosFormulario.telefone);
    console.log('   Endereço:', dadosFormulario.endereco);
    console.log('   Bairro:', dadosFormulario.bairro);
    console.log('   Composição familiar:');
    console.log('     - Crianças:', dadosFormulario.criancas);
    console.log('     - Jovens:', dadosFormulario.jovens);
    console.log('     - Adultos:', dadosFormulario.adultos);
    console.log('     - Idosos:', dadosFormulario.idosos);
    console.log('   Necessidades:', dadosFormulario.necessidades.join(', '));

    console.log('\n🚀 Enviando dados para a API...');
    
    const response = await axios.post(`${BASE_URL}/familias`, dadosFormulario);
    
    console.log('✅ SUCESSO! Família cadastrada!');
    console.log('📄 Resposta da API:');
    console.log('   ID:', response.data.data.id);
    console.log('   Nome:', response.data.data.nomeCompleto);
    console.log('   Email:', response.data.data.email || 'Não informado');
    console.log('   Total de membros:', response.data.data.composicao?.totalMembros || 'Não calculado');
    console.log('   Bairro:', response.data.data.endereco?.bairro || 'Não informado');
    console.log('   Status:', response.data.data.status);
    console.log('   Criado em:', response.data.data.criadoEm);

    // Verificar se foi salvo corretamente
    console.log('\n🔍 Verificando se foi salvo no banco...');
    const verificacao = await axios.get(`${BASE_URL}/familias/${response.data.data.id}`);
    console.log('✅ Família encontrada no banco:', verificacao.data.data.nomeCompleto);

    return true;

  } catch (error) {
    console.error('❌ ERRO no cadastro:');
    console.error('   Mensagem:', error.response?.data?.error || error.message);
    console.error('   Status:', error.response?.status);
    
    if (error.response?.data) {
      console.error('   Detalhes:', JSON.stringify(error.response.data, null, 2));
    }
    
    return false;
  }
}

// Executar teste
testarCadastroFrontend().then(sucesso => {
  if (sucesso) {
    console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
    console.log('✅ O sistema de cadastro de famílias está funcionando corretamente!');
  } else {
    console.log('\n💥 TESTE FALHOU!');
    console.log('❌ Há problemas no sistema de cadastro de famílias!');
  }
});