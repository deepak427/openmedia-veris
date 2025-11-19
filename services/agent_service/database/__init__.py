"""Database module for Veris Agent Service"""

from .client import db_client
from .operations import save_verified_claim

__all__ = ['db_client', 'save_verified_claim']
