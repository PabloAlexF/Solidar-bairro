import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileLoginPage from './MobileLogin';
import DesktopLoginPage from './DesktopLoginPage';

export default function ResponsiveLoginPage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLoginPage />;
  }

  return <DesktopLoginPage />;
}