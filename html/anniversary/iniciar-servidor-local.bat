@echo off
chcp 65001 > nul
title Servidor Local - Painel de Controle
setlocal enabledelayedexpansion

:: Cores: 0 = Preto, B = Ciano Claro
color 0B

:menu
cls
echo.
echo.
echo    .--------------------------------------------------.
echo    ^|                                                  ^|
echo    ^|      ____  ____ ____ _  _ _ ___  ____ ____       ^|
echo    ^|      [__  ^|___ ^|__/ ^|  ^| ^| ^|  \ ^|  ^| ^|__/        ^|
echo    ^|      ___] ^|___ ^|  \  \/  ^| ^|__/ ^|__^| ^|  \        ^|
echo    ^|                                                  ^|
echo    ^|         [  S E R V I D O R    L O C A L  ]       ^|
echo    '--------------------------------------------------'
echo.
echo    [!] ARQUITETURA DE ALTA DISPONIBILIDADE ATIVA
echo    -------------------------------------------------------
echo.
echo    [1] [+] Ligar Servidores (Web: 8000 ^| API: 8001)
echo    [2] [-] Desligar Servidores
echo    [3] [>] Abrir Pasta do Projeto
echo    [0] [X] Sair
echo.
echo    -------------------------------------------------------
set /p opcao="  > Selecione uma acao: "

if "%opcao%"=="1" goto ligar
if "%opcao%"=="2" goto desligar
if "%opcao%"=="3" goto pasta
if "%opcao%"=="0" exit
goto menu

:ligar
echo.
echo   [+] Iniciando Engine Visual (Porta 8000)...
powershell -WindowStyle Hidden -Command "Start-Process cmd -ArgumentList '/c python -m http.server 8000' -WindowStyle Hidden"

echo   [+] Iniciando Local API Gateway (Porta 8001)...
powershell -WindowStyle Hidden -Command "Start-Process cmd -ArgumentList '/c python api/server.py' -WindowStyle Hidden"

echo.
echo   [OK] Sistemas operacionais em segundo plano.
echo   [!] Redirecionando para o ambiente de desenvolvimento...
timeout 2 > NUL
start http://localhost:8000
goto menu

:desligar
echo.
echo   [-] Encerrando processos ativos...

echo   [*] Finalizando Front-End (8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /F /PID %%a >nul 2>&1

echo   [*] Finalizando Back-End API (8001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do taskkill /F /PID %%a >nul 2>&1

echo.
echo   [!] Todos os servicos foram interrompidos com seguranca.
timeout 2 > NUL
goto menu

:pasta
echo   [!] Abrindo explorador de arquivos...
start .
goto menu
