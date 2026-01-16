# API do Painel Social

## Visão Geral
O Painel Social é uma ferramenta administrativa para gestão de famílias vulneráveis, pedidos de ajuda, comércios parceiros e ONGs atuantes na comunidade.

## Endpoints

### Dashboard
**GET** `/api/painel-social/dashboard/:bairro`

Retorna todos os dados consolidados do painel para um bairro específico.

**Parâmetros:**
- `bairro` (path) - Nome do bairro

**Resposta:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 5,
      "pessoas": 22,
      "criancas": 8,
      "idosos": 3,
      "altaVuln": 2,
      "pendentes": 1,
      "atendidos": 1
    },
    "familias": [...],
    "pedidos": [...],
    "comercios": [...],
    "ongs": [...]
  }
}
```

### Famílias

#### Listar todas as famílias
**GET** `/api/familias`

#### Listar famílias por bairro
**GET** `/api/familias/bairro/:bairro`

#### Estatísticas por bairro
**GET** `/api/familias/stats/:bairro`

#### Criar família
**POST** `/api/familias`

**Body:**
```json
{
  "nomeCompleto": "Família Silva",
  "vulnerability": "Alta",
  "composicao": {
    "totalMembros": 5,
    "criancas": 2,
    "idosos": 1
  },
  "rendaFamiliar": "Sem renda",
  "telefone": "(31) 99999-9999",
  "endereco": {
    "logradouro": "Rua das Flores",
    "numero": "123",
    "bairro": "São Benedito",
    "latitude": -19.768,
    "longitude": -43.85
  },
  "status": "ativo"
}
```

#### Atualizar família
**PUT** `/api/familias/:id`

#### Deletar família
**DELETE** `/api/familias/:id`

### Pedidos de Ajuda

**GET** `/api/painel-social/pedidos?bairro=:bairro`

Retorna pedidos de ajuda ativos no bairro.

### Comércios Parceiros

**GET** `/api/painel-social/comercios?bairro=:bairro`

Retorna comércios parceiros no bairro.

### ONGs Atuantes

**GET** `/api/painel-social/ongs?bairro=:bairro`

Retorna ONGs atuantes no bairro.

## Modelo de Dados

### Família
```typescript
{
  id: string;
  nomeCompleto: string;
  vulnerability: 'Baixa' | 'Média' | 'Alta';
  composicao: {
    totalMembros: number;
    criancas: number;
    idosos: number;
  };
  rendaFamiliar: string;
  telefone: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    latitude: number;
    longitude: number;
  };
  status: 'ativo' | 'pendente' | 'atendido';
  criadoEm: Date;
  atualizadoEm: Date;
}
```

## Autenticação

Todas as rotas do painel social requerem autenticação de administrador.

**Header:**
```
Authorization: Bearer <token>
```

## Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Sem permissão (não é admin)
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Exemplos de Uso

### Frontend (React)

```javascript
import ApiService from './services/apiService';

// Carregar dados do dashboard
const loadDashboard = async () => {
  try {
    const response = await ApiService.getPainelDashboard('São Benedito');
    if (response.success) {
      console.log(response.data);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Criar nova família
const createFamily = async () => {
  try {
    const response = await ApiService.createFamiliaPanel({
      nomeCompleto: 'Família Silva',
      vulnerability: 'Alta',
      composicao: {
        totalMembros: 5,
        criancas: 2,
        idosos: 1
      },
      rendaFamiliar: 'Sem renda',
      telefone: '(31) 99999-9999',
      endereco: {
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'São Benedito',
        latitude: -19.768,
        longitude: -43.85
      }
    });
    
    if (response.success) {
      console.log('Família criada:', response.data);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};
```

## Filtros e Busca

O painel social suporta filtros no frontend:
- Todos
- Alta Vulnerabilidade
- Com crianças
- Com idosos
- Pendentes

A busca funciona por nome da família ou endereço.

## Visualizações

### Lista
Exibe famílias em formato de tabela com:
- Avatar e nome
- Nível de vulnerabilidade
- Composição familiar
- Status
- Ações (editar/excluir)

### Mapa
Exibe marcadores geográficos com camadas:
- Famílias
- Pedidos de ajuda
- Comércios parceiros
- ONGs
- Pontos de coleta
- Zonas de risco

## Exportação

O painel permite exportar dados em formato CSV com todas as informações das famílias filtradas.
