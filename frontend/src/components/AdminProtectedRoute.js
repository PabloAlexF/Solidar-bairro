import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  // Temporariamente permitir acesso direto para desenvolvimento
  // TODO: Implementar autenticação real
  return children;
  
  // Código original comentado:
  /*
  const isAuthenticated = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');
  const isAdmin = isAuthenticated && userRole === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
  */
};

export default AdminProtectedRoute;