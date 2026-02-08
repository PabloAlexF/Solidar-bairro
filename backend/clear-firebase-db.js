// Script para limpar o banco de dados Firebase diretamente
// Execute: node clear-firebase-db.js

const admin = require('firebase-admin');

// Configuração do Firebase Admin
const serviceAccount = {
  // Substitua pelos seus dados do Firebase
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID || "your-project-id",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
};

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function clearCollection(collectionName) {
  try {
    console.log(`🗑️ Limpando coleção: ${collectionName}`);
    
    const snapshot = await db.collection(collectionName).get();
    
    if (snapshot.empty) {
      console.log(`✅ Coleção ${collectionName} já está vazia`);
      return;
    }
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`✅ ${snapshot.size} documentos removidos de ${collectionName}`);
    
  } catch (error) {
    console.error(`❌ Erro ao limpar ${collectionName}:`, error.message);
  }
}

async function clearDatabase() {
  try {
    console.log('🗑️ Iniciando limpeza do banco Firebase...');
    
    // Limpar coleções
    await clearCollection('conversations');
    await clearCollection('messages');
    await clearCollection('pedidos');
    await clearCollection('achados-perdidos');
    
    console.log('🎉 Limpeza do banco de dados concluída!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error.message);
    process.exit(1);
  }
}

// Executar o script
clearDatabase();