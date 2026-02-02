// Script para limpar o banco de dados
// Execute: node clear-database.js

const API_BASE_URL = 'http://localhost:3001/api';

async function clearDatabase() {
  try {
    console.log('🗑️ Iniciando limpeza do banco de dados...');
    
    // Limpar conversas
    console.log('Limpando conversas...');
    const conversationsResponse = await fetch(`${API_BASE_URL}/admin/clear-conversations`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (conversationsResponse.ok) {
      console.log('✅ Conversas limpas');
    } else {
      console.log('❌ Erro ao limpar conversas');
    }
    
    // Limpar pedidos
    console.log('Limpando pedidos...');
    const pedidosResponse = await fetch(`${API_BASE_URL}/admin/clear-pedidos`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (pedidosResponse.ok) {
      console.log('✅ Pedidos limpos');
    } else {
      console.log('❌ Erro ao limpar pedidos');
    }
    
    // Limpar mensagens
    console.log('Limpando mensagens...');
    const messagesResponse = await fetch(`${API_BASE_URL}/admin/clear-messages`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (messagesResponse.ok) {
      console.log('✅ Mensagens limpas');
    } else {
      console.log('❌ Erro ao limpar mensagens');
    }
    
    console.log('🎉 Limpeza do banco de dados concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error.message);
  }
}

// Executar o script
clearDatabase();