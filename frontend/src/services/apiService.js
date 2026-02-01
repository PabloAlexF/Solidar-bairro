import { API_CONFIG, VALIDATION_CONFIG } from '../config';
import SecurityMiddleware from '../utils/securityMiddleware';

const ApiService = {
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,

  // Validação de segurança antes de requisições
  validateRequest(endpoint, data = null) {
    // Validar endpoint
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Endpoint inválido');
    }
    
    // Prevenir path traversal
    if (endpoint.includes('..') || endpoint.includes('//')) {
      throw new Error('Endpoint contém caracteres suspeitos');
    }
    
    // Pular validação de dados para endpoints de autenticação
    if (endpoint.includes('/auth/') || endpoint.includes('/login') || endpoint.includes('/cidadaos') || endpoint.includes('/comercios') || endpoint.includes('/ongs') || endpoint.includes('/familias')) {
      return true;
    }
    
    // Validar dados apenas para outros endpoints
    if (data && typeof data === 'object') {
      const integrity = SecurityMiddleware.verifyDataIntegrity(data);
      if (!integrity.valid) {
        throw new Error(integrity.error);
      }
    }
    
    return true;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('solidar-refresh-token');
    if (!refreshToken) {
      throw new Error('Token de refresh não encontrado');
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Falha ao renovar token');
      }

      const data = await response.json();
      if (data.success && data.data) {
        localStorage.setItem('solidar-token', data.data.token);
        localStorage.setItem('solidar-refresh-token', data.data.refreshToken);
        return data.data.token;
      }

      throw new Error('Resposta inválida do refresh');
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      throw error;
    }
  },

  async request(endpoint, options = {}, retryCount = 0, isRetry = false) {
    // Validação de segurança
    this.validateRequest(endpoint, options.body ? JSON.parse(options.body) : null);
    
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('solidar-token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Header de segurança adicional
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Resposta não-JSON:', text);
        throw new Error(`Servidor retornou ${response.status}. Verifique se a API está rodando em ${this.baseURL}`);
      }

      const data = await response.json();

      if (response.status === 401 && !isRetry) {
        // Token expirado, tentar renovar
        try {
          await this.refreshToken();
          // Retry com novo token
          return this.request(endpoint, options, retryCount, true);
        } catch (refreshError) {
          console.error('Falha ao renovar token:', refreshError);
          // Se refresh falhar, continuar com erro original
        }
      }

      if (response.status === 429) {
        // Rate limit exceeded - implement exponential backoff
        if (retryCount < 3) {
          const delay = Math.min(1000 * Math.pow(2, retryCount) + Math.random() * 1000, 30000); // Max 30 seconds
          console.warn(`Rate limit atingido. Tentando novamente em ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request(endpoint, options, retryCount + 1, isRetry);
        } else {
          throw new Error('Limite de requisições excedido. Tente novamente mais tarde.');
        }
      }

      if (!response.ok) {
        // Tratamento específico para erro 404 (usuário não encontrado)
        if (response.status === 404) {
          console.warn('Recurso não encontrado (404):', endpoint);
          throw new Error('Recurso não encontrado');
        }
        
        console.error('Erro na API:', data);
        const secureError = SecurityMiddleware.handleSecureError(new Error(data.error || `Erro HTTP: ${response.status}`));
        throw new Error(secureError.message);
      }

      return data;
    } catch (error) {
      console.error('Erro na requisição:', { endpoint, error: error.message });
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar com a API. Verifique se o servidor está rodando.');
      }
      throw error;
    }
  },

  async login(email, password) {
    // More defensive validation
    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new Error('Email é obrigatório');
    }
    if (!password || typeof password !== 'string' || !password.trim()) {
      throw new Error('Senha é obrigatória');
    }

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
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

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
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
    const response = await this.request('/chat/conversations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Criar notificação para nova conversa
    if (response.success) {
      const { NotificationManager } = await import('../utils/notifications');
      NotificationManager.createChatNotification({
        participantName: data.participantName || 'Alguém',
        title: data.title || 'Nova conversa'
      });
    }
    
    return response;
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
    const response = await this.request(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ 
        text, 
        content: text,
        type,
        metadata 
      })
    });
    
    // Criar notificação para nova mensagem
    if (response.success) {
      const { NotificationManager } = await import('../utils/notifications');
      const user = JSON.parse(localStorage.getItem('solidar-user') || '{}');
      NotificationManager.createMessageNotification({
        senderName: user.nome || user.nomeCompleto || 'Alguém',
        content: text
      });
    }
    
    return response;
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

  async closeConversation(conversationId) {
    return this.request(`/chat/conversations/${conversationId}/close`, {
      method: 'PUT'
    });
  },

  async getUserData(id) {
    return this.request(`/users/${id}`);
  },

  async requestEmailChange(userId, newEmail) {
    return this.request(`/users/${userId}/request-email-change`, {
      method: 'POST',
      body: JSON.stringify({ newEmail })
    });
  },

  async confirmEmailChange(userId, newEmail, code) {
    return this.request(`/users/${userId}/confirm-email-change`, {
      method: 'POST',
      body: JSON.stringify({ newEmail, code })
    });
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
  },

  async getNeighborhoodStats() {
    return this.request('/stats/neighborhood');
  },

  // Painel Social - Famílias
  async getFamilias() {
    return this.request('/familias');
  },

  async getFamiliasByBairro(bairro) {
    return this.request(`/familias/bairro/${encodeURIComponent(bairro)}`);
  },

  async getStatsByBairro(bairro) {
    return this.request(`/familias/stats/${encodeURIComponent(bairro)}`);
  },

  async createFamiliaPanel(data) {
    return this.request('/familias', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateFamiliaPanel(id, data) {
    return this.request(`/familias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteFamiliaPanel(id) {
    return this.request(`/familias/${id}`, {
      method: 'DELETE'
    });
  },

  // Painel Social - Comércios
  async getComercios() {
    return this.request('/comercios');
  },

  async getComerciosByBairro(bairro) {
    return this.request(`/comercios?bairro=${encodeURIComponent(bairro)}`);
  },

  // Painel Social - ONGs
  async getOngs() {
    return this.request('/ongs');
  },

  async getOngsByBairro(bairro) {
    return this.request(`/ongs?bairro=${encodeURIComponent(bairro)}`);
  },

  // Painel Social - Dashboard
  async getPainelDashboard(bairro) {
    return this.request(`/painel-social/dashboard/${encodeURIComponent(bairro)}`);
  },

  async getPainelPedidos(bairro) {
    return this.request(`/painel-social/pedidos?bairro=${encodeURIComponent(bairro)}`);
  },

  async getPainelComercios(bairro) {
    return this.request(`/painel-social/comercios?bairro=${encodeURIComponent(bairro)}`);
  },

  async getPainelOngs(bairro) {
    return this.request(`/painel-social/ongs?bairro=${encodeURIComponent(bairro)}`);
  }
};

export default ApiService;