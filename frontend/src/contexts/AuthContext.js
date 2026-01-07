import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const savedToken = localStorage.getItem('solidar-token');
      const savedUser = localStorage.getItem('solidar-user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        
        // Verificar se token ainda é válido apenas se não estiver em página pública
        const currentPath = window.location.pathname;
        const publicRoutes = ['/', '/landing', '/cadastro', '/sobre-tipos', '/login'];
        const isPublicRoute = publicRoutes.includes(currentPath) || currentPath.startsWith('/cadastro/');
        
        if (!isPublicRoute) {
          try {
            await apiService.verifyToken(savedToken);
          } catch (error) {
            // Token inválido, limpar dados
            logout();
          }
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar auth:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data;
        
        setUser(userData);
        setToken(userToken);
        
        localStorage.setItem('solidar-user', JSON.stringify(userData));
        localStorage.setItem('solidar-token', userToken);
        
        return { success: true, user: userData };
      }
      
      throw new Error(response.message || 'Erro no login');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiService.logout();
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Sempre limpar estado local
      setUser(null);
      setToken(null);
      localStorage.removeItem('solidar-user');
      localStorage.removeItem('solidar-token');
      
      // Disparar evento para outros componentes
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token: newToken } = response.data;
        
        setUser(newUser);
        setToken(newToken);
        
        localStorage.setItem('solidar-user', JSON.stringify(newUser));
        localStorage.setItem('solidar-token', newToken);
        
        return { success: true, user: newUser };
      }
      
      throw new Error(response.message || 'Erro no cadastro');
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('solidar-user', JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent('userUpdated'));
  };

  const isAuthenticated = () => {
    return !!(user && token);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};