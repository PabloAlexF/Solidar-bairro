const admin = require('firebase-admin');
require('dotenv').config();

/**
 * Singleton Pattern para conexão com Firebase
 * Garante uma única instância da conexão durante toda a aplicação
 */
class FirebaseConnection {
  constructor() {
    if (FirebaseConnection.instance) {
      return FirebaseConnection.instance;
    }

    // Verificar se temos credenciais do Firebase
    const hasFirebaseCredentials = process.env.FIREBASE_PROJECT_ID && 
                                   process.env.FIREBASE_PRIVATE_KEY && 
                                   process.env.FIREBASE_CLIENT_EMAIL;
    
    if (!hasFirebaseCredentials) {
      console.log('⚠️  Modo desenvolvimento: Firebase não configurado');
      console.log('📝 Usando mocks para desenvolvimento');
      
      // Mock objects para desenvolvimento
      this.db = {
        collection: (name) => ({
          add: (data) => Promise.resolve({ id: `mock-${Date.now()}`, data }),
          get: () => Promise.resolve({ 
            docs: [],
            empty: true,
            size: 0
          }),
          doc: (id) => ({
            id,
            get: () => Promise.resolve({ 
              exists: false, 
              id, 
              data: () => null 
            }),
            set: (data) => Promise.resolve({ id, data }),
            update: (data) => Promise.resolve({ id, data }),
            delete: () => Promise.resolve()
          }),
          where: () => ({
            get: () => Promise.resolve({ docs: [], empty: true, size: 0 })
          })
        })
      };
      
      this.auth = {
        createUser: (userData) => Promise.resolve({ uid: `mock-${Date.now()}`, ...userData }),
        getUserByEmail: (email) => Promise.resolve({ uid: `mock-${Date.now()}`, email })
      };
      
      this.admin = { firestore: () => this.db };
      this.isDevMode = true;
      
    } else {
      // Configuração real do Firebase
      try {
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

        this.db = admin.firestore();
        this.auth = admin.auth();
        this.admin = admin;
        this.isDevMode = false;
        
        console.log('✅ Firebase configurado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao configurar Firebase:', error.message);
        throw error;
      }
    }

    FirebaseConnection.instance = this;
  }

  getDb() {
    return this.db;
  }

  getAuth() {
    return this.auth;
  }

  getAdmin() {
    return this.admin;
  }
  
  isDevelopmentMode() {
    return this.isDevMode;
  }
}

// Exporta uma única instância (Singleton)
module.exports = new FirebaseConnection();