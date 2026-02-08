@echo off
echo ========================================
echo   DEPLOY FRONTEND - SolidarBairro
echo ========================================
echo.

cd Frontend

echo [1/4] Fazendo build do frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERRO no build!
    pause
    exit /b 1
)

echo.
echo [2/4] Compactando arquivos...
cd build
powershell -Command "Compress-Archive -Path * -DestinationPath '../solidarbrasil-frontend.zip' -Force"
cd ..

echo.
echo [3/4] Enviando para Hostinger...
scp -P 65002 "solidarbrasil-frontend.zip" u198590363@46.202.145.7:~/

echo.
echo [4/4] Descompactando no servidor...
ssh -p 65002 u198590363@46.202.145.7 "unzip -o solidarbrasil-frontend.zip -d public_html/ && rm solidarbrasil-frontend.zip"

echo.
echo ========================================
echo   DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Acesse: https://solidarbrasil.com.br/
echo.
pause
