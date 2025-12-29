import { API_CONFIG, VALIDATION_CONFIG } from '../config';

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
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

  // Sanitizar dados
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
    return this.request('/ongs', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  // Métodos para famílias
  async createFamilia(familiaData) {
    const sanitizedData = this.sanitizeData(familiaData);
    return this.request('/familias', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }

  // Métodos legados (manter compatibilidade)
  async login(email, password) {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email e senha são obrigatórios');
    }
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
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
    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
    });
  }
}

export default new ApiService();