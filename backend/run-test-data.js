const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin
const serviceAccount = require('./solidar-bairro-firebase-adminsdk-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
});

// Importar e executar criação de dados
const { createTestData } = require('./create-test-data');

console.log('🚀 Iniciando criação de dados de teste...\n');
createTestData();