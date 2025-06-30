# Coolify Deployment Instructions

## Issue Resolution

The deployment was failing because the application was trying to bind directly to port 80 on the host system, which conflicts with Coolify's Traefik reverse proxy.

## Changes Made

### 1. Added `docker-compose.yaml`
- Configures the application for Coolify's internal networking
- Removes direct port binding (Coolify/Traefik handles routing)
- Adds proper labels for Coolify management

### 2. Added `.dockerignore`
- Reduces build context size
- Excludes unnecessary files from Docker build
- Improves build performance

## Deployment Steps

1. **Run the deployment script:**
   ```bash
   deploy-coolify-fix.bat
   ```

2. **Monitor deployment in Coolify:**
   - Go to your Coolify dashboard
   - Check the deployment logs
   - Wait for "Running" status

3. **Access your application:**
   ```
   https://demo.yasta.online
   ```

## How It Works

1. **Coolify Network:** Application joins the `coolify` network
2. **Internal Port:** Container exposes port 80 internally (not to host)
3. **Traefik Routing:** Coolify's Traefik proxy routes external traffic to your container
4. **Domain SSL:** Automatic SSL certificate via Let's Encrypt

## Troubleshooting

If deployment still fails:

1. **Check running containers:**
   ```bash
   docker ps | grep 80
   ```

2. **Remove conflicting containers:**
   ```bash
   docker stop <container_id>
   ```

3. **Restart deployment in Coolify**

## Technical Details

- **Network:** Uses Coolify's shared network
- **Ports:** No host port mapping (handled by Traefik)
- **Environment:** Production environment variables
- **Build:** Multi-stage Docker build for optimization
