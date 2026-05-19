"""Base repository class - generic CRUD operations"""
from typing import TypeVar, Generic, Type, List, Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType")


class Repository(Generic[ModelType, CreateSchemaType]):
    """Base repository class with common CRUD operations"""

    def __init__(self, session: AsyncSession, model: Type[ModelType]):
        self.session = session
        self.model = model

    async def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Create a new object"""
        db_obj = self.model(**obj_in.dict())
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return db_obj

    async def get(self, id: int) -> Optional[ModelType]:
        """Get object by ID"""
        result = await self.session.execute(select(self.model).where(self.model.id == id))
        return result.scalars().first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> tuple[List[ModelType], int]:
        """Get all objects with pagination"""
        # Get total count
        count_result = await self.session.execute(select(func.count(self.model.id)))
        total = count_result.scalar() or 0

        # Get paginated results
        result = await self.session.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return result.scalars().all(), total

    async def update(self, id: int, obj_in: dict) -> Optional[ModelType]:
        """Update object"""
        db_obj = await self.get(id)
        if not db_obj:
            return None

        for field, value in obj_in.items():
            if value is not None:
                setattr(db_obj, field, value)

        await self.session.commit()
        await self.session.refresh(db_obj)
        return db_obj

    async def delete(self, id: int) -> bool:
        """Delete object"""
        db_obj = await self.get(id)
        if not db_obj:
            return False

        await self.session.delete(db_obj)
        await self.session.commit()
        return True
