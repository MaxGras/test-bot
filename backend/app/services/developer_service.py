"""Developer service - business logic for developers"""
from sqlalchemy.ext.asyncio import AsyncSession

from ..repositories.developer_repository import DeveloperRepository
from ..repositories.user_repository import UserRepository
from ..schemas.developer import DeveloperCreate, DeveloperUpdate
from ..models.user import User, UserRole


class DeveloperService:
    """Developer business logic"""

    def __init__(self, session: AsyncSession):
        self.repo = DeveloperRepository(session)
        self.session = session
        self.user_repo = UserRepository(session)

    async def create_developer(self, developer_in: DeveloperCreate):
        """Create a new developer"""
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

        # Create developer with the user_id
        developer_data = developer_in.dict(exclude_unset=True)
        developer_data['user_id'] = user_id

        from ..schemas.developer import DeveloperCreate as DC
        developer_create = DC(**developer_data)
        return await self.repo.create(developer_create)

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
