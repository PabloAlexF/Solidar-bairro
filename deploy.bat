@echo off
echo 🚀 Iniciando processo de deploy do SolidarBrasil...

REM Verificar se estamos na raiz do projeto
if not exist "README.md" (
    echo ❌ Execute este script na raiz do projeto
    exit /b 1
)

REM Deploy do Backend (Firebase Functions)
echo 📦 Fazendo deploy do backend...
cd backend

REM Verificar se as variáveis de ambiente estão configuradas
if not exist ".env" (
    echo ❌ Configure o arquivo .env com suas credenciais Firebase
    echo    Copie .env.example para .env e configure as variáveis
    exit /b 1
)

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo 📥 Instalando dependências do backend...
    npm install
)

REM Deploy das functions
echo 🔥 Fazendo deploy das Firebase Functions...
npm run deploy

cd ..

REM Deploy do Frontend (GitHub Pages)
echo 🌐 Fazendo deploy do frontend...
cd Frontend

REM Instalar dependências se necessário
if not exist "node_modules" (
    echo 📥 Instalando dependências do frontend...
    npm install
)

REM Build do projeto
echo 🔨 Fazendo build do frontend...
npm run build

REM Deploy para GitHub Pages
echo 📤 Fazendo deploy para GitHub Pages...
npm run deploy

cd ..

echo ✅ Deploy concluído!
echo 🌐 Frontend: https://seu-usuario.github.io/solidar-bairro
echo 🔥 Backend: https://solidar-bairro.web.app