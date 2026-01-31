#!/bin/bash

# Deploy Completo - SolidarBrasil no Hostinger
echo "🚀 Iniciando deploy completo no Hostinger..."

# Configurações
DOMAIN="seudominio.com"
SSH_USER="seu_usuario"
SSH_HOST="seu_host.hostinger.com"
REMOTE_PATH="/home/seu_usuario/public_html"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Build do Frontend
echo "🏗️ Fazendo build do frontend..."
cd Frontend
chmod +x build-production.sh
./build-production.sh
if [ $? -eq 0 ]; then
    echo_success "Build do frontend concluído"
else
    echo_error "Erro no build do frontend"
    exit 1
fi
cd ..

# 2. Preparar arquivos para upload
echo "📦 Preparando arquivos..."
mkdir -p deploy-temp
cp -r Frontend/build/* deploy-temp/
cp -r backend deploy-temp/
cp .htaccess deploy-temp/

# 3. Upload via SCP
echo "📤 Fazendo upload dos arquivos..."
scp -r deploy-temp/* $SSH_USER@$SSH_HOST:$REMOTE_PATH/

# 4. Executar deploy do backend no servidor
echo "🔧 Configurando backend no servidor..."
ssh $SSH_USER@$SSH_HOST << 'EOF'
cd public_html/backend
chmod +x deploy-hostinger.sh
./deploy-hostinger.sh
EOF

# 5. Limpeza
rm -rf deploy-temp

echo_success "Deploy concluído!"
echo "🌐 Acesse: https://$DOMAIN"
echo "📊 API: https://$DOMAIN/api"