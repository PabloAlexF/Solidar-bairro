# 🚀 Deploy Backend no Render

## Passo 1: Repositório GitHub

Seu repositório já está no GitHub:
```
https://github.com/PabloAlexF/Solidar-bairro
```

O backend está em: `/backend`

## Passo 2: Criar Conta no Render

1. Acesse: https://render.com
2. Clique em "Get Started for Free"
3. Faça login com GitHub

## Passo 3: Criar Web Service

1. No dashboard, clique em "New +"
2. Selecione "Web Service"
3. **Conectar repositório público:**
   - Opção 1: Clique em "Connect account" e autorize o GitHub (recomendado)
   - Opção 2: Role até o final e clique em "Public Git repository"
     - Cole a URL: `https://github.com/PabloAlexF/Solidar-bairro`
4. Configure:
   - **Name**: solidar-bairro-backend
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Root Directory**: `backend` ⚠️ IMPORTANTE!
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

## Passo 4: Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=*

FIREBASE_PROJECT_ID=solidar-bairro-novo
FIREBASE_DATABASE_URL=https://solidar-bairro-novo-default-rtdb.firebaseio.com/
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCs8/rc4V9pfRH3
9+3SwGL7BK3BqaZPSlY2nMoq6gGFVlI3UmkO7YCCukygdtNC/TMOxLMTBAG34jTO
fb9fwy/FmEnRfLEidnR86pTxM7t+7ogkPk1t1inSZxYW2RJtLpffjAB7QgL5v8uD
51/Goc249713cz/4bkwYh4fNeAZ//QaVff8QOzTTvtbE9/5dM1DN8pL8yVV0Hls8
jZHZIV0IRuvGbO/mnWXpQBsFd2965w80WBEyqim9La/DVcZ1aq9P0G7w+bd/bAKT
QuZeA29lUxvsX1K2jBx0cet0hatLu1mdATZb8rj9goO1aK7nAL5kEQxbli8u8BTl
HMTZJ8/rAgMBAAECggEAQVXbt1RmPE30m0WsMHjgC26tiyLhAkQVRIU/dC25TFsb
LO3zZSHAceIZ72ZkEYLgJlyVP4I8efA4vabQREdShSUuAbbGnbu87rGZeXLvChjn
EjX8/xiv7N1ngVMYfGllExxq1CVQRXO4WIhv7HQUaKMiDn1ZtapJEd0lJrAIWJGo
loDNn6KpRjskEHOt5nrZCbI3t035e+q5ztzSW8vW7/iJML2R5XmWlqiz/khNUsXF
Md4qCxLBoxHu/9ng65Vn7+kavL2Wwvwq/qdB2pflN2VcgPZvjeehXxAU+asokEsV
a7O7SLBOVGCKS+J1P9ujZ2lqrmAq35dEUP8ye3RNCQKBgQDd4zxiN3XqfDf05x1c
9cXN+1S6cIetmrwgjb2PJfvQvmt4Xh5QRKtRwxdFHRa2ueZNbkEiXgdi23qxcOIc
U9RSt8sPQO7kk3qRwCtYxDbynVUQ8Qpz1a4KNbmP4GQHqa4UDlsBS15z76xQAEVc
E9L2GnCRcOHWZH/r6Y0lqN6fmQKBgQDHitcXPDXca6JtATcgQdaVdJrnrO4Kfyrm
sAv/XSOgoTz76X2w8myhnLaVgivVyzvU1wH9VJa7wdxVT+TTdjbT0xbrdDW9xmSf
HWJsCFQvZtgsLl3gePIOZCheX4NuIKwnRHyuR56ivY5UdhSHxOe8BgN04AOg5r+Y
YZQK4u6uIwKBgQCsNn6aODNTr996O5pFmRdR/HxRS59ydUMH/RqfrLpZ1EDzJhFe
+T0Cc2lvIdmMLpJ5jFYPR21yI6iBaXyEwedr3+xBRYNkcrZRwxWhioCfIs9wG7Si
HLk8gWApM95PODm8pTuqsIV5dA6H9P3gLh6xFepCZ5tQW6YRQq5jCULoGQKBgC5H
pVteO5/D1wgxH/f7TSmcwdC56vvEQs7+RcoUcA7xVpOWs/A2Sbux/Sbv6frMCDR1
KaD33X3umIuw3AGviUfXzZkOeuho+y1sQ0eLJvtXfwvANUW6x2lPEY3R2UnRihwR
ZlmFguV70WcFe/2BTb3uJx8UVcMbwZQ2DX/44iLBAoGBANLb1k8XhLTUX8OrbK0a
BPQBWxWXKOpDVUBT8tLO/LjdUQmHs2ZTpzAVzbs2kguvsZStVPayBnkAk5uMHxTk
STb5c5ZtOVxXwr+MWSGSA8e+uXHvFI/Gbcp+YnPuSPL4IZGxGb77sc75FP/04a1I
GtrhVGit581rcVFZ7Cd50aLY
-----END PRIVATE KEY-----

FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@solidar-bairro-novo.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY_ID=964b57d75116b164fde81fae35d083f6394f7ecf
FIREBASE_CLIENT_ID=100627875349151437566
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40solidar-bairro-novo.iam.gserviceaccount.com
```

**IMPORTANTE**: Cole a FIREBASE_PRIVATE_KEY em uma única linha ou use o formato com \n

## Passo 5: Deploy

1. Clique em "Create Web Service"
2. Aguarde o build e deploy (5-10 minutos)
3. Sua URL será: `https://solidar-bairro-backend.onrender.com`

## Passo 6: Testar

```bash
curl https://solidar-bairro-backend.onrender.com/health
```

## Passo 7: Atualizar Frontend

No frontend, crie o arquivo `.env.production`:
```
REACT_APP_API_URL=https://solidar-bairro-backend-q1y1.onrender.com/api
REACT_APP_ENV=production
```

Ou para desenvolvimento local:
```
REACT_APP_API_URL=https://solidar-bairro-backend-q1y1.onrender.com/api
```

## ⚠️ Observações

- **Plano Free**: O serviço "dorme" após 15 minutos de inatividade
- **Cold Start**: Primeira requisição pode demorar 30-60 segundos
- **Logs**: Acesse em "Logs" no dashboard do Render
- **Redeploy**: Push no GitHub faz deploy automático

## 🔧 Troubleshooting

Se der erro no build:
1. Verifique os logs no Render
2. Confirme que o package.json está correto
3. Verifique se todas as variáveis de ambiente foram adicionadas

Se der erro 503:
1. Aguarde o serviço "acordar" (cold start)
2. Verifique os logs de runtime
