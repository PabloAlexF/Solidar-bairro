# Scripts de Teste - Cadastros

Scripts para testar os cadastros de todas as categorias do SolidarBrasil.

## 📁 Scripts Disponíveis

### 1. `test-cadastro-completo.js`
Cadastra **1 registro de cada categoria**:
- ✅ Cidadão
- ✅ Comércio
- ✅ ONG
- ✅ Família
- ✅ Achados e Perdidos

### 2. `test-familia-desktop.js`
Testa especificamente o **formulário desktop de cadastro de família** com dados completos de todos os 6 steps:
- Step 1: Dados do Responsável
- Step 2: Documentos
- Step 3: Contato
- Step 4: Residência
- Step 5: Composição Familiar
- Step 6: Necessidades

## 🚀 Como Executar

### Pré-requisitos
1. Backend rodando na porta 3001
2. Node.js instalado
3. Estar na pasta `backend`

### Executar Teste Completo (Todas Categorias)
```bash
cd backend
node tests/test-cadastro-completo.js
```

### Executar Teste Desktop Família
```bash
cd backend
node tests/test-familia-desktop.js
```

## 📊 Saída Esperada

### Test Cadastro Completo
```
🚀 INICIANDO TESTE DE CADASTRO COMPLETO
=========================================

👤 === CADASTRANDO CIDADÃO ===
✅ Cidadão cadastrado com sucesso!
   ID: abc123
   Nome: Carlos Eduardo Silva
   Email: carlos.silva@email.com

🏪 === CADASTRANDO COMÉRCIO ===
✅ Comércio cadastrado com sucesso!
   ID: def456
   Nome: Mercadinho São José
   CNPJ: 12.345.678/0001-90

🏛️ === CADASTRANDO ONG ===
✅ ONG cadastrada com sucesso!
   ID: ghi789
   Nome: Instituto Esperança Solidária
   CNPJ: 98.765.432/0001-10

👨👩👧👦 === CADASTRANDO FAMÍLIA ===
✅ Família cadastrada com sucesso!
   ID: jkl012
   Responsável: Pedro Henrique Costa
   Membros: 5

🔍 === CADASTRANDO ACHADO/PERDIDO ===
✅ Item cadastrado com sucesso!
   ID: mno345
   Tipo: perdido
   Título: Carteira de Identidade Perdida

📊 === RESUMO DOS CADASTROS ===
👤 Cidadãos: 1 cadastrado(s)
🏪 Comércios: 1 cadastrado(s)
🏛️ ONGs: 1 cadastrada(s)
👨👩👧👦 Famílias: 1 cadastrada(s)
🔍 Achados/Perdidos: 1 cadastrado(s)

✅ TESTE CONCLUÍDO!
```

### Test Família Desktop
```
🖥️  TESTE DE CADASTRO - FAMÍLIA DESKTOP
==========================================

📋 Dados do Formulário:
------------------------
Step 1 - Responsável:
  Nome: Ana Paula Oliveira
  Data Nascimento: 1988-07-12
  Estado Civil: casado
  Profissão: Diarista

Step 2 - Documentos:
  CPF: 444.555.666-77
  RG: 23.456.789-1
  NIS: 98765432109
  Renda Familiar: ate-2-salarios

[... mais detalhes ...]

✅ CADASTRO REALIZADO COM SUCESSO!
✅ Família encontrada no banco de dados!
✅ TESTE CONCLUÍDO COM SUCESSO!
```

## 🔧 Personalização

Para modificar os dados de teste, edite os objetos no início de cada arquivo:

### test-cadastro-completo.js
```javascript
const dadosTeste = {
  cidadao: { ... },
  comercio: { ... },
  ong: { ... },
  familia: { ... }
};
```

### test-familia-desktop.js
```javascript
const dadosFormularioDesktop = {
  nomeCompleto: 'Seu Nome',
  // ... outros campos
};
```

## ⚠️ Observações

- Os scripts usam dados fictícios mas realistas
- CPFs e CNPJs são exemplos (não validados)
- Emails são fictícios
- CEP padrão: 33400-000 (Lagoa Santa/MG)
- Senhas padrão: "senha123"

## 🐛 Troubleshooting

### Erro: "Cannot connect to server"
- Verifique se o backend está rodando: `npm start` na pasta backend
- Confirme a porta: deve ser 3001

### Erro: "Email já cadastrado"
- Os scripts tentam cadastrar com emails fixos
- Limpe o banco ou altere os emails nos scripts

### Erro: "CPF inválido"
- Verifique o formato: XXX.XXX.XXX-XX
- Use CPFs válidos ou ajuste a validação

## 📝 Logs

Os scripts mostram:
- ✅ Sucesso em verde
- ❌ Erros em vermelho
- 📊 Resumos e estatísticas
- 🔍 Verificações de dados

## 🤝 Contribuição

Para adicionar novos testes:
1. Crie um novo arquivo em `backend/tests/`
2. Siga o padrão dos scripts existentes
3. Documente no README

---

**SolidarBrasil** - Scripts de Teste v1.0
