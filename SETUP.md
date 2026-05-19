# Setup Guide — Telegram Bot Full Stack

Complete setup guide for running the entire application (Backend + Frontend + Database) with Docker Compose.

---

## 📋 Prerequisites

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git** (for cloning)

### Check Installation

```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start (One Command!)

```bash
cd /Users/admin/wk-prj/tg-bot/new-bot

# Start all services
docker-compose up

# App will be available at:
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# Database: localhost:5432
```

That's it! Everything will start automatically. 🎉

---

## 🔧 Environment Configuration

### Backend Admin ID

The **hardcoded admin Telegram ID** is in `backend/.env`:

```ini
# Admin - Change this to YOUR Telegram ID
ADMIN_ID=6857090051
```

**To change the admin:**

1. Get your Telegram ID using @userinfobot
2. Edit `backend/.env`:
   ```bash
   nano backend/.env
   ```
3. Change `ADMIN_ID=YOUR_TELEGRAM_ID`
4. Restart services:
   ```bash
   docker-compose restart backend
   ```

### Frontend Configuration

Frontend settings in `frontend/.env`:

```ini
# API points to backend (auto-configured in docker-compose)
VITE_API_URL=http://localhost:8000/api/v1

# Same admin ID as backend
VITE_ADMIN_ID=6857090051

# Environment
VITE_ENVIRONMENT=development
```

Docker Compose automatically sets `VITE_API_URL` to `http://backend:8000/api/v1` (internal network).

---

## 📚 Service Details

### Database (PostgreSQL)
- **Container**: `tg_bot_db`
- **Port**: 5432
- **User**: `tg_bot_user`
- **Password**: `tg_bot_password`
- **Database**: `tg_bot_db`
- **Volume**: `postgres_data` (persistent)

### Backend (FastAPI)
- **Container**: `tg_bot_backend`
- **Port**: 8000
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Network**: Connects to DB

### Frontend (React + Vite)
- **Container**: `tg_bot_frontend`
- **Port**: 5173
- **URL**: http://localhost:5173
- **API Endpoint**: Points to backend via docker network

### Network
- All services connected via `app-network` bridge
- Services can talk to each other using container names
- Only frontend and backend expose ports to host

---

## 📖 Common Commands

### Start Services

```bash
# Start in foreground (see logs)
docker-compose up

# Start in background
docker-compose up -d

# Start specific service
docker-compose up backend
docker-compose up frontend
docker-compose up db
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Follow logs (tail -f)
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Stop Services

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop backend

# Stop and remove containers
docker-compose down

# Remove everything including volumes (data)
docker-compose down -v

# Remove everything including images
docker-compose down -v --rmi all
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific
docker-compose restart backend

# Restart after code changes
docker-compose restart frontend
```

### Execute Commands

```bash
# Run command in container
docker-compose exec backend bash
docker-compose exec frontend npm run build
docker-compose exec db psql -U tg_bot_user -d tg_bot_db

# Database shell
docker-compose exec db psql -U tg_bot_user -d tg_bot_db
```

### Rebuild Images

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend

# Rebuild and start
docker-compose build && docker-compose up

# Rebuild without cache
docker-compose build --no-cache
```

---

## 🐛 Troubleshooting

### Backend Can't Connect to Database

**Problem**: Backend shows connection error

**Solution**:
```bash
# Check if DB is healthy
docker-compose ps
# Should show "db" with status "Up (healthy)"

# View DB logs
docker-compose logs db

# Restart DB
docker-compose restart db
```

### Frontend Can't Reach Backend

**Problem**: API calls fail in frontend

**Solution**:
```bash
# Check if backend is running
docker-compose ps
# Should show "backend" with status "Up"

# In docker-compose, API URL is: http://backend:8000/api/v1
# Locally (outside docker), use: http://localhost:8000/api/v1
```

### Port Already in Use

**Problem**: Port 5173, 8000, or 5432 is already in use

**Solution**:
```bash
# Find process using port
lsof -i :5173   # Frontend
lsof -i :8000   # Backend
lsof -i :5432   # Database

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "5174:5173"  # Frontend on 5174 instead
```

### Database Data Persistence

**Problem**: Data disappeared after restart

**Solution**:
```bash
# Check volume exists
docker volume ls | grep postgres_data

# Ensure you're NOT using: docker-compose down -v
# That deletes the volume!

# Use instead:
docker-compose stop     # Keeps data
docker-compose down     # Keeps data
```

### Build Issues

**Problem**: Docker build fails

**Solution**:
```bash
# Clean rebuild
docker-compose build --no-cache

# Check Dockerfile is valid
docker build ./backend -f ./backend/Dockerfile

# Free up space
docker system prune
```

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Defines all services |
| `backend/.env` | Backend config (ADMIN_ID, DATABASE_URL, etc.) |
| `backend/Dockerfile` | Backend container image |
| `frontend/.env` | Frontend config (API_URL, ADMIN_ID) |
| `frontend/Dockerfile` | Frontend container image |
| `backend/requirements.txt` | Python dependencies |
| `frontend/package.json` | Node dependencies |

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────┐
│         Docker Compose (app-network)        │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐    ┌──────────┐  ┌────────┐ │
│  │ Frontend │    │ Backend  │  │   DB   │ │
│  │ :5173    │───→│ :8000    │─→│ :5432  │ │
│  │ Vite     │    │ FastAPI  │  │   PG   │ │
│  └──────────┘    └──────────┘  └────────┘ │
│                                             │
│  Services connected via: app-network       │
│  Frontend API URL: http://backend:8000/... │
│  Database URL: postgresql://db:5432/...    │
│                                             │
└─────────────────────────────────────────────┘
         ↓ Exposed to Host Machine
    ┌─────────────────────┐
    │  localhost:5173     │ ← Frontend
    │  localhost:8000     │ ← Backend API
    │  localhost:5432     │ ← Database
    └─────────────────────┘
```

---

## 🎯 First Run Checklist

- [ ] Clone repository
- [ ] Navigate to `new-bot` directory
- [ ] Update `backend/.env` with your ADMIN_ID
- [ ] Run `docker-compose up`
- [ ] Wait for all services to start (db → backend → frontend)
- [ ] Open http://localhost:5173 in browser
- [ ] Backend docs at http://localhost:8000/docs
- [ ] Try logging in with your Telegram ID

---

## 🌐 Deployment

### Local Development
```bash
docker-compose up
```

### Production (with env variables)
```bash
export ADMIN_ID=your_telegram_id
export BOT_TOKEN=your_bot_token
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Using Environment File
```bash
# Create .env.prod
ADMIN_ID=your_id
BOT_TOKEN=your_token

# Use with compose
docker-compose --env-file .env.prod up
```

---

## 📝 Notes

- **Auto-reload**: Frontend and backend both reload on code changes
- **Database persistence**: Data survives `docker-compose stop` and restart
- **Network isolation**: Services communicate via internal network
- **No external access**: Database not exposed outside docker network (only to backend)

---

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f [service]`
2. Verify services running: `docker-compose ps`
3. Check network: `docker network ls`
4. Test backend: `curl http://localhost:8000/health`
5. Check frontend build: `docker-compose build --no-cache frontend`

---

## 🚀 Next Steps

1. **Test Backend API**:
   - Go to http://localhost:8000/docs
   - Try creating a user

2. **Test Frontend**:
   - Go to http://localhost:5173
   - Login with your Telegram account

3. **Connect Telegram Bot**:
   - Get bot token from @BotFather
   - Update `backend/.env` with BOT_TOKEN
   - Run the old-bot Telegram bot

4. **Deploy**:
   - Push to Git
   - Deploy docker-compose to your server
   - Update Telegram Mini App URL

---

**Last Updated**: May 19, 2026
