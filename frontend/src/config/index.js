/**
 * Configurações centralizadas do Frontend - Solidar Bairro
 */

// Configurações da API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
};

// Configurações do ambiente
export const APP_CONFIG = {
  ENV: process.env.NODE_ENV || 'development',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  PUBLIC_URL: process.env.PUBLIC_URL || '',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
};

// Configurações de UI
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#f97316',
    SUCCESS_COLOR: '#22c55e',
    ERROR_COLOR: '#ef4444',
    WARNING_COLOR: '#f59e0b',
  },
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
  ANIMATION_DURATION: 300,
};

// Configurações de validação
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_PATTERN: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CNPJ_LENGTH: 14,
  CPF_LENGTH: 11,
};

// Configurações de localStorage
export const STORAGE_KEYS = {
  USER: 'solidar-user',
  NOTIFICATIONS: 'solidar-notifications',
  THEME: 'solidar-theme',
  LOCATION: 'solidar-location',
};

// Configurações de notificações
export const NOTIFICATION_CONFIG = {
  MAX_NOTIFICATIONS: 50,
  AUTO_DISMISS_TIME: 5000,
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  },
};

// URLs das páginas
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/cadastro',
  PROFILE: '/perfil',
  HELP_REQUEST: '/preciso-de-ajuda',
  HELP_OFFER: '/quero-ajudar',
  REQUESTS: '/pedidos',
  LANDING: '/landing',
};

// Configurações de geolocalização
export const GEO_CONFIG = {
  DEFAULT_COORDS: {
    lat: -23.5505,
    lng: -46.6333, // São Paulo
  },
  ZOOM_LEVEL: 13,
  SEARCH_RADIUS: 5000, // 5km em metros
};

export default {
  API_CONFIG,
  APP_CONFIG,
  UI_CONFIG,
  VALIDATION_CONFIG,
  STORAGE_KEYS,
  NOTIFICATION_CONFIG,
  ROUTES,
  GEO_CONFIG,
};