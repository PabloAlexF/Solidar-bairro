import React, { useState } from 'react';
import ChatNotificationService from '../services/chatNotificationService';

const ChatDemo = () => {
  const [isVisible, setIsVisible] = useState(false);

  const simularMensagem = () => {
    const mensagens = [
      'Olá! Ainda precisa da cesta básica?',
      'Posso entregar hoje à tarde, tudo bem?',
      'Obrigada pela ajuda! Você salvou minha família',
      'Quando podemos nos encontrar?',
      'Tenho os medicamentos que você precisa'
    ];
    
    const nomes = ['Ana Paula', 'Carlos Silva', 'Maria Santos', 'João Pedro', 'Fernanda Lima'];
    
    const mensagem = mensagens[Math.floor(Math.random() * mensagens.length)];
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    
    ChatNotificationService.addChatMessageNotification(nome, mensagem, 'conv_demo');
  };

  const simularNovaConversa = () => {
    const tipos = ['Cesta Básica', 'Remédios', 'Roupas de Inverno', 'Conta de Luz'];
    const nomes = ['Pedro Santos', 'Lucia Oliveira', 'Roberto Lima', 'Sandra Costa'];
    
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    
    ChatNotificationService.addChatStartedNotification(nome, tipo);
  };

  const simularAjudaFinalizada = () => {
    const tipos = ['Cesta Básica', 'Remédios', 'Roupas de Inverno'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    
    ChatNotificationService.addHelpCompletedNotification('Família Silva', tipo);
  };

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        🧪
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      zIndex: 1000,
      minWidth: '250px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Demo Chat</h4>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button 
          onClick={simularMensagem}
          style={{
            padding: '0.5rem',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          💬 Simular mensagem
        </button>
        
        <button 
          onClick={simularNovaConversa}
          style={{
            padding: '0.5rem',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          🆕 Nova conversa
        </button>
        
        <button 
          onClick={simularAjudaFinalizada}
          style={{
            padding: '0.5rem',
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          ✅ Ajuda finalizada
        </button>
      </div>
    </div>
  );
};

export default ChatDemo;