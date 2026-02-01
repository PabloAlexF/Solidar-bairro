@echo off
echo ========================================
echo    SOLIDAR BAIRRO - TESTE COMPLETO
echo ========================================
echo.

echo 🔍 Verificando se o backend esta rodando...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend nao esta rodando!
    echo.
    echo 📋 Para iniciar o sistema:
    echo    1. Abra um terminal e execute: cd backend
    echo    2. Execute: npm start
    echo    3. Execute este script novamente
    echo.
    pause
    exit /b 1
)

echo ✅ Backend esta rodando!
echo.

echo 🔧 Criando dados de teste...
cd backend
node scripts/create-complete-test-data.js

echo.
echo 🎯 Proximos passos:
echo    1. Acesse: http://localhost:3000
echo    2. Teste o login com as credenciais criadas
echo    3. Explore o dashboard de cada tipo de usuario
echo.
pause