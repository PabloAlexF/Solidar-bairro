import React from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CadastroFamiliaMobile from './CadastroFamiliaMobile';
import CadastroFamiliaDesktop from './CadastroFamiliaDesktop';

export default function CadastroFamilia() {
  const isMobile = useIsMobile();

  return isMobile ? <CadastroFamiliaMobile /> : <CadastroFamiliaDesktop />;
}
