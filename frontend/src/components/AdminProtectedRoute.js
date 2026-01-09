import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  // Check if user is authenticated and has admin role
  const isAuthenticated = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');
  
  // You can replace this with your actual authentication logic
  const isAdmin = isAuthenticated && userRole === 'admin';
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;