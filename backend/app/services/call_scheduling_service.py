"""Call scheduling service - business logic based on old-bot patterns"""
from datetime import datetime, timedelta
from typing import List, Optional, Tuple
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
import logging

from ..models.call import Call
from ..models.developer import Developer
from ..models.user import User, UserRole
from ..models.notification import NotificationSettings
from ..repositories.call_repository import CallRepository

logger = logging.getLogger(__name__)


class CallSchedulingService:
    """Call scheduling business logic - ported from old-bot handlers"""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.call_repo = CallRepository(session, Call)

    # ============================================================================
    # CALL MANAGEMENT
    # ============================================================================

    async def create_call(
        self,
        developer_id: int,
        sales_manager_id: int,
        start_time: datetime,
        end_time: datetime,
        title: str,
        call_link: Optional[str] = None,
        salary_fork: Optional[str] = None,
        job_post_link: Optional[str] = None,
        notes: str = ""
    ) -> Call:
        """Create a new call (with validation)"""
        # Check for conflicts first
        conflict = await self.check_time_conflict(developer_id, start_time, end_time)
        if conflict:
            raise ValueError(f"Time conflict with existing call: {conflict.title}")

        call = Call(
            developer_id=developer_id,
            sales_manager_id=sales_manager_id,
            start_time=start_time,
            end_time=end_time,
            title=title,
            notes=notes,
            call_link=call_link,
            salary_fork=salary_fork,
            job_post_link=job_post_link
        )
        self.session.add(call)
        await self.session.commit()
        await self.session.refresh(call)
        return call

    async def get_call(self, call_id: int) -> Optional[Call]:
        """Get call by ID"""
        return await self.call_repo.get_by_id(call_id)

    async def delete_call(self, call_id: int) -> bool:
        """Delete call by ID"""
        call = await self.call_repo.get_by_id(call_id)
        if call:
            await self.session.delete(call)
            await self.session.commit()
            return True
        return False

    async def update_call(
        self,
        call_id: int,
        **kwargs
    ) -> Optional[Call]:
        """Update call fields"""
        call = await self.call_repo.get_by_id(call_id)
        if not call:
            return None

        for key, value in kwargs.items():
            if hasattr(call, key):
                setattr(call, key, value)

        await self.session.commit()
        await self.session.refresh(call)
        return call

    # ============================================================================
    # CONFLICT DETECTION
    # ============================================================================

    async def check_time_conflict(
        self,
        developer_id: int,
        start_time: datetime,
        end_time: datetime,
        exclude_call_id: Optional[int] = None
    ) -> Optional[Call]:
        """
        Check if time range overlaps with any existing calls for developer.
        Returns the conflicting call if found, None if clear.
        """
        stmt = select(Call).where(
            and_(
                Call.developer_id == developer_id,
                Call.start_time < end_time,
                Call.end_time > start_time
            )
        )

        if exclude_call_id:
            stmt = stmt.where(Call.id != exclude_call_id)

        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_conflicts_on_date(
        self,
        developer_id: int,
        date: datetime.date
    ) -> List[Call]:
        """Get all calls for developer on a specific date"""
        day_start = datetime.combine(date, datetime.min.time()).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        day_end = datetime.combine(date, datetime.min.time()).replace(
            hour=23, minute=59, second=59, microsecond=999999
        )

        stmt = select(Call).where(
            and_(
                Call.developer_id == developer_id,
                Call.start_time >= day_start,
                Call.start_time <= day_end
            )
        ).order_by(Call.start_time)

        result = await self.session.execute(stmt)
        return result.scalars().all()

    # ============================================================================
    # SCHEDULE VIEWING
    # ============================================================================

    async def get_developer_schedule(
        self,
        developer_id: int,
        start_date: datetime.date,
        end_date: datetime.date
    ) -> List[Call]:
        """Get all calls for developer between dates"""
        day_start = datetime.combine(start_date, datetime.min.time()).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        day_end = datetime.combine(end_date, datetime.min.time()).replace(
            hour=23, minute=59, second=59, microsecond=999999
        )

        stmt = select(Call).where(
            and_(
                Call.developer_id == developer_id,
                Call.start_time >= day_start,
                Call.end_time <= day_end
            )
        ).order_by(Call.start_time)

        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_manager_calls_on_date(
        self,
        developer_id: int,
        sales_manager_id: int,
        date: datetime.date
    ) -> List[Call]:
        """Get calls booked by specific manager on specific date (for suspend)"""
        day_start = datetime.combine(date, datetime.min.time()).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        day_end = datetime.combine(date, datetime.min.time()).replace(
            hour=23, minute=59, second=59, microsecond=999999
        )

        stmt = select(Call).where(
            and_(
                Call.developer_id == developer_id,
                Call.sales_manager_id == sales_manager_id,
                Call.start_time >= day_start,
                Call.start_time <= day_end
            )
        ).order_by(Call.start_time)

        result = await self.session.execute(stmt)
        return result.scalars().all()

    # ============================================================================
    # NOTIFICATION MANAGEMENT
    # ============================================================================

    async def get_notification_setting(
        self,
        sales_manager_id: int,
        developer_id: int
    ) -> Optional[NotificationSettings]:
        """Get notification setting for manager-developer pair"""
        stmt = select(NotificationSettings).where(
            and_(
                NotificationSettings.sales_manager_id == sales_manager_id,
                NotificationSettings.developer_id == developer_id
            )
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def toggle_notifications(
        self,
        sales_manager_id: int,
        developer_id: int
    ) -> bool:
        """Toggle notifications for manager-developer pair. Returns new status"""
        setting = await self.get_notification_setting(sales_manager_id, developer_id)

        if setting:
            setting.is_enabled = not setting.is_enabled
        else:
            setting = NotificationSettings(
                sales_manager_id=sales_manager_id,
                developer_id=developer_id,
                is_enabled=True
            )
            self.session.add(setting)

        await self.session.commit()
        await self.session.refresh(setting)
        return setting.is_enabled

    async def is_notifications_enabled(
        self,
        sales_manager_id: int,
        developer_id: int
    ) -> bool:
        """Check if notifications are enabled"""
        setting = await self.get_notification_setting(sales_manager_id, developer_id)
        return setting.is_enabled if setting else False

    async def get_subscribed_admins_for_developer(
        self,
        developer_id: int
    ) -> List[User]:
        """Get all admins who subscribed to developer notifications"""
        stmt = select(User).join(
            NotificationSettings,
            NotificationSettings.sales_manager_id == User.id
        ).where(
            and_(
                NotificationSettings.developer_id == developer_id,
                NotificationSettings.is_enabled == True,
                User.role == UserRole.ADMIN
            )
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()

    # ============================================================================
    # MANAGER OPERATIONS
    # ============================================================================

    async def get_manager_all_calls(
        self,
        sales_manager_id: int
    ) -> List[Call]:
        """Get all calls booked by a manager"""
        stmt = select(Call).where(
            Call.sales_manager_id == sales_manager_id
        ).order_by(Call.start_time)

        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_manager_calls_for_developer(
        self,
        sales_manager_id: int,
        developer_id: int
    ) -> List[Call]:
        """Get all calls booked by manager for specific developer"""
        stmt = select(Call).where(
            and_(
                Call.sales_manager_id == sales_manager_id,
                Call.developer_id == developer_id
            )
        ).order_by(Call.start_time)

        result = await self.session.execute(stmt)
        return result.scalars().all()

    # ============================================================================
    # DEVELOPER OPERATIONS
    # ============================================================================

    async def get_all_developers(self) -> List[Developer]:
        """Get list of all developers"""
        stmt = select(Developer).order_by(Developer.name)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_developer_calls_by_date(
        self,
        developer_id: int,
        date: datetime.date
    ) -> List[Tuple[Call, Optional[User]]]:
        """Get calls with manager info for display"""
        calls = await self.get_conflicts_on_date(developer_id, date)

        result = []
        for call in calls:
            stmt = select(User).where(User.id == call.sales_manager_id)
            manager_result = await self.session.execute(stmt)
            manager = manager_result.scalars().first()
            result.append((call, manager))

        return result

    # ============================================================================
    # VALIDATION & FORMATTING
    # ============================================================================

    @staticmethod
    def validate_call_title(title: str) -> bool:
        """Validate call title (account name)"""
        if not title or len(title) < 1:
            return False
        return len(title) <= 255

    @staticmethod
    def validate_time_range(start_time: datetime, end_time: datetime) -> bool:
        """Validate that end_time is after start_time"""
        return end_time > start_time

    @staticmethod
    def validate_duration_minutes(minutes: int) -> bool:
        """Validate call duration"""
        return minutes in [30, 60, 90]

    @staticmethod
    def calculate_end_time(start_time: datetime, duration_minutes: int) -> datetime:
        """Calculate end time from start and duration"""
        return start_time + timedelta(minutes=duration_minutes)

    # ============================================================================
    # STATISTICS (for admin views)
    # ============================================================================

    async def get_developer_call_count(self, developer_id: int) -> int:
        """Get total number of calls for developer"""
        stmt = select(Call).where(Call.developer_id == developer_id)
        result = await self.session.execute(stmt)
        return len(result.scalars().all())

    async def get_manager_call_count(self, sales_manager_id: int) -> int:
        """Get total number of calls booked by manager"""
        stmt = select(Call).where(Call.sales_manager_id == sales_manager_id)
        result = await self.session.execute(stmt)
        return len(result.scalars().all())

    async def get_calls_today(self) -> List[Call]:
        """Get all calls scheduled for today"""
        today = datetime.now().date()
        return await self.get_conflicts_on_date(1, today)  # Would need to handle all devs


# ============================================================================
# HELPER FUNCTIONS FOR COMMON OPERATIONS
# ============================================================================

async def schedule_call_with_notifications(
    session: AsyncSession,
    developer_id: int,
    sales_manager_id: int,
    start_time: datetime,
    end_time: datetime,
    title: str,
    call_link: Optional[str] = None,
    salary_fork: Optional[str] = None,
    job_post_link: Optional[str] = None,
) -> Tuple[Call, List[User]]:
    """
    Complete call scheduling flow:
    1. Create call
    2. Get subscribed admins
    3. Return for notification sending

    Old bot equivalent: save_call_with_extras() + notify_admins_new_call()
    """
    service = CallSchedulingService(session)

    # Create call (will raise if conflict)
    call = await service.create_call(
        developer_id=developer_id,
        sales_manager_id=sales_manager_id,
        start_time=start_time,
        end_time=end_time,
        title=title,
        call_link=call_link,
        salary_fork=salary_fork,
        job_post_link=job_post_link
    )

    # Get subscribed admins
    subscribed_admins = await service.get_subscribed_admins_for_developer(developer_id)

    return call, subscribed_admins


async def validate_and_create_call(
    session: AsyncSession,
    developer_id: int,
    sales_manager_id: int,
    start_time: datetime,
    duration_minutes: int,
    title: str,
    call_link: Optional[str] = None,
    salary_fork: Optional[str] = None,
    job_post_link: Optional[str] = None,
) -> Tuple[bool, str, Optional[Call]]:
    """
    Validate and create call with detailed error messages.
    Returns: (success: bool, message: str, call: Call | None)
    """
    service = CallSchedulingService(session)

    # Validate title
    if not service.validate_call_title(title):
        return False, "❌ Account name cannot be empty", None

    # Validate duration
    if not service.validate_duration_minutes(duration_minutes):
        return False, "❌ Invalid duration", None

    # Calculate end time
    end_time = service.calculate_end_time(start_time, duration_minutes)

    # Validate time range
    if not service.validate_time_range(start_time, end_time):
        return False, "❌ End time must be after start time", None

    # Check for conflicts
    conflict = await service.check_time_conflict(developer_id, start_time, end_time)
    if conflict:
        # Get manager who booked conflicting call
        stmt = select(User).where(User.id == conflict.sales_manager_id)
        result = await session.execute(stmt)
        manager = result.scalars().first()
        manager_name = manager.first_name if manager else "Unknown"

        conflict_msg = (
            f"❌ Conflict detected!\n\n"
            f"Developer is already booked:\n"
            f"• {conflict.title}\n"
            f"• {conflict.start_time.strftime('%H:%M')} - {conflict.end_time.strftime('%H:%M')}\n"
            f"• By {manager_name}\n\n"
            f"Please pick a different time."
        )
        return False, conflict_msg, None

    # All validations passed, create call
    try:
        call = await service.create_call(
            developer_id=developer_id,
            sales_manager_id=sales_manager_id,
            start_time=start_time,
            end_time=end_time,
            title=title,
            call_link=call_link,
            salary_fork=salary_fork,
            job_post_link=job_post_link
        )
        return True, "✅ Call scheduled successfully!", call
    except Exception as e:
        logger.error(f"Error creating call: {e}")
        return False, f"❌ Error saving call: {str(e)}", None
