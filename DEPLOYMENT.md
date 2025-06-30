# Deployment Guide for Dubai Real Estate AI Dashboard

## 🚀 Quick Deployment to Coolify

### Prerequisites
- Coolify instance running at `https://coolify.yasta.online`
- GitHub repository with the code
- Domain `demo.yasta.online` configured

### Step 1: Commit and Push
```bash
git add .
git commit -m "Add deployment configuration - Dockerfile and nginx.conf"
git push origin main
```

### Step 2: Coolify Configuration
1. **Access Coolify:** `https://coolify.yasta.online`
2. **Project:** Dubai Real Estate Platform
3. **Add Application:**
   - **Type:** Git Repository
   - **Repository:** Your GitHub repo URL
   - **Branch:** main
   - **Build Pack:** Dockerfile

### Step 3: Environment Variables
```
NODE_ENV=production
VITE_API_URL=https://api.yasta.online
VITE_APP_NAME=AI Real Estate Team
VITE_CLIENT_ID=demo_client
VITE_MOCK_DATA=true
```

### Step 4: Domain Configuration
```
Domain: demo.yasta.online
SSL: Automatic (Let's Encrypt)
Port: 80
```

### Step 5: Deploy
1. Click **"Deploy"**
2. Monitor build logs
3. Wait for **"Running"** status
4. Test at `https://demo.yasta.online`

## 🎯 Expected Result
Beautiful AI Agent Team dashboard with:
- 6 specialized AI agents
- Manager Agent chat interface
- Professional responsive design
- Fast loading times

## 🔧 Troubleshooting
- **Build fails:** Check build logs in Coolify
- **404 errors:** Verify nginx.conf routing
- **SSL issues:** Wait 5-10 minutes for certificate generation
- **Environment variables:** Verify in Coolify dashboard

## 📱 Demo URLs
- **Production:** https://demo.yasta.online
- **Coolify Dashboard:** https://coolify.yasta.online
- **Development:** http://localhost:5173