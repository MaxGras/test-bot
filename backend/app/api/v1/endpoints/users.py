"""User endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status

from ....schemas.user import UserCreate, UserUpdate, UserResponse, UserListResponse
from ....services import UserService
from .dependencies import get_user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, service: UserService = Depends(get_user_service)):
    """Create a new user"""
    try:
        return await service.create_user(user_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail="User creation failed")


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, service: UserService = Depends(get_user_service)):
    """Get user by ID"""
    user = await service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/telegram/{telegram_id}", response_model=UserResponse)
async def get_user_by_telegram_id(
    telegram_id: int, service: UserService = Depends(get_user_service)
):
    """Get user by Telegram ID"""
    user = await service.get_user_by_telegram_id(telegram_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("", response_model=UserListResponse)
async def list_users(
    skip: int = 0, limit: int = 100, service: UserService = Depends(get_user_service)
):
    """List all users"""
    return await service.list_users(skip, limit)


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int, user_in: UserUpdate, service: UserService = Depends(get_user_service)
):
    """Update user"""
    user = await service.update_user(user_id, user_in)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, service: UserService = Depends(get_user_service)):
    """Delete user"""
    success = await service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
