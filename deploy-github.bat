@echo off
echo ========================================
echo  DEPLOY SOLIDAR-BAIRRO PARA GITHUB
echo ========================================
echo.

cd /d "c:\Users\Administrator\Desktop\solidar-bairro"

echo [1/6] Verificando repositorio remoto...
git remote -v

echo.
echo [2/6] Fazendo push da branch master...
git push -u origin master

echo.
echo [3/6] Fazendo push da branch develop...
git push -u origin develop

echo.
echo [4/6] Fazendo push das branches de funcionalidades...
git push -u origin feature/landing-page
git push -u origin feature/registration-system
git push -u origin feature/social-management
git push -u origin feature/ui-styling

echo.
echo [5/6] Verificando branches remotas...
git branch -r

echo.
echo [6/6] CONCLUIDO!
echo ========================================
echo  TODAS AS BRANCHES FORAM ENVIADAS!
echo ========================================
echo.
echo Branches criadas:
echo - master (principal)
echo - develop (desenvolvimento)
echo - feature/landing-page
echo - feature/registration-system
echo - feature/social-management
echo - feature/ui-styling
echo.
pause