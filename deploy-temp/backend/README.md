# Solidar Bairro - Backend (Firebase)

## Tecnologias
- Node.js + Express
- Firebase Admin SDK
- Firebase Authentication
- Cloud Firestore

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── services/       # Lógica de negócio com Firebase
│   ├── routes/         # Definição das rotas
│   ├── middleware/     # Middlewares (auth, etc)
│   ├── config/         # Configuração Firebase
│   ├── utils/          # Utilitários
│   └── server.js       # Servidor principal
├── tests/              # Testes
├── firebase.json       # Configuração Firebase
└── package.json
```

## Configuração

1. **Instale as dependências:**
```bash
cd backend
npm install
```

2. **Configure o Firebase:**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Baixe o arquivo `serviceAccountKey.json`
   - Coloque na pasta `src/config/`

3. **Configure variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

## Execução

```bash
# Desenvolvimento local
npm run dev

# Emuladores Firebase
npm run serve

# Deploy para produção
npm run deploy
```

## Funcionalidades Implementadas

- ✅ Autenticação Firebase
- ✅ CRUD de usuários
- ✅ Middleware de autenticação
- ✅ Estrutura escalável