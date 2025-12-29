const axios = require('axios');

const testONGData = {
  nomeEntidade: "Instituto Solidariedade Lagoa Santa",
  cnpj: "98.765.432/0001-10",
  razaoSocial: "Instituto Solidariedade Lagoa Santa",
  nomeFantasia: "Solidariedade LS",
  areaTrabalho: "Assistência Social",
  descricaoAtuacao: "Atendimento a famílias em situação de vulnerabilidade social, distribuição de alimentos e roupas, apoio educacional para crianças e adolescentes.",
  responsavelNome: "Maria Silva Santos",
  responsavelCpf: "987.654.321-00",
  telefone: "(31) 99888-7777",
  email: "contato@solidariedadels.org.br",
  endereco: "Rua da Esperança, 456",
  bairro: "Centro",
  cidade: "Lagoa Santa",
  cep: "33400-100",
  senha: "ong123456",
  aceitaTermos: true,
  aceitaPrivacidade: true,
  aceitaPoliticaOng: true,
  declaracaoVeracidade: true
};

async function testCadastroONG() {
  try {
    console.log('🏛️ Testando cadastro de ONG...');
    console.log('Dados:', JSON.stringify(testONGData, null, 2));
    
    const response = await axios.post('http://localhost:3001/api/ongs', testONGData);
    
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
testCadastroONG();