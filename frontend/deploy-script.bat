@echo off
echo ========================================
echo DEPLOY AUTOMATICO - SolidarBrasil
echo ========================================
echo.

echo [1/2] Enviando arquivo para servidor...
scp -P 65002 "C:\Users\Administrator\Desktop\solidar-bairro\Frontend\deploy-v3-FINAL.zip" u198590363@46.202.145.7:~/

echo.
echo [2/2] Conectando ao SSH para descompactar...
echo Execute os seguintes comandos no SSH:
echo.
echo rm -rf public_html/*
echo unzip -o deploy-v3-FINAL.zip -d public_html/
echo chmod 644 public_html/.htaccess public_html/index.html
echo chmod -R 755 public_html/static
echo ls -la public_html/static/js/
echo.
echo Pressione qualquer tecla para conectar ao SSH...
pause

ssh -p 65002 u198590363@46.202.145.7

echo.
echo ========================================
echo Deploy concluido!
echo Teste em: https://solidarbrasil.com.br
echo ========================================
pause
