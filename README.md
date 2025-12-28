# Solidar Bairro

Plataforma de solidariedade comunitária que conecta pessoas que precisam de ajuda com aquelas que podem ajudar.

## Estrutura do Projeto

```
projeto-pablo/
├── backend/          # API Node.js + Firebase
├── frontend/         # React.js Application
└── README.md         # Este arquivo
```

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

## Tecnologias

- **Backend**: Node.js, Express, Firebase Admin SDK
- **Frontend**: React.js
- **Banco de dados**: Firebase Firestore
- **Autenticação**: Firebase Auth