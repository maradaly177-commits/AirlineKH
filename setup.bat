@echo off
REM Quick setup script for AirlineKH Frontend-Backend connection
REM Run this from the project root directory (Windows)

echo.
echo 🚀 AirlineKH Frontend-Backend Setup Script
echo ==========================================
echo.

REM Check if in correct directory
if not exist "composer.json" (
    echo ❌ Error: Run this script from the AirlineKH project root directory
    pause
    exit /b 1
)

if not exist "client" (
    echo ❌ Error: client folder not found
    pause
    exit /b 1
)

REM Backend Setup
echo 📦 Setting up Backend...
echo.

REM Install composer dependencies
if not exist "vendor" (
    echo Installing Composer dependencies...
    call composer install
    if errorlevel 1 (
        echo ❌ Composer install failed. Make sure Composer is installed.
        pause
        exit /b 1
    )
)

REM Generate APP_KEY if not exists
findstr /M "APP_KEY=" .env >nul 2>&1
if errorlevel 1 (
    echo Generating APP_KEY...
    php artisan key:generate
)

echo ✅ Backend dependencies installed
echo.

REM Frontend Setup
echo 📦 Setting up Frontend...
echo.

cd client

REM Install npm dependencies
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install failed. Make sure Node.js is installed.
        pause
        exit /b 1
    )
)

REM Create .env file if not exists
if not exist ".env" (
    echo Creating frontend .env file...
    (
        echo # Frontend API Configuration
        echo VITE_API_BASE_URL=http://127.0.0.1:8000/api
        echo VITE_USE_AI_MOCK=false
    ) > .env
    echo ✅ Created client\.env
) else (
    echo ⚠️  client\.env already exists
)

cd ..

echo.
echo ✅ Frontend setup complete
echo.

REM Display next steps
echo 📝 Next Steps:
echo.
echo 1. Backend:
echo    - Configure database in .env
echo    - Configure Ollama: OLLAMA_URL=http://127.0.0.1:11434
echo    - Run migrations: php artisan migrate
echo    - Start server: php artisan serve
echo.
echo 2. Ollama:
echo    - Start Ollama (double-click Ollama.exe from taskbar or install folder^)
echo    - Download model: ollama pull qwen2.5:3b
echo.
echo 3. Frontend:
echo    - Start dev server: cd client && npm run dev
echo    - Open browser: http://localhost:5173
echo.
echo ✅ Setup complete!
echo.
echo For more details, see:
echo   - FRONTEND_BACKEND_CONNECTION_GUIDE.md
echo   - CONNECTION_CHECKLIST.md
echo.
pause
