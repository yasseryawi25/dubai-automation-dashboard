@echo off
echo 🔧 Fixing Coolify Port Mapping Conflict...

echo.
echo 1. Updated docker-compose.yaml to prevent port conflicts
git add docker-compose.yaml

echo 2. Staging all changes...
git add .

echo 3. Committing port mapping fix...
git commit -m "CRITICAL FIX: Remove port mapping 80:80 - Use expose only for Coolify/Traefik routing"

echo 4. Pushing to trigger redeployment...
git push origin main

echo.
echo ✅ Port mapping fix deployed!
echo.
echo 📋 MANUAL STEP REQUIRED IN COOLIFY:
echo    1. Go to your application → Configuration → Network
echo    2. CLEAR the "Ports Mappings" field (remove 80:80)  
echo    3. Keep "Ports Exposes" as 80
echo    4. Click "Deploy"
echo.
echo 🌐 After fix: https://demo.yasta.online should work
echo.
pause
