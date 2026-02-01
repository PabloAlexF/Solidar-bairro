# 🧪 Guia de Testes - SolidarBairro

## 🚀 Inicialização Rápida

### 1. Executar Sistema Completo
```bash
# Execute o script de inicialização (Windows)
init-test-system.bat

# Ou manualmente:
cd backend
npm start
# Em outro terminal:
cd frontend  
npm start
```

### 2. Criar Dados de Teste
```bash
cd backend
node scripts/create-complete-test-data.js
```

### 3. Testar Dashboard
```bash
cd backend
node scripts/test-dashboard.js
```

## 👥 Credenciais de Teste

### 👤 Cidadão
- **Email:** joao@teste.com
- **Senha:** 123456
- **Nome:** João Silva
- **CPF:** 123.456.789-01

### 👨👩👧👦 Família
- **Email:** maria@teste.com
- **Senha:** 123456
- **Responsável:** Maria Santos
- **CPF:** 987.654.321-09
- **Membros:** 4 pessoas

### 🏢 ONG
- **Email:** contato@solidariedadebh.org
- **Senha:** 123456
- **Nome:** Solidariedade BH
- **CNPJ:** 12.345.678/0001-90

## 🔧 Scripts Disponíveis

### Backend (`backend/scripts/`)
- `create-test-data.js` - Cria dados básicos no Firestore
- `create-complete-test-data.js` - Cria dados + testa APIs + login
- `test-dashboard.js` - Testa funcionalidades do dashboard

### Raiz do Projeto
- `init-test-system.bat` - Script de inicialização completa (Windows)

## 📊 Funcionalidades Testadas

### ✅ Sistema de Autenticação
- [x] Cadastro de usuários (Cidadão, Família, ONG)
- [x] Login com email/senha
- [x] Geração de tokens JWT
- [x] Validação de tokens

### ✅ APIs Testadas
- [x] POST /api/cidadaos - Cadastro de cidadão
- [x] POST /api/familias - Cadastro de família
- [x] POST /api/ongs - Cadastro de ONG
- [x] POST /api/auth/login - Login universal
- [x] GET /api/{tipo}/{uid} - Buscar dados do usuário

### 📱 Dashboard (Frontend)
- [x] Login responsivo
- [x] Redirecionamento por tipo de usuário
- [x] Carregamento de dados específicos
- [x] Interface personalizada por tipo

## 🌐 URLs de Teste

### Backend
- **API Base:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/health
- **Debug Routes:** http://localhost:3001/debug/routes

### Frontend
- **Aplicação:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Dashboard Cidadão:** http://localhost:3000/dashboard/cidadao
- **Dashboard Família:** http://localhost:3000/dashboard/familia
- **Dashboard ONG:** http://localhost:3000/dashboard/ong

## 🔍 Verificações de Teste

### 1. Backend Funcionando
```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"OK","cache":"Connected","timestamp":"..."}
```

### 2. Login Funcionando
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@teste.com","senha":"123456"}'
```

### 3. Frontend Carregando
- Acesse http://localhost:3000
- Deve carregar a página inicial
- Link de login deve estar visível

## 🐛 Solução de Problemas

### Backend não inicia
```bash
cd backend
npm install
npm start
```

### Frontend não carrega
```bash
cd frontend
npm install
npm start
```

### Dados não são criados
1. Verifique se o backend está rodando
2. Verifique as credenciais do Firebase no `.env`
3. Execute: `node scripts/create-complete-test-data.js`

### Login não funciona
1. Verifique se os dados foram criados
2. Teste com as credenciais exatas
3. Verifique o console do navegador para erros

## 📋 Checklist de Teste Completo

- [ ] Backend iniciado (http://localhost:3001/health)
- [ ] Frontend iniciado (http://localhost:3000)
- [ ] Dados de teste criados
- [ ] Login Cidadão funcionando
- [ ] Login Família funcionando  
- [ ] Login ONG funcionando
- [ ] Dashboard Cidadão carregando
- [ ] Dashboard Família carregando
- [ ] Dashboard ONG carregando
- [ ] Dados específicos sendo exibidos
- [ ] Navegação entre páginas funcionando

## 🎯 Próximos Testes

### Funcionalidades Avançadas
- [ ] Sistema de chat
- [ ] Achados e perdidos
- [ ] Pedidos de ajuda
- [ ] Notificações
- [ ] Painel social

### Testes de Integração
- [ ] Fluxo completo de cadastro
- [ ] Fluxo completo de pedido de ajuda
- [ ] Fluxo completo de chat
- [ ] Responsividade mobile

---

**Última atualização:** $(Get-Date -Format "dd/MM/yyyy HH:mm")