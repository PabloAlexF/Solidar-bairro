import React, { useState, useEffect } from 'react';
import CadastroMobile from './CadastroMobile';

// Import the desktop version from index.js
import CadastroDesktop from './index';

export default function CadastroWrapper() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile ? <CadastroMobile /> : <CadastroDesktop />;
}