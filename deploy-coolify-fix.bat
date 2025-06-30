@echo off
echo Deploying Dubai Automation Dashboard with Coolify Fix...

echo.
echo 1. Adding docker-compose.yaml for Coolify...
git add docker-compose.yaml

echo 2. Adding .dockerignore for cleaner builds...
git add .dockerignore

echo 3. Staging all changes...
git add .

echo 4. Committing changes...
git commit -m "FIX: Add docker-compose.yaml for Coolify deployment - Remove port binding conflicts"

echo 5. Pushing to main branch...
git push origin main

echo.
echo ✅ Deployment files updated and pushed!
echo 🚀 Coolify should now deploy successfully without port conflicts.
echo.
echo The application will be available at: https://demo.yasta.online
echo.
pause
