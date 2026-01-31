# 📧 Configuração do Gmail para Envio de Emails

## ⚠️ PROBLEMA IDENTIFICADO
O erro `535-5.7.8 Username and Password not accepted` indica que o Gmail não está aceitando as credenciais.

## 🔧 SOLUÇÕES

### Opção 1: App Password do Gmail (RECOMENDADO)

1. **Ativar 2FA na conta Google:**
   - Acesse: https://myaccount.google.com/security
   - Ative "Verificação em duas etapas"

2. **Gerar App Password:**
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "Mail" e "Windows Computer"
   - Copie a senha de 16 caracteres gerada

3. **Atualizar .env:**
   ```env
   SMTP_USER=renatobcdesign@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # App Password (16 caracteres)
   ```

### Opção 2: Usar outro provedor SMTP

#### Mailtrap (Desenvolvimento)
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=seu_usuario_mailtrap
SMTP_PASS=sua_senha_mailtrap
```

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=sua_api_key_sendgrid
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@seu_dominio.mailgun.org
SMTP_PASS=sua_senha_mailgun
```

## 🚀 TESTE RÁPIDO

Execute este comando para testar:
```bash
cd backend
node test-email.js
```

## 📝 PRÓXIMOS PASSOS

1. Configure App Password do Gmail OU
2. Use um provedor SMTP alternativo
3. Atualize o arquivo .env
4. Teste novamente

## 🔍 DEBUG

Se ainda não funcionar, verifique:
- Firewall/Antivírus bloqueando porta 587
- Proxy corporativo
- Configurações de rede

## ⚡ SOLUÇÃO TEMPORÁRIA

Para desenvolvimento, você pode usar um mock do email service que apenas loga no console.