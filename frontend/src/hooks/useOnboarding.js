import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'solidar-bairro-onboarding-completed';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(true); // Forçar sempre true para teste
  const [isLoading, setIsLoading] = useState(false); // Sem loading para teste

  const completeOnboarding = (dontShow) => {
    try {
      if (dontShow) {
        localStorage.setItem(ONBOARDING_KEY, 'true');
      }
      setShowOnboarding(false);
    } catch (error) {
      console.error('Erro ao salvar status do onboarding:', error);
      setShowOnboarding(false);
    }
  };

  const skipOnboarding = (dontShow) => {
    completeOnboarding(dontShow);
  };

  const resetOnboarding = () => {
    try {
      localStorage.removeItem(ONBOARDING_KEY);
      setShowOnboarding(true);
    } catch (error) {
      console.error('Erro ao resetar onboarding:', error);
    }
  };

  return {
    showOnboarding,
    isLoading,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
};