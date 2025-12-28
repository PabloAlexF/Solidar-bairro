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

    // Configuração do Firebase Admin SDK
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
}

// Exporta uma única instância (Singleton)
module.exports = new FirebaseConnection();