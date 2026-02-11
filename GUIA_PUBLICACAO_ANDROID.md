# 📱 Guia: Transformar SolidarBrasil em App Android

## 🎯 RESUMO EXECUTIVO

**Status Atual:** ✅ 70% pronto para app
**Tempo Estimado:** 2-4 horas
**Custo:** R$ 130 (taxa única Google Play)
**Método Recomendado:** Capacitor

---

## 📋 PRÉ-REQUISITOS

### Instalar no seu PC:
```bash
# 1. Node.js (já tem ✅)
# 2. Java JDK 17
# Baixar: https://adoptium.net/

# 3. Android Studio
# Baixar: https://developer.android.com/studio

# 4. Capacitor CLI
npm install -g @capacitor/cli @capacitor/core
```

---

## 🚀 PASSO A PASSO

### **ETAPA 1: Instalar Dependências do Capacitor**

```bash
cd frontend

# Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npm install @capacitor/push-notifications
npm install @capacitor/splash-screen
npm install @capacitor/status-bar
npm install @capacitor/keyboard
```

### **ETAPA 2: Corrigir Problemas Críticos**

#### 2.1 - Remover CSP do index.html
O CSP atual bloqueia o app. Remova a linha:
```html
<!-- REMOVER ESTA LINHA DO index.html -->
<meta http-equiv="Content-Security-Policy" content="..." />
```

#### 2.2 - Atualizar variáveis de ambiente
Criar `frontend/.env.production`:
```env
REACT_APP_API_URL=https://seu-backend.onrender.com/api
REACT_APP_ENV=production
PUBLIC_URL=
```

### **ETAPA 3: Build e Inicializar Capacitor**

```bash
# Build do React
npm run build

# Inicializar Capacitor (já criado o capacitor.config.json)
npx cap init

# Adicionar plataforma Android
npx cap add android

# Sincronizar arquivos
npx cap sync
```

### **ETAPA 4: Configurar Android Studio**

```bash
# Abrir projeto no Android Studio
npx cap open android
```

No Android Studio:
1. Aguardar indexação (5-10 min)
2. Ir em `File > Project Structure`
3. Verificar SDK: Android 13 (API 33) ou superior
4. Sync Gradle (botão elefante 🐘)

### **ETAPA 5: Criar Ícones Adaptativos**

Usar ferramenta online:
- https://icon.kitchen/
- Upload: `frontend/public/logoo.png`
- Baixar pacote Android
- Substituir em: `android/app/src/main/res/`

### **ETAPA 6: Configurar Permissões**

Editar `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### **ETAPA 7: Gerar APK de Teste**

No Android Studio:
1. `Build > Build Bundle(s) / APK(s) > Build APK(s)`
2. Aguardar build (5-10 min)
3. APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

### **ETAPA 8: Testar no Celular**

```bash
# Conectar celular via USB (ativar Depuração USB)
# Ou usar emulador do Android Studio

# Rodar app
npx cap run android
```

---

## 🔐 ETAPA 9: GERAR APK/AAB PARA PRODUÇÃO

### 9.1 - Criar Keystore (Chave de Assinatura)

```bash
cd android/app

# Gerar keystore (GUARDAR SENHAS!)
keytool -genkey -v -keystore solidarbrasil.keystore -alias solidarbrasil -keyalg RSA -keysize 2048 -validity 10000

# Responder perguntas:
# - Senha: [CRIAR SENHA FORTE]
# - Nome: SolidarBrasil
# - Organização: Sua Empresa
# - Cidade/Estado/País: Seus dados
```

### 9.2 - Configurar Gradle

Criar `android/key.properties`:
```properties
storePassword=SUA_SENHA_KEYSTORE
keyPassword=SUA_SENHA_KEY
keyAlias=solidarbrasil
storeFile=solidarbrasil.keystore
```

Editar `android/app/build.gradle`:
```gradle
// Adicionar no topo (após plugins)
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
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
}
```

### 9.3 - Gerar AAB (Android App Bundle)

```bash
cd android

# Gerar AAB (formato exigido pela Play Store)
./gradlew bundleRelease

# AAB estará em:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📤 ETAPA 10: PUBLICAR NA PLAY STORE

### 10.1 - Criar Conta de Desenvolvedor
1. Acessar: https://play.google.com/console
2. Pagar taxa: R$ 130 (única vez)
3. Preencher dados da conta

### 10.2 - Criar Novo App
1. `Criar app`
2. Nome: **SolidarBrasil**
3. Idioma: Português (Brasil)
4. Tipo: App
5. Categoria: Social

### 10.3 - Preencher Informações

**Descrição Curta (80 caracteres):**
```
Conecte-se com sua comunidade. Ajude e seja ajudado. Solidariedade local.
```

**Descrição Completa (4000 caracteres):**
```
🤝 SolidarBrasil - Transformando Comunidades

Conecte-se com vizinhos, comércios locais, ONGs e famílias. 
Uma plataforma que une quem precisa de ajuda com quem pode ajudar.

✨ RECURSOS PRINCIPAIS:

📍 Mapa de Solidariedade
- Veja pedidos de ajuda próximos a você
- Encontre itens perdidos e achados
- Localize comércios e ONGs parceiras

💬 Chat em Tempo Real
- Converse diretamente com quem precisa
- Coordene entregas e encontros
- Receba notificações instantâneas

🎯 Pedidos de Ajuda
- Publique necessidades (alimentos, roupas, etc)
- Ofereça ajuda à comunidade
- Acompanhe status das doações

🔍 Achados e Perdidos
- Registre itens perdidos
- Ajude a devolver objetos encontrados
- Notificações de correspondências

🏆 Sistema de Pontos
- Ganhe pontos por cada ajuda
- Ranking de solidariedade
- Reconhecimento da comunidade

🔒 SEGURANÇA E PRIVACIDADE:
- Dados criptografados
- Verificação de usuários
- Sistema de denúncias
- Moderação ativa

👥 PARA QUEM É:
- Cidadãos que querem ajudar
- Famílias em situação de vulnerabilidade
- Comércios locais engajados
- ONGs e instituições sociais

🌟 IMPACTO SOCIAL:
Cada ajuda fortalece sua comunidade. Juntos, criamos uma rede 
de solidariedade que transforma vidas e bairros.

📱 BAIXE AGORA E FAÇA PARTE!
```

### 10.4 - Assets Necessários

**Screenshots (mínimo 2, máximo 8):**
- Resolução: 1080x1920 (portrait)
- Tirar prints do app rodando

**Ícone do App:**
- 512x512 PNG
- Usar: `frontend/public/logo512.png`

**Banner (Feature Graphic):**
- 1024x500 PNG
- Criar no Canva ou Figma

**Vídeo (opcional):**
- YouTube link demonstrando o app

### 10.5 - Classificação de Conteúdo
1. Responder questionário
2. Categoria: Social/Comunicação
3. Público: Livre (com moderação)

### 10.6 - Upload do AAB
1. `Produção > Criar nova versão`
2. Upload: `app-release.aab`
3. Preencher notas da versão
4. Enviar para análise

### 10.7 - Aguardar Aprovação
- Tempo: 1-7 dias
- Google analisa conteúdo, segurança, políticas
- Pode pedir ajustes

---

## 🔄 ATUALIZAÇÕES FUTURAS

Sempre que atualizar o app:

```bash
# 1. Fazer alterações no código React
# 2. Build
npm run build

# 3. Sincronizar
npx cap sync

# 4. Incrementar versão em android/app/build.gradle
versionCode 2
versionName "1.0.1"

# 5. Gerar novo AAB
cd android
./gradlew bundleRelease

# 6. Upload na Play Store
```

---

## ⚠️ PROBLEMAS COMUNS

### Erro: "Cleartext HTTP traffic not permitted"
**Solução:** Usar apenas HTTPS no backend

### Erro: "SDK not found"
**Solução:** Configurar ANDROID_HOME no Windows:
```
ANDROID_HOME=C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk
```

### App não conecta ao backend
**Solução:** Verificar CORS no backend para aceitar app Android

### Notificações não funcionam
**Solução:** Configurar Firebase Cloud Messaging corretamente

---

## 📊 CHECKLIST FINAL

Antes de publicar, verificar:

- [ ] App roda sem erros
- [ ] Backend em produção (HTTPS)
- [ ] Ícones corretos (512x512)
- [ ] Screenshots tirados
- [ ] Descrições escritas
- [ ] Política de privacidade criada
- [ ] Termos de uso criados
- [ ] AAB assinado gerado
- [ ] Testado em dispositivo real
- [ ] Versão incrementada

---

## 🎓 RECURSOS ÚTEIS

- **Documentação Capacitor:** https://capacitorjs.com/docs
- **Play Console:** https://play.google.com/console
- **Icon Kitchen:** https://icon.kitchen/
- **Screenshot Frames:** https://screenshots.pro/

---

## 💡 DICAS PROFISSIONAIS

1. **Teste MUITO antes de publicar** - Use TestFlight/Internal Testing
2. **Crie política de privacidade** - Obrigatório pela Play Store
3. **Prepare respostas para reviews** - Usuários vão avaliar
4. **Configure Analytics** - Google Analytics ou Firebase
5. **Monitore crashes** - Firebase Crashlytics
6. **Versione corretamente** - Semantic Versioning (1.0.0)

---

## 🆘 SUPORTE

Se tiver dúvidas durante o processo:
1. Documentação oficial do Capacitor
2. Stack Overflow (tag: capacitor)
3. Discord do Capacitor
4. Fórum do Android Developers

---

**Boa sorte com a publicação! 🚀**

Seu app tem grande potencial de impacto social. 
A comunidade vai adorar! ❤️
