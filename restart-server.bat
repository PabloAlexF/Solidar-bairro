@echo off
echo Reiniciando servidor backend...
cd backend
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Iniciando servidor...
start cmd /k "npm start"
echo Servidor reiniciado! Teste novamente no frontend.