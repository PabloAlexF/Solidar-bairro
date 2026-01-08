const axios = require('axios');

async function simpleTest() {
  console.log('🧪 Teste Simples do Chat\n');
  
  const API_BASE = 'http://localhost:3001/api';
  
  try {
    // Login
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'doador@test.com',
      password: 'test123'
    });
    
    const token = loginResponse.data.data.token;
    const uid = loginResponse.data.data.user.uid;
    
    console.log('✅ Login realizado');
    
    // Criar conversa simples
    const conversationResponse = await axios.post(`${API_BASE}/chat/conversations`, {
      participants: [uid],
      type: 'direct',
      title: 'Teste Chat'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (conversationResponse.data.success) {
      const conversationId = conversationResponse.data.data.id;
      console.log('✅ Conversa criada:', conversationId);
      
      // Enviar mensagem
      const messageResponse = await axios.post(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
        text: 'Mensagem de teste',
        type: 'text'
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (messageResponse.data.success) {
        console.log('✅ Mensagem enviada:', messageResponse.data.data.id);
      } else {
        console.log('❌ Erro ao enviar mensagem:', messageResponse.data.error);
      }
      
      // Buscar mensagens
      const messagesResponse = await axios.get(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (messagesResponse.data.success) {
        console.log('✅ Mensagens carregadas:', messagesResponse.data.data.length);
      } else {
        console.log('❌ Erro ao buscar mensagens:', messagesResponse.data.error);
      }
      
    } else {
      console.log('❌ Erro ao criar conversa:', conversationResponse.data.error);
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.response?.data?.error || error.message);
  }
}

simpleTest();