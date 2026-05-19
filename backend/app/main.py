"""FastAPI application factory"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .core import init_db, close_db, seed_admin
from .api.v1 import api_router


def create_app() -> FastAPI:
    """Create and configure FastAPI application"""

    app = FastAPI(
        title=settings.API_TITLE,
        version=settings.API_VERSION,
        description=settings.API_DESCRIPTION,
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(api_router)

    # Startup and shutdown events
    @app.on_event("startup")
    async def startup():
        """Initialize database on startup"""
        await init_db()
        await seed_admin()

    @app.on_event("shutdown")
    async def shutdown():
        """Close database connection on shutdown"""
        await close_db()

    # Health check endpoint
    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {"status": "ok"}

    return app


app = create_app()
