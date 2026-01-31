#!/bin/bash

echo "🚀 Iniciando processo de deploy do SolidarBrasil..."

# Verificar se estamos na raiz do projeto
if [ ! -f "README.md" ]; then
    echo "❌ Execute este script na raiz do projeto"
    exit 1
fi

# Deploy do Backend (Firebase Functions)
echo "📦 Fazendo deploy do backend..."
cd backend

# Verificar se as variáveis de ambiente estão configuradas
if [ ! -f ".env" ] || ! grep -q "FIREBASE_PROJECT_ID=" .env; then
    echo "❌ Configure o arquivo .env com suas credenciais Firebase"
    echo "   Copie .env.example para .env e configure as variáveis"
    exit 1
fi

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências do backend..."
    npm install
fi

# Deploy das functions
echo "🔥 Fazendo deploy das Firebase Functions..."
npm run deploy

cd ..

# Deploy do Frontend (GitHub Pages)
echo "🌐 Fazendo deploy do frontend..."
cd Frontend

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências do frontend..."
    npm install
fi

# Build do projeto
echo "🔨 Fazendo build do frontend..."
npm run build

# Deploy para GitHub Pages
echo "📤 Fazendo deploy para GitHub Pages..."
npm run deploy

cd ..

echo "✅ Deploy concluído!"
echo "🌐 Frontend: https://seu-usuario.github.io/solidar-bairro"
echo "🔥 Backend: https://solidar-bairro.web.app"