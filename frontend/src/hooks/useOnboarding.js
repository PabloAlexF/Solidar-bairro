import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'solidar-bairro-onboarding-completed';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = () => {
      try {
        // Only show onboarding if the flag is NOT set to 'true'
        const completed = localStorage.getItem(ONBOARDING_KEY);
        setShowOnboarding(completed !== 'true');
      } catch (error) {
        console.error('Erro ao verificar status do onboarding:', error);
        setShowOnboarding(true); // Default to showing on error
      } finally {
        setIsLoading(false);
      }
    };

    // Delay checking to avoid layout shifts and improve perceived performance
    const timer = setTimeout(checkOnboardingStatus, 500);
    return () => clearTimeout(timer);
  }, []);

  const completeOnboarding = (dontShow) => {
    try {
      // If user checked "don't show again", set the flag in localStorage
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
    // Skipping also respects the "don't show again" checkbox
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