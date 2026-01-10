import { useState, useEffect } from 'react';
import CadastroFamiliaMobile from './CadastroFamiliaMobile';
import CadastroFamiliaDesktop from './CadastroFamiliaDesktop';

export default function CadastroFamilia() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    setIsLoading(false);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return null;
  }

  return isMobile ? <CadastroFamiliaMobile /> : <CadastroFamiliaDesktop />;
}
