@echo off
echo ========================================
echo   BUILD LOCAL - SolidarBairro
echo ========================================
echo.

cd Frontend

echo [1/2] Fazendo build do frontend...
call npm run build

echo.
echo [2/2] Build concluido!
echo.
echo Arquivos gerados em: Frontend\build\
echo.
echo Para testar localmente:
echo   cd Frontend\build
echo   npx serve -s . -p 3000
echo.
echo Ou execute: deploy-frontend.bat para enviar ao Hostinger
echo.
pause
