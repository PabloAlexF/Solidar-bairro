@echo off
echo ========================================
echo   PREPARAR PARA HOSTINGER
echo ========================================
echo.

echo [1/3] Gerando build de producao...
cd Frontend
call npm install
call npm run build

if errorlevel 1 (
    echo ERRO no build!
    pause
    exit /b 1
)

echo.
echo [2/3] Criando .htaccess...
(
echo ^<IfModule mod_rewrite.c^>
echo   RewriteEngine On
echo   RewriteBase /
echo   RewriteRule ^index\.html$ - [L]
echo   RewriteCond %%{REQUEST_FILENAME} !-f
echo   RewriteCond %%{REQUEST_FILENAME} !-d
echo   RewriteRule . /index.html [L]
echo ^</IfModule^>
echo.
echo # Forcar HTTPS
echo RewriteCond %%{HTTPS} off
echo RewriteRule ^^(.*)$ https://%%{HTTP_HOST}%%{REQUEST_URI} [L,R=301]
echo.
echo # Cache
echo ^<IfModule mod_expires.c^>
echo   ExpiresActive On
echo   ExpiresByType image/jpg "access plus 1 year"
echo   ExpiresByType image/jpeg "access plus 1 year"
echo   ExpiresByType image/png "access plus 1 year"
echo   ExpiresByType text/css "access plus 1 month"
echo   ExpiresByType application/javascript "access plus 1 month"
echo ^</IfModule^>
) > build\.htaccess

echo.
echo [3/3] Criando arquivo ZIP...
cd build
powershell Compress-Archive -Path * -DestinationPath ..\..\hostinger-upload.zip -Force
cd ..\..

echo.
echo ========================================
echo   SUCESSO!
echo ========================================
echo.
echo Arquivo criado: hostinger-upload.zip
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Acesse hPanel da Hostinger
echo 2. Va em: Arquivos ^> Gerenciador de Arquivos
echo 3. Entre na pasta: public_html
echo 4. Delete tudo que estiver la
echo 5. Faca upload do arquivo: hostinger-upload.zip
echo 6. Extraia o ZIP
echo 7. Delete o ZIP
echo 8. Pronto! Acesse seu dominio
echo.
echo ========================================
pause
