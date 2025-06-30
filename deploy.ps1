# PowerShell Deployment Script for Day 6 AI Agent Platform
# Run this in PowerShell (Windows Terminal recommended)

Write-Host "🚀 Deploying Day 6 AI Agent Platform Fixes..." -ForegroundColor Cyan
Write-Host ""

# Navigate to project directory
Set-Location "D:\ClaudeProject\dubai-automation-dashboard"

# Check current directory
Write-Host "📁 Current directory: $(Get-Location)" -ForegroundColor Yellow

# Add all changes
Write-Host "📦 Adding all changes to git..." -ForegroundColor Green
git add .

# Commit with descriptive message
Write-Host "💾 Committing changes..." -ForegroundColor Green
git commit -m "Day 6 Complete: AI Agent Platform with VAPI Integration

✅ Fixed VAPIService class export for static methods
✅ Corrected TypeScript static method calls  
✅ AI Agent Team dashboard with 6 agents
✅ Manager Agent chat interface (Sarah)
✅ Voice calling preparation (VAPI ready)
✅ Real-time status indicators
✅ Professional premium design justifying AED 4,997 setup fee
✅ Arabic-English bilingual support
✅ Complete agent hierarchy (Manager → Coordinator → Basic)

Ready for Day 7 n8n integration and sales demonstrations."

# Push to production branch for Coolify auto-deployment
Write-Host "📤 Pushing to production branch..." -ForegroundColor Magenta
git push origin production

Write-Host ""
Write-Host "✅ Deployment initiated!" -ForegroundColor Green
Write-Host "🌐 Monitor progress at Coolify dashboard" -ForegroundColor Cyan
Write-Host "🎯 Demo URL: https://demo.yasta.online" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected features after deployment:" -ForegroundColor White
Write-Host "  • AI Agent Team dashboard" -ForegroundColor Gray
Write-Host "  • 6 agents with proper hierarchy" -ForegroundColor Gray  
Write-Host "  • Sarah Manager Agent chat interface" -ForegroundColor Gray
Write-Host "  • Voice call buttons (VAPI integration ready)" -ForegroundColor Gray
Write-Host "  • Professional premium design" -ForegroundColor Gray
Write-Host "  • Real-time status indicators" -ForegroundColor Gray
Write-Host ""
Write-Host "🔍 If deployment fails, check Coolify logs for any remaining TypeScript errors" -ForegroundColor Red

# Keep window open
Read-Host "Press Enter to continue..."
