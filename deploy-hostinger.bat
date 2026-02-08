@echo off
echo 🚀 Iniciando deploy completo no Hostinger...

REM Configurações - ALTERE AQUI
set DOMAIN=solidarbrasil.com.br
set SSH_USER=seu_usuario_hostinger
set SSH_HOST=seu_host.hostinger.com
set REMOTE_PATH=/home/%SSH_USER%/public_html

REM Cores para output (simulado)
set GREEN=[OK]
set RED=[ERRO]
set YELLOW=[AVISO]

echo %GREEN% Verificando arquivos...

REM Verificar se o build existe
if not exist "Frontend\build\index.html" (
    echo %RED% Build do frontend não encontrado. Execute o build primeiro.
    echo Execute: cd Frontend && npm run build
    exit /b 1
)

echo %GREEN% Preparando arquivos para upload...

REM Criar diretório temporário
if exist deploy-temp rmdir /s /q deploy-temp
mkdir deploy-temp

REM Copiar arquivos do frontend
xcopy Frontend\build\* deploy-temp\ /E /I /H /Y

REM Copiar backend
xcopy backend deploy-temp\backend\ /E /I /H /Y

REM Copiar .htaccess
copy .htaccess deploy-temp\

echo %GREEN% Arquivos preparados em deploy-temp\

echo %YELLOW% Para fazer upload, execute manualmente:
echo scp -r deploy-temp\* %SSH_USER%@%SSH_HOST%:%REMOTE_PATH%/
echo.
echo %YELLOW% Ou use um cliente FTP/SFTP para enviar a pasta deploy-temp para %REMOTE_PATH%
echo.
echo %GREEN% Após upload, execute no servidor:
echo cd public_html/backend && chmod +x deploy-hostinger.sh && ./deploy-hostinger.sh
echo.
echo %GREEN% Deploy preparado! Acesse: https://%DOMAIN%
