# Como Gerar APK/AAB para Google Play Store

## Passo 1: Instalar Dependências

Certifique-se de ter instalado:
- Node.js
- Android Studio
- Java JDK 11+

## Passo 2: Configurar Variáveis de Ambiente

Crie arquivo `.env.production` no frontend (se ainda não existe):

```env
REACT_APP_API_URL=https://solidar-bairro-backend.onrender.com/api
REACT_APP_ENV=production
PUBLIC_URL=.
```

## Passo 3: Build Web (para testar)

```bash
cd frontend
npm run build
```

---

## Para Android (APK/AAB)

### Opção 1: Usar Capacitor (Recomendado para React)

#### 1. Instalar Capacitor
```bash
cd frontend
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init
```

Quando perguntado:
- App name: `SolidarBairro`
- App ID: `com.solidarbrasil.solidarbairro`
- Web directory: `build`

#### 2. Adicionar plataforma Android
```bash
npm run build
npx cap add android
npx cap sync
```

#### 3. Abrir no Android Studio
```bash
npx cap open android
```

#### 4. Gerar Keystore (primeira vez)
No terminal:
```bash
keytool -genkey -v -keystore solidarbairro.keystore -alias solidarbairro -keyalg RSA -keysize 2048 -validity 10000
```

Preencha as informações solicitadas e GUARDE A SENHA!

#### 5. Configurar assinatura no Android Studio
1. Build > Generate Signed Bundle/APK
2. Escolha "Android App Bundle" (AAB)
3. Selecione o keystore criado
4. Insira as senhas
5. Escolha "release"
6. Clique em "Finish"

O arquivo AAB estará em: `android/app/release/app-release.aab`

---

### Opção 2: Usar Cordova

#### 1. Instalar Cordova
```bash
npm install -g cordova
cd frontend
cordova create solidarbairro com.solidarbrasil.solidarbairro SolidarBairro
cd solidarbairro
cordova platform add android
```

#### 2. Copiar build
```bash
# Volte para frontend e faça build
cd ..
npm run build

# Copie conteúdo de build/ para solidarbairro/www/
```

#### 3. Build release
```bash
cd solidarbairro
cordova build android --release
```

---

### Opção 3: PWA to APK (Mais Rápido para Teste)

Use serviços online:
1. **PWABuilder** (https://www.pwabuilder.com/)
   - Cole URL do seu site
   - Clique em "Build My PWA"
   - Escolha Android
   - Baixe o AAB

2. **Bubblewrap** (CLI do Google)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://seu-site.com/manifest.json
bubblewrap build
```

---

## Informações Importantes

### App ID (Package Name)
Use: `com.solidarbrasil.solidarbairro`

### Versão
- Version Name: `1.0.0`
- Version Code: `1`

### Permissões Necessárias (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

---

## Checklist Antes do Upload

- [ ] Build gerado com sucesso
- [ ] Arquivo AAB (não APK) para Play Store
- [ ] Assinado com keystore
- [ ] Testado em dispositivo real
- [ ] Versão de produção (não debug)
- [ ] Variáveis de ambiente corretas
- [ ] URLs apontando para produção

---

## Solução Rápida: PWA Builder (Recomendado para Iniciantes)

Se você já tem o site no ar no Hostinger:

1. Acesse: https://www.pwabuilder.com/
2. Cole a URL: `https://seu-dominio-hostinger.com`
3. Clique em "Start"
4. Clique em "Package for Stores"
5. Escolha "Android"
6. Configure:
   - Package ID: `com.solidarbrasil.solidarbairro`
   - App name: `SolidarBairro`
   - Version: `1.0.0`
7. Clique em "Generate"
8. Baixe o arquivo AAB

**Pronto! Você tem o AAB para fazer upload no Play Console.**

---

## Após Gerar o AAB

1. Volte ao Play Console
2. Arraste o arquivo AAB para a área de upload
3. Preencha:
   - Nome da versão: `1.0.0 (Build 1)`
   - Notas da versão: (use o texto fornecido)
4. Clique em "Salvar"
5. Clique em "Revisar versão"
6. Clique em "Iniciar implantação para teste interno"

---

## Troubleshooting

### Erro: "App não assinado"
- Certifique-se de usar keystore para assinar
- Use build release, não debug

### Erro: "Package name já existe"
- Mude o package name para algo único
- Ex: `com.solidarbrasil.solidarbairro.app`

### Erro: "Versão já existe"
- Incremente o version code
- Ex: de 1 para 2

### App não abre após instalação
- Verifique se URLs estão corretas
- Teste em modo debug primeiro
- Verifique logs no Android Studio

---

## Próximos Passos

Depois de fazer upload:
1. ✅ Versão de teste interno criada
2. 📧 Adicionar lista de testadores
3. 📱 Enviar link de teste
4. ⏰ Aguardar 14 dias
5. 🚀 Solicitar produção

**Qual método você prefere usar para gerar o APK/AAB?**
