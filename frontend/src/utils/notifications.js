// Sistema de notificações melhorado para SolidarBairro

class NotificationManager {
  constructor() {
    this.listeners = [];
    this.queue = [];
    this.isProcessing = false;
  }

  // Adicionar listener para eventos de notificação
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Emitir notificação para todos os listeners
  emit(notification) {
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Erro no listener de notificação:', error);
      }
    });
  }

  // Formatar mensagem da notificação
  formatMessage(message, maxLength = 100) {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return `${message.substring(0, maxLength - 3)}...`;
  }

  // Obter ícone baseado no tipo
  getTypeIcon(type) {
    const icons = {
      chat: '💬',
      help_request: '🆘',
      help_offer: '🤝',
      match: '✨',
      system: '📢',
      welcome: '🎉',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || '🔔';
  }

  // Obter cor baseada na prioridade
  getPriorityColor(priority) {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'normal': return '#2563eb';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  }

  // Criar notificação formatada
  createNotification({
    type = 'info',
    title,
    message,
    priority = 'normal',
    category,
    actionUrl,
    actionText,
    persistent = false,
    showBrowser = false,
    ...extra
  }) {
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: title || this.getDefaultTitle(type),
      message: this.formatMessage(message),
      priority,
      category,
      actionUrl,
      actionText,
      persistent,
      icon: this.getTypeIcon(type),
      color: this.getPriorityColor(priority),
      timestamp: new Date().toISOString(),
      read: false,
      ...extra
    };

    // Mostrar notificação do browser se solicitado
    if (showBrowser && title && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const browserNotif = new Notification(title, {
          body: message,
          icon: '/favicon.ico',
          tag: notification.id,
          requireInteraction: persistent
        });
        setTimeout(() => browserNotif.close(), 5000);
      } catch (error) {
        console.error('Erro ao mostrar notificação do browser:', error);
      }
    }

    return notification;
  }

  // Obter título padrão baseado no tipo
  getDefaultTitle(type) {
    const titles = {
      chat: 'Nova mensagem',
      help_request: 'Novo pedido de ajuda',
      help_offer: 'Nova oferta de ajuda',
      match: 'Nova conexão encontrada',
      system: 'Atualização do sistema',
      welcome: 'Bem-vindo!',
      success: 'Sucesso',
      error: 'Erro',
      warning: 'Atenção',
      info: 'Informação'
    };
    return titles[type] || 'Notificação';
  }

  // Salvar notificação no localStorage
  saveNotification(notification) {
    try {
      const existing = JSON.parse(localStorage.getItem('solidar-notifications') || '[]');
      
      // Evitar duplicatas
      const isDuplicate = existing.some(n => 
        n.title === notification.title && 
        n.message === notification.message &&
        Math.abs(new Date(n.timestamp) - new Date(notification.timestamp)) < 60000
      );
      
      if (!isDuplicate) {
        const updated = [notification, ...existing.slice(0, 49)];
        localStorage.setItem('solidar-notifications', JSON.stringify(updated));
        
        // Disparar evento para atualizar UI
        window.dispatchEvent(new CustomEvent('notificationAdded', { detail: notification }));
      }
    } catch (error) {
      console.error('Erro ao salvar notificação:', error);
    }
  }

  // Criar e salvar notificação
  create(title, message, type = 'info', options = {}) {
    const notification = this.createNotification({
      title,
      message,
      type,
      ...options
    });
    
    this.saveNotification(notification);
    this.emit(notification);
    
    return notification;
  }

  // Tipos específicos de notificação
  createHelpNotification(pedido) {
    return this.create(
      'Nova Ajuda Disponível! 🆘',
      `${pedido.userName} precisa de ${pedido.category} em ${pedido.neighborhood}`,
      'help_request',
      {
        priority: pedido.urgency === 'critico' ? 'urgent' : 'high',
        category: pedido.category,
        showBrowser: true
      }
    );
  }

  createChatNotification(conversa) {
    return this.create(
      'Nova Conversa! 💬',
      `${conversa.participantName} iniciou uma conversa sobre ${conversa.title}`,
      'chat',
      {
        priority: 'high',
        actionUrl: `/chat/${conversa.id}`,
        actionText: 'Ver conversa',
        showBrowser: true
      }
    );
  }

  createMessageNotification(mensagem) {
    return this.create(
      `Nova mensagem de ${mensagem.senderName} 💬`,
      this.formatMessage(mensagem.content, 60),
      'chat',
      {
        priority: 'high',
        actionUrl: `/chat/${mensagem.conversationId}`,
        actionText: 'Responder',
        showBrowser: true
      }
    );
  }

  createSystemNotification(title, message, priority = 'normal') {
    return this.create(title, message, 'system', { priority });
  }

  createSuccessNotification(title, message) {
    return this.create(title, message, 'success', { priority: 'normal' });
  }

  createErrorNotification(title, message) {
    return this.create(title, message, 'error', { priority: 'high', persistent: true });
  }

  createWarningNotification(title, message) {
    return this.create(title, message, 'warning', { priority: 'normal' });
  }

  createInfoNotification(title, message) {
    return this.create(title, message, 'info', { priority: 'low' });
  }

  // Obter todas as notificações
  getAll() {
    try {
      const notifications = JSON.parse(localStorage.getItem('solidar-notifications') || '[]');
      // Filtrar notificações antigas (mais de 7 dias)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return notifications.filter(n => new Date(n.timestamp) > weekAgo);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      return [];
    }
  }

  // Marcar como lida
  markAsRead(id) {
    try {
      const notifications = this.getAll();
      const updated = notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem('solidar-notifications', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('notificationUpdated'));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }

  // Marcar todas como lidas
  markAllAsRead() {
    try {
      const notifications = this.getAll();
      const updated = notifications.map(n => ({ ...n, read: true }));
      localStorage.setItem('solidar-notifications', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('notificationUpdated'));
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  }

  // Limpar todas
  clearAll() {
    try {
      localStorage.removeItem('solidar-notifications');
      window.dispatchEvent(new CustomEvent('notificationUpdated'));
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  }

  // Contar não lidas
  getUnreadCount() {
    return this.getAll().filter(n => !n.read).length;
  }

  // Obter por tipo
  getByType(type) {
    return this.getAll().filter(n => n.type === type);
  }

  // Obter por prioridade
  getByPriority(priority) {
    return this.getAll().filter(n => n.priority === priority);
  }

  // Limpar notificações antigas automaticamente
  cleanOldNotifications() {
    try {
      const notifications = this.getAll();
      localStorage.setItem('solidar-notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Erro ao limpar notificações antigas:', error);
    }
  }
}

// Instância singleton
const notificationManager = new NotificationManager();

// Limpar notificações antigas diariamente
setInterval(() => {
  notificationManager.cleanOldNotifications();
}, 24 * 60 * 60 * 1000);

// Exportar instância e métodos utilitários
export { notificationManager };

// Funções de conveniência
export const showNotification = (title, message, type, options) => 
  notificationManager.create(title, message, type, options);

export const showSuccess = (title, message, options) => 
  notificationManager.createSuccessNotification(title, message, options);

export const showError = (title, message, options) => 
  notificationManager.createErrorNotification(title, message, options);

export const showWarning = (title, message, options) => 
  notificationManager.createWarningNotification(title, message, options);

export const showInfo = (title, message, options) => 
  notificationManager.createInfoNotification(title, message, options);

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

export default notificationManager;