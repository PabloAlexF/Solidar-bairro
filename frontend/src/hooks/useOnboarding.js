import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'solidar-bairro-onboarding-dont-show';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try {
      const dontShow = localStorage.getItem(ONBOARDING_KEY);
      return dontShow !== 'true'; // Show onboarding unless user chose not to
    } catch (error) {
      console.error('Erro ao verificar status do onboarding:', error);
      return true; // Default to showing onboarding on error
    }
  });
  const [isLoading, setIsLoading] = useState(false);

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