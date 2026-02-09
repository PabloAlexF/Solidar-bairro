import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { connectSocket, disconnectSocket } from '../services/socketService';

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
      // Load cached authentication data to persist login
      const cachedUser = localStorage.getItem('solidar-user');
      const cachedToken = localStorage.getItem('solidar-token');

      if (cachedUser && cachedToken) {
        try {
          const userData = JSON.parse(cachedUser);
          // Keep endereco as object, don't format it
          setUser(userData);
          setToken(cachedToken);

          // Connect socket for authenticated user
          if (userData && (userData.uid || userData.id)) {
            console.log('🔌 [Auth] Conectando socket para usuário:', userData.uid || userData.id);
            connectSocket(userData.uid || userData.id);
          }
        } catch (parseError) {
          console.error('Erro ao parsear dados do usuário:', parseError);
          // Clear invalid data
          localStorage.removeItem('solidar-user');
          localStorage.removeItem('solidar-token');
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data;
        
        // Debug: verificar dados recebidos
        console.log('Login - userData completo:', JSON.stringify(userData, null, 2));
        console.log('Login - fotoPerfil:', userData.fotoPerfil);
        
        // Keep endereco as object, don't format it
        setUser(userData);
        setToken(userToken);

        localStorage.setItem('solidar-user', JSON.stringify(userData));
        localStorage.setItem('solidar-token', userToken);

        // Connect socket for authenticated user
        if (userData && (userData.uid || userData.id)) {
          console.log('🔌 [Auth] Conectando socket para usuário:', userData.uid || userData.id);
          connectSocket(userData.uid || userData.id);
        }

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
        
        // Keep endereco as object, don't format it
        setUser(newUser);
        setToken(newToken);

        localStorage.setItem('solidar-user', JSON.stringify(newUser));
        localStorage.setItem('solidar-token', newToken);

        // Connect socket for authenticated user
        if (newUser && (newUser.uid || newUser.id)) {
          connectSocket(newUser.uid || newUser.id);
        }

        return { success: true, user: newUser };
      }
      
      throw new Error(response.message || 'Erro no cadastro');
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (userData) => {
    // Keep endereco as object, don't format it
    setUser(userData);
    localStorage.setItem('solidar-user', JSON.stringify(userData));
    window.dispatchEvent(new CustomEvent('userUpdated'));
  };

  const isAuthenticated = () => {
    return !!(user && token && (user.uid || user.id));
  };

  const hasValidUserId = () => {
    return !!(user && (user.uid || user.id));
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    updateUser,
    isAuthenticated,
    hasValidUserId
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};