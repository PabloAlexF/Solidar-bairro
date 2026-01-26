// AI Assistant Ultra-Inteligente
export class AIAssistant {
  static async validateRequest(formData) {
    const { category, description, urgency, visibility } = formData;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const validations = {
      textIntelligence: this.validateTextIntelligence(description),
      categoryMatch: this.validateCategoryMatch(category, description),
      urgencyAuthenticity: this.validateUrgencyAuthenticity(urgency, description),
      descriptionCoherence: this.validateDescriptionCoherence(description)
    };
    
    const isValid = Object.values(validations).every(v => v.isValid);
    
    return {
      isValid,
      validations,
      suggestions: this.generateSuggestions(validations, formData),
      confidence: this.calculateConfidence(validations)
    };
  }
  
  static validateTextIntelligence(description) {
    const text = description.toLowerCase().trim();
    
    // Detecta padrões repetitivos
    if (/(.{1,3})\1{4,}/.test(text)) {
      return { isValid: false, message: 'Texto contém padrões repetitivos sem sentido' };
    }
    
    // Detecta sequências aleatórias
    if (/[bcdfghjklmnpqrstvwxyz]{5,}|[aeiou]{4,}/.test(text.replace(/\s/g, ''))) {
      return { isValid: false, message: 'Texto contém sequências aleatórias de caracteres' };
    }
    
    // Verifica palavras reais portuguesas
    const realWords = [
      'preciso', 'ajuda', 'família', 'filhos', 'trabalho', 'casa', 'comida', 'dinheiro',
      'saúde', 'medicamento', 'roupa', 'emprego', 'conta', 'situação', 'difícil', 'problema'
    ];
    
    if (!realWords.some(word => text.includes(word))) {
      return { isValid: false, message: 'Texto não contém palavras relacionadas a pedidos de ajuda' };
    }
    
    return { isValid: true, message: 'Texto demonstra inteligência e coerência' };
  }
  
  static validateCategoryMatch(category, description) {
    const keywords = {
      'Alimentos': ['comida', 'fome', 'cesta', 'alimentar', 'refeição', 'mercado'],
      'Roupas': ['roupa', 'vestir', 'agasalho', 'calça', 'camisa', 'blusa'],
      'Medicamentos': ['remédio', 'medicamento', 'saúde', 'doença', 'tratamento'],
      'Emprego': ['trabalho', 'emprego', 'desempregado', 'renda', 'sustento'],
      'Contas': ['conta', 'boleto', 'pagamento', 'dívida', 'aluguel']
    };
    
    const categoryWords = keywords[category] || [];
    const hasMatch = categoryWords.some(word => description.toLowerCase().includes(word));
    
    return {
      isValid: hasMatch,
      message: hasMatch ? 'Categoria compatível' : `Descrição não corresponde à categoria "${category}"`
    };
  }
  
  static validateUrgencyAuthenticity(urgency, description) {
    const text = description.toLowerCase();
    
    const urgencyWords = {
      'critico': { 
        required: ['urgente', 'crítico', 'emergência', 'imediato', 'risco', 'grave'],
        forbidden: ['tranquilo', 'sem pressa', 'quando possível']
      },
      'urgente': {
        required: ['rápido', 'logo', 'breve', 'urgente', 'necessário'],
        forbidden: ['tranquilo', 'sem pressa']
      },
      'tranquilo': {
        required: ['tranquilo', 'sem pressa', 'quando possível'],
        forbidden: ['urgente', 'crítico', 'emergência', 'imediato']
      }
    };
    
    const indicators = urgencyWords[urgency];
    if (!indicators) return { isValid: true, message: 'Urgência válida' };
    
    // Verifica contradições
    if (indicators.forbidden.some(word => text.includes(word))) {
      return { isValid: false, message: `Texto contradiz urgência "${urgency}"` };
    }
    
    // Para crítico/urgente, exige palavras justificativas
    if (['critico', 'urgente'].includes(urgency)) {
      if (!indicators.required.some(word => text.includes(word))) {
        return { isValid: false, message: `Urgência "${urgency}" não justificada no texto` };
      }
    }
    
    return { isValid: true, message: 'Urgência condiz com a descrição' };
  }
  
  static validateDescriptionCoherence(description) {
    const words = description.split(/\s+/).filter(w => w.length > 2);
    
    if (words.length < 8) {
      return { isValid: false, message: 'Descrição muito curta - mínimo 8 palavras' };
    }
    
    // Verifica diversidade
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    if (uniqueWords.size / words.length < 0.7) {
      return { isValid: false, message: 'Muita repetição - seja mais específico' };
    }
    
    return { isValid: true, message: 'Descrição coerente' };
  }
  
  static generateSuggestions(validations, formData) {
    const suggestions = [];
    
    Object.entries(validations).forEach(([key, validation]) => {
      if (!validation.isValid) {
        suggestions.push({
          type: key,
          message: validation.message,
          action: 'Revisar'
        });
      }
    });
    
    return suggestions;
  }
  
  static calculateConfidence(validations) {
    const validCount = Object.values(validations).filter(v => v.isValid).length;
    return Math.round((validCount / Object.keys(validations).length) * 100);
  }
}