@echo off
echo ====================================
echo 🧪 Testing Complete System
echo ====================================

REM Function to check if a URL is accessible
:CheckURL
curl -s %1 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ %2
) else (
    echo ❌ %2
)
goto :eof

echo.
echo 🔍 Testing Backend API Server...
echo.

REM Test API Health
echo Testing API Health endpoint...
call :CheckURL "http://localhost:3001/health" "API Health Check"

REM Test Database Connection
echo.
echo Testing Database Connection...
call :CheckURL "http://localhost:3001/api/database/test" "Database Connection"

REM Test Agents API
echo.
echo Testing Agents API...
call :CheckURL "http://localhost:3001/api/agents" "Agents API"

echo.
echo 📊 Fetching detailed test results...
echo.

REM Get detailed results with curl
echo === API Health ===
curl -s http://localhost:3001/health 2>nul || echo "❌ API not responding"

echo.
echo.
echo === Database Test ===
curl -s http://localhost:3001/api/database/test 2>nul || echo "❌ Database test failed"

echo.
echo.
echo === Agents List ===
curl -s http://localhost:3001/api/agents 2>nul || echo "❌ Agents API failed"

echo.
echo.
echo ====================================
echo 🎯 Omar Hassan Check
echo ====================================

REM Check if Omar Hassan exists
echo Checking for Omar Hassan (Lead Qualification Agent)...
curl -s http://localhost:3001/api/agents 2>nul | findstr /i "omar" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Omar Hassan found in database
) else (
    echo ❌ Omar Hassan not found - check database setup
)

echo.
echo ====================================
echo 📋 Test Summary
echo ====================================
echo.
echo If you see ✅ for all tests above:
echo - ✅ Backend API is running correctly
echo - ✅ Database connection is working
echo - ✅ Omar Hassan is ready for lead qualification
echo.
echo If you see ❌ for any test:
echo - Check that the backend server is running (run-backend.bat)
echo - Verify database credentials in .env.api
echo - Ensure PostgreSQL is accessible
echo - Run database setup commands if needed
echo.
echo Next steps:
echo 1. Start frontend: npm run dev
echo 2. Test complete system in browser
echo 3. Try WhatsApp workflow integration
echo.
pause
