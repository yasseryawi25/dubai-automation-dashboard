# Dubai Real Estate Dashboard - Coolify Deployment Guide

## 🎯 Deployment Overview
Deploy your Dubai Real Estate AI Dashboard to your Coolify server with automated SSL and domain management.

## 📋 Pre-deployment Checklist
- [x] Code pushed to GitHub repository
- [x] Environment variables configured  
- [x] Docker configuration ready
- [x] Database services running on Coolify

## 🚀 Coolify Deployment Steps

### Step 1: Create New Application in Coolify

1. **Access Coolify Dashboard:**
   - URL: `https://coolify.yasta.online`
   - Login with your admin credentials

2. **Navigate to Project:**
   - Go to **Projects** → **Dubai Real Estate Platform**
   - Click **Add Resource** → **Application**

3. **Configure Git Repository:**
   ```
   Source Type: Git Repository
   Repository URL: https://github.com/YOUR_USERNAME/dubai-real-estate-dashboard.git
   Branch: production
   ```

### Step 2: Application Configuration

**Build Configuration:**
```
Build Command: npm ci && npm run build
Start Command: (auto-detected from Dockerfile)
Port: 80
Dockerfile Path: ./Dockerfile
```

**Environment Variables:**
```bash
# Basic Configuration
NODE_ENV=production
VITE_APP_NAME=Dubai Real Estate AI Dashboard

# Database Configuration (from your existing services)
VITE_DATABASE_URL=postgresql://automation_user:YOUR_PASSWORD@automation-postgres:5432/automation_platform
VITE_REDIS_URL=redis://:YOUR_PASSWORD@automation-redis:6379

# API Configuration
VITE_API_URL=https://api.yasta.online
VITE_SUPABASE_URL=https://supabase.yasta.online
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Services (for future integration)
VITE_VAPI_API_KEY=your_vapi_api_key
VITE_OPENAI_API_KEY=your_openai_api_key

# Client Configuration
VITE_CLIENT_ID=demo_client
VITE_DEFAULT_LANGUAGE=en
```

### Step 3: Domain Configuration

**Primary Domain:**
```
Domain: dashboard.yasta.online
SSL: Automatic (Let's Encrypt)
Force HTTPS: Yes
```

**Demo Domains (optional):**
```
demo.yasta.online
client1.yasta.online
client2.yasta.online
```

### Step 4: Deploy Application

1. **Review Configuration:**
   - Verify all environment variables
   - Check domain settings
   - Confirm SSL configuration

2. **Start Deployment:**
   - Click **Deploy**
   - Monitor deployment logs
   - Wait for "Running" status

3. **Verify Deployment:**
   - Visit: `https://dashboard.yasta.online`
   - Check SSL certificate (green lock)
   - Test dashboard functionality

## 🔧 Post-Deployment Configuration

### Database Connection Testing
```bash
# Test database connectivity
npm run db:test

# Run comprehensive diagnostics
npm run db:diagnose
```

### Health Check Verification
```bash
# Check application health
curl https://dashboard.yasta.online/health

# Verify API endpoints
curl https://dashboard.yasta.online/api/status
```

## 📊 Monitoring & Maintenance

### Coolify Monitoring
- **Application Status:** Monitor in Coolify dashboard
- **Resource Usage:** Check CPU, memory, disk usage
- **Logs:** Review application and deployment logs
- **Metrics:** Track response times and uptime

### Database Health
- **Connection Status:** Monitor database connectivity
- **Performance:** Track query response times
- **Storage:** Monitor database storage usage
- **Backups:** Verify automated backup execution

## 🔄 Update Process

### For Code Updates:
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update: [description]"
   git push origin production
   ```

2. **Auto-Deploy in Coolify:**
   - Coolify automatically detects changes
   - Triggers new deployment
   - Updates application with zero downtime

### For Environment Changes:
1. **Update in Coolify:**
   - Go to application settings
   - Modify environment variables
   - Restart application

## 🚨 Troubleshooting

### Common Deployment Issues:

**Build Failures:**
```bash
# Check build logs in Coolify
# Verify package.json scripts
# Ensure all dependencies installed
```

**Database Connection Issues:**
```bash
# Verify database service status
# Check connection strings
# Test internal network connectivity
```

**SSL Certificate Problems:**
```bash
# Check domain DNS configuration
# Verify Coolify SSL settings
# Allow 24-48 hours for DNS propagation
```

### Quick Fixes:
1. **Application Won't Start:** Check environment variables and Docker configuration
2. **502 Bad Gateway:** Verify application port and health check
3. **Database Errors:** Check database service status and credentials
4. **SSL Issues:** Verify domain configuration and DNS settings

## 💰 Cost Optimization

### Current Infrastructure Costs:
```
Contabo VPS: AED 44/month
Domain (.yasta.online): AED 15/month
Total: AED 59/month

Savings vs DigitalOcean: AED 117/month (66% reduction)
```

### Scaling Considerations:
- **5 clients:** Same VPS, multiple subdomains
- **10+ clients:** Consider VPS upgrade
- **Enterprise:** Multiple VPS instances

## 🎯 Success Metrics

**Deployment Success:**
- [ ] Application accessible via HTTPS
- [ ] SSL certificate valid
- [ ] Database connection working
- [ ] All 6 AI agents displaying
- [ ] Demo functionality operational

**Performance Targets:**
- [ ] Page load time < 3 seconds
- [ ] Dashboard responsive on mobile
- [ ] Real-time updates working
- [ ] Health checks passing

## 📞 Support & Maintenance

### Regular Maintenance:
- **Weekly:** Review application logs and performance
- **Monthly:** Update dependencies and security patches
- **Quarterly:** Optimize database and clean up storage

### Emergency Support:
- **Monitor:** Set up alerts for downtime
- **Backup:** Regular database and code backups
- **Recovery:** Document recovery procedures

---

**Deployment prepared for:** Dubai Real Estate AI Dashboard  
**Infrastructure:** Contabo VPS + Coolify  
**Target URL:** https://dashboard.yasta.online  
**Estimated Deployment Time:** 15-20 minutes
