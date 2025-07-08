@echo off
echo Setting up GitHub repository for Dubai Real Estate Dashboard...
cd D:\ClaudeProject\dubai-automation-dashboard

echo.
echo ===========================================
echo 1. ADDING ALL FILES TO GIT
echo ===========================================
git add .

echo.
echo ===========================================
echo 2. COMMITTING CHANGES
echo ===========================================
git commit -m "Complete Dubai Real Estate AI Dashboard - Production Ready

Features:
- 6 Specialized AI Agents (Manager, Coordinators, Specialists)
- Supabase real-time database integration
- ROI Calculator (AED 22,000 vs AED 1,497 comparison)
- Voice calling preparation (VAPI integration ready)
- Responsive design optimized for presentations
- Complete database schema for real estate CRM
- Production-ready Docker configuration
- Comprehensive health monitoring system

Ready for Coolify deployment with:
- PostgreSQL + Redis integration
- Multi-tenant architecture
- SSL automation
- Environment-specific configurations"

echo.
echo ===========================================
echo 3. CREATING PRODUCTION BRANCH
echo ===========================================
git checkout -b production
git checkout main

echo.
echo ===========================================
echo 4. NEXT STEPS:
echo ===========================================
echo - Create GitHub repository named: dubai-real-estate-dashboard
echo - Add remote origin with your GitHub repository URL
echo - Push to GitHub using the commands below
echo.
echo After creating GitHub repository, run:
echo git remote add origin https://github.com/YOUR_USERNAME/dubai-real-estate-dashboard.git
echo git branch -M main
echo git push -u origin main
echo git push origin production

pause
