# API - Cadastro de Comércio Local

## Endpoint: POST /api/comercios

Cadastra um novo comércio local na plataforma Solidar Bairro.

### Headers
```
Content-Type: application/json
```

## Endpoints Disponíveis

### POST /api/comercios
Cadastrar novo comércio

### GET /api/comercios
Listar todos os comércios

### GET /api/comercios/:uid
Buscar comércio por ID

### Body (JSON)

#### Campos Obrigatórios
- `nomeEstabelecimento` (string): Nome do estabelecimento
- `cnpj` (string): CNPJ do estabelecimento
- `razaoSocial` (string): Razão social da empresa
- `tipoComercio` (string): Tipo de comércio (ex: "Mercado/Supermercado")
- `descricaoAtividade` (string): Descrição das atividades
- `responsavelNome` (string): Nome do responsável
- `responsavelCpf` (string): CPF do responsável
- `telefone` (string): Telefone comercial
- `endereco` (string): Endereço completo
- `bairro` (string): Bairro
- `cidade` (string): Cidade (deve ser "Lagoa Santa")
- `senha` (string): Senha de acesso

#### Campos Opcionais
- `nomeFantasia` (string): Nome fantasia
- `horarioFuncionamento` (string): Horário de funcionamento
- `email` (string): E-mail comercial
- `uf` (string): Estado (padrão: "MG")
- `cep` (string): CEP
- `aceitaMoedaSolidaria` (boolean): Aceita moeda solidária
- `ofereceProdutosSolidarios` (boolean): Oferece produtos solidários
- `participaAcoesSociais` (boolean): Participa de ações sociais

### Exemplo de Requisição

```json
{
  "nomeEstabelecimento": "Mercado do João",
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "João Silva Comércio LTDA",
  "nomeFantasia": "Mercado do João",
  "tipoComercio": "Mercado/Supermercado",
  "descricaoAtividade": "Venda de produtos alimentícios, bebidas e itens de primeira necessidade",
  "horarioFuncionamento": "Segunda a Sábado: 7h às 19h, Domingo: 7h às 12h",
  "responsavelNome": "João Silva",
  "responsavelCpf": "123.456.789-00",
  "telefone": "(31) 99999-1234",
  "email": "contato@mercadodojoao.com.br",
  "endereco": "Rua das Flores, 123",
  "bairro": "Centro",
  "cidade": "Lagoa Santa",
  "uf": "MG",
  "cep": "33400-000",
  "aceitaMoedaSolidaria": true,
  "ofereceProdutosSolidarios": true,
  "participaAcoesSociais": true,
  "senha": "123456789"
}
```

### Respostas

#### Sucesso (201 Created)
```json
{
  "success": true,
  "data": {
    "uid": "firebase-uid-gerado",
    "nomeEstabelecimento": "Mercado do João",
    "cnpj": "12.345.678/0001-90",
    "razaoSocial": "João Silva Comércio LTDA",
    "tipoComercio": "Mercado/Supermercado",
    "responsavel": {
      "nome": "João Silva",
      "cpf": "123.456.789-00"
    },
    "contato": {
      "telefone": "(31) 99999-1234",
      "email": "contato@mercadodojoao.com.br"
    },
    "endereco": {
      "endereco": "Rua das Flores, 123",
      "bairro": "Centro",
      "cidade": "Lagoa Santa",
      "uf": "MG"
    },
    "tipo": "comercio",
    "ativo": true,
    "verificado": false,
    "criadoEm": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Erro - Dados inválidos (400 Bad Request)
```json
{
  "success": false,
  "error": "Dados inválidos: Nome do estabelecimento é obrigatório, CNPJ é obrigatório"
}
```

### Estrutura no Firebase

Os dados são salvos em:
```
comercios/{uid}
```

### Tipos de Comércio Aceitos
- Mercado/Supermercado
- Padaria
- Farmácia
- Restaurante/Lanchonete
- Loja de Roupas
- Material de Construção
- Açougue
- Hortifruti
- Papelaria
- Outros

### Bairros Atendidos
- São Lucas
- Centro
- Vila Nova
- Jardim América
- Santa Rita

### Observações
- O campo `verificado` é definido como `false` por padrão
- Comércios precisam de verificação manual antes de ficarem ativos
- Se não fornecido email, será gerado um baseado no CNPJ
- A senha não é retornada na resposta por segurança