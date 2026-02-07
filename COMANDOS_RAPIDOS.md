# ⚡ COMANDOS RÁPIDOS - COPIE E COLE

## 🏗️ FASE 1: BUILD DO FRONTEND

### Windows (Recomendado - Use o script pronto)
```cmd
build-playstore.bat
```

### Manual
```cmd
cd Frontend
npm install
npm run build
```

---

## 🌐 FASE 2: HOSPEDAR ONLINE

### Opção A: Firebase Hosting (GRÁTIS)

#### Instalar Firebase CLI
```cmd
npm install -g firebase-tools
```

#### Login
```cmd
firebase login
```

#### Inicializar (Frontend)
```cmd
cd Frontend
firebase init hosting
```
**Respostas:**
- Use existing project? **YES**
- Select project: **solidar-bairro**
- Public directory? **build**
- Single-page app? **YES**
- Overwrite index.html? **NO**

#### Deploy Frontend
```cmd
firebase deploy --only hosting
```

#### Inicializar (Backend)
```cmd
cd ..\backend
firebase init functions
```

#### Deploy Backend
```cmd
firebase deploy --only functions
```

---

### Opção B: Vercel (GRÁTIS)

#### Instalar Vercel CLI
```cmd
npm install -g vercel
```

#### Deploy Frontend
```cmd
cd Frontend
vercel --prod
```

---

### Opção C: Netlify (GRÁTIS)

#### Instalar Netlify CLI
```cmd
npm install -g netlify-cli
```

#### Deploy
```cmd
cd Frontend
netlify deploy --prod --dir=build
```

---

## 📦 FASE 3: GERAR APK

### Instalar Bubblewrap
```cmd
npm install -g @bubblewrap/cli
```

### Verificar instalação
```cmd
bubblewrap --version
```

### Inicializar projeto TWA
```cmd
cd c:\Users\Administrator\Desktop\solidar-bairro
bubblewrap init --manifest https://SEU_SITE.com/manifest.json
```

**⚠️ SUBSTITUA `SEU_SITE.com` pela URL real do seu frontend!**

**Respostas sugeridas:**
```
? Domain being opened in the TWA: SEU_SITE.com
? Name of the application: SolidarBrasil
? Short name for the application: SolidarBrasil
? Application ID: com.solidarbrasil.app
? Display mode: standalone
? Orientation: portrait
? Theme color: #4CAF50
? Background color: #ffffff
? Icon URL: https://SEU_SITE.com/logo512.png
? Maskable icon URL: https://SEU_SITE.com/logo512.png
? Splash screen color: #ffffff
? Key path: [ENTER para criar automaticamente]
? Key password: [CRIE UMA SENHA FORTE]
? Key alias: android
```

### Gerar APK
```cmd
bubblewrap build
```

### Localizar APK gerado
```cmd
dir app-release-signed.apk
```

---

## 🧪 FASE 4: TESTAR APK

### Copiar APK para celular via ADB
```cmd
adb devices
adb install app-release-signed.apk
```

### OU copie manualmente
1. Conecte celular no PC via USB
2. Copie `app-release-signed.apk` para pasta Downloads do celular
3. Abra o arquivo no celular e instale

---

## 🔧 COMANDOS ÚTEIS

### Verificar versões instaladas
```cmd
node --version
npm --version
firebase --version
bubblewrap --version
```

### Limpar cache do npm
```cmd
npm cache clean --force
```

### Reinstalar dependências
```cmd
cd Frontend
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Ver logs do Firebase
```cmd
firebase functions:log
```

### Testar localmente antes do deploy
```cmd
cd Frontend
npm start
```

### Build de teste (sem minificação)
```cmd
cd Frontend
set GENERATE_SOURCEMAP=true && npm run build
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: "bubblewrap not found"
```cmd
npm install -g @bubblewrap/cli
```

### Erro: "firebase not found"
```cmd
npm install -g firebase-tools
```

### Erro: "Permission denied"
```cmd
# Execute o CMD como Administrador
# Botão direito > Executar como administrador
```

### Erro: "Port 3000 already in use"
```cmd
# Mude a porta
set PORT=3001 && npm start
```

### Erro no build do React
```cmd
cd Frontend
npm install --legacy-peer-deps
npm run build
```

### Limpar build anterior
```cmd
cd Frontend
rmdir /s /q build
npm run build
```

---

## 📱 COMANDOS ADB (Android Debug Bridge)

### Instalar ADB
Baixe: https://developer.android.com/studio/releases/platform-tools

### Verificar dispositivos conectados
```cmd
adb devices
```

### Instalar APK
```cmd
adb install app-release-signed.apk
```

### Desinstalar app
```cmd
adb uninstall com.solidarbrasil.app
```

### Ver logs do app
```cmd
adb logcat | findstr SolidarBrasil
```

### Tirar screenshot
```cmd
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

---

## 🔄 ATUALIZAR O APP (FUTURAS VERSÕES)

### 1. Atualizar código
```cmd
cd Frontend
# Faça suas alterações no código
```

### 2. Novo build
```cmd
npm run build
```

### 3. Deploy
```cmd
firebase deploy --only hosting
```

### 4. Gerar novo APK
```cmd
cd ..
bubblewrap update
bubblewrap build
```

### 5. Upload no Play Console
- Acesse Play Console
- Vá em "Produção" > "Criar nova versão"
- Faça upload do novo APK
- Preencha notas da versão
- Enviar para revisão

---

## 📊 MONITORAMENTO

### Ver analytics do Firebase
```cmd
firebase open analytics
```

### Ver console do Firebase
```cmd
firebase open console
```

### Ver logs em tempo real
```cmd
firebase functions:log --only hosting
```

---

## 🆘 COMANDOS DE EMERGÊNCIA

### Reverter deploy do Firebase
```cmd
firebase hosting:rollback
```

### Parar todas as functions
```cmd
firebase functions:delete --all
```

### Limpar tudo e recomeçar
```cmd
cd Frontend
rmdir /s /q node_modules build
del package-lock.json
npm install
npm run build
```

---

## 💡 DICAS

### Criar alias para comandos frequentes (Windows)
Crie um arquivo `aliases.bat`:
```cmd
@echo off
doskey build=cd Frontend && npm run build && cd ..
doskey deploy=firebase deploy --only hosting
doskey apk=bubblewrap build
```

Execute: `aliases.bat` antes de começar

### Variáveis de ambiente rápidas
```cmd
set REACT_APP_API_URL=https://sua-api.com/api
set PUBLIC_URL=https://seu-site.com
npm run build
```

---

## 📋 SEQUÊNCIA COMPLETA (COPIE TUDO)

```cmd
REM 1. Build do frontend
cd c:\Users\Administrator\Desktop\solidar-bairro\Frontend
npm install
npm run build

REM 2. Deploy no Firebase
firebase login
firebase init hosting
firebase deploy --only hosting

REM 3. Gerar APK
cd ..
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://SEU_SITE.com/manifest.json
bubblewrap build

REM 4. Pronto! APK gerado: app-release-signed.apk
```

---

## ✅ CHECKLIST DE COMANDOS

Execute na ordem:

- [ ] `node --version` (verificar Node.js)
- [ ] `cd Frontend`
- [ ] `npm install`
- [ ] `npm run build`
- [ ] `firebase login`
- [ ] `firebase deploy --only hosting`
- [ ] `cd ..`
- [ ] `npm install -g @bubblewrap/cli`
- [ ] `bubblewrap init --manifest URL`
- [ ] `bubblewrap build`
- [ ] `adb install app-release-signed.apk`

---

**Salve este arquivo e use como referência rápida! ⚡**

Qualquer erro, copie a mensagem e me envie que eu te ajudo!
