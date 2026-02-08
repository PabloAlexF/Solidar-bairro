@echo off
echo ========================================
echo   DEPLOY COMPLETO - SolidarBairro
echo ========================================
echo.
echo Este script vai fazer deploy de:
echo   - Frontend (build completo)
echo   - Backend (services alterados)
echo.
pause

echo.
echo ========================================
echo   PARTE 1: FRONTEND
echo ========================================
call deploy-frontend.bat

echo.
echo.
echo ========================================
echo   PARTE 2: BACKEND
echo ========================================
call deploy-backend.bat

echo.
echo ========================================
echo   DEPLOY COMPLETO FINALIZADO!
echo ========================================
echo.
echo Frontend: https://solidarbrasil.com.br/solidar-bairro
echo Backend: Reiniciado com sucesso
echo.
pause
