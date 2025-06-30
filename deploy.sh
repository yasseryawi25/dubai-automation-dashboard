#!/bin/bash

echo "🚀 Deploying Day 6 AI Agent Platform Fixes..."

# Navigate to project directory
cd "$(dirname "$0")"

# Add all changes
git add .

# Commit with descriptive message
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
echo "📤 Pushing to production branch..."
git push origin production

echo ""
echo "✅ Deployment initiated!"
echo "🌐 Monitor progress at Coolify dashboard"
echo "🎯 Demo URL: https://demo.yasta.online"
echo ""
echo "Expected features after deployment:"
echo "  • AI Agent Team dashboard"
echo "  • 6 agents with proper hierarchy"
echo "  • Sarah Manager Agent chat interface"
echo "  • Voice call buttons (VAPI integration ready)"
echo "  • Professional premium design"
echo "  • Real-time status indicators"
echo ""
echo "🔍 If deployment fails, check Coolify logs for any remaining TypeScript errors"
