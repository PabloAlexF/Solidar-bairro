# 🌐 DEPLOY NA HOSTINGER - PASSO A PASSO

## 📋 O QUE VOCÊ PRECISA

- [ ] Conta na Hostinger (plano com Node.js)
- [ ] Domínio (pode usar subdomínio da Hostinger)
- [ ] Acesso SSH ou File Manager

---

## 🚀 OPÇÃO 1: DEPLOY MANUAL (MAIS FÁCIL)

### PASSO 1: Gerar Build

```cmd
cd Frontend
npm install
npm run build
```

Isso cria a pasta `Frontend/build` com arquivos estáticos.

### PASSO 2: Configurar .htaccess

Crie arquivo `Frontend/build/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Habilitar HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### PASSO 3: Upload via File Manager

1. Acesse **hPanel da Hostinger**
2. Vá em **Arquivos > Gerenciador de Arquivos**
3. Navegue até `public_html/`
4. **Delete tudo** que estiver lá (ou crie subpasta)
5. **Upload** todo conteúdo da pasta `Frontend/build`
6. Certifique-se que o `.htaccess` foi enviado

### PASSO 4: Configurar Domínio

**Se usar domínio próprio:**
- Já está pronto! Acesse: `https://seudominio.com`

**Se usar subdomínio Hostinger:**
1. hPanel > **Domínios**
2. Criar subdomínio: `solidarbrasil.seudominio.com`
3. Apontar para pasta onde fez upload

### PASSO 5: Ativar SSL (HTTPS)

1. hPanel > **SSL**
2. Instalar certificado gratuito
3. Aguardar 5-10 minutos

**Pronto! Frontend online! ✅**

---

## 🔧 OPÇÃO 2: DEPLOY COM SSH (AVANÇADO)

### PASSO 1: Conectar via SSH

```bash
ssh usuario@seudominio.com
```

### PASSO 2: Clonar repositório (se usar Git)

```bash
cd public_html
git clone https://github.com/seu-usuario/solidar-bairro.git
cd solidar-bairro/Frontend
```

### PASSO 3: Instalar dependências e buildar

```bash
npm install
npm run build
```

### PASSO 4: Mover arquivos

```bash
cp -r build/* ../../
cd ../../
rm -rf solidar-bairro
```

---

## 🔥 BACKEND NA HOSTINGER

### OPÇÃO A: Backend Separado (Node.js)

**Se seu plano Hostinger tem Node.js:**

1. **Upload do backend:**
   - Envie pasta `backend` via FTP/SSH
   - Coloque em `~/backend` (fora do public_html)

2. **Instalar dependências:**
   ```bash
   cd ~/backend
   npm install --production
   ```

3. **Configurar variáveis (.env):**
   ```bash
   nano .env
   ```
   Cole suas credenciais Firebase

4. **Iniciar com PM2:**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name solidar-backend
   pm2 save
   pm2 startup
   ```

5. **Configurar proxy reverso:**
   
   Edite `.htaccess` no `public_html`:
   ```apache
   # API Proxy
   RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
   ```

### OPÇÃO B: Backend no Firebase (RECOMENDADO)

**Mais fácil e confiável:**

```bash
cd backend
npm install -g firebase-tools
firebase login
firebase init functions
firebase deploy --only functions
```

Anote a URL: `https://us-central1-solidar-bairro.cloudfunctions.net/api`

---

## ⚙️ CONFIGURAR URLs NO FRONTEND

### Edite: `Frontend/.env.production`

**Se backend na Hostinger:**
```env
REACT_APP_API_URL=https://seudominio.com/api
PUBLIC_URL=https://seudominio.com
```

**Se backend no Firebase:**
```env
REACT_APP_API_URL=https://us-central1-solidar-bairro.cloudfunctions.net/api
PUBLIC_URL=https://seudominio.com
```

### Rebuild:
```cmd
cd Frontend
npm run build
```

### Re-upload para Hostinger

---

## 🧪 TESTAR

1. Acesse: `https://seudominio.com`
2. Teste login, cadastro, mapa
3. Abra DevTools (F12) > Console
4. Veja se há erros de API

---

## 📱 GERAR APK DEPOIS

Quando tudo estiver funcionando:

```cmd
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://seudominio.com/manifest.json
bubblewrap build
```

---

## 🆘 PROBLEMAS COMUNS

### "Arquivos com &#39; no nome"
**Problema:** Ao listar arquivos aparecem caracteres estranhos como `&#39;`

**Solução:**
```bash
# No terminal SSH da Hostinger, renomeie os arquivos:
cd ~/public_html
find . -name "*'*" -type f -exec bash -c 'mv "$0" "${0//\'/}"' {} \;

# OU simplesmente delete e faça upload novamente:
rm -rf src
# Depois faça upload limpo via File Manager
```

**Prevenção:** Sempre use File Manager ou FTP para upload, evite copiar/colar nomes com aspas.

### "Erro 500"
- Verifique `.htaccess`
- Veja logs: hPanel > Logs de Erro

### "API não responde"
- Verifique CORS no backend
- Teste API diretamente: `https://seudominio.com/api/health`

### "Página em branco"
- Verifique `PUBLIC_URL` no `.env.production`
- Limpe cache do navegador

### "SSL não funciona"
- Aguarde 10-15 minutos após ativar
- Force HTTPS no `.htaccess`

---

## 💡 RECOMENDAÇÃO

**MELHOR SETUP:**

✅ **Frontend:** Hostinger (você já tem)
✅ **Backend:** Firebase Functions (grátis, confiável)

**Por quê?**
- Firebase é especializado em backend
- Hostinger é melhor para arquivos estáticos
- Menos configuração
- Mais estável

---

## 📋 CHECKLIST HOSTINGER

- [ ] Build gerado (`npm run build`)
- [ ] `.htaccess` criado
- [ ] Arquivos enviados para `public_html`
- [ ] SSL ativado
- [ ] Domínio configurado
- [ ] `.env.production` com URLs corretas
- [ ] Testado no navegador
- [ ] APIs respondendo
- [ ] Pronto para gerar APK!

---

## 🔗 LINKS ÚTEIS

- **hPanel:** https://hpanel.hostinger.com
- **Tutoriais Hostinger:** https://www.hostinger.com.br/tutoriais
- **Suporte:** Chat ao vivo no hPanel

---

**Qualquer dúvida, me chame! 🚀**
