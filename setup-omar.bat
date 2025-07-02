@echo off
echo 🎯 Setting up Omar (Lead Qualification Agent) - Backend API Server
echo ==================================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Step 1: Setup API server
echo 📦 Step 1: Setting up backend API server...

REM Create API directory structure
if not exist "api" mkdir api
copy api-server.ts api\ >nul 2>&1
copy tsconfig.api.json api\tsconfig.json >nul 2>&1
copy .env.api.example api\.env.example >nul 2>&1

cd api

REM Setup package.json
if not exist "package.json" (
    copy ..\api-package.json package.json >nul 2>&1
)

REM Install dependencies
echo Installing Node.js dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed

REM Step 2: Environment setup
echo.
echo ⚙️ Step 2: Environment configuration...

if not exist ".env" (
    copy .env.example .env >nul 2>&1
    echo 📝 Created .env file from template
    echo ⚠️  IMPORTANT: You need to update the database password in api\.env
    echo    Edit the DB_PASSWORD value with your actual Coolify PostgreSQL password
) else (
    echo ✅ .env file already exists
)

REM Step 3: Create database test
echo.
echo 🗄️ Step 3: Creating database test script...

echo const { Pool } = require('pg'); > test-db.js
echo require('dotenv').config(); >> test-db.js
echo. >> test-db.js
echo const pool = new Pool({ >> test-db.js
echo   host: process.env.DB_HOST ^|^| 'automation-postgres', >> test-db.js
echo   port: parseInt(process.env.DB_PORT ^|^| '5432'^), >> test-db.js
echo   database: process.env.DB_NAME ^|^| 'automation_platform', >> test-db.js
echo   user: process.env.DB_USER ^|^| 'automation_user', >> test-db.js
echo   password: process.env.DB_PASSWORD ^|^| '', >> test-db.js
echo }^); >> test-db.js
echo. >> test-db.js
echo async function testConnection(^) { >> test-db.js
echo   try { >> test-db.js
echo     console.log('🔌 Testing database connection...'^); >> test-db.js
echo     const client = await pool.connect(^); >> test-db.js
echo     console.log('✅ Database connection successful!'^); >> test-db.js
echo     client.release(^); >> test-db.js
echo     await pool.end(^); >> test-db.js
echo     console.log('🎯 Database test completed!'^); >> test-db.js
echo   } catch (error^) { >> test-db.js
echo     console.error('❌ Database connection failed:', error.message^); >> test-db.js
echo     console.log('🔧 Check your .env file and database credentials'^); >> test-db.js
echo   } >> test-db.js
echo } >> test-db.js
echo. >> test-db.js
echo testConnection(^); >> test-db.js

echo ✅ Database test script created

echo.
echo 🎉 Setup completed!
echo.
echo 📋 Next steps:
echo 1. Update api\.env with your actual database password
echo 2. Test database: cd api ^&^& node test-db.js
echo 3. Start API server: cd api ^&^& npm run dev
echo 4. Start frontend: npm run dev (in main directory)
echo 5. Visit http://localhost:5173 to see Omar in action!
echo.
echo 🎯 Omar (Lead Qualification Agent) is ready to process leads!
echo.
pause
