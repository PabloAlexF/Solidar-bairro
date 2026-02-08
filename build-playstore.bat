@echo off
echo ========================================
echo   SOLIDARBRASIL - BUILD PARA PLAY STORE
echo ========================================
echo.

echo [1/4] Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Instale em: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando dependencias...
cd Frontend
call npm install

echo.
echo [3/4] Gerando build de producao...
call npm run build

if errorlevel 1 (
    echo.
    echo ERRO: Build falhou!
    echo Verifique os erros acima.
    pause
    exit /b 1
)

echo.
echo [4/4] Build concluido com sucesso!
echo.
echo ========================================
echo   PROXIMOS PASSOS:
echo ========================================
echo.
echo 1. Hospede a pasta 'Frontend\build' online
echo    - Firebase Hosting (gratis)
echo    - Vercel (gratis)
echo    - Netlify (gratis)
echo.
echo 2. Anote a URL do seu site
echo.
echo 3. Instale Bubblewrap:
echo    npm install -g @bubblewrap/cli
echo.
echo 4. Gere o APK:
echo    bubblewrap init --manifest https://SEU_SITE.com/manifest.json
echo    bubblewrap build
echo.
echo 5. Consulte GUIA_PLAY_STORE.md para detalhes
echo.
echo ========================================
pause
