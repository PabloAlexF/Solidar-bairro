const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testarComercio() {
  console.log('🏪 Testando cadastro de comércio...\n');

  // Primeiro testar se servidor está rodando
  try {
    const health = await axios.get('http://localhost:3001/health');
    console.log('✅ Servidor OK:', health.data);
  } catch (error) {
    console.log('❌ Servidor não está rodando!');
    return;
  }

  const comercioData = {
    nomeEstabelecimento: 'Teste Padaria',
    cnpj: '12345678000190',
    razaoSocial: 'Teste Padaria Ltda',
    tipoComercio: 'Padaria',
    descricaoAtividade: 'Pães e doces',
    responsavelNome: 'João Teste',
    responsavelCpf: '12345678900',
    telefone: '31999999999',
    email: 'teste@padaria.com',
    endereco: 'Rua Teste, 123',
    bairro: 'Centro',
    cidade: 'Lagoa Santa',
    senha: '123456'
  };

  try {
    console.log('Dados enviados:', JSON.stringify(comercioData, null, 2));
    
    const response = await axios.post(`${BASE_URL}/comercios`, comercioData);
    console.log('✅ Sucesso:', response.data);
  } catch (error) {
    console.log('❌ Status:', error.response?.status);
    console.log('Erro completo:', error.response?.data);
    console.log('Mensagem:', error.message);
  }
}

testarComercio();