@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════╗
echo ║     SCRIPTS DE TESTE - SOLIDARBRASIL                   ║
echo ╔════════════════════════════════════════════════════════╝
echo.

:menu
echo.
echo Escolha uma opção:
echo.
echo [1] Testar TODAS as categorias (Cidadão, Comércio, ONG, Família, Achados)
echo [2] Testar APENAS Cadastro Família Desktop
echo [3] Executar AMBOS os testes
echo [4] Sair
echo.
set /p opcao="Digite o número da opção: "

if "%opcao%"=="1" goto teste_completo
if "%opcao%"=="2" goto teste_familia
if "%opcao%"=="3" goto teste_ambos
if "%opcao%"=="4" goto sair
goto menu

:teste_completo
cls
echo.
echo ═══════════════════════════════════════════════════════
echo  EXECUTANDO: Teste Completo (Todas Categorias)
echo ═══════════════════════════════════════════════════════
echo.
cd backend
node tests/test-cadastro-completo.js
cd ..
echo.
echo ═══════════════════════════════════════════════════════
echo  Teste Concluído!
echo ═══════════════════════════════════════════════════════
pause
goto menu

:teste_familia
cls
echo.
echo ═══════════════════════════════════════════════════════
echo  EXECUTANDO: Teste Família Desktop
echo ═══════════════════════════════════════════════════════
echo.
cd backend
node tests/test-familia-desktop.js
cd ..
echo.
echo ═══════════════════════════════════════════════════════
echo  Teste Concluído!
echo ═══════════════════════════════════════════════════════
pause
goto menu

:teste_ambos
cls
echo.
echo ═══════════════════════════════════════════════════════
echo  EXECUTANDO: Todos os Testes
echo ═══════════════════════════════════════════════════════
echo.
echo [1/2] Teste Completo...
echo.
cd backend
node tests/test-cadastro-completo.js
echo.
echo.
echo [2/2] Teste Família Desktop...
echo.
node tests/test-familia-desktop.js
cd ..
echo.
echo ═══════════════════════════════════════════════════════
echo  Todos os Testes Concluídos!
echo ═══════════════════════════════════════════════════════
pause
goto menu

:sair
cls
echo.
echo Saindo...
echo.
exit

:erro
echo.
echo ❌ ERRO: Certifique-se de que:
echo    1. O backend está rodando (npm start na pasta backend)
echo    2. A porta 3001 está disponível
echo    3. Node.js está instalado
echo.
pause
goto menu
