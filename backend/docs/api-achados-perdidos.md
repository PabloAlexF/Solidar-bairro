# API Achados e Perdidos

## Visão Geral
API para gerenciar itens perdidos e encontrados na plataforma Solidar Bairro.

## Base URL
```
http://localhost:3001/api/achados-perdidos
```

## Endpoints

### 1. Listar Itens
**GET** `/`

Lista todos os itens ativos com filtros opcionais.

**Query Parameters:**
- `type` (opcional): `lost` ou `found`
- `category` (opcional): Categoria do item
- `city` (opcional): Cidade para filtrar
- `search` (opcional): Termo de busca

**Exemplo:**
```bash
GET /api/achados-perdidos?type=lost&category=Eletrônicos&search=iphone
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "item123",
      "title": "iPhone 13 Pro",
      "description": "Perdido no shopping...",
      "category": "Eletrônicos",
      "type": "lost",
      "location": "Shopping Center",
      "date_occurrence": "2025-01-20",
      "contact_info": "(11) 99999-8888",
      "image_url": "https://...",
      "reward": "R$ 200,00",
      "tags": ["iphone", "apple"],
      "user_id": "user123",
      "city": "São Paulo",
      "state": "SP",
      "status": "active",
      "created_at": "2025-01-20T10:00:00Z"
    }
  ],
  "total": 1
}
```

### 2. Buscar Item por ID
**GET** `/:id`

Busca um item específico pelo ID.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "item123",
    "title": "iPhone 13 Pro",
    // ... outros campos
  }
}
```

### 3. Criar Item (Autenticado)
**POST** `/`

Cria um novo item perdido ou encontrado.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "iPhone 13 Pro Max",
  "description": "Perdido no shopping Eldorado...",
  "category": "Eletrônicos",
  "type": "lost",
  "location": "Shopping Eldorado",
  "date_occurrence": "2025-01-20",
  "contact_info": "(11) 99999-8888",
  "image_url": "https://...",
  "reward": "R$ 200,00",
  "tags": ["iphone", "apple"],
  "city": "São Paulo",
  "state": "SP",
  "neighborhood": "Pinheiros"
}
```

**Campos Obrigatórios:**
- `title`
- `description`
- `category`
- `type`
- `contact_info`

**Resposta:**
```json
{
  "success": true,
  "message": "Item criado com sucesso",
  "data": {
    "id": "item123",
    // ... dados do item criado
  }
}
```

### 4. Atualizar Item (Autenticado)
**PUT** `/:id`

Atualiza um item existente (apenas o dono pode editar).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:** (campos opcionais para atualizar)
```json
{
  "title": "Novo título",
  "description": "Nova descrição",
  "location": "Nova localização",
  "contact_info": "Novo contato",
  "reward": "Nova recompensa"
}
```

### 5. Deletar Item (Autenticado)
**DELETE** `/:id`

Remove um item (apenas o dono pode deletar).

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "success": true,
  "message": "Item deletado com sucesso"
}
```

### 6. Meus Itens (Autenticado)
**GET** `/user/my-items`

Lista todos os itens do usuário autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

### 7. Marcar como Resolvido (Autenticado)
**PATCH** `/:id/resolve`

Marca um item como resolvido (encontrado/devolvido).

**Headers:**
```
Authorization: Bearer <token>
```

## Categorias Válidas
- Eletrônicos
- Documentos
- Pets
- Chaves
- Vestuário
- Carteiras
- Bolsas/Mochilas
- Joias/Relógios
- Outros

## Tipos Válidos
- `lost`: Item perdido
- `found`: Item encontrado

## Status Válidos
- `active`: Item ativo
- `resolved`: Item resolvido
- `deleted`: Item deletado

## Códigos de Erro

### 400 - Bad Request
```json
{
  "success": false,
  "error": "Campos obrigatórios: title, description, category, type, contact_info"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "error": "Usuário não autenticado"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "error": "Não autorizado a editar este item"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": "Item não encontrado"
}
```

### 500 - Internal Server Error
```json
{
  "success": false,
  "error": "Erro interno do servidor"
}
```

## Exemplos de Uso

### Buscar todos os itens perdidos de eletrônicos
```bash
curl "http://localhost:3001/api/achados-perdidos?type=lost&category=Eletrônicos"
```

### Criar um novo item perdido
```bash
curl -X POST "http://localhost:3001/api/achados-perdidos" \
  -H "Authorization: Bearer <seu-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Carteira de couro",
    "description": "Perdida no centro da cidade",
    "category": "Carteiras",
    "type": "lost",
    "location": "Centro - Rua XV",
    "contact_info": "(11) 99999-8888"
  }'
```

### Buscar por termo
```bash
curl "http://localhost:3001/api/achados-perdidos?search=carteira"
```

## Integração Frontend

O frontend já está integrado com esta API através do `apiService.js`:

```javascript
// Buscar itens
const items = await apiService.getAchadosPerdidos({ type: 'lost' });

// Criar item
const newItem = await apiService.createAchadoPerdido(itemData);

// Buscar meus itens
const myItems = await apiService.getMeusAchadosPerdidos();
```