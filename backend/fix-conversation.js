const firebase = require('./src/config/firebase');

async function fixConversation() {
  const db = firebase.getDb();
  const conversationId = 'ilbHVq4kFwizE3DqzNsw';
  const wrongId = '4b7oaeYmjPNO7CtcvZDu';
  const correctId = 'BLuRcvVnkjxRvBZNWDQN';
  
  console.log(`\n🔧 Corrigindo conversa: ${conversationId}\n`);
  
  // Buscar conversa
  const convDoc = await db.collection('conversations').doc(conversationId).get();
  if (!convDoc.exists) {
    console.log('❌ Conversa não encontrada');
    process.exit(1);
  }
  
  const convData = convDoc.data();
  console.log('📋 Dados atuais:', convData);
  
  // Substituir ID errado pelo correto
  const newParticipants = convData.participants.map(p => p === wrongId ? correctId : p);
  
  console.log('\n✏️ Atualizando participantes...');
  console.log('Antes:', convData.participants);
  console.log('Depois:', newParticipants);
  
  await db.collection('conversations').doc(conversationId).update({
    participants: newParticipants
  });
  
  console.log('\n✅ Conversa corrigida com sucesso!');
  process.exit(0);
}

fixConversation().catch(console.error);
