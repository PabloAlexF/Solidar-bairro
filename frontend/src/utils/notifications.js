// Utilitário para gerenciar notificações
export const NotificationManager = {
  // Criar uma nova notificação
  create: (title, message, type = 'info') => {
    const notification = {
      id: Date.now() + Math.random(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Obter notificações existentes
    const existing = JSON.parse(localStorage.getItem('solidar-notifications') || '[]');
    
    // Adicionar nova notificação no início
    const updated = [notification, ...existing];
    
    // Manter apenas as últimas 50 notificações
    const limited = updated.slice(0, 50);
    
    // Salvar no localStorage
    localStorage.setItem('solidar-notifications', JSON.stringify(limited));
    
    // Disparar evento customizado para atualizar a UI
    window.dispatchEvent(new CustomEvent('notificationAdded', { detail: notification }));
    
    return notification;
  },

  // Criar notificação específica para nova ajuda
  createHelpNotification: (pedido) => {
    const title = 'Nova Ajuda Disponível!';
    const message = `${pedido.userName} precisa de ${pedido.category} em ${pedido.neighborhood}`;
    
    return NotificationManager.create(title, message, 'help');
  },

  // Criar notificação para nova conversa
  createChatNotification: (conversa) => {
    const title = 'Nova Conversa!';
    const message = `${conversa.participantName} iniciou uma conversa sobre ${conversa.title}`;
    
    return NotificationManager.create(title, message, 'chat');
  },

  // Criar notificação para nova mensagem
  createMessageNotification: (mensagem) => {
    const title = 'Nova Mensagem!';
    const message = `${mensagem.senderName}: ${mensagem.content.substring(0, 50)}...`;
    
    return NotificationManager.create(title, message, 'message');
  },

  // Obter todas as notificações
  getAll: () => {
    return JSON.parse(localStorage.getItem('solidar-notifications') || '[]');
  },

  // Marcar como lida
  markAsRead: (id) => {
    const notifications = NotificationManager.getAll();
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem('solidar-notifications', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('notificationUpdated'));
  },

  // Marcar todas como lidas
  markAllAsRead: () => {
    const notifications = NotificationManager.getAll();
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('solidar-notifications', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('notificationUpdated'));
  },

  // Limpar todas
  clearAll: () => {
    localStorage.removeItem('solidar-notifications');
    window.dispatchEvent(new CustomEvent('notificationUpdated'));
  },

  // Contar não lidas
  getUnreadCount: () => {
    const notifications = NotificationManager.getAll();
    return notifications.filter(n => !n.read).length;
  }
};