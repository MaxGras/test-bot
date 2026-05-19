"""Developer repository"""
from ..models.developer import Developer
from ..schemas.developer import DeveloperCreate
from .base import Repository


class DeveloperRepository(Repository[Developer, DeveloperCreate]):
    """Developer repository with custom queries"""
    pass
