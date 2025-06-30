@echo off
echo ============================================
echo    Fixing Dockerfile Dependencies Issue
echo ============================================

cd /d "D:\ClaudeProject\dubai-automation-dashboard"

echo.
echo 🔧 ISSUE IDENTIFIED:
echo The Dockerfile was only installing production dependencies,
echo but vite and typescript are in devDependencies and needed for build.
echo.
echo ✅ SOLUTION APPLIED:
echo Changed "npm ci --only=production" to "npm ci" to install ALL dependencies.
echo.

echo 1. Checking git status...
git status

echo.
echo 2. Adding Dockerfile changes...
git add Dockerfile

echo.
echo 3. Committing critical fix...
git commit -m "Fix Dockerfile: Install ALL dependencies including devDependencies for build - vite and typescript needed"

echo.
echo 4. Pushing to GitHub...
git push origin main

echo.
echo ✅ CRITICAL FIX DEPLOYED!
echo 🚀 Coolify should now successfully build and deploy.
echo.
echo Expected result: 
echo - Build will install vite and typescript 
echo - "npm run build" will work correctly
echo - https://demo.yasta.online will be live
echo.
echo Monitor deployment at: https://coolify.yasta.online
echo.
pause
