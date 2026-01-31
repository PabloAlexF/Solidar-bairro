const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendConfirmationCode(email, code) {
    try {
      const mailOptions = {
        from: `"Solidar Bairro" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Código de Confirmação - Solidar Bairro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Confirmação de Email</h2>
            <p>Olá!</p>
            <p>Você solicitou uma alteração de email no Solidar Bairro.</p>
            <p>Seu código de confirmação é:</p>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
            </div>
            <p>Este código é válido por 10 minutos.</p>
            <p>Se você não solicitou esta alteração, ignore este email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Solidar Bairro - Conectando pessoas que precisam de ajuda
            </p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email de confirmação');
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      // Check if SMTP configuration is available
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('SMTP configuration missing. SMTP_USER and SMTP_PASS must be set.');
        throw new Error('Configuração SMTP não encontrada');
      }

      const mailOptions = {
        from: `"Solidar Bairro" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Bem-vindo ao Solidar Bairro!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Bem-vindo, ${name}!</h2>
            <p>Seu cadastro foi confirmado com sucesso no Solidar Bairro.</p>
            <p>Agora você pode:</p>
            <ul>
              <li>Solicitar ajuda quando precisar</li>
              <li>Ofercer ajuda para quem precisa</li>
              <li>Participar da comunidade local</li>
            </ul>
            <p>Juntos fazemos a diferença!</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Solidar Bairro - Conectando pessoas que precisam de ajuda
            </p>
          </div>
        `
      };

      console.log('Tentando enviar email de boas-vindas para:', email);
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email de boas-vindas enviado com sucesso:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas:', error.message);
      throw new Error('Falha ao enviar email de boas-vindas');
    }
  }
}

module.exports = new EmailService();
