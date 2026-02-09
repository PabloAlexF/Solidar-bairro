# 🚀 GUIA DE DEPLOY - HOSTINGER

## Arquivos Prontos para Upload
Localização: `frontend/build/`

## Passo a Passo:

### 1. Acesse o Painel da Hostinger
- URL: https://hpanel.hostinger.com
- Faça login com suas credenciais

### 2. Abra o File Manager
- No painel, clique em "File Manager" (Gerenciador de Arquivos)
- Ou acesse via FTP usando FileZilla

### 3. Navegue até a pasta do site
- Geralmente é `public_html` ou `domains/seudominio.com/public_html`

### 4. Backup (IMPORTANTE!)
- Selecione todos os arquivos atuais
- Clique em "Compress" para criar um backup
- Baixe o arquivo .zip como segurança

### 5. Limpe a pasta
- Delete TODOS os arquivos antigos (exceto o backup)
- Mantenha apenas arquivos de configuração do servidor se houver

### 6. Faça Upload dos Novos Arquivos
Faça upload de TODOS os arquivos da pasta `frontend/build/`:
- ✅ index.html
- ✅ .htaccess (IMPORTANTE!)
- ✅ pasta static/ (completa)
- ✅ pasta sounds/
- ✅ manifest.json
- ✅ robots.txt
- ✅ favicon.ico
- ✅ todos os arquivos .png
- ✅ 404.html
- ✅ service-worker.js
- ✅ sw.js

### 7. Verifique as Permissões
- Arquivos: 644
- Pastas: 755

### 8. Teste o Site
- Acesse seu domínio
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Teste as funcionalidades

## 🔧 Configurações Adicionais

### Se o WebSocket não funcionar:
Adicione ao .htaccess (já incluído):
```apache
<IfModule mod_proxy.c>
  ProxyPass /socket.io/ wss://solidar-bairro-backend.onrender.com/socket.io/
  ProxyPassReverse /socket.io/ wss://solidar-bairro-backend.onrender.com/socket.io/
</IfModule>
```

### Variáveis de Ambiente
Certifique-se que o arquivo build foi gerado com:
- REACT_APP_API_URL=https://solidar-bairro-backend.onrender.com/api

## ✅ Checklist Pós-Deploy

- [ ] Site carrega corretamente
- [ ] Login funciona
- [ ] Chat abre sem erros
- [ ] WebSocket conecta (verifique console)
- [ ] Rotas funcionam (teste /quero-ajudar, /chat, etc)
- [ ] Imagens carregam
- [ ] CSS aplicado corretamente

## 🐛 Troubleshooting

### Erro 404 nas rotas:
- Verifique se o .htaccess foi enviado
- Verifique se mod_rewrite está ativo na Hostinger

### CSS não carrega:
- Limpe cache do navegador
- Verifique permissões da pasta static/

### WebSocket não conecta:
- Verifique console do navegador
- Confirme que CSP permite conexões WSS

## 📞 Suporte
Se tiver problemas, entre em contato com o suporte da Hostinger.
