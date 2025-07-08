@echo off
echo Checking Git status for Dubai Real Estate Dashboard...
cd D:\ClaudeProject\dubai-automation-dashboard

echo.
echo ===========================================
echo CURRENT GIT STATUS:
echo ===========================================
git status

echo.
echo ===========================================
echo CURRENT REMOTE REPOSITORIES:
echo ===========================================
git remote -v

echo.
echo ===========================================
echo RECENT COMMITS:
echo ===========================================
git log --oneline -5

echo.
echo ===========================================
echo STAGED FILES:
echo ===========================================
git diff --cached --name-only

echo.
echo ===========================================
echo MODIFIED FILES:
echo ===========================================
git diff --name-only

pause
