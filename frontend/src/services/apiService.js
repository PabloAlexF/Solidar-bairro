import { API_BASE_URL } from '../config/firebaseConnection';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Métodos para autenticação
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Métodos para pedidos
  async getPedidos() {
    return this.request('/pedidos');
  }

  async createPedido(pedidoData) {
    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedidoData),
    });
  }
}

export default new ApiService();