@echo off
echo ========================================
echo  INSTALACAO CAPACITOR - SOLIDARBRASIL
echo ========================================
echo.

cd frontend

echo [1/5] Instalando Capacitor Core...
call npm install @capacitor/core @capacitor/cli

echo.
echo [2/5] Instalando Capacitor Android...
call npm install @capacitor/android

echo.
echo [3/5] Instalando plugins essenciais...
call npm install @capacitor/push-notifications @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard @capacitor/geolocation @capacitor/camera

echo.
echo [4/5] Atualizando package.json com scripts...
echo.

echo.
echo [5/5] Instalacao concluida!
echo.
echo ========================================
echo  PROXIMOS PASSOS:
echo ========================================
echo 1. npm run build
echo 2. npx cap init
echo 3. npx cap add android
echo 4. npx cap sync
echo 5. npx cap open android
echo.
echo Leia o arquivo: GUIA_PUBLICACAO_ANDROID.md
echo ========================================
pause
