import React, { useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useOnboarding } from '../../hooks/useOnboarding';
import MobileLandingPage from './MobileLandingPage';
import DesktopLandingPage from './DesktopLandingPage';
import { OnboardingMobile, OnboardingDesktop } from '../../components/Onboarding';

export default function ResponsiveLandingPage() {
  const isMobile = useIsMobile();
  const { 
    showOnboarding, 
    isLoading, 
    completeOnboarding, 
    skipOnboarding,
    resetOnboarding
  } = useOnboarding();



  if (isLoading) {
    return (
      <div className="sb-flex sb-items-center sb-justify-center sb-min-h-screen">
        <div className="sb-loading sb-loading-lg" />
      </div>
    );
  }

  return (
    <>
      {isMobile ? <MobileLandingPage /> : <DesktopLandingPage />}
      {showOnboarding && (
        isMobile ? (
          <OnboardingMobile
            onComplete={completeOnboarding}
            onSkip={skipOnboarding}
          />
        ) : (
          <OnboardingDesktop
            onComplete={completeOnboarding}
            onSkip={skipOnboarding}
          />
        )
      )}
    </>
  );
}
