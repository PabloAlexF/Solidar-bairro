// INSTRUÇÕES PARA LIMPAR O BANCO FIREBASE MANUALMENTE

console.log(`
🗑️ LIMPEZA MANUAL DO FIREBASE

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em "Firestore Database"
4. Delete as seguintes coleções:
   - conversations
   - messages  
   - pedidos
   - achados-perdidos

OU execute este código no console do navegador na página do Firestore:

// Cole este código no console do navegador (F12):
const collections = ['conversations', 'messages', 'pedidos', 'achados-perdidos'];
collections.forEach(collection => {
  console.log('Deletando coleção:', collection);
  // Clique manualmente em cada coleção e delete
});

🎉 Após limpar, teste novamente o chat!
`);

// Alternativa: Script simples para testar conexão
console.log('Testando se o servidor está rodando...');

fetch('http://localhost:3001/api/pedidos')
  .then(response => {
    if (response.ok) {
      console.log('✅ Servidor está rodando!');
      console.log('Execute: node clear-database.js');
    } else {
      console.log('❌ Servidor não está respondendo');
      console.log('Inicie o servidor com: npm start');
    }
  })
  .catch(error => {
    console.log('❌ Servidor não está rodando');
    console.log('Inicie o servidor com: npm start');
  });