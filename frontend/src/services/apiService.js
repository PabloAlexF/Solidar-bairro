import { API_CONFIG, VALIDATION_CONFIG } from '../config';

const ApiService = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('solidar-token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Servidor retornou ${response.status}. Verifique se a API está rodando em ${this.baseURL}`);
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar com a API. Verifique se o servidor está rodando.');
      }
      throw error;
    }
  },

  async login(email, password) {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email e senha são obrigatórios');
    }
    
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
    
    if (response.success && response.data?.token) {
      localStorage.setItem('solidar-token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('solidar-refresh-token', response.data.refreshToken);
      }
    }
    
    return response;
  },

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST'
      });
    } finally {
      localStorage.removeItem('solidar-token');
      localStorage.removeItem('solidar-refresh-token');
      localStorage.removeItem('solidar-user');
    }
  },

  async verifyToken(token) {
    return this.request('/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async getPedidos() {
    return this.request('/pedidos');
  },

  async getMeusPedidos() {
    return this.request('/pedidos/meus');
  },

  async getMeusInteresses() {
    return this.request('/interesses/meus');
  },

  async createConversation(data) {
    return this.request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getConversations() {
    return this.request('/chat/conversations');
  },

  async getConversation(id) {
    return this.request(`/chat/conversations/${id}`);
  },

  async sendMessage(conversationId, text, type = 'text', metadata = null) {
    return this.request(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ 
        text, 
        content: text,
        type,
        metadata 
      })
    });
  },

  async getMessages(conversationId, limit = 50, lastMessageId = null) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (lastMessageId) params.append('lastMessageId', lastMessageId);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/chat/conversations/${conversationId}/messages${query}`);
  },

  async createCidadao(data) {
    return this.request('/cidadaos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async createComercio(data) {
    return this.request('/comercios', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async createOng(data) {
    return this.request('/ongs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async createFamilia(data) {
    return this.request('/familias', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async createPedido(data) {
    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async markConversationAsRead(conversationId) {
    return this.request(`/chat/conversations/${conversationId}/read`, {
      method: 'PUT'
    });
  },

  async getUserData(id) {
    return this.request(`/users/${id}`);
  },

  async getPedido(id) {
    return this.request(`/pedidos/${id}`);
  }
};

export default ApiService;