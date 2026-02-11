const firebase = require('../config/firebase');
const logger = require('./loggerService');

class UserService {
  constructor() {
    this.db = firebase.getDb();
  }

  formatUserData(id, data, tipo) {
    let nome, nomeCompleto;
    switch (tipo) {
      case 'cidadao':
        nome = data.nome;
        nomeCompleto = data.nomeCompleto;
        break;
      case 'comercio':
        nome = data.nomeFantasia || data.razaoSocial;
        nomeCompleto = data.razaoSocial;
        break;
      case 'ong':
        nome = data.nome;
        nomeCompleto = data.nome;
        break;
      case 'familia':
        nome = data.nomeCompleto || data.nome;
        nomeCompleto = data.nomeCompleto || data.nome;
        break;
      case 'admin':
        nome = data.nome || 'Administrador';
        nomeCompleto = data.nome || 'Administrador';
        break;
      default:
        nome = 'Usuário';
        nomeCompleto = 'Usuário';
    }
    return {
      id,
      nome,
      nomeCompleto,
      tipo,
      bairro: data.endereco?.bairro,
      isOnline: true, // Placeholder
      foto: data.foto || data.photoUrl || null
    };
  }

  async getUserData(id) {
    try {
      logger.info(`🔍 Buscando dados do usuário ID: ${id}`);
      if (!id) return null;

      const collections = ['cidadaos', 'comercios', 'ongs', 'familias', 'admins'];
      for (const collectionName of collections) {
        const doc = await this.db.collection(collectionName).doc(id).get();
        if (doc.exists) {
          const data = doc.data();
          const tipo = collectionName.slice(0, -1);
          logger.info(`✅ Usuário encontrado em ${collectionName}`, { id: doc.id, nome: data.nome || data.nomeFantasia });
          return this.formatUserData(doc.id, data, tipo);
        }
      }

      logger.warn(`🚨 Usuário não encontrado em nenhuma coleção pelo ID: ${id}`);
      return null;
    } catch (error) {
      logger.error('💥 Erro ao buscar dados do usuário:', { error: error.message, userId: id });
      return null;
    }
  }
}

module.exports = new UserService();