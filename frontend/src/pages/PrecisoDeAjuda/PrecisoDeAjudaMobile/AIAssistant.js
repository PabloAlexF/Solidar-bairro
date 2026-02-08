/**
 * Assistente de IA para validação de pedidos.
 * Este módulo se comunica com um endpoint de backend para analisar a qualidade
 * e a coerência de um novo pedido de ajuda.
 */

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
        // O backend pode esperar uma string, e o form usa um array.
        visibility: Array.isArray(visibility) ? visibility.join(', ') : visibility
      })
    });
    
    const result = await response.json();
    
    // Se a API indicar que não pode publicar, retornamos a estrutura de falha.
    if (!response.ok || !result.canPublish) {
      return {
        canPublish: false,
        validations: result.validation?.validations || {},
        suggestions: result.validation?.suggestions || [],
        confidence: result.validation?.confidence || 0,
        analysis: result.validation?.analysis || 'Pedido requer revisão para melhor performance.'
      };
    }
    
    // Se a API aprovar, retornamos a estrutura de sucesso.
    return {
      canPublish: true,
      validations: result.data?.validations || {},
      suggestions: result.data?.suggestions || [],
      confidence: result.data?.confidence || 100,
      analysis: result.data?.analysis || 'Pedido aprovado pela IA!'
    };
    
  } catch (error) {
    console.error('Erro ao validar com o assistente IA:', error);
    // Em caso de falha de conexão, retornamos um erro claro para o usuário.
    return {
      canPublish: false,
      validations: {},
      suggestions: [{
        type: 'error',
        message: 'Não foi possível conectar ao nosso assistente de validação. Verifique sua conexão e tente novamente.',
      }],
      confidence: 0,
      analysis: 'Erro de Conexão'
    };
  }
};