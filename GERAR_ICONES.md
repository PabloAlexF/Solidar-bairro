# Script para Gerar Ícones PWA

## Opção 1: Usar ferramenta online (MAIS FÁCIL)

Acesse: https://www.pwabuilder.com/imageGenerator

1. Faça upload do arquivo `logoo.png`
2. Clique em "Generate"
3. Baixe o pacote de ícones
4. Extraia os arquivos para `frontend/public/`

---

## Opção 2: Usar ImageMagick (linha de comando)

### Instalar ImageMagick:
- Windows: https://imagemagick.org/script/download.php
- Mac: `brew install imagemagick`
- Linux: `sudo apt-get install imagemagick`

### Gerar ícones:

```bash
cd frontend/public

# Ícone 192x192
magick logoo.png -resize 192x192 logo192.png

# Ícone 512x512
magick logoo.png -resize 512x512 logo512.png

# Favicon
magick logoo.png -resize 32x32 favicon.ico
```

---

## Opção 3: Usar site RealFaviconGenerator

Acesse: https://realfavicongenerator.net/

1. Faça upload do `logoo.png`
2. Configure as opções
3. Clique em "Generate your Favicons and HTML code"
4. Baixe o pacote
5. Extraia para `frontend/public/`

---

## Tamanhos Necessários:

- **16x16** - Favicon navegador
- **32x32** - Favicon navegador
- **48x48** - Windows tiles
- **72x72** - Android launcher
- **96x96** - Android launcher
- **128x128** - Chrome Web Store
- **144x144** - Windows tiles
- **152x152** - iOS Safari
- **192x192** - Android launcher (obrigatório)
- **384x384** - Android splash
- **512x512** - PWA (obrigatório)

---

## Após gerar os ícones:

1. Coloque todos na pasta `frontend/public/`
2. Atualize o `manifest.json` se necessário
3. Execute `npm run build`
4. Teste o PWA

---

## Verificar PWA:

1. Abra o site em produção
2. Abra DevTools (F12)
3. Vá em "Application" > "Manifest"
4. Verifique se os ícones aparecem corretamente
5. Teste "Add to Home Screen"
