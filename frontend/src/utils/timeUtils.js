/**
 * Utilitário para calcular tempo relativo de timestamps
 * Suporta múltiplos formatos: Firebase Timestamp, Unix timestamp, ISO string, Date object
 */

/**
 * Converte qualquer formato de timestamp para objeto Date
 * @param {*} timestamp - Timestamp em qualquer formato
 * @returns {Date} - Objeto Date válido
 */
export const parseTimestamp = (timestamp) => {
  if (!timestamp) return new Date();

  // Firebase Timestamp com seconds
  if (typeof timestamp === 'object' && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }

  // Firestore Timestamp com _seconds
  if (typeof timestamp === 'object' && timestamp._seconds) {
    return new Date(timestamp._seconds * 1000);
  }

  // Método toDate do Firebase
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }

  // String ISO
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }

  // Unix timestamp em milissegundos
  if (typeof timestamp === 'number') {
    return new Date(timestamp);
  }

  // Já é um objeto Date
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Fallback
  return new Date();
};

/**
 * Calcula o tempo relativo de um timestamp
 * @param {*} timestamp - Timestamp em qualquer formato
 * @returns {string} - Tempo relativo formatado (ex: "5min atrás", "2h atrás")
 */
export const getRelativeTime = (timestamp) => {
  const date = parseTimestamp(timestamp);
  
  if (isNaN(date.getTime())) {
    return 'Data desconhecida';
  }

  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  // Menos de 1 minuto
  if (diffInMinutes < 1) return 'Agora mesmo';

  // Menos de 1 hora
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;

  // Menos de 24 horas
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;

  // Menos de 7 dias
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;

  // Mais de 7 dias - mostrar data
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: diffInDays > 365 ? '2-digit' : undefined
  });
};

/**
 * Formata timestamp para hora (HH:MM)
 * @param {*} timestamp - Timestamp em qualquer formato
 * @returns {string} - Hora formatada (ex: "14:30")
 */
export const formatTime = (timestamp) => {
  const date = parseTimestamp(timestamp);
  
  if (isNaN(date.getTime())) {
    return 'Agora';
  }

  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Formata timestamp para data completa
 * @param {*} timestamp - Timestamp em qualquer formato
 * @returns {string} - Data formatada (ex: "15/03/2024 às 14:30")
 */
export const formatFullDate = (timestamp) => {
  const date = parseTimestamp(timestamp);
  
  if (isNaN(date.getTime())) {
    return 'Data desconhecida';
  }

  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Verifica se um timestamp é de hoje
 * @param {*} timestamp - Timestamp em qualquer formato
 * @returns {boolean} - True se for de hoje
 */
export const isToday = (timestamp) => {
  const date = parseTimestamp(timestamp);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

/**
 * Verifica se um timestamp é de ontem
 * @param {*} timestamp - Timestamp em qualquer formato
 * @returns {boolean} - True se for de ontem
 */
export const isYesterday = (timestamp) => {
  const date = parseTimestamp(timestamp);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return date.getDate() === yesterday.getDate() &&
         date.getMonth() === yesterday.getMonth() &&
         date.getFullYear() === yesterday.getFullYear();
};

/**
 * Formata timestamp de forma inteligente (Hoje, Ontem, ou data)
 * @param {*} timestamp - Timestamp em qualquer formato
 * @returns {string} - Data formatada de forma inteligente
 */
export const formatSmartDate = (timestamp) => {
  if (isToday(timestamp)) {
    return `Hoje às ${formatTime(timestamp)}`;
  }
  
  if (isYesterday(timestamp)) {
    return `Ontem às ${formatTime(timestamp)}`;
  }
  
  return formatFullDate(timestamp);
};
