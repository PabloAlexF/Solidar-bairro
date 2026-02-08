@echo off
echo ========================================
echo   VERIFICAR E DEPLOY
echo ========================================
echo.

cd Frontend

echo [1/3] Removendo build antigo...
if exist "build" rmdir /s /q build

echo.
echo [2/3] Fazendo build NOVO...
set GENERATE_SOURCEMAP=false
call npm run build

echo.
echo [3/3] Verificando hash gerado...
dir build\static\js\main.*.js

echo.
echo Pressione qualquer tecla para enviar ao Hostinger...
pause

cd build
powershell -Command "Compress-Archive -Path * -DestinationPath '../frontend-deploy.zip' -Force"
cd ..

echo.
echo Enviando para Hostinger...
scp -P 65002 "frontend-deploy.zip" u198590363@46.202.145.7:~/

echo.
echo Descompactando no servidor...
ssh -p 65002 u198590363@46.202.145.7 "rm -rf public_html/* && unzip -o frontend-deploy.zip -d public_html/ && rm frontend-deploy.zip"

echo.
echo ========================================
echo   CONCLUIDO!
echo ========================================
echo.
echo Acesse em modo anonimo: Ctrl+Shift+N
echo URL: https://solidarbrasil.com.br/
echo.
pause
