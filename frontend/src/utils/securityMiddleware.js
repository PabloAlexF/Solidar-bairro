// Middleware de segurança para headers e proteções adicionais
export class SecurityMiddleware {
  
  // Configurar Content Security Policy
  static setupCSP() {
    // Skip CSP setup in development to avoid conflicts
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Necessário para React
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' http://localhost:3001 https://nominatim.openstreetmap.org https://api.openstreetmap.org https://viacep.com.br/*",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');

    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }
  
  // Configurar headers de segurança adicionais
  static setupSecurityHeaders() {
    // Nota: X-Frame-Options deve ser configurado no servidor via headers HTTP
    // Não pode ser definido via meta tag

    // X-Content-Type-Options
    const contentType = document.createElement('meta');
    contentType.httpEquiv = 'X-Content-Type-Options';
    contentType.content = 'nosniff';
    document.head.appendChild(contentType);

    // Referrer Policy
    const referrer = document.createElement('meta');
    referrer.name = 'referrer';
    referrer.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrer);
  }
  
  // Validação rigorosa de entrada
  static validateInput(input, rules = {}) {
    const {
      required = false,
      minLength = 0,
      maxLength = 1000,
      pattern = null,
      allowedChars = null,
      sanitize = true
    } = rules;
    
    if (required && (!input || input.trim() === '')) {
      return { valid: false, error: 'Campo obrigatório' };
    }
    
    if (!input) return { valid: true, value: '' };
    
    let value = input.toString();
    
    if (sanitize) {
      value = this.sanitizeInput(value);
    }
    
    if (value.length < minLength) {
      return { valid: false, error: `Mínimo ${minLength} caracteres` };
    }
    
    if (value.length > maxLength) {
      return { valid: false, error: `Máximo ${maxLength} caracteres` };
    }
    
    if (pattern && !pattern.test(value)) {
      return { valid: false, error: 'Formato inválido' };
    }
    
    if (allowedChars && !new RegExp(`^[${allowedChars}]*$`).test(value)) {
      return { valid: false, error: 'Caracteres não permitidos' };
    }
    
    return { valid: true, value };
  }
  
  // Sanitização avançada
  static sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      // Remove scripts
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove javascript: URLs
      .replace(/javascript:/gi, '')
      // Remove event handlers
      .replace(/on\w+\s*=/gi, '')
      // Remove data: URLs (exceto imagens pequenas)
      .replace(/data:(?!image\/[png|jpg|jpeg|gif|svg];base64,)[^;]*;/gi, '')
      // Remove tags HTML perigosas
      .replace(/<(iframe|object|embed|form|input|script|style)[^>]*>/gi, '')
      // Escape caracteres especiais
      .replace(/[<>'"&]/g, (char) => {
        const escapes = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return escapes[char];
      });
  }
  
  // Tratamento seguro de erros
  static handleSecureError(error, context = 'Aplicação') {
    // Log detalhado apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context}] Erro detalhado:`, error);
    }
    
    // Para erros de autorização específicos, manter a mensagem original
    if (error.message && (error.message.includes('autorizado') || error.message.includes('autenticado'))) {
      return {
        message: error.message,
        code: 'AuthorizationError',
        timestamp: new Date().toISOString()
      };
    }
    
    // Mensagens genéricas para produção
    const userFriendlyMessages = {
      'NetworkError': 'Erro de conexão. Verifique sua internet.',
      'ValidationError': 'Dados inválidos fornecidos.',
      'AuthenticationError': 'Sessão expirada. Faça login novamente.',
      'AuthorizationError': 'Você não tem permissão para esta ação.',
      'NotFoundError': 'Recurso não encontrado.',
      'ServerError': 'Erro interno do servidor. Tente novamente.',
      'RateLimitError': 'Muitas tentativas. Aguarde alguns minutos.'
    };
    
    const errorType = error.name || 'ServerError';
    const userMessage = userFriendlyMessages[errorType] || error.message || 'Ocorreu um erro inesperado.';
    
    return {
      message: userMessage,
      code: errorType,
      timestamp: new Date().toISOString()
    };
  }
  
  // Verificação de integridade de dados
  static verifyDataIntegrity(data, expectedFields = []) {
    if (!data || typeof data !== 'object') {
      return { valid: false, error: 'Dados inválidos' };
    }
    
    // Verificar campos obrigatórios
    for (const field of expectedFields) {
      if (!(field in data)) {
        return { valid: false, error: `Campo obrigatório ausente: ${field}` };
      }
    }
    
    // Verificar se não há campos extras suspeitos (apenas para objetos aninhados)
    const suspiciousFields = ['__proto__', 'constructor', 'prototype'];
    for (const field of suspiciousFields) {
      if (field in data) {
        return { valid: false, error: 'Dados contêm campos suspeitos' };
      }
    }
    
    // Permitir campos comuns de login/cadastro
    const allowedLoginFields = ['email', 'password', 'nome', 'telefone', 'endereco', 'tipo', 'cnpj', 'cpf'];
    const dataKeys = Object.keys(data);
    
    // Se todos os campos são permitidos, validar
    const hasOnlyAllowedFields = dataKeys.every(key => 
      allowedLoginFields.includes(key) || 
      typeof data[key] === 'string' || 
      typeof data[key] === 'number' ||
      typeof data[key] === 'boolean'
    );
    
    if (!hasOnlyAllowedFields) {
      // Log para debug mas não bloquear
      console.warn('Campos não reconhecidos encontrados:', dataKeys.filter(key => !allowedLoginFields.includes(key)));
    }
    
    return { valid: true };
  }
  
  // Inicializar todas as proteções
  static initialize() {
    try {
      this.setupCSP();
      this.setupSecurityHeaders();
      
      // Prevenir clickjacking
      if (window.top !== window.self) {
        window.top.location = window.self.location;
      }
      
      // Limpar console em produção
      if (process.env.NODE_ENV === 'production') {
        console.clear();
        console.log('%cPare!', 'color: red; font-size: 50px; font-weight: bold;');
        console.log('%cEsta é uma funcionalidade do navegador destinada a desenvolvedores. Não cole ou digite código aqui.', 'color: red; font-size: 16px;');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao inicializar segurança:', error);
      return false;
    }
  }
}

export default SecurityMiddleware;