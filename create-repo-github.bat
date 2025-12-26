@echo off
echo ========================================
echo  CRIANDO REPOSITORIO NO GITHUB
echo ========================================
echo.

cd /d "c:\Users\Administrator\Desktop\solidar-bairro"

echo [1/7] Criando repositorio no GitHub...
gh repo create PabloAlexF/solidar-bairro --public --description "Plataforma de solidariedade social para bairros - React App" --source=. --remote=origin --push

echo.
echo [2/7] Fazendo push da branch master...
git push -u origin master

echo.
echo [3/7] Fazendo push da branch develop...
git push -u origin develop

echo.
echo [4/7] Fazendo push das branches de funcionalidades...
git push -u origin feature/landing-page
git push -u origin feature/registration-system
git push -u origin feature/social-management
git push -u origin feature/ui-styling

echo.
echo [5/7] Configurando branch principal...
gh repo edit --default-branch master

echo.
echo [6/7] Verificando repositorio...
gh repo view

echo.
echo [7/7] CONCLUIDO!
echo ========================================
echo  REPOSITORIO CRIADO E BRANCHES ENVIADAS!
echo ========================================
echo.
echo URL: https://github.com/PabloAlexF/solidar-bairro
echo.
pause