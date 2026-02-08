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

## Endpoints Disponíveis

### POST /api/cidadaos
Cadastrar novo cidadão

### GET /api/cidadaos
Listar todos os cidadãos

### GET /api/cidadaos/:uid
Buscar cidadão por ID

## Respostas

### Sucesso (201)
```json
{
  "success": true,
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

### Erro - Dados Inválidos (400)
```json
{
  "success": false,
  "error": "Dados inválidos: Nome é obrigatório, Email é obrigatório"
}
```

## Exemplo de Uso

### cURL
```bash
curl -X POST http://localhost:3001/api/cidadaos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "telefone": "(11) 98765-4321",
    "password": "senha123",
    "cep": "04567-890",
    "rua": "Av. Paulista",
    "numero": "1000",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP"
  }'
```

## Estrutura no Firestore

Os dados são armazenados em:
```
cidadaos/{uid}
```