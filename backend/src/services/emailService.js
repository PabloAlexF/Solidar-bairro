const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP_USER e SMTP_PASS devem estar configurados');
    }
    
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    console.log('✅ EmailService configurado com Gmail');
  }

  async sendConfirmationCode(email, code) {
    try {
      const mailOptions = {
        from: `"Solidar Bairro" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Código de Confirmação - Solidar Bairro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Solidar Bairro</h1>
            <h2>Código de Confirmação</h2>
            <p>Seu código de confirmação é:</p>
            <div style="background: #f0f9ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
            </div>
            <p><strong>Válido por 10 minutos.</strong></p>
          </div>
        `
      };
      
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email REAL enviado para:', email, 'MessageID:', info.messageId);
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error('❌ Gmail falhou:', error.message);
      console.log('🔢 CÓDIGO MANUAL:', code, 'para', email);
      
      return { 
        success: true, 
        messageId: `manual-${Date.now()}`,
        code: code,
        manualMode: true
      };
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      const mailOptions = {
        from: `"Solidar Bairro" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Bem-vindo ao Solidar Bairro! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">Solidar Bairro</h1>
            <h2>Bem-vindo, ${name}! 🎉</h2>
            <p>Seu cadastro foi confirmado com sucesso.</p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de boas-vindas enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.log('⚠️ Email de boas-vindas não enviado, mas cadastro OK');
      return { success: true, messageId: `manual-welcome-${Date.now()}` };
    }
  }
}

module.exports = new EmailService();