@echo off
echo ========================================
echo   DEPLOY COM LIMPEZA DE CACHE
echo ========================================
echo.

cd Frontend

echo [1/5] Limpando cache do npm...
call npm cache clean --force

echo.
echo [2/5] Removendo node_modules e build antigos...
if exist "node_modules" rmdir /s /q node_modules
if exist "build" rmdir /s /q build

echo.
echo [3/5] Reinstalando dependencias...
call npm install

echo.
echo [4/5] Fazendo build NOVO...
call npm run build

echo.
echo [5/5] Enviando para Hostinger...
cd build
powershell -Command "Compress-Archive -Path * -DestinationPath '../solidarbrasil-frontend-new.zip' -Force"
cd ..

scp -P 65002 "solidarbrasil-frontend-new.zip" u198590363@46.202.145.7:~/

echo.
echo Descompactando no servidor e limpando cache...
ssh -p 65002 u198590363@46.202.145.7 "rm -rf public_html/* && unzip -o solidarbrasil-frontend-new.zip -d public_html/ && rm solidarbrasil-frontend-new.zip && echo 'Cache-Control: no-cache, no-store, must-revalidate' > public_html/.htaccess"

echo.
echo ========================================
echo   DEPLOY COMPLETO!
echo ========================================
echo.
echo IMPORTANTE: Limpe o cache do navegador:
echo   Chrome: Ctrl+Shift+Delete
echo   Ou acesse em modo anonimo
echo.
pause
