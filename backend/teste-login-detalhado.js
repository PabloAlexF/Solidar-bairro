const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testarLoginDetalhado() {
  console.log('🔐 Teste Detalhado de Login - SolidarBrasil\n');
  
  try {
    // 1. Listar usuários disponíveis
    console.log('1. 📋 Listando usuários disponíveis...');
    const cidadaos = await axios.get(`${BASE_URL}/cidadaos`);
    
    if (cidadaos.data.success && cidadaos.data.data.length > 0) {
      console.log(`✅ Encontrados ${cidadaos.data.data.length} cidadãos cadastrados:`);
      
      cidadaos.data.data.forEach((cidadao, index) => {
        console.log(`   ${index + 1}. ${cidadao.nome || cidadao.nomeCompleto} - ${cidadao.email}`);
      });
      
      // 2. Testar login com o primeiro usuário
      const primeiroUsuario = cidadaos.data.data[0];
      console.log(`\n2. 🔑 Testando login com: ${primeiroUsuario.nome || primeiroUsuario.nomeCompleto}`);
      console.log(`   📧 Email: ${primeiroUsuario.email}`);
      
      const loginData = {
        email: primeiroUsuario.email,
        password: '123456' // Senha padrão dos testes
      };
      
      console.log('   ⏳ Enviando credenciais...');
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
      
      if (loginResponse.data.success) {
        console.log('   ✅ LOGIN REALIZADO COM SUCESSO!');
        console.log(`   🎫 Token gerado: ${loginResponse.data.token ? 'Sim' : 'Não'}`);
        console.log(`   👤 Nome do usuário: ${loginResponse.data.user?.nome || loginResponse.data.user?.nomeCompleto || 'N/A'}`);
        console.log(`   📧 Email: ${loginResponse.data.user?.email || 'N/A'}`);
        console.log(`   🏷️ Tipo: ${loginResponse.data.user?.tipo || 'cidadao'}`);
        console.log(`   🆔 UID: ${loginResponse.data.user?.uid || loginResponse.data.user?.id || 'N/A'}`);
        
        // 3. Testar acesso com token (se disponível)
        if (loginResponse.data.token) {
          console.log('\n3. 🔒 Testando acesso autenticado...');
          try {
            const authResponse = await axios.get(`${BASE_URL}/cidadaos/${primeiroUsuario.id}`, {
              headers: {
                'Authorization': `Bearer ${loginResponse.data.token}`
              }
            });
            console.log('   ✅ Acesso autenticado funcionando!');
          } catch (authError) {
            console.log('   ⚠️ Erro no acesso autenticado:', authError.response?.data?.error || authError.message);
          }
        }
        
      } else {
        console.log('   ❌ FALHA NO LOGIN');
        console.log(`   🚫 Erro: ${loginResponse.data.error || 'Erro desconhecido'}`);
      }
      
    } else {
      console.log('⚠️ Nenhum usuário encontrado para teste');
      
      // Criar usuário de teste
      console.log('\n💡 Criando usuário de teste...');
      const novoUsuario = {
        nome: 'Usuário Teste Login',
        email: 'teste.login@solidarbrasil.com',
        telefone: '(11) 99999-0000',
        endereco: 'Rua Teste Login, 123',
        password: '123456'
      };
      
      const criarResponse = await axios.post(`${BASE_URL}/cidadaos`, novoUsuario);
      
      if (criarResponse.data.success) {
        console.log('✅ Usuário de teste criado!');
        
        // Testar login com o novo usuário
        console.log('\n🔑 Testando login com usuário recém-criado...');
        const loginData = {
          email: novoUsuario.email,
          password: novoUsuario.password
        };
        
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
        
        if (loginResponse.data.success) {
          console.log('✅ LOGIN COM USUÁRIO NOVO REALIZADO COM SUCESSO!');
          console.log(`🎫 Token: ${loginResponse.data.token ? 'Gerado' : 'Não gerado'}`);
          console.log(`👤 Usuário: ${loginResponse.data.user?.nome}`);
        } else {
          console.log('❌ Falha no login com usuário novo:', loginResponse.data.error);
        }
      } else {
        console.log('❌ Erro ao criar usuário de teste:', criarResponse.data.error);
      }
    }
    
    // 4. Testar outros tipos de usuário
    console.log('\n4. 🏪 Testando login com outros tipos de usuário...');
    
    // Testar comércios
    try {
      const comercios = await axios.get(`${BASE_URL}/comercios`);
      if (comercios.data.success && comercios.data.data.length > 0) {
        const comercio = comercios.data.data[0];
        console.log(`   🏪 Testando comércio: ${comercio.nomeFantasia || comercio.nome}`);
        
        const loginComercio = await axios.post(`${BASE_URL}/auth/login`, {
          email: comercio.email,
          password: '123456'
        });
        
        if (loginComercio.data.success) {
          console.log('   ✅ Login de comércio funcionando!');
        } else {
          console.log('   ⚠️ Login de comércio falhou:', loginComercio.data.error);
        }
      }
    } catch (error) {
      console.log('   ⚠️ Erro ao testar login de comércio');
    }
    
    // Testar ONGs
    try {
      const ongs = await axios.get(`${BASE_URL}/ongs`);
      if (ongs.data.success && ongs.data.data.length > 0) {
        const ong = ongs.data.data[0];
        console.log(`   🏛️ Testando ONG: ${ong.nome || ong.nomeFantasia}`);
        
        const loginOng = await axios.post(`${BASE_URL}/auth/login`, {
          email: ong.email,
          password: '123456'
        });
        
        if (loginOng.data.success) {
          console.log('   ✅ Login de ONG funcionando!');
        } else {
          console.log('   ⚠️ Login de ONG falhou:', loginOng.data.error);
        }
      }
    } catch (error) {
      console.log('   ⚠️ Erro ao testar login de ONG');
    }
    
  } catch (error) {
    console.error('❌ Erro geral no teste:', error.response?.data || error.message);
  }
  
  console.log('\n🎉 Teste de login concluído!');
}

// Executar se chamado diretamente
if (require.main === module) {
  testarLoginDetalhado();
}

module.exports = { testarLoginDetalhado };