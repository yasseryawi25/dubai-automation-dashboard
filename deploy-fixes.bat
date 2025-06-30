@echo off
echo ============================================
echo    Committing TypeScript Fixes to Git
echo ============================================

cd /d "D:\ClaudeProject\dubai-automation-dashboard"

echo.
echo 1. Checking git status...
git status

echo.
echo 2. Adding all changes...
git add .

echo.
echo 3. Committing changes...
git commit -m "Fix TypeScript build errors for Coolify deployment - remove unused imports, add proper types, make config less strict"

echo.
echo 4. Pushing to GitHub...
git push origin main

echo.
echo ✅ All changes committed and pushed successfully!
echo 🚀 Coolify should now automatically trigger a new deployment.
echo.
echo Check your Coolify dashboard at: https://coolify.yasta.online
echo Expected result: https://demo.yasta.online should work after deployment
echo.
pause
