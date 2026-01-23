import React from 'react';
import { MobileQueroAjudar } from './MobileQueroAjudar';
import DesktopQueroAjudar from './DesktopQueroAjudar';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useEffect } from 'react';
import { getCurrentLocation } from '../../utils/geolocation';
import toast from 'react-hot-toast';

const ResponsiveQueroAjudar = () => {
  const isMobile = useIsMobile();
  
  console.log('ResponsiveQueroAjudar - isMobile:', isMobile);
  
  useEffect(() => {
    // Carregar localização apenas uma vez no componente pai
    const loadLocation = async () => {
      try {
        const location = await getCurrentLocation();
        toast.success(`Localização: ${location.city}, ${location.state}`);
      } catch (error) {
        console.warn('Erro ao obter localização:', error);
        toast.error('Não foi possível obter sua localização. Usando São Paulo como padrão.');
      }
    };
    
    loadLocation();
  }, []);
  
  return isMobile ? <MobileQueroAjudar /> : <DesktopQueroAjudar />;
};

export default ResponsiveQueroAjudar;