# API Solidar Bairro - Documentação Geral

## Visão Geral

A API do Solidar Bairro é uma plataforma de solidariedade comunitária que conecta pessoas que precisam de ajuda com aquelas que podem ajudar.

## Base URL
```
http://localhost:3001/api
```

## Estrutura de Resposta Padrão

### Sucesso
```json
{
  "success": true,
  "data": { ... }
}
```

### Erro
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

## Endpoints Disponíveis

### 👥 Cidadãos
- `POST /api/cidadaos` - Cadastrar cidadão
- `GET /api/cidadaos` - Listar cidadãos
- `GET /api/cidadaos/:uid` - Buscar cidadão por ID

### 🏪 Comércios
- `POST /api/comercios` - Cadastrar comércio
- `GET /api/comercios` - Listar comércios
- `GET /api/comercios/:uid` - Buscar comércio por ID

### 🏛️ ONGs
- `POST /api/ongs` - Cadastrar ONG
- `GET /api/ongs` - Listar ONGs
- `GET /api/ongs/:uid` - Buscar ONG por ID

### 👨‍👩‍👧‍👦 Famílias
- `POST /api/familias` - Cadastrar família
- `GET /api/familias` - Listar famílias
- `GET /api/familias/:id` - Buscar família por ID

### 🔍 Health Check
- `GET /health` - Verificar status da API

## Autenticação

### Cidadãos, Comércios e ONGs
- Utilizam Firebase Authentication
- Recebem `uid` único após cadastro
- Senhas são gerenciadas pelo Firebase

### Famílias
- Não requerem autenticação
- Armazenadas diretamente no Firestore
- Recebem `id` de documento único

## Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro interno |

## Estrutura no Firebase

```
Firestore Collections:
├── cidadaos/{uid}
├── comercios/{uid}
├── ongs/{uid}
└── familias/{id}

Firebase Authentication:
├── Cidadãos (email/password)
├── Comércios (email/password)
└── ONGs (email/password)
```

## Validações Comuns

### Campos Obrigatórios
- Nome/Nome da entidade
- Email (exceto famílias)
- Telefone
- Endereço/Localização

### Formatos
- Email: formato válido
- Telefone: (XX) XXXXX-XXXX
- CNPJ: XX.XXX.XXX/XXXX-XX
- CPF: XXX.XXX.XXX-XX

## Exemplos de Teste

### Testar todas as APIs
```bash
cd backend
node test-all-apis.js
```

### Testar API específica
```bash
# Cidadão
curl -X POST http://localhost:3001/api/cidadaos \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","telefone":"(31)99999-9999","password":"123456","cep":"33400-000","rua":"Rua A","numero":"123","bairro":"Centro","cidade":"Lagoa Santa","estado":"MG"}'

# Comércio
curl -X POST http://localhost:3001/api/comercios \
  -H "Content-Type: application/json" \
  -d '{"nomeEstabelecimento":"Padaria","cnpj":"12.345.678/0001-90","razaoSocial":"Padaria Ltda","tipoComercio":"Alimentação","descricaoAtividade":"Padaria","responsavelNome":"João","responsavelCpf":"123.456.789-00","telefone":"(31)3333-3333","senha":"123456","endereco":"Av. Principal","bairro":"Centro","cidade":"Lagoa Santa"}'

# ONG
curl -X POST http://localhost:3001/api/ongs \
  -H "Content-Type: application/json" \
  -d '{"nomeEntidade":"Instituto","cnpj":"98.765.432/0001-10","razaoSocial":"Instituto Ltda","areaTrabalho":"Social","descricaoAtuacao":"Apoio social","responsavelNome":"Maria","responsavelCpf":"987.654.321-00","telefone":"(31)2222-2222","email":"instituto@email.com","senha":"123456","endereco":"Rua B","bairro":"Centro","cidade":"Lagoa Santa","cep":"33400-100"}'

# Família
curl -X POST http://localhost:3001/api/familias \
  -H "Content-Type: application/json" \
  -d '{"nome":"Família Silva","endereco":"Rua C, 123","telefone":"(31)8888-8888","email":"familia@email.com","necessidades":["alimentação"]}'
```

## Tecnologias Utilizadas

- **Backend**: Node.js + Express
- **Banco de Dados**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Padrão**: Singleton para conexão Firebase

## Como Executar

```bash
# Instalar dependências
cd backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com credenciais do Firebase

# Iniciar servidor
npm start
# ou para desenvolvimento
npm run dev
```

## Arquivos de Documentação

- [API Cidadão](./api-cidadao.md)
- [API Comércio](./api-comercio.md)
- [API ONG](./api-ong.md)
- [API Família](./api-familia.md)