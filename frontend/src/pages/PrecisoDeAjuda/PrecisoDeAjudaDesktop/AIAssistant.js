export const validateRequest = async (formData) => {
  const { category, description, urgency, visibility } = formData;
  
  try {
    const response = await fetch('http://localhost:3001/api/bot/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category,
        description,
        urgency,
        visibility
      })
    });
    
    const result = await response.json();
    
    // Se não passou na validação, retorna os detalhes
    if (!response.ok || !result.canPublish) {
      return {
        canPublish: false,
        validations: result.validation?.validations || {},
        suggestions: result.validation?.suggestions || [],
        confidence: result.validation?.confidence || 0,
        riskScore: result.validation?.riskScore || 100,
        analysis: result.validation?.analysis || 'Pedido requer revisão'
      };
    }
    
    return {
      canPublish: true,
      validations: result.data?.validations || {},
      suggestions: result.data?.suggestions || [],
      confidence: result.data?.confidence || 100,
      riskScore: result.data?.riskScore || 0,
      analysis: result.data?.analysis || 'Pedido aprovado'
    };
    
  } catch (error) {
    console.error('Erro ao validar com bot Python:', error);
    // Fallback - não permite publicação em caso de erro
    return {
      canPublish: false,
      validations: {},
      suggestions: [{
        type: 'error',
        message: 'Erro na validação. Tente novamente.',
        action: 'Tentar novamente',
        priority: 'high',
        evidence: 'Falha na conexão com o sistema de validação'
      }],
      confidence: 0,
      riskScore: 100,
      analysis: 'Erro na validação'
    };
  }
};

export const analyzeRequest = async (formData) => {
  try {
    const response = await fetch('http://localhost:3001/api/bot/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    return result.success ? result.analysis : null;
    
  } catch (error) {
    console.error('Erro na análise:', error);
    return null;
  }
};

export const showValidationModal = (validationResult) => {
  return {
    show: !validationResult.canPublish,
    title: validationResult.canPublish ? 'Pedido Aprovado!' : 'Pedido Requer Revisão',
    type: validationResult.canPublish ? 'success' : 'warning',
    content: {
      analysis: validationResult.analysis,
      confidence: validationResult.confidence,
      riskScore: validationResult.riskScore,
      suggestions: validationResult.suggestions,
      validations: validationResult.validations
    }
  };
};

export const validateTextIntelligence = (description) => {
  return { isValid: true, message: 'OK' };
};

export const validateCategoryMatch = (category, description) => {
  return { isValid: true, message: 'OK' };
};

export const generateSuggestions = () => {
  return [];
};

export const testBot = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/bot/test');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao testar bot:', error);
    return { success: false, error: error.message };
  }
};

export const AIAssistant = {
  validateRequest,
  analyzeRequest,
  showValidationModal,
  testBot
};