# Deployment Guide

Complete guide for deploying the Telegram Bot application to production.

---

## 📋 Prerequisites

- Docker & Docker Compose (v2.0+)
- Domain name (for production)
- Telegram Bot Token (@BotFather)
- Server with public IP (AWS, DigitalOcean, Heroku, etc.)

---

## 🚀 Deployment Steps

### 1. Prepare Environment Files

Create `.env` files with your production values:

#### Backend Configuration (`backend/.env`)

```bash
# Copy the production template
cp backend/.env.production backend/.env

# Edit with your production values
nano backend/.env
```

**Required changes:**
- `DATABASE_URL` - Update with your database credentials
- `API_URL` - Set to your API domain (e.g., `https://api.yourdomain.com`)
- `FRONTEND_URL` - Set to your frontend domain (e.g., `https://yourdomain.com`)
- `ADMIN_ID` - Your Telegram ID (get from @userinfobot)
- `SECRET_KEY` - Generate a secure random key
- `BOT_TOKEN` - Your token from @BotFather
- `BOT_WEBHOOK_URL` - Webhook URL for Telegram updates
- `ENVIRONMENT` - Set to `production`
- `DEBUG` - Set to `False`

#### Frontend Configuration (`frontend/.env`)

```bash
# Copy the production template
cp frontend/.env.production frontend/.env

# Edit with your production values
nano frontend/.env
```

**Required changes:**
- `VITE_API_URL` - Set to your API domain (e.g., `https://api.yourdomain.com/api/v1`)
- `VITE_ADMIN_ID` - Must match backend `ADMIN_ID`
- `VITE_ENVIRONMENT` - Set to `production`

---

## 🌐 Domain & URL Configuration

### API URL
- **Development**: `http://localhost:8000`
- **Production**: `https://api.yourdomain.com`
- **Docker Internal**: `http://backend:8000`

### Frontend URL
- **Development**: `http://localhost:5173`
- **Production**: `https://yourdomain.com`

### Bot Webhook URL
- **Development**: `http://localhost:8000/webhook/telegram` (requires ngrok)
- **Production**: `https://api.yourdomain.com/webhook/telegram`

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY` to a random 32+ character string
  ```bash
  python3 -c "import secrets; print(secrets.token_urlsafe(32))"
  ```
- [ ] Set `DEBUG=False` in backend `.env`
- [ ] Update `ADMIN_ID` to your Telegram ID
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL on your domain
- [ ] Set proper CORS origins (not `*`)
- [ ] Rotate `BOT_TOKEN` if needed
- [ ] Use environment variables, not hardcoded secrets

---

## 📦 Docker Deployment

### Option 1: Standard Docker Compose

```bash
# Clone repository
git clone <your-repo> tg-bot
cd tg-bot/new-bot

# Create .env files (see step 1 above)
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env

# Edit environment files
nano backend/.env
nano frontend/.env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Docker Compose with External Database

If using managed database (RDS, managed PostgreSQL):

```bash
# Update DATABASE_URL in backend/.env to point to external DB
DATABASE_URL=postgresql+asyncpg://user:pass@db.example.com:5432/dbname

# Start without db service
docker-compose up -d --scale db=0
```

---

## 🌍 Reverse Proxy Setup (Nginx)

Create `/etc/nginx/sites-available/tg-bot`:

```nginx
# Frontend
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# API Backend
server {
    listen 80;
    listen [::]:80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and test:
```bash
sudo ln -s /etc/nginx/sites-available/tg-bot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 HTTPS/SSL Setup

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificates
sudo certbot certonly --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renew (crontab)
0 0 1 * * certbot renew --quiet
```

Update nginx config to use SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of config
}
```

---

## 🤖 Telegram Bot Setup

### Register Webhook with Telegram

```bash
curl -X POST https://api.telegram.org/bot<BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.yourdomain.com/webhook/telegram",
    "drop_pending_updates": true
  }'
```

### Verify Webhook

```bash
curl https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo
```

### Set Mini App Button

1. Chat with @BotFather
2. `/mybots` → Select your bot → `Bot Settings` → `Menu button` → `Web App`
3. URL: `https://yourdomain.com`

---

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Health Check

```bash
# Backend health
curl https://api.yourdomain.com/health

# Frontend
Visit https://yourdomain.com
```

### Backup Database

```bash
# Create backup
docker-compose exec db pg_dump -U tg_bot_user tg_bot_db > backup.sql

# Restore backup
docker-compose exec -T db psql -U tg_bot_user tg_bot_db < backup.sql
```

---

## 🔄 Updates & Maintenance

### Deploy Updates

```bash
# Pull latest code
git pull origin main

# Rebuild containers
docker-compose build --no-cache

# Restart services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Database Migrations

```bash
# If using Alembic or similar
docker-compose exec backend alembic upgrade head
```

---

## ❌ Troubleshooting

### Port Already in Use

```bash
# Find process on port
lsof -i :80
lsof -i :443
lsof -i :5432

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check database status
docker-compose ps db

# View database logs
docker-compose logs db

# Connect to database
docker-compose exec db psql -U tg_bot_user -d tg_bot_db
```

### Bot Webhook Not Receiving Updates

```bash
# Check webhook status
curl https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo

# Re-set webhook
curl -X POST https://api.telegram.org/bot<BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://api.yourdomain.com/webhook/telegram"}'
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Verify API URL is correct
# Open browser DevTools → Network → check API calls
# Should go to: https://api.yourdomain.com/api/v1
```

---

## 📝 Environment Variables Summary

| Variable | Backend | Frontend | Required | Example |
|----------|---------|----------|----------|---------|
| `API_URL` | ✓ | | Prod only | `https://api.yourdomain.com` |
| `FRONTEND_URL` | ✓ | | Prod only | `https://yourdomain.com` |
| `VITE_API_URL` | | ✓ | Yes | `https://api.yourdomain.com/api/v1` |
| `ADMIN_ID` | ✓ | ✓ | Yes | `6857090051` |
| `BOT_TOKEN` | ✓ | | Yes | From @BotFather |
| `BOT_WEBHOOK_URL` | ✓ | | Prod only | `https://api.yourdomain.com/webhook/telegram` |
| `DATABASE_URL` | ✓ | | Yes | `postgresql+...` |
| `SECRET_KEY` | ✓ | | Yes | Random 32+ chars |
| `ENVIRONMENT` | ✓ | ✓ | Yes | `production` |
| `DEBUG` | ✓ | | Yes | `False` |
| `VITE_ENVIRONMENT` | | ✓ | Yes | `production` |

---

## 🚀 Quick Deploy Script

```bash
#!/bin/bash
set -e

echo "🚀 Deploying Telegram Bot..."

# Navigate to project
cd /path/to/new-bot

# Update code
git pull origin main

# Build images
docker-compose build --no-cache

# Restart services
docker-compose up -d

# Show logs
docker-compose logs -f

echo "✅ Deployment complete!"
```

Save as `deploy.sh` and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📞 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables
3. Test endpoints with curl
4. Check Telegram bot webhook status

---

**Last Updated**: May 19, 2026
