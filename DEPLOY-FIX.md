# 🚀 Correção do Deploy - SolidarBrasil

## ❌ Problema Identificado
O site em produção está tentando conectar ao `localhost:3001` ao invés da API de produção em `https://solidar-bairro-backend.onrender.com`.

## 🔍 Causa
O build atual não foi feito com as variáveis de ambiente de produção.

## ✅ Solução

### 1. Fazer novo build de produção

```bash
cd frontend
npm run build
```

Isso vai gerar uma nova pasta `build/` com as variáveis corretas do `.env.production`.

### 2. Fazer deploy do novo build

**Se estiver usando GitHub Pages:**
```bash
npm run deploy
```

**Se estiver usando outro serviço (Vercel, Netlify, etc):**
- Faça upload da pasta `build/` para o serviço
- Ou conecte o repositório e configure para fazer build automático

### 3. Verificar variáveis de ambiente

Certifique-se que o `.env.production` tem:
```env
REACT_APP_API_URL=https://solidar-bairro-backend.onrender.com/api
REACT_APP_SOCKET_URL=https://solidar-bairro-backend.onrender.com
REACT_APP_ENV=production
PUBLIC_URL=https://solidarbrasil.com.br
GENERATE_SOURCEMAP=false
```

### 4. Limpar cache do navegador

Após o deploy, limpe o cache:
- Chrome: Ctrl+Shift+Delete
- Ou acesse em modo anônimo para testar

## 🔒 Content Security Policy (CSP)

Se o erro persistir, adicione a URL da API no CSP do `index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="connect-src 'self' https://solidar-bairro-backend.onrender.com wss://solidar-bairro-backend.onrender.com https://*.onrender.com wss://*.onrender.com https://viacep.com.br https://nominatim.openstreetmap.org https://api.openstreetmap.org https://api.bigdatacloud.net">
```

## ✅ Teste

Após o deploy, teste:
1. Acesse https://solidarbrasil.com.br
2. Abra o Console (F12)
3. Tente fazer login
4. Verifique se a requisição vai para `https://solidar-bairro-backend.onrender.com/api/auth/login`

## 📝 Comandos Rápidos

```bash
# Build + Deploy (GitHub Pages)
cd frontend
npm run build
npm run deploy

# Ou se tiver script combinado
npm run deploy
```

## 🆘 Se ainda não funcionar

1. Verifique se o backend está online: https://solidar-bairro-backend.onrender.com/api/health
2. Verifique os logs do serviço de hospedagem
3. Confirme que o domínio está apontando corretamente
4. Verifique se há cache de CDN (Cloudflare, etc)
