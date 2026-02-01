import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { NotificationProvider } from './contexts/NotificationContext';
import SecurityMiddleware from './utils/securityMiddleware';
import './styles/globals.css';
import './styles/visibility-fix.css';
import './pages/Chat/styles.css';
import './pages/Chat/MobileChat.css';

function App() {
  useEffect(() => {
    // Inicializar proteções de segurança
    SecurityMiddleware.initialize();
  }, []);

  return (
    <div className="App">
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </div>
  );
}

export default App;