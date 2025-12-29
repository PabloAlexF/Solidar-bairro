const axios = require('axios');

const testCidadao = async () => {
  try {
    const response = await axios.post('http://localhost:3001/api/cidadaos', {
      nome: 'Teste Silva',
      email: 'teste@email.com',
      telefone: '(11) 99999-9999',
      password: '123456',
      cep: '01234-567',
      rua: 'Rua de Teste',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP'
    });

    console.log('✅ Sucesso:', response.data);
  } catch (error) {
    console.log('❌ Erro:', error.response?.data || error.message);
  }
};

testCidadao();