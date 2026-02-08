import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import OnboardingDesktop from '../../components/Onboarding/OnboardingDesktop';
import OnboardingMobile from '../../components/Onboarding/OnboardingMobile';

export default function PainelSocialWrapper() {
  const isMobile = useIsMobile();

  return isMobile ? <OnboardingMobile /> : <OnboardingDesktop />;
}
