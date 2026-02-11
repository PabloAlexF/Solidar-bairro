# 🚀 GUIA RÁPIDO: App Android com Hostinger + Render

## ✅ VANTAGENS DA SUA INFRAESTRUTURA

- ✅ **Frontend na Hostinger** - HTTPS nativo
- ✅ **Backend no Render** - HTTPS nativo
- ✅ **Domínio próprio** - solidarbrasil.com.br
- ✅ **Build já feito** - Pronto para próximo passo!

---

## 🎯 CONFIGURAÇÃO RÁPIDA (15 MINUTOS)

### PASSO 1: Atualizar .env.production

Edite o arquivo `.env.production` que acabei de criar:

```env
REACT_APP_API_URL=https://SEU-BACKEND.onrender.com/api
REACT_APP_SOCKET_URL=https://SEU-BACKEND.onrender.com
REACT_APP_ENV=production
PUBLIC_URL=https://solidarbrasil.com.br
GENERATE_SOURCEMAP=false
```

**⚠️ IMPORTANTE:** Substitua `SEU-BACKEND.onrender.com` pela URL real do Render!

### PASSO 2: Remover CSP do index.html

Abra `frontend/public/index.html` e **DELETE** a linha 11:

```html
<!-- REMOVER ESTA LINHA COMPLETA -->
<meta http-equiv="Content-Security-Policy" content="..." />
```

**Por quê?** O CSP bloqueia o app Android. A segurança será gerenciada pelo Capacitor.

### PASSO 3: Instalar Capacitor

```bash
cd frontend

# Instalar dependências
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor/push-notifications @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard @capacitor/geolocation
```

### PASSO 4: Build de Produção

```bash
# Build com variáveis de produção
npm run build
```

### PASSO 5: Inicializar Capacitor

```bash
# Inicializar (responda as perguntas)
npx cap init

# Perguntas:
# App name: SolidarBrasil
# App ID: br.com.solidarbrasil.app
# Web directory: build
```

### PASSO 6: Adicionar Android

```bash
npx cap add android
npx cap sync
```

### PASSO 7: Configurar Backend para App

No seu backend (Render), adicione no CORS:

```javascript
// backend/src/middleware/cors.js ou similar
const allowedOrigins = [
  'http://localhost:3000',
  'https://solidarbrasil.com.br',
  'capacitor://localhost',  // ← ADICIONAR
  'ionic://localhost',      // ← ADICIONAR
  'https://localhost'       // ← ADICIONAR
];
```

### PASSO 8: Abrir no Android Studio

```bash
npx cap open android
```

**Aguarde 5-10 minutos** para o Android Studio indexar tudo.

---

## 📱 TESTAR NO CELULAR

### Opção A: USB (Recomendado)

1. Conectar celular via USB
2. Ativar "Depuração USB" nas configurações do desenvolvedor
3. No Android Studio: `Run > Run 'app'`

### Opção B: Emulador

1. No Android Studio: `Tools > Device Manager`
2. Criar dispositivo virtual (Pixel 6, Android 13)
3. Iniciar emulador
4. `Run > Run 'app'`

---

## 🔐 GERAR APK PARA TESTES

No Android Studio:

1. `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Aguardar build (5-10 min)
3. APK em: `android/app/build/outputs/apk/debug/app-debug.apk`
4. Enviar para amigos testarem via WhatsApp!

---

## 🏪 PUBLICAR NA PLAY STORE

### 1. Criar Keystore

```bash
cd android/app

keytool -genkey -v -keystore solidarbrasil.keystore -alias solidarbrasil -keyalg RSA -keysize 2048 -validity 10000

# Guardar senhas em local seguro!
```

### 2. Configurar Assinatura

Criar `android/key.properties`:

```properties
storePassword=SUA_SENHA_AQUI
keyPassword=SUA_SENHA_AQUI
keyAlias=solidarbrasil
storeFile=solidarbrasil.keystore
```

Editar `android/app/build.gradle` (adicionar antes de `android {`):

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Dentro de `android {`, adicionar:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### 3. Gerar AAB (Android App Bundle)

```bash
cd android
./gradlew bundleRelease

# Windows:
gradlew.bat bundleRelease

# AAB estará em:
# android/app/build/outputs/bundle/release/app-release.aab
```

### 4. Criar Conta Google Play Console

1. Acessar: https://play.google.com/console
2. Pagar R$ 130 (taxa única)
3. Criar novo app: **SolidarBrasil**

### 5. Upload do AAB

1. `Produção > Criar nova versão`
2. Upload: `app-release.aab`
3. Preencher:
   - **Nome:** SolidarBrasil
   - **Descrição curta:** Conecte-se com sua comunidade. Ajude e seja ajudado.
   - **Categoria:** Social
   - **Screenshots:** Tirar do app rodando
   - **Ícone:** 512x512 (usar logo512.png)

### 6. Política de Privacidade (OBRIGATÓRIO)

Criar página na Hostinger: `solidarbrasil.com.br/privacidade`

Modelo básico:

```
POLÍTICA DE PRIVACIDADE - SOLIDARBRASIL

1. COLETA DE DADOS
Coletamos: nome, email, telefone, localização (com permissão).

2. USO DOS DADOS
Para conectar usuários e facilitar doações na comunidade.

3. COMPARTILHAMENTO
Dados não são vendidos. Compartilhados apenas entre usuários da plataforma.

4. SEGURANÇA
Dados criptografados e armazenados no Firebase (Google).

5. DIREITOS
Você pode solicitar exclusão dos dados a qualquer momento.

Contato: contato@solidarbrasil.com.br
```

### 7. Enviar para Análise

- Tempo de análise: 1-7 dias
- Google pode pedir ajustes
- Após aprovação: APP PUBLICADO! 🎉

---

## 🔄 ATUALIZAÇÕES FUTURAS

```bash
# 1. Fazer alterações no código
# 2. Build
npm run build

# 3. Sync
npx cap sync

# 4. Incrementar versão em android/app/build.gradle
versionCode 2
versionName "1.0.1"

# 5. Gerar AAB
cd android
./gradlew bundleRelease

# 6. Upload na Play Store
```

---

## ⚡ COMANDOS ÚTEIS

```bash
# Build + Sync + Abrir Android Studio
npm run cap:android

# Apenas sync
npm run cap:sync

# Ver logs do app
npx cap run android --livereload
```

---

## 🐛 PROBLEMAS COMUNS

### App não conecta ao backend
**Solução:** Verificar CORS no backend (adicionar origins do Capacitor)

### Erro "net::ERR_CLEARTEXT_HTTP_TRAFFIC_NOT_PERMITTED"
**Solução:** Usar apenas HTTPS (você já tem!)

### Notificações não funcionam
**Solução:** Configurar Firebase Cloud Messaging no Android

### Build falha
**Solução:** Limpar cache
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

---

## 📊 CHECKLIST FINAL

Antes de publicar:

- [ ] .env.production configurado com URLs reais
- [ ] CSP removido do index.html
- [ ] Build de produção feito
- [ ] Testado em dispositivo real
- [ ] Backend aceita requisições do app (CORS)
- [ ] Ícones 512x512 criados
- [ ] Screenshots tirados
- [ ] Política de privacidade publicada
- [ ] Keystore criado e guardado
- [ ] AAB assinado gerado
- [ ] Conta Google Play criada (R$ 130)

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. ✅ Build feito
2. ⏭️ Remover CSP do index.html
3. ⏭️ Atualizar .env.production com URL do Render
4. ⏭️ Instalar Capacitor
5. ⏭️ npx cap init
6. ⏭️ npx cap add android
7. ⏭️ npx cap open android

**Tempo estimado:** 30 minutos até ter o app rodando no celular! 📱

---

## 💡 DICA PRO

Como você já tem domínio HTTPS, pode usar **TWA (Trusted Web Activity)** como alternativa GRATUITA ao Capacitor!

TWA = Wrapper do Chrome que abre seu site como app nativo.

**Vantagens:**
- ✅ Gratuito (não precisa pagar R$ 130)
- ✅ Mais simples
- ✅ Atualiza automaticamente (usa o site)

**Desvantagens:**
- ❌ Menos controle
- ❌ Sem acesso a APIs nativas avançadas
- ❌ Precisa configurar Digital Asset Links

Quer que eu crie o guia TWA também? 🤔

---

**Boa sorte! Seu app vai bombar! 🚀❤️**
