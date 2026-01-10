import React from 'react';
import { MobileQueroAjudar } from './MobileQueroAjudar';
import DesktopQueroAjudar from './DesktopQueroAjudar';
import { useIsMobile } from '../../hooks/useIsMobile';

const ResponsiveQueroAjudar = () => {
  const isMobile = useIsMobile();
  
  console.log('ResponsiveQueroAjudar - isMobile:', isMobile);
  
  return isMobile ? <MobileQueroAjudar /> : <DesktopQueroAjudar />;
};

export default ResponsiveQueroAjudar;