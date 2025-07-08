@echo off
echo ========================================
echo Pushing to GitHub Repository
echo ========================================
echo.

cd D:\ClaudeProject\dubai-automation-dashboard

echo Please enter your GitHub repository URL:
echo Example: https://github.com/yourusername/dubai-real-estate-dashboard.git
echo.
set /p GITHUB_URL="Repository URL: "

echo.
echo Setting up GitHub remote...
git remote remove origin 2>nul
git remote add origin %GITHUB_URL%

echo.
echo Pushing main branch...
git push -u origin main

echo.
echo Pushing production branch...
git push origin production

echo.
echo ========================================
echo SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Repository URL: %GITHUB_URL%
echo Main branch: https://github.com/yourusername/dubai-real-estate-dashboard
echo Production branch: https://github.com/yourusername/dubai-real-estate-dashboard/tree/production
echo.
echo ========================================
echo NEXT: DEPLOY TO COOLIFY
echo ========================================
echo.
echo 1. Access Coolify Dashboard: https://coolify.yasta.online
echo 2. Follow the steps in DEPLOYMENT-GUIDE.md
echo 3. Use the 'production' branch for deployment
echo 4. Copy environment variables from .env.production.template
echo.
echo Key deployment details:
echo - Repository: %GITHUB_URL%
echo - Branch: production
echo - Domain: dashboard.yasta.online
echo - Dockerfile: ./Dockerfile (included)
echo.
pause
