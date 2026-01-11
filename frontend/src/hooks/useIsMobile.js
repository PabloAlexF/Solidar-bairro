import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth <= 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      const shouldUseMobile = isMobileDevice || isSmallScreen || isTouchDevice;
      
      console.log('Device check:', { 
        isMobileDevice, 
        isSmallScreen, 
        isTouchDevice,
        shouldUseMobile,
        width: window.innerWidth 
      });
      
      setIsMobile(shouldUseMobile);
    };

    checkDevice();
    
    const debouncedResize = () => {
      clearTimeout(window.resizeTimeout);
      window.resizeTimeout = setTimeout(checkDevice, 150);
    };
    
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', checkDevice);
      clearTimeout(window.resizeTimeout);
    };
  }, []);

  return isMobile;
};