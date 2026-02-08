@echo off
echo ========================================
echo   DEPLOY BACKEND - SolidarBairro
echo ========================================
echo.

cd backend

echo [1/3] Compactando arquivos alterados...
powershell -Command "Compress-Archive -Path 'src/services/cidadaoService.js','src/services/comercioService.js','src/services/familiaService.js','src/services/ongService.js' -DestinationPath 'solidarbrasil-backend-services.zip' -Force"

echo.
echo [2/3] Enviando para Hostinger...
scp -P 65002 "solidarbrasil-backend-services.zip" u198590363@46.202.145.7:~/

echo.
echo [3/3] Descompactando no servidor...
ssh -p 65002 u198590363@46.202.145.7 "unzip -o solidarbrasil-backend-services.zip -d solidar-backend/ && rm solidarbrasil-backend-services.zip && cd solidar-backend && pm2 restart solidar-backend"

echo.
echo ========================================
echo   DEPLOY BACKEND CONCLUIDO!
echo ========================================
echo.
echo Backend reiniciado com sucesso!
echo.
pause
