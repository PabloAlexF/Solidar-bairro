const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

async function clearDatabase() {
  try {
    console.log('🗑️  Iniciando limpeza do banco de dados...');
    
    const collections = ['cidadaos', 'comercios', 'ongs', 'familias', 'achados-perdidos'];
    
    for (const collectionName of collections) {
      console.log(`Limpando coleção: ${collectionName}`);
      
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Coleção ${collectionName} limpa (${snapshot.size} documentos removidos)`);
    }
    
    console.log('🎉 Banco de dados limpo com sucesso!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro ao limpar banco de dados:', error);
    process.exit(1);
  }
}

clearDatabase();