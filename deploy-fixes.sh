#!/bin/bash

# Navigate to project directory
cd "D:\ClaudeProject\dubai-automation-dashboard"

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Fix TypeScript compilation errors for deployment

- Fix App.tsx Layout component children prop issue
- Add missing TypeScript interfaces (UserProfile, ClientProfile, etc.)
- Replace invalid lucide-react icons (FilePdf->File, Font->Type)
- Fix service import paths and remove server dependencies
- Remove duplicate interface properties in BulkActionBar
- Fix invalid enum values in useBulkOperations
- Create browser-compatible database connection manager
- Update BackendIntegrationDemo import path

All critical TypeScript errors that were preventing Docker build should now be resolved."

# Push to GitHub
git push origin main

echo "Changes committed and pushed successfully!"
echo "Check Coolify dashboard for new deployment status."
