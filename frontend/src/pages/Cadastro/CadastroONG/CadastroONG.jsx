import React, { useEffect, useState } from 'react';
import CadastroONGMobile from './CadastroONGMobile';
import CadastroONGDesktop from './CadastroONGDesktop';
import './CadastroONG.css';

export default function CadastroONG() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile ? <CadastroONGMobile /> : <CadastroONGDesktop />;
}