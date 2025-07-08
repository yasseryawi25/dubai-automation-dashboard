@echo off
echo ========================================
echo Dubai Real Estate Dashboard Deployment
echo ========================================
echo.

cd D:\ClaudeProject\dubai-automation-dashboard

echo 1. Checking current directory...
pwd

echo.
echo 2. Checking Git status...
git status

echo.
echo 3. Adding all files to Git...
git add .

echo.
echo 4. Committing changes...
git commit -m "Production deployment - Complete Dubai Real Estate AI Dashboard

Features included:
✅ 6 Specialized AI Agents (Manager, Coordinators, Specialists)  
✅ Supabase real-time database integration
✅ ROI Calculator (AED 22,000 vs AED 1,497 comparison)
✅ Voice calling preparation (VAPI integration ready)
✅ Responsive design optimized for client presentations
✅ Complete database schema for real estate CRM
✅ Production-ready Docker configuration
✅ Comprehensive health monitoring system
✅ Multi-tenant architecture ready
✅ SSL automation configured
✅ Environment-specific configurations

Ready for Coolify deployment with:
- PostgreSQL + Redis integration
- Automated SSL certificates
- Multi-client support
- Professional presentation interface"

echo.
echo 5. Creating and switching to production branch...
git checkout -b production 2>nul || git checkout production
git merge main

echo.
echo ========================================
echo GITHUB REPOSITORY SETUP REQUIRED
echo ========================================
echo.
echo Please complete these steps:
echo.
echo 1. Go to GitHub.com and create a new repository
echo 2. Repository name: dubai-real-estate-dashboard
echo 3. Set as Public or Private (your choice)
echo 4. DO NOT initialize with README (we have one)
echo.
echo 5. Copy the repository URL (should look like):
echo    https://github.com/YOUR_USERNAME/dubai-real-estate-dashboard.git
echo.
echo 6. Come back and run: deploy-to-github.bat
echo.
pause

echo.
echo ========================================
echo NEXT STEPS AFTER GITHUB SETUP:
echo ========================================
echo.
echo 1. Run: deploy-to-github.bat
echo 2. Access Coolify: https://coolify.yasta.online
echo 3. Follow DEPLOYMENT-GUIDE.md for Coolify setup
echo 4. Test deployment at: https://dashboard.yasta.online
echo.
echo Files created for your reference:
echo - DEPLOYMENT-GUIDE.md (Complete deployment instructions)
echo - .env.production.template (Environment variables template)
echo - deploy-to-github.bat (GitHub push script)
echo.
pause
