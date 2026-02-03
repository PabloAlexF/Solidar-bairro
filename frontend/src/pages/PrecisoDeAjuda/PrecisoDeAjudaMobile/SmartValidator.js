/**
 * Funções de validação para o formulário de pedido de ajuda.
 * Este arquivo contém validações básicas de campos obrigatórios.
 */

export const validateRequiredFields = (formData) => {
  const errors = [];
  
  if (!formData.category) {
    errors.push({ field: 'Categoria', message: 'Selecione uma categoria.' });
  }
  if (!formData.description || formData.description.length < 20) {
    errors.push({ field: 'Descrição', message: 'Sua história deve ter pelo menos 20 caracteres.' });
  }
  if (!formData.urgency) {
    errors.push({ field: 'Urgência', message: 'Selecione o nível de urgência.' });
  }
  
  return errors;
};