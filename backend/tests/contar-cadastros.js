const axios = require('axios');

async function contarCadastros() {
  console.log('📊 Contando cadastros existentes...\n');

  const tipos = ['cidadaos', 'comercios', 'ongs', 'familias'];
  
  for (const tipo of tipos) {
    try {
      const response = await axios.get(`http://localhost:3001/api/${tipo}`);
      const total = response.data.data.length;
      console.log(`${tipo.toUpperCase()}: ${total} cadastros`);
    } catch (error) {
      console.log(`${tipo.toUpperCase()}: ❌ Erro - ${error.message}`);
    }
  }
}

contarCadastros();