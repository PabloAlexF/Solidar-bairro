#!/bin/bash

# Script de inicialização do backend na Hostinger

echo "🚀 Iniciando SolidarBrasil Backend..."

# Carregar variáveis de ambiente
export $(cat .env.hostinger | xargs)

# Instalar dependências (se necessário)
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install --production
fi

# Iniciar servidor com PM2
echo "🔥 Iniciando servidor..."
pm2 start src/server.js --name solidar-backend --watch --ignore-watch="node_modules logs" --log-date-format="YYYY-MM-DD HH:mm:ss"
pm2 save
pm2 startup

echo "✅ Backend iniciado com sucesso!"
echo "📊 Para ver logs: pm2 logs solidar-backend"
echo "🔄 Para reiniciar: pm2 restart solidar-backend"
echo "⏹️  Para parar: pm2 stop solidar-backend"
