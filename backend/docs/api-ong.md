# API - Cadastro de Organização Social (ONG)

## Endpoint: POST /api/ongs

Cadastra uma nova organização social na plataforma Solidar Bairro.

### Headers
```
Content-Type: application/json
```

## Endpoints Disponíveis

### POST /api/ongs
Cadastrar nova ONG

### GET /api/ongs
Listar todas as ONGs

### GET /api/ongs/:uid
Buscar ONG por ID

### Body (JSON)

#### Campos Obrigatórios
- `nomeEntidade` (string): Nome completo da entidade
- `cnpj` (string): CNPJ da organização
- `razaoSocial` (string): Razão social
- `areaTrabalho` (string): Área de atuação
- `descricaoAtuacao` (string): Descrição das atividades
- `responsavelNome` (string): Nome do responsável legal
- `responsavelCpf` (string): CPF do responsável
- `telefone` (string): Telefone institucional
- `email` (string): E-mail institucional
- `endereco` (string): Endereço da sede
- `bairro` (string): Bairro
- `cidade` (string): Cidade (deve ser "Lagoa Santa")
- `cep` (string): CEP
- `senha` (string): Senha de acesso

#### Campos Opcionais
- `nomeFantasia` (string): Nome fantasia
- `estatutoSocial` (file): Arquivo do estatuto social
- `ataDiretoria` (file): Ata de nomeação da diretoria
- `certidoesNegativas` (file): Certidões negativas
- `aceitaTermos` (boolean): Aceita termos de uso
- `aceitaPrivacidade` (boolean): Aceita política de privacidade
- `aceitaPoliticaOng` (boolean): Aceita política de ONGs
- `declaracaoVeracidade` (boolean): Declara veracidade das informações

### Exemplo de Requisição

```json
{
  "nomeEntidade": "Instituto Solidariedade Lagoa Santa",
  "cnpj": "98.765.432/0001-10",
  "razaoSocial": "Instituto Solidariedade Lagoa Santa",
  "nomeFantasia": "Solidariedade LS",
  "areaTrabalho": "Assistência Social",
  "descricaoAtuacao": "Atendimento a famílias em situação de vulnerabilidade social, distribuição de alimentos e roupas, apoio educacional para crianças e adolescentes.",
  "responsavelNome": "Maria Silva Santos",
  "responsavelCpf": "987.654.321-00",
  "telefone": "(31) 99888-7777",
  "email": "contato@solidariedadels.org.br",
  "endereco": "Rua da Esperança, 456",
  "bairro": "Centro",
  "cidade": "Lagoa Santa",
  "cep": "33400-100",
  "senha": "ong123456",
  "aceitaTermos": true,
  "aceitaPrivacidade": true,
  "aceitaPoliticaOng": true,
  "declaracaoVeracidade": true
}
```

### Respostas

#### Sucesso (201 Created)
```json
{
  "success": true,
  "data": {
    "uid": "firebase-uid-gerado",
    "nomeEntidade": "Instituto Solidariedade Lagoa Santa",
    "cnpj": "98.765.432/0001-10",
    "razaoSocial": "Instituto Solidariedade Lagoa Santa",
    "areaTrabalho": "Assistência Social",
    "responsavel": {
      "nome": "Maria Silva Santos",
      "cpf": "987.654.321-00"
    },
    "contato": {
      "telefone": "(31) 99888-7777",
      "email": "contato@solidariedadels.org.br"
    },
    "endereco": {
      "endereco": "Rua da Esperança, 456",
      "bairro": "Centro",
      "cidade": "Lagoa Santa",
      "uf": "MG",
      "cep": "33400-100"
    },
    "tipo": "ong",
    "ativo": false,
    "verificado": false,
    "statusVerificacao": "aguardando",
    "criadoEm": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Erro - Dados inválidos (400 Bad Request)
```json
{
  "success": false,
  "error": "Dados inválidos: Nome da entidade é obrigatório, CNPJ é obrigatório"
}
```

### Estrutura no Firebase

Os dados são salvos em:
```
ongs/{uid}
```

### Áreas de Trabalho Aceitas
- Alimentação
- Educação
- Saúde
- Roupas e Calçados
- Moradia
- Assistência Social
- Meio Ambiente
- Cultura e Esporte
- Direitos Humanos
- Outros

### Status de Verificação

#### statusVerificacao
- `aguardando`: Cadastro realizado, aguardando análise
- `em_analise`: Documentos em análise pela equipe
- `aprovado`: ONG aprovada e ativa
- `rejeitado`: Cadastro rejeitado

#### statusDocumentos
- `pendente`: Documentos não enviados ou pendentes
- `aprovado`: Documentos aprovados
- `rejeitado`: Documentos rejeitados

### Processo de Verificação

1. **Cadastro** → `ativo: false`, `verificado: false`, `statusVerificacao: "aguardando"`
2. **Análise de Documentos** → `statusVerificacao: "em_analise"`
3. **Aprovação** → `ativo: true`, `verificado: true`, `statusVerificacao: "aprovado"`

### Observações
- ONGs ficam **inativas** até aprovação completa
- Verificação de documentos é **obrigatória**
- Processo pode levar até 48h
- E-mail de confirmação será enviado
- Documentos devem estar em formato PDF, DOC ou DOCX