import React from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CadastroComercioMobile from './CadastroComercioMobile';
import CadastroComercioDesktop from './CadastroComercioDesktop';

export default function CadastroComercio() {
  const isMobile = useIsMobile();

  return isMobile ? <CadastroComercioMobile /> : <CadastroComercioDesktop />;
}
