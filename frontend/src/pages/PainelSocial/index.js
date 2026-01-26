import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import PainelSocial from './PainelSocial';
import PainelSocialMobile from './PainelSocialMobile';

export default function ResponsivePainelSocial() {
  const isMobile = useIsMobile();

  return isMobile ? <PainelSocialMobile /> : <PainelSocial />;
}