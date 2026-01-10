import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { MobileLandingPage } from '../../components/MobileLandingPage';
import DesktopLandingPage from './DesktopLandingPage';

export default function ResponsiveLandingPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileLandingPage /> : <DesktopLandingPage />;
}