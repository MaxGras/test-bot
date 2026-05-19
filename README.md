# Telegram Bot - New Architecture (SOLID & YAGNI)

Refactored version with **modern FastAPI backend** following SOLID principles and YAGNI, plus separate frontend architecture.

## 🏗️ Architecture Highlights

✅ **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion  
✅ **YAGNI Compliant**: Only implement what's actually needed, no premature abstraction  
✅ **Layered Architecture**: Models → Repositories → Services → Endpoints  
✅ **Dependency Injection**: Services and repositories injected via FastAPI `Depends()`  
✅ **Clean Code**: Each module has one responsibility, easy to test and extend  

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed explanation.

## Project Structure

```
new-bot/
├── backend/                          # FastAPI backend
│   ├── app/
│   │   ├── core/                    # Configuration & database
│   │   │   ├── config.py            # Settings management
│   │   │   └── database.py          # DB connection & session
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   ├── schemas/                 # Pydantic validation
│   │   ├── repositories/            # Data access layer
│   │   ├── services/                # Business logic layer
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/       # HTTP endpoints (organized by resource)
│   │   │       └── dependencies.py  # Dependency injection
│   │   └── main.py                 # FastAPI app factory
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
├── frontend/                         # Frontend (to be implemented)
├── docker-compose.yml               # PostgreSQL + FastAPI services
├── ARCHITECTURE.md                  # Detailed architecture docs
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose

### Run with Docker Compose

```bash
cd /Users/admin/wk-prj/tg-bot/new-bot

# Start all services
docker-compose up

# Access API at http://localhost:8000
```

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Endpoints

**Base URL**: `http://localhost:8000/api/v1`

### Users
- `POST /users` - Create user
- `GET /users/{user_id}` - Get user
- `GET /users/telegram/{telegram_id}` - Get by Telegram ID
- `GET /users` - List all
- `PATCH /users/{user_id}` - Update
- `DELETE /users/{user_id}` - Delete

### Developers
- `POST /developers` - Create developer
- `GET /developers/{developer_id}` - Get developer
- `GET /developers` - List all
- `PATCH /developers/{developer_id}` - Update
- `DELETE /developers/{developer_id}` - Delete

### Calls
- `POST /calls` - Create call
- `GET /calls/{call_id}` - Get call
- `GET /calls` - List (filters: developer_id, sales_manager_id)
- `PATCH /calls/{call_id}` - Update
- `DELETE /calls/{call_id}` - Delete

### Access
- `POST /access` - Grant access
- `GET /access` - List (filter: user_id)
- `DELETE /access/{access_id}` - Revoke

### Notifications
- `POST /notification-settings` - Create settings
- `GET /notification-settings` - List (filters: manager_id, developer_id)
- `PATCH /notification-settings/{settings_id}` - Update
- `POST /notification-settings/{manager_id}/{developer_id}/toggle` - Toggle

## 💻 Common Commands

```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Clean everything
docker-compose down -v

# Database shell
docker-compose exec db psql -U tg_bot_user -d tg_bot_db

# Backend shell
docker-compose exec backend bash

# Rebuild
docker-compose build --no-cache
```

## 🗄️ Database

- **Type**: PostgreSQL 16
- **Host**: `db` (Docker), `localhost:5432` (host machine)
- **User**: `tg_bot_user`
- **Password**: `tg_bot_password`
- **Database**: `tg_bot_db`

Tables auto-created on startup.

## ⚙️ Environment Variables

See `backend/.env`:
```
DATABASE_URL=postgresql+asyncpg://...
ADMIN_ID=your_telegram_id
BOT_TOKEN=your_bot_token
DEBUG=true
TIMEZONE=ETC/GMT-2
```

## 🛠️ Tech Stack

**Backend:**
- FastAPI 0.104.1 - Modern Python web framework
- SQLAlchemy 2.0.23 - Async ORM
- asyncpg 0.29.0 - Async PostgreSQL
- Pydantic 2.5.0 - Data validation
- Uvicorn 0.24.0 - ASGI server

**Database:**
- PostgreSQL 16 (Alpine)

**Deployment:**
- Docker & Docker Compose

## 📖 Layer Breakdown

| Layer | Purpose | Example |
|-------|---------|---------|
| **Endpoints** | HTTP routing & validation | `api/v1/endpoints/users.py` |
| **Services** | Business logic | `services/user_service.py` |
| **Repositories** | Data access abstraction | `repositories/user_repository.py` |
| **Models** | Database schema | `models/user.py` |
| **Schemas** | Request/response validation | `schemas/user.py` |

## ✨ Design Principles

### Single Responsibility
- Each file does ONE thing
- Models don't have logic
- Services don't know about HTTP
- Repositories don't contain business logic

### DRY (Don't Repeat Yourself)
- Base `Repository` class for common CRUD
- Service patterns reused across entities
- Endpoint patterns consistent

### Testability
- Each layer testable independently
- Mock repositories for service tests
- Mock services for endpoint tests

## 🔄 Adding a New Feature

To add a "Team" entity:

```
1. models/team.py               # SQLAlchemy model
2. schemas/team.py              # Pydantic schemas
3. repositories/team_repository.py  # Data access
4. services/team_service.py     # Business logic
5. api/v1/endpoints/teams.py    # HTTP endpoints
6. Update api/v1/__init__.py    # Register router
7. Update api/v1/dependencies.py # Add dependency
```

Done! All layers follow the same pattern.

## 📊 What's Implemented

✅ CRUD for Users, Developers, Calls, Access, Notifications  
✅ Async database with SQLAlchemy 2.0  
✅ Pydantic validation  
✅ Proper error handling (400, 404, 500)  
✅ Health check endpoint  
✅ Auto API documentation  
✅ Docker containerization  
✅ SOLID architecture  

## 🚧 Next Steps

1. ✅ Backend API (SOLID architecture)
2. ✅ PostgreSQL + Docker
3. ⏳ Frontend (React/Vue)
4. ⏳ Authentication (JWT)
5. ⏳ WebSocket (real-time updates)
6. ⏳ Background tasks (notifications)
7. ⏳ Testing (pytest)
8. ⏳ CI/CD pipeline
