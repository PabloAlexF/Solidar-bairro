import React from 'react';
import { MobileQueroAjudar } from './MobileQueroAjudar';
import DesktopQueroAjudar from './DesktopQueroAjudar';
import { useIsMobile } from '../../hooks/useIsMobile';

const ResponsiveQueroAjudar = () => {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileQueroAjudar /> : <DesktopQueroAjudar />;
};

export default ResponsiveQueroAjudar;