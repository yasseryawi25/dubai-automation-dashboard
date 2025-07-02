@echo off
echo ====================================
echo 🚀 Starting Backend API Server
echo ====================================

REM Check if .env.api exists
if not exist ".env.api" (
    echo ❌ .env.api file not found
    echo Please run setup-backend.bat first
    pause
    exit /b 1
)

REM Start the backend server
echo.
echo 🔄 Starting API server on port 3001...
echo 📊 API Health: http://localhost:3001/health
echo 🤖 Agents API: http://localhost:3001/api/agents
echo 🔧 Database test: http://localhost:3001/api/database/test
echo.
echo Press Ctrl+C to stop the server
echo.

npx tsx api-server.ts
