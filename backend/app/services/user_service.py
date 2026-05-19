"""User service - business logic for users"""
from sqlalchemy.ext.asyncio import AsyncSession

from ..repositories.user_repository import UserRepository
from ..schemas.user import UserCreate, UserUpdate


class UserService:
    """User business logic"""

    def __init__(self, session: AsyncSession):
        self.repo = UserRepository(session)

    async def create_user(self, user_in: UserCreate):
        """Create a new user"""
        return await self.repo.create(user_in)

    async def get_user(self, user_id: int):
        """Get user by ID"""
        return await self.repo.get(user_id)

    async def get_user_by_telegram_id(self, telegram_id: int):
        """Get user by Telegram ID"""
        return await self.repo.get_by_telegram_id(telegram_id)

    async def list_users(self, skip: int = 0, limit: int = 100):
        """List all users"""
        users, total = await self.repo.get_all(skip, limit)
        return {"total": total, "items": users}

    async def list_users_by_role(self, role: str, skip: int = 0, limit: int = 100):
        """List users by role"""
        users, total = await self.repo.get_by_role(role, skip, limit)
        return {"total": total, "items": users}

    async def update_user(self, user_id: int, user_in: UserUpdate):
        """Update user"""
        return await self.repo.update(user_id, user_in.dict(exclude_unset=True))

    async def delete_user(self, user_id: int):
        """Delete user"""
        return await self.repo.delete(user_id)
