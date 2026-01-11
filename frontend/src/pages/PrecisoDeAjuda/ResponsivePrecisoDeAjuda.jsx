import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import PrecisoDeAjudaMobile from './PrecisoDeAjudaMobile';
import PrecisoDeAjudaDesktop from './PrecisoDeAjudaDesktop';

export default function ResponsivePrecisoDeAjuda() {
  const isMobile = useIsMobile();

  return isMobile ? <PrecisoDeAjudaMobile /> : <PrecisoDeAjudaDesktop />;
}