// Mock EmailService - Desabilitado temporariamente
class EmailService {
  async sendWelcomeEmail(email, nome) {
    console.log(`📧 Email de boas-vindas seria enviado para: ${email} (${nome})`);
    return { success: true };
  }

  async sendConfirmationCode(email, code) {
    console.log(`📧 Código ${code} seria enviado para: ${email}`);
    return { success: true };
  }

  async sendNotificationEmail(email, nome, titulo, mensagem, tipo = 'info') {
    console.log(`📧 Notificação seria enviada para: ${email} - ${titulo}`);
    return { success: true };
  }

  async sendPasswordResetEmail(email, nome, resetToken) {
    console.log(`📧 Reset de senha seria enviado para: ${email}`);
    return { success: true };
  }
}

module.exports = new EmailService();