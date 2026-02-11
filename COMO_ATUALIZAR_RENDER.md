# 🔧 Como Adicionar Variável de Ambiente no Render

## 📋 PASSO A PASSO:

### 1️⃣ **Acessar o Dashboard do Render**
- Acesse: https://dashboard.render.com/
- Faça login com sua conta

### 2️⃣ **Selecionar seu Backend**
- Na lista de serviços, clique no seu backend: **solidar-bairro-backend**

### 3️⃣ **Ir para Environment**
- No menu lateral esquerdo, clique em **"Environment"**
- Ou clique na aba **"Environment"** no topo

### 4️⃣ **Adicionar Nova Variável**
- Clique no botão **"Add Environment Variable"**
- Ou role até o final e clique em **"+ Add"**

### 5️⃣ **Preencher os Campos**

**Key (Nome da variável):**
```
ALLOWED_ORIGINS
```

**Value (Valor da variável):**
```
http://localhost:3000,https://solidarbrasil.com.br,capacitor://localhost,ionic://localhost,https://localhost
```

### 6️⃣ **Salvar**
- Clique no botão **"Save Changes"** (canto superior direito)
- O Render vai **reiniciar automaticamente** o serviço (aguarde 1-2 minutos)

---

## ✅ **ALTERNATIVA: Atualizar via Código**

Se preferir, você pode atualizar o código do backend para usar a variável:

### Opção A: Já está usando FRONTEND_URL?

Edite o arquivo de CORS do backend (geralmente `backend/src/middleware/cors.js` ou `backend/src/config/cors.js`):

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://solidarbrasil.com.br',
  'capacitor://localhost',
  'ionic://localhost', 
  'https://localhost'
];
```

### Opção B: Criar variável ALLOWED_ORIGINS

```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'https://solidarbrasil.com.br',
      'capacitor://localhost',
      'ionic://localhost',
      'https://localhost'
    ];
```

Depois faça commit e push para o GitHub. O Render vai fazer deploy automático!

---

## 🔍 **VERIFICAR SE FUNCIONOU**

Após salvar e o serviço reiniciar:

1. Acesse os logs: **"Logs"** no menu lateral
2. Procure por mensagens de CORS
3. Deve aparecer algo como: `CORS enabled for origins: ...`

---

## ⚠️ **IMPORTANTE**

- **Não esqueça de salvar!** O botão fica no canto superior direito
- **Aguarde o restart** - O Render reinicia automaticamente (1-2 min)
- **Verifique os logs** - Para confirmar que não deu erro

---

## 🎯 **RESUMO RÁPIDO**

```
1. https://dashboard.render.com/
2. Clicar no backend
3. Environment
4. Add Environment Variable
5. Key: ALLOWED_ORIGINS
6. Value: http://localhost:3000,https://solidarbrasil.com.br,capacitor://localhost,ionic://localhost,https://localhost
7. Save Changes
8. Aguardar restart (1-2 min)
```

---

## 📸 **REFERÊNCIA VISUAL**

```
┌─────────────────────────────────────────┐
│  Render Dashboard                       │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ solidar-bairro-backend          │   │
│  │ ● Running                       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Menu Lateral:                          │
│  ├─ Overview                            │
│  ├─ Events                              │
│  ├─ Logs                                │
│  ├─ Shell                               │
│  ├─ ► Environment  ← CLICAR AQUI       │
│  ├─ Settings                            │
│  └─ Metrics                             │
│                                         │
│  Environment Variables:                 │
│  ┌─────────────────────────────────┐   │
│  │ Key              Value           │   │
│  ├─────────────────────────────────┤   │
│  │ PORT             3001            │   │
│  │ NODE_ENV         production      │   │
│  │ FRONTEND_URL     http://...      │   │
│  │ ...                              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ Add Environment Variable]           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Key: ALLOWED_ORIGINS            │   │
│  │ Value: http://localhost:3000... │   │
│  └─────────────────────────────────┘   │
│                                         │
│              [Save Changes] ← CLICAR   │
└─────────────────────────────────────────┘
```

---

## 🆘 **PROBLEMAS COMUNS**

### Erro: "Invalid environment variable"
**Solução:** Verifique se não tem espaços extras no valor

### Serviço não reinicia
**Solução:** Clique em "Manual Deploy" > "Deploy latest commit"

### CORS ainda bloqueando
**Solução:** Verifique se o código do backend está usando a variável corretamente

---

**Pronto! Agora seu backend vai aceitar requisições do app Android! 🚀**
