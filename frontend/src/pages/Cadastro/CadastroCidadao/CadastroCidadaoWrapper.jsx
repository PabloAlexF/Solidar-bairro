import React, { useState, useEffect } from 'react';
import CadastroCidadao from './CadastroCidadao';
import CadastroCidadaoMobile from './CadastroCidadaoMobile';

const CadastroCidadaoWrapper = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <CadastroCidadaoMobile /> : <CadastroCidadao />;
};

export default CadastroCidadaoWrapper;