# FastAPI Backend — Project Context

---

## 📌 IMPORTANT: Documentation Maintenance

**Every time you change code, update this CONTEXT.md file** with:
- ✅ New features added
- ✅ New endpoints created
- ✅ Database schema changes
- ✅ New services or repositories
- ✅ New environment variables
- ✅ Changed behavior or flow
- ✅ Bug fixes or improvements

**Keep this document in sync with the codebase so future developers (or you) have an accurate reference.**

---

## Project Overview

A **modern REST API backend** for a developer call scheduling system. Built with FastAPI following **SOLID principles and YAGNI** patterns. Handles user management, developer profiles, call scheduling, access control, and notifications.

**Architecture**: Layered (Endpoints → Services → Repositories → Models)  
**Design**: SOLID compliant, testable, maintainable, scalable

---

## Tech Stack

- **Language**: Python 3.12
- **Web Framework**: FastAPI 0.104.1 (async)
- **ORM**: SQLAlchemy 2.0.23 (async)
- **Database**: PostgreSQL 16 (Docker)
- **Async Driver**: asyncpg 0.29.0
- **Data Validation**: Pydantic 2.5.0
- **Config**: Pydantic Settings 2.1.0
- **Server**: Uvicorn 0.24.0 (ASGI)
- **Date/Time**: Pendulum 3.0.0, pytz 2023.3

---

## Project Structure

```
backend/
├── app/
│   ├── __init__.py                  # App exports
│   ├── main.py                      # FastAPI app factory (30 lines)
│   │
│   ├── core/                        # Core infrastructure
│   │   ├── __init__.py
│   │   ├── config.py                # Settings from .env (S - Single Responsibility)
│   │   └── database.py              # PostgreSQL connection setup (S)
│   │
│   ├── models/                      # SQLAlchemy ORM models (1 model = 1 file)
│   │   ├── __init__.py              # Base + imports
│   │   ├── user.py                  # User entity
│   │   ├── developer.py             # Developer entity
│   │   ├── call.py                  # Call/Meeting entity
│   │   ├── access.py                # Access control entity
│   │   └── notification_settings.py # Notification preferences
│   │
│   ├── schemas/                     # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── user.py                  # User schemas (Create, Update, Response)
│   │   ├── developer.py
│   │   ├── call.py
│   │   ├── access.py
│   │   └── notification_settings.py
│   │
│   ├── repositories/                # Data access layer (I - Interface Segregation, D - DI)
│   │   ├── __init__.py
│   │   ├── base.py                  # Base repository (DRY - generic CRUD)
│   │   ├── user_repository.py       # User queries
│   │   ├── developer_repository.py  # Developer queries
│   │   ├── call_repository.py       # Call queries (with filters)
│   │   ├── access_repository.py     # Access queries
│   │   └── notification_settings_repository.py
│   │
│   ├── services/                    # Business logic layer (O - Open/Closed)
│   │   ├── __init__.py
│   │   ├── user_service.py          # User operations
│   │   ├── developer_service.py     # Developer operations
│   │   ├── call_service.py          # Call operations + filtering
│   │   ├── access_service.py        # Access control operations
│   │   └── notification_service.py  # Notification operations
│   │
│   ├── api/                         # HTTP API routes
│   │   ├── __init__.py
│   │   └── v1/                      # API v1 (allows future versions)
│   │       ├── __init__.py          # Router registration
│   │       ├── dependencies.py      # Service dependency injection
│   │       └── endpoints/           # Endpoints by resource
│   │           ├── __init__.py
│   │           ├── users.py         # GET/POST/PATCH/DELETE /users
│   │           ├── developers.py    # GET/POST/PATCH/DELETE /developers
│   │           ├── calls.py         # GET/POST/PATCH/DELETE /calls
│   │           ├── access.py        # GET/POST/DELETE /access
│   │           ├── notifications.py # GET/POST/PATCH /notification-settings
│   │           └── dependencies.py  # Re-export dependencies
│   │
│   ├── exceptions/                  # Custom exceptions (I - Interface Segregation)
│   ├── middleware/                  # Custom middleware
│   └── utils/                       # Utility functions
│
├── .env                             # Environment variables
├── requirements.txt                 # Python dependencies
├── Dockerfile                       # Container image definition
└── CONTEXT.md                       # This file
```

---

## Architecture Overview

### Layer Responsibilities

#### 1. **Core Layer** (`core/`)
Handles application infrastructure:
- **config.py**: Loads environment variables using Pydantic Settings
- **database.py**: Creates async PostgreSQL connection, session factory, init/close functions

**Principle**: Single Responsibility - each file has one job

#### 2. **Models Layer** (`models/`)
SQLAlchemy ORM definitions (database schema):
- One model = one file
- No business logic
- Pure data structures
- Relationships and constraints defined here

**Example**: `models/user.py` contains `User` model with fields, constraints, and `__repr__`

#### 3. **Schemas Layer** (`schemas/`)
Pydantic models for request/response validation:
- `Create` schema - what client sends to create entity
- `Update` schema - what client sends to update
- `Response` schema - what API returns
- Validation rules, field types, descriptions

**Example**: `schemas/user.py` has `UserCreate`, `UserUpdate`, `UserResponse`

#### 4. **Repository Layer** (`repositories/`)
**Responsibility**: Data access abstraction. Convert business queries to database queries.

**Base Repository** (`base.py`):
- Generic CRUD operations: `create()`, `get()`, `get_all()`, `update()`, `delete()`
- Type-safe with generics: `Repository[ModelType, SchemaType]`
- Pagination support
- Reduces code duplication

**Specific Repositories** (e.g., `user_repository.py`):
- Inherit from `Base Repository`
- Add entity-specific queries: `get_by_telegram_id()`, `get_by_role()`
- All database queries live here, nowhere else

**Principle**: Dependency Inversion - services depend on repositories, not database code

#### 5. **Service Layer** (`services/`)
**Responsibility**: Business logic. Orchestrate operations using repositories.

**Examples**:
```python
# UserService.create_user()
# - validates input
# - creates user in DB
# - returns response

# CallService.list_calls()
# - handles filtering logic
# - calls appropriate repository method
# - formats response
```

**Principle**: Services know about business rules, don't know about HTTP

#### 6. **API/Endpoints Layer** (`api/`)
**Responsibility**: HTTP handling. Accept requests, call services, return responses.

**Structure**:
- `v1/` - API version 1
- `endpoints/users.py` - all `/users/*` routes
- `dependencies.py` - FastAPI `Depends()` injection
- Each endpoint: 5-10 lines
  - Accept request
  - Call service
  - Handle errors (400, 404, 500)
  - Return response

**Principle**: Interface Segregation - endpoints only expose what's needed

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    role ENUM('admin', 'developer', 'sales_manager') NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    INDEX (telegram_id)
);
```

### Developers Table
```sql
CREATE TABLE developers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Calls Table
```sql
CREATE TABLE calls (
    id SERIAL PRIMARY KEY,
    developer_id INT NOT NULL,
    sales_manager_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    title VARCHAR(255) NOT NULL,
    notes TEXT,
    call_link VARCHAR(500),
    salary_fork VARCHAR(255),
    job_post_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE,
    FOREIGN KEY (sales_manager_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (start_time),
    INDEX (end_time)
);
```

### Access Table
```sql
CREATE TABLE access (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    granted_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id)
);
```

### NotificationSettings Table
```sql
CREATE TABLE notification_settings (
    id SERIAL PRIMARY KEY,
    sales_manager_id INT NOT NULL,
    developer_id INT NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (sales_manager_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE,
    UNIQUE (sales_manager_id, developer_id)
);
```

---

## API Endpoints

**Base URL**: `http://localhost:8000/api/v1`

### Health Check
- `GET /health` - API is alive

### Users Endpoints
- `POST /users` - Create user
- `GET /users/{user_id}` - Get user by ID
- `GET /users/telegram/{telegram_id}` - Get user by Telegram ID
- `GET /users` - List all users (pagination: skip, limit)
- `PATCH /users/{user_id}` - Update user
- `DELETE /users/{user_id}` - Delete user (cascade deletes)

### Developers Endpoints
- `POST /developers` - Create developer
- `GET /developers/{developer_id}` - Get developer
- `GET /developers` - List developers
- `PATCH /developers/{developer_id}` - Update developer
- `DELETE /developers/{developer_id}` - Delete developer

### Calls Endpoints
- `POST /calls` - Create call
- `GET /calls/{call_id}` - Get call
- `GET /calls` - List calls (filters: developer_id, sales_manager_id)
- `PATCH /calls/{call_id}` - Update call
- `DELETE /calls/{call_id}` - Delete call

### Access Endpoints
- `POST /access` - Grant access to user
- `GET /access` - List access records (filter: user_id)
- `DELETE /access/{access_id}` - Revoke access

### Notification Settings Endpoints
- `POST /notification-settings` - Create settings
- `GET /notification-settings` - List (filters: sales_manager_id, developer_id)
- `PATCH /notification-settings/{settings_id}` - Update settings
- `POST /notification-settings/{manager_id}/{developer_id}/toggle` - Toggle notifications

---

## SOLID Principles Applied

| Principle | Applied | How |
|-----------|---------|-----|
| **S** - Single Responsibility | ✅ | Each file has ONE reason to change. Config, DB, models, services separated. |
| **O** - Open/Closed | ✅ | Base Repository class open for extension (inheritance), closed for modification. New entities extend, don't modify base. |
| **L** - Liskov Substitution | ✅ | All repositories inherit Repository[Model, Schema]. Fully interchangeable. |
| **I** - Interface Segregation | ✅ | Small focused methods. Endpoints don't know business logic. Services don't know HTTP. |
| **D** - Dependency Inversion | ✅ | FastAPI Depends() injects services. Services depend on abstractions (repositories), not concrete DB code. |

---

## YAGNI (You Aren't Gonna Need It) Applied

Only implemented what's **actually used**:

✅ **Implemented**:
- Basic CRUD for all entities
- Filtering for calls (by developer, manager)
- Notification toggle
- Error handling (400, 404)
- Auto API docs (/docs, /redoc)

❌ **Not Implemented** (will add when needed):
- JWT authentication
- Advanced caching (Redis)
- Background tasks (Celery)
- File uploads
- Webhooks
- Advanced logging
- Rate limiting
- Pagination helpers (using simple skip/limit)

---

## How Data Flows

```
HTTP Request (POST /api/v1/users)
    ↓
Endpoint Layer (api/v1/endpoints/users.py)
    - Validate request with Pydantic schema
    - Call service method
    ↓
Service Layer (services/user_service.py)
    - Apply business logic
    - Call repository methods
    ↓
Repository Layer (repositories/user_repository.py)
    - Execute database queries via SQLAlchemy
    ↓
Models Layer (models/user.py)
    - SQLAlchemy ORM converts to/from database
    ↓
PostgreSQL Database
    - Persists data
    ↓
Response flows back up:
Database → Model → Repository → Service → Schema → HTTP Response (JSON)
```

---

## Environment Variables (.env)

```ini
# Database
DATABASE_URL=postgresql+asyncpg://tg_bot_user:tg_bot_password@db:5432/tg_bot_db

# API Configuration
API_TITLE=Telegram Bot API
API_VERSION=1.0.0

# Auth
ADMIN_ID=6857090051
SECRET_KEY=your-secret-key-change-in-production

# Bot
BOT_TOKEN=your_bot_token_here

# Application
TIMEZONE=ETC/GMT-2
DEBUG=True
ENVIRONMENT=development  # development, staging, production
```

---

## Running the Backend

### With Docker Compose (Recommended)

```bash
cd /Users/admin/wk-prj/tg-bot/new-bot

# Start PostgreSQL + API
docker-compose up

# API at http://localhost:8000
# Swagger UI at http://localhost:8000/docs
# ReDoc at http://localhost:8000/redoc
```

### Locally (for development)

```bash
# Install dependencies
pip install -r requirements.txt

# Start PostgreSQL separately
docker-compose up db

# Run API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Common Commands

```bash
# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Remove all data
docker-compose down -v

# Access database
docker-compose exec db psql -U tg_bot_user -d tg_bot_db

# Rebuild images
docker-compose build --no-cache

# Run tests (when added)
pytest

# Check types with mypy (when added)
mypy app/
```

---

## Adding a New Feature

**Example**: Add "Team" entity

1. **Create Model** (`models/team.py`)
   - Define SQLAlchemy model with fields

2. **Create Schemas** (`schemas/team.py`)
   - Define TeamCreate, TeamUpdate, TeamResponse

3. **Create Repository** (`repositories/team_repository.py`)
   - Inherit from Base Repository
   - Add custom queries if needed

4. **Create Service** (`services/team_service.py`)
   - Implement business logic
   - Use repository for data access

5. **Create Endpoints** (`api/v1/endpoints/teams.py`)
   - Define CRUD routes
   - Use service

6. **Register** in `api/v1/__init__.py`
   - Include teams router

7. **Add Dependency** in `api/v1/dependencies.py`
   - Add `get_team_service()`

**That's it!** All layers follow established patterns. Everything is testable and maintainable.

---

## Testing Strategy (Future)

Each layer can be tested independently:

```python
# Test repositories (mock sessions)
async def test_user_repo_get():
    session = AsyncMockSession()
    repo = UserRepository(session)
    user = await repo.get(1)
    assert user.id == 1

# Test services (mock repositories)
async def test_user_service_create():
    repo = MockUserRepository()
    service = UserService(session)  # session injected
    user = await service.create_user(UserCreate(...))
    assert user.id

# Test endpoints (mock services)
async def test_user_endpoint():
    client = TestClient(app)
    response = client.get("/api/v1/users/1")
    assert response.status_code == 200
```

---

## Key Implementation Details

### Async Everything
- All database operations are async (asyncpg + SQLAlchemy async)
- All endpoints are async
- All I/O is non-blocking

### Dependency Injection
- FastAPI `Depends()` injects services
- Services depend on repositories
- Easy to mock for testing

### Error Handling
- 400 Bad Request - validation failed
- 404 Not Found - entity doesn't exist
- 500 Internal Server Error - unexpected error

### Database Sessions
- `get_db_session()` dependency provides AsyncSession
- Auto-closed when endpoint returns
- No connection leaks

### Pagination
- `skip` and `limit` parameters
- Default limit: 100
- All list endpoints support pagination

---

## Performance Considerations

- ✅ Async database driver (asyncpg)
- ✅ Connection pooling
- ✅ Indexed timestamps for call queries
- ✅ Proper foreign key relationships
- ⏳ TODO: Add caching when needed
- ⏳ TODO: Add database query optimization

---

## Security Notes

- ⏳ TODO: Add JWT authentication
- ⏳ TODO: Add CORS validation
- ⏳ TODO: Add rate limiting
- ⏳ TODO: Add request logging
- ✅ Secret key in .env (not in code)
- ✅ Database credentials in .env

---

## Future Improvements (When Needed - YAGNI)

- 🔒 JWT authentication & authorization
- 💾 Redis caching layer
- 📧 Email notifications
- ⏰ Background job queue (Celery)
- 📊 Analytics/metrics
- 🔍 Advanced search
- 📄 File upload support
- 🪝 Webhooks
- 📝 Request logging middleware
- 🚦 Rate limiting
- 🧪 Full test suite (pytest)
- 📚 Comprehensive API documentation

---

## Related Files

- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Detailed architecture explanation
- **[README.md](../README.md)** - Quick start & commands
- **[old-bot/CONTEXT.md](../../old-bot/CONTEXT.md)** - Original Telegram bot documentation
- **[requirements.txt](./requirements.txt)** - Python dependencies
- **[.env](./.env)** - Environment configuration
- **[Dockerfile](./Dockerfile)** - Container definition
- **[../docker-compose.yml](../docker-compose.yml)** - Docker services

---

## Contact & Support

For questions about the architecture or implementation:
1. Check [ARCHITECTURE.md](../ARCHITECTURE.md)
2. Review the relevant layer code
3. Check docstrings in the code
4. Reference the database schema above

---

**Last Updated**: May 19, 2026  
**Maintainer**: Development Team
