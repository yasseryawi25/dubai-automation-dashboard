# Dubai Real Estate Dashboard - Complete Deployment Script (PowerShell)
# Run this script to prepare and deploy your dashboard

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Dubai Real Estate Dashboard Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to project directory
Set-Location "D:\ClaudeProject\dubai-automation-dashboard"

Write-Host "1. Checking current directory..." -ForegroundColor Yellow
Get-Location

Write-Host ""
Write-Host "2. Checking Git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "3. Adding all files to Git..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "4. Committing changes..." -ForegroundColor Yellow
$commitMessage = @"
Production deployment - Complete Dubai Real Estate AI Dashboard

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
- Professional presentation interface
"@

git commit -m $commitMessage

Write-Host ""
Write-Host "5. Creating and switching to production branch..." -ForegroundColor Yellow
try {
    git checkout -b production 2>$null
} catch {
    git checkout production
}
git merge main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "GITHUB REPOSITORY SETUP REQUIRED" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Please complete these steps:" -ForegroundColor White
Write-Host ""
Write-Host "1. Go to GitHub.com and create a new repository" -ForegroundColor White
Write-Host "2. Repository name: dubai-real-estate-dashboard" -ForegroundColor Yellow
Write-Host "3. Set as Public or Private (your choice)" -ForegroundColor White
Write-Host "4. DO NOT initialize with README (we have one)" -ForegroundColor Red
Write-Host ""
Write-Host "5. Copy the repository URL (should look like):" -ForegroundColor White
Write-Host "   https://github.com/YOUR_USERNAME/dubai-real-estate-dashboard.git" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. Come back and run: .\deploy-to-github.ps1" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue"

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "NEXT STEPS AFTER GITHUB SETUP:" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "1. Run: .\deploy-to-github.ps1" -ForegroundColor Yellow
Write-Host "2. Access Coolify: https://coolify.yasta.online" -ForegroundColor Cyan
Write-Host "3. Follow DEPLOYMENT-GUIDE.md for Coolify setup" -ForegroundColor White
Write-Host "4. Test deployment at: https://dashboard.yasta.online" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files created for your reference:" -ForegroundColor White
Write-Host "- DEPLOYMENT-GUIDE.md (Complete deployment instructions)" -ForegroundColor Green
Write-Host "- .env.production.template (Environment variables template)" -ForegroundColor Green
Write-Host "- deploy-to-github.ps1 (GitHub push script)" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to finish"
