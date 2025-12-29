/**
 * Utilitários comuns - Solidar Bairro
 */

import { VALIDATION_CONFIG, STORAGE_KEYS } from '../config';

// Utilitários de validação
export const validators = {
  email: (email) => VALIDATION_CONFIG.EMAIL_PATTERN.test(email),
  phone: (phone) => VALIDATION_CONFIG.PHONE_PATTERN.test(phone),
  password: (password) => password && password.length >= VALIDATION_CONFIG.PASSWORD_MIN_LENGTH,
  cnpj: (cnpj) => {
    const numbers = cnpj.replace(/\D/g, '');
    return numbers.length === VALIDATION_CONFIG.CNPJ_LENGTH;
  },
  cpf: (cpf) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === VALIDATION_CONFIG.CPF_LENGTH;
  },
  required: (value) => value && value.toString().trim().length > 0,
};

// Utilitários de formatação
export const formatters = {
  phone: (phone) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    return phone;
  },
  
  cnpj: (cnpj) => {
    const numbers = cnpj.replace(/\D/g, '');
    if (numbers.length === 14) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12)}`;
    }
    return cnpj;
  },
  
  cpf: (cpf) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
    }
    return cpf;
  },
  
  currency: (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  },
  
  date: (date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  },
  
  dateTime: (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  },
};

// Utilitários de localStorage
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Erro ao ler localStorage para chave ${key}:`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erro ao salvar no localStorage para chave ${key}:`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover do localStorage para chave ${key}:`, error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  },
};

// Utilitários de usuário
export const userUtils = {
  getCurrentUser: () => storage.get(STORAGE_KEYS.USER),
  setCurrentUser: (user) => storage.set(STORAGE_KEYS.USER, user),
  clearCurrentUser: () => storage.remove(STORAGE_KEYS.USER),
  isLoggedIn: () => !!storage.get(STORAGE_KEYS.USER),
  getUserInitials: (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  },
};

// Utilitários de notificação
export const notificationUtils = {
  getNotifications: () => storage.get(STORAGE_KEYS.NOTIFICATIONS) || [],
  
  addNotification: (notification) => {
    const notifications = notificationUtils.getNotifications();
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    notifications.unshift(newNotification);
    
    // Limitar número de notificações
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
    
    // Disparar evento customizado
    window.dispatchEvent(new CustomEvent('notificationAdded', {
      detail: newNotification
    }));
    
    return newNotification;
  },
  
  markAsRead: (notificationId) => {
    const notifications = notificationUtils.getNotifications();
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  },
  
  markAllAsRead: () => {
    const notifications = notificationUtils.getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    storage.set(STORAGE_KEYS.NOTIFICATIONS, updated);
  },
  
  clearAll: () => {
    storage.remove(STORAGE_KEYS.NOTIFICATIONS);
  },
};

// Utilitários de URL
export const urlUtils = {
  getQueryParam: (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },
  
  setQueryParam: (param, value) => {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
  },
  
  removeQueryParam: (param) => {
    const url = new URL(window.location);
    url.searchParams.delete(param);
    window.history.pushState({}, '', url);
  },
};

// Utilitários de debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Utilitários de throttle
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Utilitários de geolocalização
export const geoUtils = {
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutos
        }
      );
    });
  },
  
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distância em km
  },
};

export default {
  validators,
  formatters,
  storage,
  userUtils,
  notificationUtils,
  urlUtils,
  debounce,
  throttle,
  geoUtils,
};