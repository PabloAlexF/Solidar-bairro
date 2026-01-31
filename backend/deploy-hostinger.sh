#!/bin/bash

# Script de Deploy para Hostinger
echo "🚀 Iniciando deploy no Hostinger..."

# 1. Fazer backup do .env atual
if [ -f .env ]; then
    cp .env .env.backup
    echo "✅ Backup do .env criado"
fi

# 2. Usar configurações de produção
cp .env.production .env
echo "✅ Configurações de produção aplicadas"

# 3. Instalar dependências
echo "📦 Instalando dependências..."
npm ci --only=production

# 4. Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2
fi

# 5. Parar aplicação anterior (se existir)
pm2 stop solidar-backend 2>/dev/null || true
pm2 delete solidar-backend 2>/dev/null || true

# 6. Iniciar aplicação
echo "🔄 Iniciando aplicação..."
pm2 start src/server.js --name "solidar-backend" --env production

# 7. Salvar configuração do PM2
pm2 save
pm2 startup

echo "✅ Deploy concluído!"
echo "📊 Status da aplicação:"
pm2 status