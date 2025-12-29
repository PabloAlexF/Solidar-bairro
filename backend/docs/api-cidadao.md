# API - Cadastro de Cidadão

## Endpoint

**POST** `/api/cidadaos`

Cadastra um novo cidadão na plataforma Solidar Bairro.

## Estrutura da Requisição

### Headers
```
Content-Type: application/json
```

### Body (JSON)
```json
{
  "nome": "string",
  "email": "string",
  "telefone": "string",
  "password": "string",
  "cep": "string",
  "rua": "string",
  "numero": "string",
  "complemento": "string",
  "bairro": "string",
  "cidade": "string",
  "estado": "string"
}
```

### Campos Obrigatórios
- `nome`: Nome completo do cidadão
- `email`: Email válido (será usado para login)
- `telefone`: Telefone de contato
- `password`: Senha (mínimo 6 caracteres)
- `cep`: CEP do endereço
- `rua`: Nome da rua
- `numero`: Número da residência
- `bairro`: Bairro
- `cidade`: Cidade
- `estado`: Estado (sigla)

### Campos Opcionais
- `complemento`: Complemento do endereço (apartamento, bloco, etc.)

## Respostas

### Sucesso (201)
```json
{
  "message": "Cidadão cadastrado com sucesso",
  "data": {
    "uid": "firebase-uid-gerado",
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999",
    "endereco": {
      "cep": "01234-567",
      "rua": "Rua das Flores",
      "numero": "123",
      "complemento": "Apto 45",
      "bairro": "Centro",
      "cidade": "São Paulo",
      "estado": "SP"
    },
    "tipo": "cidadao",
    "ativo": true,
    "criadoEm": "2024-01-15T10:30:00.000Z"
  }
}
```

### Erro - Campos Obrigatórios (400)
```json
{
  "error": "Todos os campos obrigatórios devem ser preenchidos"
}
```

### Erro - Email já existe (400)
```json
{
  "error": "Erro ao cadastrar cidadão: The email address is already in use by another account."
}
```

## Exemplo de Uso

### cURL
```bash
curl -X POST http://localhost:3000/api/cidadaos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "telefone": "(11) 98765-4321",
    "password": "senha123",
    "cep": "04567-890",
    "rua": "Av. Paulista",
    "numero": "1000",
    "complemento": "Sala 101",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP"
  }'
```

### JavaScript (Fetch)
```javascript
const response = await fetch('/api/cidadaos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(11) 98765-4321',
    password: 'senha123',
    cep: '04567-890',
    rua: 'Av. Paulista',
    numero: '1000',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP'
  })
});

const data = await response.json();
```

## Estrutura no Firestore

Os dados são armazenados em:
```
usuarios/
└── cidadaos/
    └── cidadaos/ (subcoleção)
        └── {uid} (documento do cidadão)
```

## Validações

- Email deve ser único
- Senha deve ter pelo menos 6 caracteres
- Todos os campos obrigatórios devem estar presentes
- Email deve ter formato válido