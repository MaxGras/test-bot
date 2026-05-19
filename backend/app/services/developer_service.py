"""Developer service - business logic for developers"""
from sqlalchemy.ext.asyncio import AsyncSession

from ..repositories.developer_repository import DeveloperRepository
from ..schemas.developer import DeveloperCreate, DeveloperUpdate
from ..models.user import User, UserRole
from ..models.developer import Developer


class DeveloperService:
    """Developer business logic"""

    def __init__(self, session: AsyncSession):
        self.repo = DeveloperRepository(session, Developer)
        self.session = session

    async def create_developer(self, developer_in: DeveloperCreate):
        """Create a new developer"""
        try:
            user_id = developer_in.user_id

            # If no user_id provided, create a user automatically
            if not user_id:
                user = User(
                    telegram_id=0,
                    role=UserRole.DEVELOPER,
                    first_name=developer_in.name,
                    is_active=True
                )
                self.session.add(user)
                await self.session.flush()
                user_id = user.id

            # Create developer directly
            developer = Developer(
                user_id=user_id,
                name=developer_in.name,
                bio=developer_in.bio,
                is_available=developer_in.is_available
            )
            self.session.add(developer)
            await self.session.commit()
            await self.session.refresh(developer)
            return developer
        except Exception as e:
            await self.session.rollback()
            raise e

    async def get_developer(self, developer_id: int):
        """Get developer by ID"""
        return await self.repo.get(developer_id)

    async def list_developers(self, skip: int = 0, limit: int = 100):
        """List all developers"""
        developers, total = await self.repo.get_all(skip, limit)
        return {"total": total, "items": developers}

    async def update_developer(self, developer_id: int, developer_in: DeveloperUpdate):
        """Update developer"""
        return await self.repo.update(developer_id, developer_in.dict(exclude_unset=True))

    async def delete_developer(self, developer_id: int):
        """Delete developer"""
        return await self.repo.delete(developer_id)
