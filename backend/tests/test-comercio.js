const axios = require('axios');

const testComercioData = {
  nomeEstabelecimento: "Mercado do João",
  cnpj: "12.345.678/0001-90",
  razaoSocial: "João Silva Comércio LTDA",
  nomeFantasia: "Mercado do João",
  tipoComercio: "Mercado/Supermercado",
  descricaoAtividade: "Venda de produtos alimentícios, bebidas e itens de primeira necessidade",
  horarioFuncionamento: "Segunda a Sábado: 7h às 19h, Domingo: 7h às 12h",
  responsavelNome: "João Silva",
  responsavelCpf: "123.456.789-00",
  telefone: "(31) 99999-1234",
  email: "contato@mercadodojoao.com.br",
  endereco: "Rua das Flores, 123",
  bairro: "Centro",
  cidade: "Lagoa Santa",
  uf: "MG",
  cep: "33400-000",
  aceitaMoedaSolidaria: true,
  ofereceProdutosSolidarios: true,
  participaAcoesSociais: true,
  senha: "123456789",
  aceitaTermos: true,
  aceitaPrivacidade: true
};

async function testCadastroComercio() {
  try {
    console.log('🏪 Testando cadastro de comércio...');
    console.log('Dados:', JSON.stringify(testComercioData, null, 2));
    
    const response = await axios.post('http://localhost:3001/api/comercios', testComercioData);
    
    console.log('✅ Sucesso!');
    console.log('Status:', response.status);
    console.log('Resposta:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Erro no cadastro:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Erro:', error.response.data);
    } else {
      console.log('Erro:', error.message);
    }
  }
}

// Executar teste
testCadastroComercio();