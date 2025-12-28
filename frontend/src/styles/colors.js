// Sistema de cores do SolidarBairro
export const colors = {
  // Cores principais
  primary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // Laranja principal
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  
  // Cores secundárias (azul)
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Verde para sucesso
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Vermelho para alertas
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Amarelo para avisos
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Cores neutras
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Cores especiais
  white: '#ffffff',
  black: '#000000',
  
  // Gradientes
  gradients: {
    primary: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    secondary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    card: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  // Estados de urgência
  urgency: {
    alta: '#ef4444',
    media: '#f59e0b',
    baixa: '#22c55e',
  },
  
  // Categorias de ajuda
  categories: {
    alimentos: '#f97316',
    roupas: '#8b5cf6',
    higiene: '#06b6d4',
    medicamentos: '#ef4444',
    contas: '#f59e0b',
    trabalho: '#10b981',
    servicos: '#6366f1',
    outros: '#64748b',
  }
};

// Função helper para obter cores com opacidade
export const withOpacity = (color, opacity) => {
  return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

// Função helper para obter cores de categoria
export const getCategoryColor = (category) => {
  const categoryKey = category.toLowerCase();
  return colors.categories[categoryKey] || colors.categories.outros;
};

// Função helper para obter cores de urgência
export const getUrgencyColor = (urgency) => {
  const urgencyKey = urgency.toLowerCase();
  return colors.urgency[urgencyKey] || colors.urgency.media;
};