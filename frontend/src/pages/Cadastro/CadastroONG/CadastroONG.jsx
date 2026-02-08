import React from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CadastroONGMobile from './CadastroONGMobile';
import CadastroONGDesktop from './CadastroONGDesktop';
import './CadastroONG.css';

export default function CadastroONG() {
  const isMobile = useIsMobile();

  return isMobile ? <CadastroONGMobile /> : <CadastroONGDesktop />;
}
