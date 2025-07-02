@echo off
echo ====================================
echo 🚀 Setting up Backend API Server
echo ====================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Install API dependencies
echo.
echo 📦 Installing API dependencies...
npm install express cors pg dotenv @types/express @types/cors @types/pg @types/node tsx typescript

REM Check if installation was successful
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Copy environment file if it doesn't exist
if not exist ".env.api" (
    echo.
    echo 📝 Creating .env.api file...
    copy ".env.api.example" ".env.api"
    echo.
    echo ⚠️  IMPORTANT: Please edit .env.api with your database credentials
    echo    - Open .env.api in a text editor
    echo    - Set DB_PASSWORD to your PostgreSQL password from Coolify
    echo    - Save the file
    echo.
)

echo.
echo ✅ Backend API setup complete!
echo.
echo Next steps:
echo 1. Edit .env.api with your database credentials
echo 2. Run: npm run setup-backend
echo 3. Test with: npm run test-backend
echo.
pause
