#!/bin/bash

# Script de Build para Frontend
echo "🏗️ Iniciando build do frontend..."

# 1. Usar configurações de produção
cp .env.production .env.local

# 2. Instalar dependências
echo "📦 Instalando dependências..."
npm ci

# 3. Build otimizado
echo "🔨 Gerando build de produção..."
npm run build

# 4. Otimizar arquivos
echo "⚡ Otimizando arquivos..."
# Comprimir arquivos CSS e JS (se tiver ferramentas instaladas)
if command -v gzip &> /dev/null; then
    find build/static -name "*.js" -exec gzip -k {} \;
    find build/static -name "*.css" -exec gzip -k {} \;
    echo "✅ Arquivos comprimidos"
fi

echo "✅ Build concluído!"
echo "📁 Arquivos prontos em: ./build/"