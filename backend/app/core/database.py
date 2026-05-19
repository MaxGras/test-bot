"""Database connection and session management"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import NullPool
from .config import settings
import logging

logger = logging.getLogger(__name__)

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
    poolclass=NullPool if settings.ENVIRONMENT == "testing" else None,
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    future=True,
)


async def get_db_session() -> AsyncSession:
    """Get database session for dependency injection"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    """Initialize database tables"""
    from ..models import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Database initialized successfully")


async def close_db() -> None:
    """Close database connection"""
    await engine.dispose()
    logger.info("✅ Database connection closed")


async def seed_admin() -> None:
    """Create admin user if not exists"""
    from .config import settings
    from ..models.user import User, UserRole
    from sqlalchemy import select

    async with AsyncSessionLocal() as session:
        admin_id = settings.ADMIN_ID
        stmt = select(User).where(User.telegram_id == admin_id)
        result = await session.execute(stmt)
        existing = result.scalar_one_or_none()

        if not existing:
            admin = User(
                telegram_id=admin_id,
                role=UserRole.ADMIN,
                username="admin",
                is_active=True
            )
            session.add(admin)
            await session.commit()
            logger.info(f"✅ Admin {admin_id} created")
        else:
            logger.info(f"✅ Admin {admin_id} already exists")
