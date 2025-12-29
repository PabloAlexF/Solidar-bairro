# Solidar Bairro

Plataforma de solidariedade comunitária que conecta pessoas que precisam de ajuda com aquelas que podem ajudar.

## Estrutura do Projeto

```
projeto-pablo/
├── backend/          # API Node.js + Firebase
├── frontend/         # React.js Application
└── README.md         # Este arquivo
```

## APIs Disponíveis

### 👥 Cidadãos
- **POST** `/api/cidadaos` - Cadastrar cidadão
- **GET** `/api/cidadaos` - Listar cidadãos
- **GET** `/api/cidadaos/:uid` - Buscar cidadão

### 🏪 Comércios
- **POST** `/api/comercios` - Cadastrar comércio
- **GET** `/api/comercios` - Listar comércios
- **GET** `/api/comercios/:uid` - Buscar comércio

### 🏛️ ONGs
- **POST** `/api/ongs` - Cadastrar ONG
- **GET** `/api/ongs` - Listar ONGs
- **GET** `/api/ongs/:uid` - Buscar ONG

### 👨👩👧👦 Famílias
- **POST** `/api/familias` - Cadastrar família
- **GET** `/api/familias` - Listar famílias
- **GET** `/api/familias/:id` - Buscar família

## Arquitetura

### Padrões de Design Implementados

#### Singleton Pattern
Implementado na conexão com Firebase para garantir uma única instância durante toda a aplicação:

```javascript
// backend/src/config/firebase.js
class FirebaseConnection {
  constructor() {
    if (FirebaseConnection.instance) {
      return FirebaseConnection.instance;
    }
    // Inicialização única
    FirebaseConnection.instance = this;
  }
}
```

**Vantagens:**
- ✅ Economia de recursos
- ✅ Controle de acesso centralizado
- ✅ Evita múltiplas conexões desnecessárias
- ✅ Facilita manutenção

### Segurança
- Firebase configurado apenas no backend
- Credenciais em variáveis de ambiente
- Frontend comunica via API REST

## Como executar

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Testar APIs
```bash
cd backend
node test-all-apis.js
```

## 📚 Documentação

- [Documentação Geral da API](./backend/docs/README.md)
- [API Cidadão](./backend/docs/api-cidadao.md)
- [API Comércio](./backend/docs/api-comercio.md)
- [API ONG](./backend/docs/api-ong.md)
- [API Família](./backend/docs/api-familia.md)

## Tecnologias

- **Backend**: Node.js, Express, Firebase Admin SDK
- **Frontend**: React.js
- **Banco de dados**: Firebase Firestore
- **Autenticação**: Firebase Auth