# Solidar Bairro

Plataforma de solidariedade comunitária que conecta pessoas que precisam de ajuda com aquelas que podem ajudar.

## 📁 Estrutura do Projeto

```
solidar-bairro/
├── backend/                 # API Node.js + Firebase
│   ├── src/
│   │   ├── config/         # Configurações (Firebase, Database)
│   │   ├── controllers/    # Controladores da API
│   │   ├── middleware/     # Middlewares (Auth, CORS, etc.)
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Lógica de negócio
│   │   └── server.js       # Servidor principal
│   ├── tests/              # Testes da API
│   ├── docs/               # Documentação da API
│   ├── package.json
│   └── .env.example
├── frontend/               # Aplicação React.js
│   ├── public/             # Arquivos públicos
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   │   ├── layout/     # Componentes de layout
│   │   │   └── ui/         # Componentes de interface
│   │   ├── config/         # Configurações do frontend
│   │   ├── contexts/       # Contextos React
│   │   ├── hooks/          # Hooks customizados
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços (API, etc.)
│   │   ├── styles/         # Estilos CSS organizados
│   │   │   ├── components/ # Estilos de componentes
│   │   │   ├── pages/      # Estilos de páginas
│   │   │   ├── responsive/ # Estilos responsivos
│   │   │   ├── globals.css # Estilos globais
│   │   │   └── index.css   # Arquivo principal de estilos
│   │   ├── utils/          # Utilitários e helpers
│   │   ├── App.js          # Componente principal
│   │   └── index.js        # Ponto de entrada
│   ├── package.json
│   └── .env.example
└── README.md               # Este arquivo
```

## 🚀 Como executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Conta no Firebase (para backend)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
npm start
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure as variáveis de ambiente no .env.local
npm start
```

### Testar APIs
```bash
cd backend
node tests/test-all-apis.js
```

## 📚 APIs Disponíveis

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

## 🏗️ Arquitetura

### Padrões de Design Implementados

#### Singleton Pattern
Implementado na conexão com Firebase para garantir uma única instância:

```javascript
// backend/src/config/firebase.js
class FirebaseConnection {
  constructor() {
    if (FirebaseConnection.instance) {
      return FirebaseConnection.instance;
    }
    FirebaseConnection.instance = this;
  }
}
```

**Vantagens:**
- ✅ Economia de recursos
- ✅ Controle de acesso centralizado
- ✅ Evita múltiplas conexões desnecessárias
- ✅ Facilita manutenção

#### Service Layer Pattern
Camada de serviços para lógica de negócio:

```javascript
// frontend/src/services/apiService.js
class ApiService {
  async createCidadao(data) {
    // Validação e sanitização
    // Chamada para API
  }
}
```

#### Configuration Pattern
Configuração centralizada:

```javascript
// frontend/src/config/index.js
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL,
  TIMEOUT: 10000,
};
```

### Segurança
- 🔒 Firebase configurado apenas no backend
- 🔑 Credenciais em variáveis de ambiente
- 🌐 Frontend comunica via API REST
- 🛡️ Validação de dados no frontend e backend
- 🚫 Sanitização de inputs
- 📝 Headers de segurança configurados

### Performance
- ⚡ Lazy loading de componentes
- 🗜️ Compressão de assets
- 📱 Design responsivo mobile-first
- 🎨 CSS otimizado e organizado
- 💾 Cache de dados no localStorage

## 🛠️ Tecnologias

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth
- **Validation**: Custom validators
- **Security**: CORS, Helmet, Rate limiting

### Frontend
- **Framework**: React.js 19+
- **Routing**: React Router DOM 7+
- **Styling**: CSS3 + CSS Modules
- **Maps**: React Leaflet
- **HTTP Client**: Fetch API
- **State Management**: React Hooks + Context
- **Build Tool**: Create React App

### DevOps
- **Package Manager**: npm
- **Version Control**: Git
- **Deployment**: Firebase Hosting (backend), GitHub Pages (frontend)
- **Environment**: dotenv
- **Testing**: Jest (backend), React Testing Library (frontend)

## 📖 Documentação

- [Documentação Geral da API](./backend/docs/README.md)
- [API Cidadão](./backend/docs/api-cidadao.md)
- [API Comércio](./backend/docs/api-comercio.md)
- [API ONG](./backend/docs/api-ong.md)
- [API Família](./backend/docs/api-familia.md)

## 🔧 Configuração

### Variáveis de Ambiente - Backend
```env
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FRONTEND_URL=http://localhost:3000
```

### Variáveis de Ambiente - Frontend
```env
REACT_APP_API_URL=http://localhost:3001/api
PUBLIC_URL=/solidar-bairro
REACT_APP_ENV=development
```

## 🚀 Deploy

### Backend (Firebase Functions)
```bash
cd backend
npm run deploy
```

### Frontend (GitHub Pages)
```bash
cd frontend
npm run build
npm run deploy
```

## 🧪 Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe Solidar Bairro
- **Design**: UI/UX Team
- **Backend**: API Development Team
- **Frontend**: React Development Team

## 📞 Suporte

Para suporte, envie um email para suporte@solidarbairro.com ou abra uma issue no GitHub.

---

**Solidar Bairro** - Conectando comunidades, transformando vidas. 💚