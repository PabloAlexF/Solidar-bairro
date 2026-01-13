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

  async get(endpoint) {
    return this.request(endpoint);
  },

  async getMeusPedidos() {
    return this.request('/pedidos/meus');
  },

  async getMeusInteresses() {
    return this.request('/interesses/meus');
  },

  async getInteresse(id) {
    return this.request(`/interesses/${id}`);
  },

  async createInteresse(data) {
    return this.request('/interesses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async createConversation(data) {
    return this.request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async createOrGetConversation(data) {
    return this.request('/chat/conversations/create-or-get', {
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
  },

  // Achados e Perdidos
  async getAchadosPerdidos(filters = {}) {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.city) params.append('city', filters.city);
    if (filters.search) params.append('search', filters.search);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/achados-perdidos${query}`);
  },

  async getAchadoPerdido(id) {
    return this.request(`/achados-perdidos/${id}`);
  },

  async createAchadoPerdido(data) {
    return this.request('/achados-perdidos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateAchadoPerdido(id, data) {
    return this.request(`/achados-perdidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteAchadoPerdido(id) {
    return this.request(`/achados-perdidos/${id}`, {
      method: 'DELETE'
    });
  },

  async getMeusAchadosPerdidos() {
    return this.request('/achados-perdidos/user/my-items');
  },

  async resolverAchadoPerdido(id) {
    return this.request(`/achados-perdidos/${id}/resolve`, {
      method: 'PATCH'
    });
  },

  // Notificações
  async getNotifications(limit = 50) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/notifications${query}`);
  },

  async getUnreadNotificationsCount() {
    return this.request('/notifications/unread-count');
  },

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  async markAllNotificationsAsRead() {
    return this.request('/notifications/mark-all-read', {
      method: 'PUT'
    });
  },

  async deleteNotification(id) {
    return this.request(`/notifications/${id}`, {
      method: 'DELETE'
    });
  },

  async deleteAllNotifications() {
    return this.request('/notifications', {
      method: 'DELETE'
    });
  },

  async finalizarAjuda(pedidoId, ajudanteId) {
    return this.request(`/pedidos/${pedidoId}/finalizar`, {
      method: 'POST',
      body: JSON.stringify({ ajudanteId })
    });
  },

  async getAjudasConcluidas(userId) {
    return this.request(`/cidadaos/${userId}/ajudas-concluidas`);
  }
};

export default ApiService;