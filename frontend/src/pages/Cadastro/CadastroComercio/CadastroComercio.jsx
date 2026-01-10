import React, { useState, useEffect } from 'react';
import CadastroComercioMobile from './CadastroComercioMobile';
import CadastroComercioDesktop from './CadastroComercioDesktop';

export default function CadastroComercio() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Define inicial
    handleResize();
    setIsLoading(false);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return null;
  }

  return isMobile ? <CadastroComercioMobile /> : <CadastroComercioDesktop />;
}
