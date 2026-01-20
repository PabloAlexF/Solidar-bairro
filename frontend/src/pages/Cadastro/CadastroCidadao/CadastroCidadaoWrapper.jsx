import React from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CadastroCidadao from './CadastroCidadao';
import CadastroCidadaoMobile from './CadastroCidadaoMobile';

const CadastroCidadaoWrapper = () => {
  const isMobile = useIsMobile();

  return isMobile ? <CadastroCidadaoMobile /> : <CadastroCidadao />;
};

export default CadastroCidadaoWrapper;