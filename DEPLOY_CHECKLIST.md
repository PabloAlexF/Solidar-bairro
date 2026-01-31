# 📋 Checklist de Deploy - SolidarBrasil

## ✅ Preparação Concluída

- [x] Arquivos duplicados removidos
- [x] Credenciais sensíveis removidas do .env
- [x] Configuração do Firebase atualizada
- [x] Scripts de deploy criados
- [x] .gitignore atualizado

## 🔧 Configurações Necessárias

### Backend (Firebase)
- [ ] Criar projeto no Firebase Console
- [ ] Configurar Authentication
- [ ] Configurar Firestore Database
- [ ] Gerar chave de serviço (Service Account Key)
- [ ] Configurar variáveis no arquivo .env:
  ```
  FIREBASE_PROJECT_ID=seu-project-id
  FIREBASE_PRIVATE_KEY=sua-private-key
  FIREBASE_CLIENT_EMAIL=seu-client-email
  ```

### Frontend (GitHub Pages)
- [ ] Criar repositório no GitHub
- [ ] Configurar GitHub Pages nas configurações do repo
- [ ] Atualizar URL da API no .env.local:
  ```
  REACT_APP_API_URL=https://seu-projeto.web.app/api
  ```

## 🚀 Comandos de Deploy

### Opção 1: Script Automatizado
```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Opção 2: Manual

#### Backend
```bash
cd backend
npm install
firebase login
firebase deploy
```

#### Frontend
```bash
cd Frontend
npm install
npm run build
npm run deploy
```

## 🔍 Verificações Pós-Deploy

- [ ] Backend funcionando: https://seu-projeto.web.app/api/health
- [ ] Frontend carregando: https://seu-usuario.github.io/solidar-bairro
- [ ] APIs respondendo corretamente
- [ ] Cadastros funcionando
- [ ] Chat funcionando
- [ ] Mapas carregando

## ⚠️ Problemas Conhecidos

1. **Credenciais Firebase**: Configure suas próprias credenciais
2. **CORS**: Verifique se o frontend URL está configurado no backend
3. **GitHub Pages**: Pode demorar alguns minutos para atualizar
4. **Firebase Functions**: Primeira execução pode ser lenta (cold start)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do Firebase Console
2. Verifique o console do navegador
3. Teste as APIs individualmente
4. Verifique as configurações de CORS

## 🎯 URLs Finais

- **Frontend**: https://seu-usuario.github.io/solidar-bairro
- **Backend**: https://seu-projeto.web.app
- **API**: https://seu-projeto.web.app/api
- **Documentação**: https://seu-projeto.web.app/docs