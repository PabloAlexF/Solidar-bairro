import { useState } from 'react';

export const useCEP = () => {
  const [loadingCep, setLoadingCep] = useState(false);

  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const searchCEP = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        return { error: 'CEP não encontrado.' };
      }
      
      return {
        success: true,
        data: {
          logradouro: data.logradouro,
          bairro: data.bairro,
          localidade: data.localidade,
          uf: data.uf,
          complemento: data.complemento
        }
      };
    } catch (error) {
      return { error: 'Erro ao buscar CEP.' };
    } finally {
      setLoadingCep(false);
    }
  };

  return {
    loadingCep,
    formatCEP,
    searchCEP
  };
};