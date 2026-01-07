import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Hook para proteger rotas
export const useAuthGuard = (redirectTo = '/login') => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);

  return { isAuthenticated: isAuthenticated(), loading };
};

// Interceptor para adicionar token nas requisições
export const setupApiInterceptors = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (url, options = {}) => {
    const token = localStorage.getItem('solidar-token');
    
    if (token && !options.headers?.Authorization) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    try {
      const response = await originalFetch(url, options);
      
      // Se token expirou (401) E o usuário estava autenticado, fazer logout
      // Mas não redirecionar automaticamente se estiver em página pública
      if (response.status === 401 && token) {
        localStorage.removeItem('solidar-token');
        localStorage.removeItem('solidar-user');
        window.dispatchEvent(new CustomEvent('tokenExpired'));
        
        // Só redirecionar se estiver em rota protegida
        const currentPath = window.location.pathname;
        const protectedRoutes = ['/quero-ajudar', '/preciso-de-ajuda', '/necessidade', '/perfil-familia', '/atualizar-status', '/painel-social', '/perfil', '/conversas', '/chat'];
        const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
        
        if (isProtectedRoute) {
          window.location.href = '/login';
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };
};

// Componente para proteger rotas
export const ProtectedRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return fallback || <div>Carregando...</div>;
  }

  if (!isAuthenticated()) {
    return fallback || <div>Acesso negado</div>;
  }

  return children;
};