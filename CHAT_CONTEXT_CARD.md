# Card de Contexto Dinâmico - Chat

## Visão Geral

O card de contexto no chat agora suporta tanto **Pedidos de Ajuda** quanto **Achados e Perdidos**, adaptando-se dinamicamente ao tipo de conversa.

## Funcionalidades Implementadas

### 1. Detecção Automática do Contexto

O sistema detecta automaticamente o tipo de contexto baseado nos dados da conversa:

- **Pedidos**: Quando `conversation.pedidoId` existe
- **Achados e Perdidos**: Quando `conversation.achadoPerdidoId` existe

### 2. Card Adaptativo

#### Para Pedidos de Ajuda:
- **Título**: "Resumo da Colaboração"
- **Ícone**: 📦 (Package)
- **Status**: Barra de progresso (Pendente → Em curso → Concluído)
- **Ação**: Botão "Finalizar Ajuda"
- **Tags**: Urgência, Localização, Categoria

#### Para Achados e Perdidos:
- **Título**: "Item Perdido" ou "Item Encontrado"
- **Ícone**: 🔍 (Search) para perdidos, 📦 (Package) para encontrados
- **Status**: Ativo ou Resolvido
- **Ação**: Botão "Marcar como Resolvido"
- **Tags**: Tipo (Perdido/Encontrado), Status, Localização, Categoria

### 3. Estados Visuais

#### Tags de Tipo (Achados e Perdidos):
```css
.type-pill.perdido {
  background-color: #fef2f2;
  color: #ef4444;
}

.type-pill.encontrado {
  background-color: #f0fdf4;
  color: #16a34a;
}
```

#### Tags de Status:
```css
.status-pill.ativo {
  background-color: #fff7ed;
  color: #f97316;
}

.status-pill.resolvido {
  background-color: #f0fdf4;
  color: #16a34a;
}
```

### 4. Ações Contextuais

#### Pedidos:
- **Em andamento**: Botão "Finalizar Ajuda" (verde)
- **Outros estados**: Botão "Detalhes" (cinza)

#### Achados e Perdidos:
- **Ativo**: Botão "Marcar como Resolvido" (laranja)
- **Resolvido**: Botão desabilitado "✅ Resolvido" (verde)

## Estrutura de Dados

### Conversa com Pedido:
```javascript
{
  id: "conv_123",
  pedidoId: "pedido_456",
  participants: [...],
  // ... outros campos
}
```

### Conversa com Achado/Perdido:
```javascript
{
  id: "conv_123",
  achadoPerdidoId: "item_789",
  participants: [...],
  // ... outros campos
}
```

### Dados do Item (Achados e Perdidos):
```javascript
{
  id: "item_789",
  title: "Carteira Perdida",
  description: "Carteira de couro marrom",
  type: "perdido", // ou "encontrado"
  category: "Carteiras",
  location: "Centro da cidade",
  resolved: false,
  status: "ativo", // ou "resolvido"
  // ... outros campos
}
```

## API Endpoints Utilizados

### Buscar Item de Achados e Perdidos:
```javascript
GET /api/achados-perdidos/:id
```

### Marcar como Resolvido:
```javascript
PATCH /api/achados-perdidos/:id/resolve
```

## Como Testar

### 1. Criar Item de Achados e Perdidos:
```bash
cd backend
node test-achados-perdidos-chat.js
```

### 2. Acessar Chat:
1. Faça login na aplicação
2. Navegue para `/chat/:conversationId`
3. O card de contexto aparecerá automaticamente se houver dados

### 3. Testar Funcionalidades:
- **Visualizar informações**: Card mostra dados do item/pedido
- **Marcar como resolvido**: Clique no botão laranja (achados/perdidos)
- **Finalizar ajuda**: Clique no botão verde (pedidos)

## Exemplo de Uso

### Cenário 1: Item Perdido
```javascript
// Dados do item
{
  title: "Chaves do Carro",
  type: "perdido",
  category: "Chaves",
  location: "Shopping Center",
  resolved: false
}

// Card exibido:
// 🔍 Item Perdido
// Chaves do Carro
// 🔴 Perdido | 🔄 Ativo | 📍 Shopping Center
// [🔄 Marcar como Resolvido]
```

### Cenário 2: Item Encontrado
```javascript
// Dados do item
{
  title: "Celular Samsung",
  type: "encontrado",
  category: "Eletrônicos",
  location: "Praça Central",
  resolved: true
}

// Card exibido:
// 📦 Item Encontrado
// Celular Samsung
// 🟢 Encontrado | ✅ Resolvido | 📍 Praça Central
// [✅ Resolvido] (desabilitado)
```

## Melhorias Futuras

1. **Notificações em tempo real** quando status muda
2. **Histórico de ações** no card
3. **Integração com mapas** para localização
4. **Upload de fotos** do item
5. **Sistema de avaliações** pós-resolução

## Arquivos Modificados

- `frontend/src/pages/Chat/index.js` - Lógica principal
- `frontend/src/pages/Chat/styles.css` - Estilos do card
- `frontend/src/services/apiService.js` - Métodos da API

## Dependências

- React Hooks (useState, useEffect)
- Lucide React (ícones)
- API Service (comunicação com backend)