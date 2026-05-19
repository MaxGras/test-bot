# Railway Deployment Guide

Deploy the Telegram Bot to Railway.app with automatic environment variable setup.

---

## 📋 Prerequisites

- Railway.app account (free tier available)
- GitHub repository pushed
- Environment variables ready (see `.env.deployment-checklist`)

---

## 🚀 Step-by-Step Deployment

### 1. Connect GitHub to Railway

1. Go to [Railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select your repository
4. Connect your GitHub account if needed

### 2. Create Backend Service

1. Click **+ Add Service**
2. Select **GitHub Repo** (your repo)
3. Choose `/backend` as the root directory
4. Name it: `telegram-bot-backend`

### 3. Create Frontend Service

1. Click **+ Add Service**
2. Select **GitHub Repo** (your repo)
3. Choose `/frontend` as the root directory
4. Name it: `telegram-bot-frontend`

### 4. Create PostgreSQL Database

1. Click **+ Add Service**
2. Select **Database** → **PostgreSQL**
3. Railway auto-creates:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

### 5. Configure Backend Service

Click on **telegram-bot-backend** service:

**Variables Tab** - Add these:

```
API_TITLE=Telegram Bot API
API_VERSION=1.0.0
API_DESCRIPTION=REST API for developer call scheduling
API_URL=${{ RAILWAY_PUBLIC_DOMAIN }}
FRONTEND_URL=https://your-frontend-domain.railway.app
ADMIN_ID=YOUR_TELEGRAM_ID
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BOT_TOKEN=your_bot_token_from_botfather
BOT_WEBHOOK_URL=${{ RAILWAY_PUBLIC_DOMAIN }}/webhook/telegram
TIMEZONE=UTC
ENVIRONMENT=production
DEBUG=False
```

**Database Connection:**

Add variable from PostgreSQL service:

```
DATABASE_URL=postgresql+asyncpg://${{ PGUSER }}:${{ PGPASSWORD }}@${{ PGHOST }}:${{ PGPORT }}/${{ PGDATABASE }}
```

Railway will auto-link the Postgres service, so you can use the variables above.

**Settings Tab:**

- Port: `8000` (Railway auto-detects)
- Restart Policy: `Always`
- Healthy Restarts: `On`

### 6. Configure Frontend Service

Click on **telegram-bot-frontend** service:

**Variables Tab** - Add:

```
VITE_API_URL=${{ RAILWAY_PUBLIC_DOMAIN }}/api/v1
VITE_ADMIN_ID=YOUR_TELEGRAM_ID
VITE_ENVIRONMENT=production
VITE_APP_TITLE=Developer Call Scheduler
```

Replace `${{ RAILWAY_PUBLIC_DOMAIN }}` with actual backend domain after first deploy.

**Settings Tab:**

- Port: `5173`
- Build Command: `npm install && npm run build`
- Start Command: Leave empty (Dockerfile handles it)

### 7. Link Services

Click **Connect** in the left sidebar:

1. Click **+ Create Connection**
2. Select **telegram-bot-backend** (depends on PostgreSQL)
3. Select **telegram-bot-frontend** (depends on backend)

This ensures proper startup order.

### 8. Deploy

1. Click **Deploy** on each service
2. Wait for builds to complete (5-10 min)
3. Check **Deployments** tab for status

---

## 🔗 Get Your Domains

After deployment:

1. **Backend URL**: Click `telegram-bot-backend` → **Settings** → Copy the public domain
   - Example: `https://telegram-bot-backend-xxxx.railway.app`

2. **Frontend URL**: Click `telegram-bot-frontend` → **Settings** → Copy the public domain
   - Example: `https://telegram-bot-frontend-xxxx.railway.app`

---

## 🔄 Update Environment Variables

After getting your domains:

### Backend Variables (Update these)

```
API_URL=https://telegram-bot-backend-xxxx.railway.app
BOT_WEBHOOK_URL=https://telegram-bot-backend-xxxx.railway.app/webhook/telegram
FRONTEND_URL=https://telegram-bot-frontend-xxxx.railway.app
```

### Frontend Variables (Update)

```
VITE_API_URL=https://telegram-bot-backend-xxxx.railway.app/api/v1
```

**How to update:**
1. Click service → **Variables**
2. Edit the variable
3. Click **Save**
4. Service auto-redeploys

---

## 🤖 Register Bot Webhook

After backend deployment, register the webhook with Telegram:

```bash
curl -X POST https://api.telegram.org/bot<BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://telegram-bot-backend-xxxx.railway.app/webhook/telegram",
    "drop_pending_updates": true
  }'
```

---

## 🎯 Set BotFather Mini App URL

1. Chat with @BotFather
2. `/mybots` → Your bot → `Bot Settings` → `Menu button` → `Web App`
3. URL: `https://telegram-bot-frontend-xxxx.railway.app`

---

## 📊 View Logs

**Backend logs:**
1. Click `telegram-bot-backend` service
2. Click **Logs** tab
3. Watch real-time logs

**Frontend logs:**
1. Click `telegram-bot-frontend` service
2. Click **Logs** tab

---

## 🔐 Secret Management

Railway has built-in secret management. For sensitive values:

1. Click service → **Variables**
2. Check the **🔒 Secret** box next to sensitive variables
3. Railway won't expose them in logs

---

## 💾 Database Backups

Railway auto-backs up PostgreSQL. To access:

1. Click PostgreSQL service
2. Click **Backups** tab
3. Download or restore from any backup

---

## 📈 Monitoring

Railway provides monitoring:

1. Click service
2. **Deployments** → See all deploys and status
3. **Logs** → View application logs
4. **Metrics** → CPU, Memory, Network usage

---

## 🚨 Troubleshooting

### Frontend Can't Reach Backend

**Problem:** CORS errors in frontend console

**Solution:**
- Update `VITE_API_URL` with correct backend domain
- Redeploy frontend

### Database Connection Failed

**Problem:** Backend won't connect to database

**Solution:**
1. Check PostgreSQL service is **running**
2. Verify `DATABASE_URL` is set correctly
3. Click backend service → **Logs** → Check error
4. Restart backend service

### Build Fails

**Problem:** Deployment fails with build error

**Solution:**
1. Check **Logs** tab for error details
2. Common causes:
   - Missing environment variables
   - Node modules not installing
   - Python dependency conflict
3. Click **Restart** to retry

### App Keeps Crashing

**Problem:** Service crashes after deploy

**Solution:**
1. Check **Logs** for error message
2. Verify all required environment variables are set
3. Check database is accessible
4. Restart service

---

## 🔄 Updates & Redeployment

### After Code Changes

1. Push to GitHub
2. Railway auto-deploys
3. Watch **Deployments** tab

### Disable Auto-Deploy

1. Click service → **Settings**
2. Disable **Auto-Deploy**
3. Deploy manually: Click **Deploy** button

### Manual Rebuild

```bash
# If needed, trigger rebuild from CLI
# Install Railway CLI: npm i -g @railway/cli
railway up
```

---

## 💰 Railway Pricing

- **Free tier**: $5 credits/month (enough for testing)
- **Hobby**: $5/month base + usage
- **Pro**: $20/month base + usage

Current setup uses:
- 1x Backend service (~$5/month)
- 1x Frontend service (~$5/month)
- 1x PostgreSQL (~$15/month, free tier available)

---

## 📝 Environment Variables Checklist

Before deploying, have these ready:

- [ ] Your Telegram ID (from @userinfobot)
- [ ] Bot Token (from @BotFather)
- [ ] Generated SECRET_KEY (32+ random chars)
- [ ] Your domain (after first deploy)
- [ ] Database auto-created by Railway

---

## 🎓 Railway Best Practices

✅ Use environment variables for all secrets  
✅ Enable auto-deploy from GitHub  
✅ Monitor logs regularly  
✅ Test webhooks after deploy  
✅ Use Railway's built-in PostgreSQL  
✅ Enable backups for database  
✅ Use domains for linking services  

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Check service **Logs** for errors
- Re-read the configuration section above
- Try restarting the service

---

**Last Updated**: May 19, 2026
