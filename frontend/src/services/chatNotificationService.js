// Serviço para gerenciar notificações de chat
class ChatNotificationService {
  static addNotification(title, message, type = 'chat') {
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    const notifications = JSON.parse(localStorage.getItem('solidar-notifications') || '[]');
    notifications.unshift(notification);
    
    // Manter apenas as últimas 50 notificações
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    localStorage.setItem('solidar-notifications', JSON.stringify(notifications));
    
    // Disparar evento para atualizar a UI
    window.dispatchEvent(new CustomEvent('notificationAdded'));
    
    return notification;
  }

  static addChatMessageNotification(senderName, message, conversaId) {
    return this.addNotification(
      `Nova mensagem de ${senderName}`,
      message.length > 50 ? message.substring(0, 50) + '...' : message,
      'chat'
    );
  }

  static addChatStartedNotification(userName, tipoAjuda) {
    return this.addNotification(
      'Nova conversa iniciada',
      `${userName} quer ajudar com: ${tipoAjuda}`,
      'chat'
    );
  }

  static addHelpCompletedNotification(userName, tipoAjuda) {
    return this.addNotification(
      'Ajuda finalizada!',
      `Sua ajuda com ${tipoAjuda} foi concluída com sucesso`,
      'success'
    );
  }
}

export default ChatNotificationService;