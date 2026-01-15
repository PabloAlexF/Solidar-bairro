import React from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileChat from './MobileChat';
import DesktopChat from './DesktopChat';

export default function ResponsiveChat() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileChat /> : <DesktopChat />;
}
