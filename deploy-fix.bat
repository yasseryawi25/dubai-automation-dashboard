@echo off
echo 🚀 Deploying Day 6 AI Agent Platform Fixes...
echo.

REM Add all changes
git add .

REM Commit with descriptive message
git commit -m "Day 6 Complete: AI Agent Platform with VAPI Integration - Fixed TypeScript exports"

REM Push to production branch for Coolify auto-deployment
echo 📤 Pushing to production branch...
git push origin production

echo.
echo ✅ Deployment initiated!
echo 🌐 Monitor progress at Coolify dashboard
echo 🎯 Demo URL: https://demo.yasta.online
echo.
echo Expected features after deployment:
echo   • AI Agent Team dashboard
echo   • 6 agents with proper hierarchy  
echo   • Sarah Manager Agent chat interface
echo   • Voice call buttons (VAPI integration ready)
echo   • Professional premium design
echo   • Real-time status indicators
echo.
echo 🔍 If deployment fails, check Coolify logs for any remaining TypeScript errors
pause
