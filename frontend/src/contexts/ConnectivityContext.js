import React, { createContext, useContext, useState, useEffect } from 'react';

const ConnectivityContext = createContext();

export const useConnectivity = () => {
  const context = useContext(ConnectivityContext);
  if (!context) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }
  return context;
};

export const ConnectivityProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    // Detectar mudanças de conectividade
    const handleOnline = () => {
      console.log('Conectividade restaurada');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('Conectividade perdida');
      setIsOnline(false);
    };

    // Detectar tipo de conexão (se disponível)
    const updateConnectionType = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setConnectionType(connection.effectiveType || 'unknown');
      }
    };

    // Adicionar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateConnectionType);
      updateConnectionType();
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  const value = {
    isOnline,
    connectionType,
    // Método para verificar conectividade manualmente
    checkConnectivity: async () => {
      try {
        // Tentar fazer uma requisição simples para verificar conectividade
        const response = await fetch('/health', {
          method: 'HEAD',
          cache: 'no-cache'
        });
        return response.ok;
      } catch {
        return false;
      }
    }
  };

  return (
    <ConnectivityContext.Provider value={value}>
      {children}
    </ConnectivityContext.Provider>
  );
};
