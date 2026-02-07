import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import CadastroMobile from './CadastroMobile';

// Import the desktop version from index.js
import CadastroDesktop from './index';

export default function CadastroWrapper() {
  const isMobile = useIsMobile();

  return isMobile ? <CadastroMobile /> : <CadastroDesktop />;
}
