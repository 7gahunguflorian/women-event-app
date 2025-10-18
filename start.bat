@echo off
echo ========================================
echo   Evenement Feminin - Demarrage
echo ========================================
echo.

echo [1/3] Installation des dependances...
call npm run install-all
if errorlevel 1 (
    echo Erreur lors de l'installation!
    pause
    exit /b 1
)

echo.
echo [2/3] Build du frontend...
call npm run build
if errorlevel 1 (
    echo Erreur lors du build!
    pause
    exit /b 1
)

echo.
echo [3/3] Demarrage du serveur...
echo.
echo ========================================
echo   Application disponible sur:
echo   http://localhost:3000
echo ========================================
echo.
echo Admin: username=admin, password=admin123
echo.
call npm start
