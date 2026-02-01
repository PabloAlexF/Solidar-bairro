// Utilitário de segurança para validação de dados
export class SecurityUtils {
  
  // Validação segura de coordenadas geográficas
  static validateCoordinates(coords) {
    if (!coords || typeof coords !== 'object') {
      return { valid: false, error: 'Coordenadas inválidas' };
    }
    
    const { lat, lng } = coords;
    
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return { valid: false, error: 'Coordenadas devem ser números' };
    }
    
    if (isNaN(lat) || isNaN(lng)) {
      return { valid: false, error: 'Coordenadas contêm valores inválidos' };
    }
    
    if (Math.abs(lat) > 90) {
      return { valid: false, error: 'Latitude fora do intervalo válido (-90 a 90)' };
    }
    
    if (Math.abs(lng) > 180) {
      return { valid: false, error: 'Longitude fora do intervalo válido (-180 a 180)' };
    }
    
    return { valid: true };
  }
  
  // Sanitização de entrada de texto
  static sanitizeText(text, maxLength = 500) {
    if (typeof text !== 'string') {
      return '';
    }
    
    return text
      .trim()
      .slice(0, maxLength)
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  }
  
  // Validação de URL segura
  static validateUrl(url) {
    try {
      const urlObj = new URL(url);
      
      // Apenas HTTPS permitido
      if (urlObj.protocol !== 'https:') {
        return { valid: false, error: 'Apenas URLs HTTPS são permitidas' };
      }
      
      // Lista de domínios permitidos para geocodificação
      const allowedDomains = [
        'nominatim.openstreetmap.org',
        'api.openstreetmap.org'
      ];
      
      if (!allowedDomains.includes(urlObj.hostname)) {
        return { valid: false, error: 'Domínio não permitido' };
      }
      
      return { valid: true, url: urlObj.toString() };
    } catch (error) {
      return { valid: false, error: 'URL inválida' };
    }
  }
  
  // Parse seguro de JSON do localStorage
  static safeParseJSON(jsonString, fallback = {}) {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        return fallback;
      }
      
      const parsed = JSON.parse(jsonString);
      
      // Validação básica do objeto
      if (typeof parsed !== 'object' || parsed === null) {
        return fallback;
      }
      
      return parsed;
    } catch (error) {
      console.warn('Erro ao fazer parse do JSON:', error);
      return fallback;
    }
  }
  
  // Limpeza segura do localStorage
  static clearUserSession() {
    try {
      const keysToRemove = [
        'solidar-user',
        'authToken',
        'refreshToken',
        'userSession'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Limpar também sessionStorage se necessário
      sessionStorage.clear();
      
      return true;
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
      return false;
    }
  }
  
  // Validação de entrada de formulário
  static validateFormInput(input, type = 'text') {
    if (typeof input !== 'string') {
      return { valid: false, error: 'Entrada deve ser texto' };
    }
    
    const sanitized = this.sanitizeText(input);
    
    switch (type) {
      case 'description':
        if (sanitized.length < 10) {
          return { valid: false, error: 'Descrição muito curta (mínimo 10 caracteres)' };
        }
        if (sanitized.length > 500) {
          return { valid: false, error: 'Descrição muito longa (máximo 500 caracteres)' };
        }
        break;
        
      case 'category':
        const allowedCategories = [
          'Alimentos', 'Roupas', 'Calçados', 'Medicamentos', 'Higiene',
          'Contas', 'Emprego', 'Móveis', 'Eletrodomésticos', 'Transporte', 'Outros'
        ];
        if (!allowedCategories.includes(sanitized)) {
          return { valid: false, error: 'Categoria inválida' };
        }
        break;
        
      case 'urgency':
        const allowedUrgencies = ['critico', 'urgente', 'moderada', 'tranquilo', 'recorrente'];
        if (!allowedUrgencies.includes(sanitized)) {
          return { valid: false, error: 'Nível de urgência inválido' };
        }
        break;
    }
    
    return { valid: true, value: sanitized };
  }
  
  // Rate limiting simples para requisições
  static createRateLimiter(maxRequests = 10, windowMs = 60000) {
    const requests = new Map();
    
    return (key = 'default') => {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      // Limpar requisições antigas
      if (requests.has(key)) {
        requests.set(key, requests.get(key).filter(time => time > windowStart));
      } else {
        requests.set(key, []);
      }
      
      const currentRequests = requests.get(key);
      
      if (currentRequests.length >= maxRequests) {
        return { allowed: false, error: 'Muitas requisições. Tente novamente em alguns minutos.' };
      }
      
      currentRequests.push(now);
      return { allowed: true };
    };
  }
}

// Rate limiter global para geocodificação
export const geocodingRateLimiter = SecurityUtils.createRateLimiter(5, 60000); // 5 requests per minute