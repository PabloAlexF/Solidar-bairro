// Frontend se conecta apenas com a API do backend
// Não precisa de configuração direta do Firebase

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export { API_BASE_URL };