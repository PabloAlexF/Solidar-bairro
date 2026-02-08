# API - Cadastro de Família

## Endpoint: POST /api/familias

Cadastra uma nova família na plataforma Solidar Bairro.

### Headers
```
Content-Type: application/json
```

## Endpoints Disponíveis

### POST /api/familias
Cadastrar nova família

### GET /api/familias
Listar todas as famílias

### GET /api/familias/:id
Buscar família por ID

### Body (JSON)

#### Campos Obrigatórios
- `nome` (string): Nome da família
- `endereco` (string): Endereço completo
- `telefone` (string): Telefone de contato
- `email` (string): Email de contato

#### Campos Opcionais
- `membros` (array): Lista de membros da família
  - `nome` (string): Nome do membro
  - `idade` (number): Idade do membro
  - `parentesco` (string): Grau de parentesco
- `necessidades` (array): Lista de necessidades da família
- `status` (string): Status da família (padrão: "ativa")

### Exemplo de Requisição

```json
{
  "nome": "Família Silva",
  "endereco": "Rua das Flores, 123 - Centro",
  "telefone": "(31) 99999-9999",
  "email": "familia.silva@email.com",
  "membros": [
    {
      "nome": "João Silva",
      "idade": 45,
      "parentesco": "pai"
    },
    {
      "nome": "Maria Silva",
      "idade": 42,
      "parentesco": "mãe"
    },
    {
      "nome": "Pedro Silva",
      "idade": 15,
      "parentesco": "filho"
    }
  ],
  "necessidades": [
    "alimentação",
    "medicamentos",
    "roupas"
  ]
}
```

### Respostas

#### Sucesso (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "documento-id-gerado",
    "nome": "Família Silva",
    "endereco": "Rua das Flores, 123 - Centro",
    "telefone": "(31) 99999-9999",
    "email": "familia.silva@email.com",
    "membros": [
      {
        "nome": "João Silva",
        "idade": 45,
        "parentesco": "pai"
      },
      {
        "nome": "Maria Silva",
        "idade": 42,
        "parentesco": "mãe"
      }
    ],
    "necessidades": [
      "alimentação",
      "medicamentos"
    ],
    "status": "ativa",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Erro - Dados inválidos (400 Bad Request)
```json
{
  "success": false,
  "error": "Dados inválidos: Nome é obrigatório, Endereço é obrigatório"
}
```

#### Sucesso - Listar famílias (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": "documento-id-1",
      "nome": "Família Silva",
      "endereco": "Rua das Flores, 123",
      "telefone": "(31) 99999-9999",
      "status": "ativa"
    },
    {
      "id": "documento-id-2",
      "nome": "Família Santos",
      "endereco": "Av. Principal, 456",
      "telefone": "(31) 88888-8888",
      "status": "ativa"
    }
  ]
}
```

#### Erro - Família não encontrada (404 Not Found)
```json
{
  "success": false,
  "error": "Família não encontrada"
}
```

### Estrutura no Firebase

Os dados são salvos em:
```
familias/{id}
```

### Tipos de Necessidades Comuns
- Alimentação
- Medicamentos
- Roupas
- Material escolar
- Produtos de higiene
- Material de limpeza
- Móveis
- Eletrodomésticos

### Status da Família
- `ativa`: Família ativa no sistema
- `inativa`: Família temporariamente inativa
- `atendida`: Família já foi atendida

### Exemplo de Uso

#### cURL
```bash
curl -X POST http://localhost:3001/api/familias \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Família Santos",
    "endereco": "Rua da Esperança, 321",
    "telefone": "(31) 8888-8888",
    "email": "familia.santos@email.com",
    "membros": [
      {
        "nome": "Pedro Santos",
        "idade": 40,
        "parentesco": "pai"
      }
    ],
    "necessidades": ["alimentação", "roupas"]
  }'
```

#### JavaScript (Fetch)
```javascript
const response = await fetch('http://localhost:3001/api/familias', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: 'Família Santos',
    endereco: 'Rua da Esperança, 321',
    telefone: '(31) 8888-8888',
    email: 'familia.santos@email.com',
    membros: [
      { nome: 'Pedro Santos', idade: 40, parentesco: 'pai' }
    ],
    necessidades: ['alimentação', 'roupas']
  })
});

const data = await response.json();
```

### Observações
- Famílias não precisam de autenticação Firebase
- Dados são armazenados diretamente no Firestore
- Sistema permite múltiplas famílias com mesmo nome
- Validação básica de campos obrigatórios