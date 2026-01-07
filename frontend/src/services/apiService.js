import { API_CONFIG, VALIDATION_CONFIG } from '../config';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }
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
      
      // Verificar se a resposta é JSON
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
  }

  // Validar dados de cidadão
  validateCidadaoData(data) {
    const errors = [];
    if (!data.nome?.trim()) errors.push('Nome é obrigatório');
    if (!data.email?.trim()) errors.push('Email é obrigatório');
    if (!data.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!data.password || data.password.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) errors.push(`Senha deve ter pelo menos ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
    if (!VALIDATION_CONFIG.EMAIL_PATTERN.test(data.email)) errors.push('Email inválido');
    return errors;
  }

  // Validar dados de comércio
  validateComercioData(data) {
    const errors = [];
    if (!data.nomeEstabelecimento?.trim()) errors.push('Nome do estabelecimento é obrigatório');
    if (!data.cnpj?.trim()) errors.push('CNPJ é obrigatório');
    if (!data.razaoSocial?.trim()) errors.push('Razão social é obrigatória');
    if (!data.tipoComercio?.trim()) errors.push('Tipo de comércio é obrigatório');
    if (!data.responsavelNome?.trim()) errors.push('Nome do responsável é obrigatório');
    if (!data.responsavelCpf?.trim()) errors.push('CPF do responsável é obrigatório');
    if (!data.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!data.endereco?.trim()) errors.push('Endereço é obrigatório');
    if (!data.bairro?.trim()) errors.push('Bairro é obrigatório');
    if (!data.cidade?.trim()) errors.push('Cidade é obrigatória');
    if (!data.senha || data.senha.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) errors.push(`Senha deve ter pelo menos ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
    
    // Validar CNPJ básico
    const cnpjNumbers = data.cnpj?.replace(/\D/g, '');
    if (cnpjNumbers && cnpjNumbers.length !== VALIDATION_CONFIG.CNPJ_LENGTH) {
      errors.push(`CNPJ deve ter ${VALIDATION_CONFIG.CNPJ_LENGTH} dígitos`);
    }
    
    return errors;
  }

  // Validar dados de ONG
  validateONGData(data) {
    const errors = [];
    if (!data.nomeEntidade?.trim()) errors.push('Nome da entidade é obrigatório');
    if (!data.cnpj?.trim()) errors.push('CNPJ é obrigatório');
    if (!data.razaoSocial?.trim()) errors.push('Razão social é obrigatória');
    if (!data.areaTrabalho?.trim()) errors.push('Área de trabalho é obrigatória');
    if (!data.descricaoAtuacao?.trim()) errors.push('Descrição da atuação é obrigatória');
    if (!data.responsavelNome?.trim()) errors.push('Nome do responsável é obrigatório');
    if (!data.responsavelCpf?.trim()) errors.push('CPF do responsável é obrigatório');
    if (!data.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!data.email?.trim()) errors.push('Email é obrigatório');
    if (!data.endereco?.trim()) errors.push('Endereço é obrigatório');
    if (!data.bairro?.trim()) errors.push('Bairro é obrigatório');
    if (!data.cidade?.trim()) errors.push('Cidade é obrigatória');
    if (!data.cep?.trim()) errors.push('CEP é obrigatório');
    if (!data.senha || data.senha.length < VALIDATION_CONFIG.PASSWORD_MIN_LENGTH) errors.push(`Senha deve ter pelo menos ${VALIDATION_CONFIG.PASSWORD_MIN_LENGTH} caracteres`);
    if (data.senha !== data.confirmarSenha) errors.push('Senhas não coincidem');
    
    // Validar CNPJ básico
    const cnpjNumbers = data.cnpj?.replace(/\D/g, '');
    if (cnpjNumbers && cnpjNumbers.length !== VALIDATION_CONFIG.CNPJ_LENGTH) {
      errors.push(`CNPJ deve ter ${VALIDATION_CONFIG.CNPJ_LENGTH} dígitos`);
    }
    
    // Validar email
    if (data.email && !VALIDATION_CONFIG.EMAIL_PATTERN.test(data.email)) {
      errors.push('Email inválido');
    }
    
    // Validar cidade (apenas Lagoa Santa)
    const normalizedCidade = data.cidade?.toLowerCase().trim();
    if (normalizedCidade && normalizedCidade !== 'lagoa santa') {
      errors.push('Atualmente atendemos apenas Lagoa Santa - MG');
    }
    
    return errors;
  }

  // Validar dados de família
  validateFamiliaData(data) {
    const errors = [];
    if (!data.nomeCompleto?.trim()) errors.push('Nome do responsável é obrigatório');
    if (!data.telefone?.trim()) errors.push('Telefone é obrigatório');
    if (!data.tipoCadastro?.trim()) errors.push('Tipo de cadastro é obrigatório');
    if (!data.endereco?.trim()) errors.push('Endereço é obrigatório');
    if (!data.bairro?.trim()) errors.push('Bairro é obrigatório');
    if (!data.numeroPessoas || parseInt(data.numeroPessoas) < 1) errors.push('Número de pessoas deve ser pelo menos 1');
    if (!data.rendaFamiliar?.trim()) errors.push('Renda familiar é obrigatória');
    
    // Validar email se fornecido
    if (data.email && !VALIDATION_CONFIG.EMAIL_PATTERN.test(data.email)) {
      errors.push('Email inválido');
    }
    
    return errors;
  }
  sanitizeData(data) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  // Métodos para cidadãos
  async createCidadao(cidadaoData) {
    const sanitizedData = this.sanitizeData(cidadaoData);
    const errors = this.validateCidadaoData(sanitizedData);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return this.request('/cidadaos', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async getCidadaos() {
    return this.request('/cidadaos');
  }

  async getCidadaoById(uid) {
    if (!uid?.trim()) {
      throw new Error('ID do cidadão é obrigatório');
    }
    return this.request(`/cidadaos/${encodeURIComponent(uid)}`);
  }

  // Métodos para comércios
  async createComercio(comercioData) {
    const sanitizedData = this.sanitizeData(comercioData);
    const errors = this.validateComercioData(sanitizedData);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return this.request('/comercios', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  // Métodos para ONGs
  async createONG(ongData) {
    const sanitizedData = this.sanitizeData(ongData);
    const errors = this.validateONGData(sanitizedData);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return this.request('/ongs', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async getONGs() {
    return this.request('/ongs');
  }

  async getONGById(uid) {
    if (!uid?.trim()) {
      throw new Error('ID da ONG é obrigatório');
    }
    return this.request(`/ongs/${encodeURIComponent(uid)}`);
  }

  // Métodos para famílias
  async createFamilia(familiaData) {
    const sanitizedData = this.sanitizeData(familiaData);
    const errors = this.validateFamiliaData(sanitizedData);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return this.request('/familias', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async getFamilias() {
    return this.request('/familias');
  }

  async getFamiliaById(id) {
    if (!id?.toString().trim()) {
      throw new Error('ID da família é obrigatório');
    }
    return this.request(`/familias/${encodeURIComponent(id)}`);
  }

  // Métodos de autenticação
  async login(email, password) {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email e senha são obrigatórios');
    }
    
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
    
    // Salvar tokens se login bem-sucedido
    if (response.success && response.data?.token) {
      localStorage.setItem('solidar-token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('solidar-refresh-token', response.data.refreshToken);
      }
    }
    
    return response;
  }

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('solidar-refresh-token');
      if (!refreshToken) return false;
      
      const response = await this.request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      
      if (response.success && response.data?.token) {
        localStorage.setItem('solidar-token', response.data.token);
        if (response.data.refreshToken) {
          localStorage.setItem('solidar-refresh-token', response.data.refreshToken);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      return false;
    }
  }

  async verifyToken(token) {
    return this.request('/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST'
      });
    } finally {
      // Sempre limpar tokens locais
      localStorage.removeItem('solidar-token');
      localStorage.removeItem('solidar-refresh-token');
      localStorage.removeItem('solidar-user');
    }
  }
  
  handleAuthError() {
    localStorage.removeItem('solidar-token');
    localStorage.removeItem('solidar-refresh-token');
    localStorage.removeItem('solidar-user');
    window.dispatchEvent(new CustomEvent('authError'));
  }

  async register(userData) {
    const sanitizedData = this.sanitizeData(userData);
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async getPedidos() {
    return this.request('/pedidos');
  }

  async createPedido(pedidoData) {
    const sanitizedData = this.sanitizeData(pedidoData);
    const errors = this.validatePedidoData(sanitizedData);
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  // Validar dados de pedido
  validatePedidoData(data) {
    const errors = [];
    if (!data.category?.trim()) errors.push('Categoria é obrigatória');
    if (!data.description?.trim() || data.description.length < 10) errors.push('Descrição deve ter pelo menos 10 caracteres');
    if (!data.urgency?.trim()) errors.push('Urgência é obrigatória');
    if (!data.visibility || !Array.isArray(data.visibility) || data.visibility.length === 0) errors.push('Pelo menos uma opção de visibilidade é obrigatória');
    return errors;
  }

  async getMeusPedidos() {
    return this.request('/pedidos/meus');
  }

  async updatePedido(id, pedidoData) {
    const sanitizedData = this.sanitizeData(pedidoData);
    return this.request(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sanitizedData),
    });
  }

  async deletePedido(id) {
    return this.request(`/pedidos/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para interesses
  async createInteresse(interesseData) {
    const sanitizedData = this.sanitizeData(interesseData);
    return this.request('/interesses', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  async getInteressesByPedido(pedidoId) {
    if (!pedidoId?.trim()) {
      throw new Error('ID do pedido é obrigatório');
    }
    return this.request(`/interesses/pedido/${encodeURIComponent(pedidoId)}`);
  }

  async getMeusInteresses() {
    return this.request('/interesses/meus');
  }
}

export default new ApiService();