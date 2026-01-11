import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileAchadosEPerdidos from './MobileAchadosEPerdidos';
import DesktopAchadosEPerdidos from './DesktopAchadosEPerdidos';

export default function ResponsiveAchadosEPerdidos() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileAchadosEPerdidos /> : <DesktopAchadosEPerdidos />;
}