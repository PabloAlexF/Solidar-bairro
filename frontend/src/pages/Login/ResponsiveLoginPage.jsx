import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileLoginPage from './MobileLoginPage';
import DesktopLoginPage from './LoginPage'; // IMPORTANTE: Aponte para seu componente de Login Desktop atual (ex: ./index.jsx)

export default function ResponsiveLoginPage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLoginPage />;
  }

  return <DesktopLoginPage />;
}