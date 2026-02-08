const { spawn } = require('child_process');
const path = require('path');

class BotController {
  /**
   * Bot inteligente para validação de pedidos com análise de palavras-chave
   */
  static validateRequestIntelligent(data) {
    const { category, description, urgency } = data;
    
    const validations = {
      textIntelligence: this.validateTextIntelligence(description),
      categoryMatch: this.validateCategoryMatch(category, description),
      urgencyAuthenticity: this.validateUrgencyAuthenticity(urgency, description),
      keywordAnalysis: this.analyzeKeywords(description, category, urgency)
    };
    
    const isValid = Object.values(validations).every(v => v.isValid);
    const confidence = Math.round(Object.values(validations).reduce((sum, v) => sum + v.confidence, 0) / 4);
    
    return {
      isValid,
      confidence,
      validations,
      riskScore: isValid ? 0 : 100 - confidence,
      analysis: this.generateAnalysis(validations),
      suggestions: this.generateSuggestions(validations),
      keywords: validations.keywordAnalysis.keywords,
      sentiment: validations.keywordAnalysis.sentiment
    };
  }
  
  /**
   * Análise avançada de palavras-chave e sentimento
   */
  static analyzeKeywords(description, category, urgency) {
    const text = description.toLowerCase();
    
    // Palavras-chave por contexto
    const keywordCategories = {
      urgency: {
        critical: ['urgente', 'crítico', 'emergência', 'imediato', 'socorro', 'agora', 'hoje', 'rápido'],
        moderate: ['necessário', 'preciso', 'importante', 'logo', 'breve'],
        low: ['quando possível', 'sem pressa', 'tranquilo', 'futuramente']
      },
      emotion: {
        desperation: ['desespero', 'desesperad', 'não aguento', 'não consigo', 'impossível'],
        sadness: ['triste', 'choro', 'lágrimas', 'sofrendo', 'dor', 'angústia'],
        hope: ['esperança', 'confiança', 'acredito', 'fé', 'otimista'],
        gratitude: ['obrigado', 'grato', 'agradeço', 'reconhecido', 'grata']
      },
      family: {
        children: ['filho', 'filha', 'filhos', 'criança', 'crianças', 'bebê', 'recém-nascido'],
        elderly: ['idoso', 'idosa', 'velho', 'velha', 'avô', 'avó', 'terceira idade'],
        family: ['família', 'esposa', 'esposo', 'marido', 'mulher', 'mãe', 'pai', 'irmão', 'irmã']
      },
      situation: {
        unemployment: ['desempregado', 'desemprego', 'sem trabalho', 'perdeu emprego', 'demitido'],
        health: ['doente', 'doença', 'hospital', 'médico', 'tratamento', 'cirurgia', 'internado'],
        financial: ['sem dinheiro', 'falido', 'endividado', 'conta atrasada', 'despejo']
      },
      authenticity: {
        genuine: ['por favor', 'humildemente', 'sinceramente', 'honestamente', 'verdade'],
        specific: ['anos', 'meses', 'dias', 'reais', 'quilos', 'pessoas', 'endereço']
      }
    };
    
    // Detectar palavras-chave
    const foundKeywords = {};
    let totalKeywords = 0;
    
    Object.keys(keywordCategories).forEach(category => {
      foundKeywords[category] = {};
      Object.keys(keywordCategories[category]).forEach(subcategory => {
        const matches = keywordCategories[category][subcategory].filter(keyword => 
          text.includes(keyword)
        );
        foundKeywords[category][subcategory] = matches;
        totalKeywords += matches.length;
      });
    });
    
    // Análise de sentimento
    const sentimentScore = this.calculateSentiment(foundKeywords);
    const authenticityScore = this.calculateAuthenticity(foundKeywords, text);
    
    // Validação baseada em palavras-chave
    let isValid = true;
    let confidence = 70;
    let message = 'Análise de palavras-chave aprovada';
    
    // Penalizar se não há palavras-chave relevantes
    if (totalKeywords < 2) {
      confidence -= 20;
      message = 'Poucas palavras-chave relevantes detectadas';
    }
    
    // Bonificar autenticidade
    if (authenticityScore > 0.7) {
      confidence += 15;
    }
    
    // Penalizar falta de contexto emocional
    if (Object.values(foundKeywords.emotion).every(arr => arr.length === 0)) {
      confidence -= 10;
    }
    
    // Validar coerência com urgência
    if (urgency === 'critico' && foundKeywords.urgency.critical.length === 0) {
      confidence -= 25;
      isValid = false;
      message = 'Urgência crítica não justificada pelas palavras-chave';
    }
    
    return {
      isValid,
      confidence: Math.max(0, Math.min(100, confidence)),
      message,
      keywords: foundKeywords,
      sentiment: {
        score: sentimentScore,
        authenticity: authenticityScore,
        totalKeywords
      }
    };
  }
  
  /**
   * Calcula score de sentimento
   */
  static calculateSentiment(keywords) {
    let score = 0;
    
    // Sentimentos negativos (indicam necessidade real)
    score += keywords.emotion.desperation.length * 0.3;
    score += keywords.emotion.sadness.length * 0.2;
    score += keywords.situation.unemployment.length * 0.2;
    score += keywords.situation.health.length * 0.25;
    score += keywords.situation.financial.length * 0.2;
    
    // Sentimentos positivos (indicam gratidão/esperança)
    score += keywords.emotion.hope.length * 0.1;
    score += keywords.emotion.gratitude.length * 0.15;
    
    return Math.min(1, score);
  }
  
  /**
   * Calcula score de autenticidade
   */
  static calculateAuthenticity(keywords, text) {
    let score = 0;
    
    // Detalhes específicos aumentam autenticidade
    score += keywords.authenticity.specific.length * 0.2;
    score += keywords.authenticity.genuine.length * 0.15;
    score += keywords.family.children.length * 0.1;
    score += keywords.family.elderly.length * 0.1;
    
    // Contexto familiar aumenta autenticidade
    if (keywords.family.family.length > 0) score += 0.2;
    
    // Números específicos no texto
    const numbers = text.match(/\d+/g) || [];
    score += Math.min(0.3, numbers.length * 0.1);
    
    return Math.min(1, score);
  }
  
  /**
   * Valida inteligência do texto
   */
  static validateTextIntelligence(description) {
    if (!description || description.length < 10) {
      return { isValid: false, confidence: 0, message: 'Descrição muito curta' };
    }
    
    const text = description.toLowerCase();
    
    // Detecta texto repetitivo
    const words = text.split(/\s+/);
    const uniqueWords = new Set(words);
    const repetitionRatio = uniqueWords.size / words.length;
    
    if (repetitionRatio < 0.3) {
      return { isValid: false, confidence: 20, message: 'Texto muito repetitivo detectado' };
    }
    
    // Detecta sequências sem sentido (mais restritivo)
    const nonsensePatterns = [
      /([a-z])\1{3,}/g, // letras repetidas 4+ vezes
      /\b(da|wa|xa|za)\w*\1\w*\b/g, // padrões nonsense específicos
    ];
    
    let nonsenseCount = 0;
    nonsensePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) nonsenseCount += matches.length;
    });
    
    // Detecta palavras muito curtas em excesso (mais tolerante)
    const shortWords = text.match(/\b\w{1,2}\b/g) || [];
    const shortWordsRatio = shortWords.length / words.length;
    
    if (nonsenseCount > 2 || shortWordsRatio > 0.6) {
      return { isValid: false, confidence: 30, message: 'Texto contém muitas sequências sem sentido' };
    }
    
    // Verifica palavras reais em português (mais tolerante)
    const commonWords = ['preciso', 'ajuda', 'família', 'filhos', 'casa', 'trabalho', 'dinheiro', 'comida', 'remédio', 'roupas', 'urgente', 'favor', 'obrigado', 'por', 'muito', 'pouco', 'dias', 'meses', 'anos', 'pessoa', 'pessoas', 'situação', 'problema', 'dificuldade', 'mãe', 'pai', 'filho', 'filha', 'sem', 'com', 'para', 'minha', 'meu', 'sua', 'seu', 'não', 'pode', 'ficar', 'está', 'estou', 'tenho', 'tem', 'quando', 'onde', 'como', 'porque'];
    const realWordsCount = words.filter(word => 
      commonWords.includes(word) || 
      word.length > 3 || 
      /^(de|da|do|em|na|no|um|uma|que|com|por|para|são|foi|ter|ser|sua|seu|meu|minha)$/.test(word)
    ).length;
    const realWordsRatio = realWordsCount / words.length;
    
    if (realWordsRatio < 0.3) {
      return { isValid: false, confidence: 40, message: 'Poucas palavras reconhecíveis em português' };
    }
    
    return { isValid: true, confidence: 90, message: 'Texto demonstra inteligência e coerência' };
  }
  
  /**
   * Valida correspondência entre categoria e descrição
   */
  static validateCategoryMatch(category, description) {
    const text = description.toLowerCase();
    
    const categoryKeywords = {
      'Alimentos': {
        primary: ['comida', 'fome', 'cesta', 'alimentar', 'alimento', 'comer', 'refeição', 'prato'],
        context: ['cozinhar', 'nutrição', 'mercado', 'supermercado', 'feira', 'básica', 'arroz', 'feijão']
      },
      'Medicamentos': {
        primary: ['remédio', 'medicamento', 'saúde', 'doença', 'hospital', 'médico'],
        context: ['farmácia', 'receita', 'tratamento', 'dor', 'doente', 'consulta', 'exame']
      },
      'Roupas': {
        primary: ['roupa', 'vestir', 'agasalho', 'blusa', 'calça', 'sapato', 'tênis'],
        context: ['frio', 'inverno', 'uniforme', 'escola', 'trabalho', 'tamanho']
      },
      'Móveis': {
        primary: ['móvel', 'cama', 'mesa', 'cadeira', 'sofá', 'geladeira', 'fogão'],
        context: ['casa', 'mudança', 'apartamento', 'quarto', 'cozinha', 'sala']
      },
      'Serviços': {
        primary: ['trabalho', 'emprego', 'serviço', 'vaga', 'currículo'],
        context: ['desempregado', 'renda', 'salário', 'experiência', 'profissional']
      }
    };
    
    const keywords = categoryKeywords[category];
    if (!keywords) {
      return { isValid: true, confidence: 70, message: 'Categoria não reconhecida, aprovando por padrão' };
    }
    
    const primaryMatches = keywords.primary.filter(word => text.includes(word)).length;
    const contextMatches = keywords.context.filter(word => text.includes(word)).length;
    
    if (primaryMatches === 0 && contextMatches === 0) {
      return { isValid: false, confidence: 20, message: `Descrição não corresponde à categoria ${category}` };
    }
    
    const confidence = Math.min(95, 60 + (primaryMatches * 20) + (contextMatches * 10));
    return { isValid: true, confidence, message: 'Categoria compatível com a descrição' };
  }
  
  /**
   * Valida autenticidade da urgência
   */
  static validateUrgencyAuthenticity(urgency, description) {
    const text = description.toLowerCase();
    
    const urgencyIndicators = {
      'critico': {
        required: ['urgente', 'crítico', 'emergência', 'imediato', 'agora', 'hoje', 'socorro'],
        forbidden: ['sem pressa', 'quando possível', 'não urgente', 'tranquilo']
      },
      'urgente': {
        required: ['urgente', 'rápido', 'logo', 'necessário', 'preciso muito'],
        forbidden: ['sem pressa', 'quando possível']
      },
      'moderada': {
        required: [],
        forbidden: []
      },
      'tranquilo': {
        required: ['sem pressa', 'quando possível', 'não urgente'],
        forbidden: ['urgente', 'crítico', 'emergência', 'imediato']
      }
    };
    
    const indicators = urgencyIndicators[urgency];
    if (!indicators) {
      return { isValid: true, confidence: 70, message: 'Nível de urgência não reconhecido' };
    }
    
    // Verifica palavras proibidas
    const forbiddenFound = indicators.forbidden.some(word => text.includes(word));
    if (forbiddenFound) {
      return { isValid: false, confidence: 30, message: `Contradição: texto não condiz com urgência ${urgency}` };
    }
    
    // Para níveis crítico e tranquilo, verifica palavras obrigatórias
    if ((urgency === 'critico' || urgency === 'tranquilo') && indicators.required.length > 0) {
      const requiredFound = indicators.required.some(word => text.includes(word));
      if (!requiredFound) {
        return { isValid: false, confidence: 40, message: `Urgência ${urgency} não justificada no texto` };
      }
    }
    
    return { isValid: true, confidence: 85, message: 'Urgência condiz com o conteúdo da descrição' };
  }
  
  /**
   * Gera análise textual avançada
   */
  static generateAnalysis(validations) {
    const issues = Object.values(validations).filter(v => !v.isValid);
    if (issues.length === 0) {
      const keywords = validations.keywordAnalysis.keywords;
      const sentiment = validations.keywordAnalysis.sentiment;
      
      let analysis = 'Pedido aprovado: texto coerente, categoria apropriada e urgência justificada.';
      
      // Adicionar insights das palavras-chave
      if (sentiment.score > 0.5) {
        analysis += ' Conteúdo demonstra necessidade genuína.';
      }
      if (sentiment.authenticity > 0.6) {
        analysis += ' Detalhes específicos indicam autenticidade.';
      }
      if (keywords.family.children.length > 0) {
        analysis += ' Situação envolve crianças - prioridade alta.';
      }
      
      return analysis;
    }
    return `Pedido rejeitado: ${issues.map(i => i.message).join('; ')}.`;
  }
  
  /**
   * Gera sugestões de melhoria avançadas
   */
  static generateSuggestions(validations) {
    const suggestions = [];
    
    if (!validations.textIntelligence.isValid) {
      suggestions.push('Escreva uma descrição mais detalhada e clara sobre sua situação');
    }
    
    if (!validations.categoryMatch.isValid) {
      suggestions.push('Verifique se selecionou a categoria correta para seu pedido');
    }
    
    if (!validations.urgencyAuthenticity.isValid) {
      suggestions.push('Ajuste o nível de urgência de acordo com sua real necessidade');
    }
    
    if (!validations.keywordAnalysis.isValid) {
      suggestions.push('Adicione mais detalhes sobre sua situação para aumentar a credibilidade');
      
      const keywords = validations.keywordAnalysis.keywords;
      const sentiment = validations.keywordAnalysis.sentiment;
      
      if (sentiment.totalKeywords < 3) {
        suggestions.push('Inclua mais informações específicas (números, datas, detalhes)');
      }
      
      if (Object.values(keywords.family).every(arr => arr.length === 0)) {
        suggestions.push('Mencione quantas pessoas serão beneficiadas');
      }
      
      if (sentiment.authenticity < 0.3) {
        suggestions.push('Seja mais específico sobre sua situação (tempo, quantidade, circunstâncias)');
      }
    }
    
    return suggestions;
  }

  /**
   * Valida pedido de ajuda usando o bot inteligente
   */
  static async validateRequest(req, res) {
    try {
      const { category, description, urgency, visibility } = req.body;

      if (!category || !description) {
        return res.status(400).json({
          success: false,
          message: 'Categoria e descrição são obrigatórias'
        });
      }

      // Usa o bot inteligente JavaScript
      const result = BotController.validateRequestIntelligent({
        category,
        description,
        urgency: urgency || 'moderada',
        visibility: visibility || []
      });

      // Se não passou na validação, retorna erro detalhado
      if (!result.isValid) {
        return res.status(422).json({
          success: false,
          message: 'Pedido não passou na validação da IA',
          validation: {
            ...result,
            canPublish: result.isValid
          },
          canPublish: result.isValid
        });
      }

      res.json({
        success: true,
        message: 'Pedido validado com sucesso',
        data: {
          ...result,
          canPublish: result.isValid
        },
        canPublish: result.isValid
      });

    } catch (error) {
      console.error('Erro na validação do bot:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message,
        canPublish: false
      });
    }
  }

  /**
   * Endpoint de teste do bot inteligente
   */
  static async testBot(req, res) {
    try {
      const testCases = [
        {
          name: 'Pedido válido - Alimentos crítico',
          data: {
            category: 'Alimentos',
            description: 'Preciso urgentemente de ajuda com comida para minha família. Somos 4 pessoas, tenho 2 filhos pequenos de 3 e 5 anos. Estou desempregado há 3 meses e a situação está crítica.',
            urgency: 'critico'
          }
        },
        {
          name: 'Spam detectado - Texto repetitivo',
          data: {
            category: 'Alimentos',
            description: 'dawdawdaw dawdawdaw preciso ajuda dawdawdaw dawdawdaw',
            urgency: 'urgente'
          }
        },
        {
          name: 'Categoria incorreta - Medicamento como Alimento',
          data: {
            category: 'Alimentos',
            description: 'Preciso de remédio para pressão alta, estou sem dinheiro para comprar na farmácia',
            urgency: 'urgente'
          }
        },
        {
          name: 'Urgência incompatível - Crítico sem justificativa',
          data: {
            category: 'Roupas',
            description: 'Gostaria de algumas roupas quando possível, sem pressa',
            urgency: 'critico'
          }
        },
        {
          name: 'Pedido válido - Medicamentos urgente',
          data: {
            category: 'Medicamentos',
            description: 'Minha mãe precisa urgentemente de remédio para diabetes, acabou o estoque e ela não pode ficar sem',
            urgency: 'urgente'
          }
        }
      ];

      const results = [];
      
      for (const testCase of testCases) {
        try {
          const result = BotController.validateRequestIntelligent(testCase.data);
          results.push({
            test: testCase.name,
            input: testCase.data,
            result: result,
            passed: result.isValid,
            confidence: result.confidence
          });
        } catch (error) {
          results.push({
            test: testCase.name,
            input: testCase.data,
            error: error.message,
            passed: false,
            confidence: 0
          });
        }
      }

      res.json({
        success: true,
        message: 'Testes do bot inteligente executados',
        results: results,
        summary: {
          total: results.length,
          passed: results.filter(r => r.passed).length,
          failed: results.filter(r => !r.passed).length
        }
      });

    } catch (error) {
      console.error('Erro no teste do bot:', error);
      res.status(500).json({
        success: false,
        message: 'Erro no teste do bot',
        error: error.message
      });
    }
  }

  /**
   * Análise detalhada de um pedido
   */
  static async analyzeRequest(req, res) {
    try {
      const { category, description, urgency, visibility } = req.body;

      const result = BotController.validateRequestIntelligent({
        category,
        description,
        urgency: urgency || 'moderada',
        visibility: visibility || []
      });

      res.json({
        success: true,
        analysis: {
          canPublish: result.isValid,
          riskScore: result.riskScore,
          confidence: result.confidence,
          summary: result.analysis,
          validations: result.validations,
          suggestions: result.suggestions
        }
      });

    } catch (error) {
      console.error('Erro na análise:', error);
      res.status(500).json({
        success: false,
        message: 'Erro na análise do pedido',
        error: error.message
      });
    }
  }
}

module.exports = BotController;