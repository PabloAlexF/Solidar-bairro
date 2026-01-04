import React from 'react';
import { useAuthGuard } from '../middleware/auth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthGuard();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // useAuthGuard já redirecionou
  }

  return children;
};

export default ProtectedRoute;