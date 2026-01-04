import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className = '', children = 'Sair' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, redirecionar
      navigate('/');
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
};

export default LogoutButton;