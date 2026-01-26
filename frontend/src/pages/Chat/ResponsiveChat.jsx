import React, { useEffect } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import MobileChat from './MobileChat';
import DesktopChat from './DesktopChat';

export default function ResponsiveChat() {
  const isMobile = useIsMobile();

  useEffect(() => {
    document.body.classList.add('chat-active');
    document.documentElement.classList.add('chat-active');
    
    return () => {
      document.body.classList.remove('chat-active');
      document.documentElement.classList.remove('chat-active');
    };
  }, []);

  return isMobile ? <MobileChat /> : <DesktopChat />;
}
