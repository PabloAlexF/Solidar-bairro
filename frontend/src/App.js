import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { NotificationProvider } from './contexts/NotificationContext';
import './styles/globals.css';
import './styles/visibility-fix.css';

function App() {
  return (
    <div className="App">
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </div>
  );
}

export default App;