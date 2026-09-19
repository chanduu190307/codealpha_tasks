from django.core.cache import cache
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

class PresenceManager:
    """
    Ephemeral Presence & Real-Time Typing State Tracker.
    Stores online status and ephemeral typing indicators using cache/Redis.
    """

    PRESENCE_TTL = 120  # 2 minutes heartbeat
    TYPING_TTL = 5      # 5 seconds

    @classmethod
    def set_user_online(cls, user_id: int):
        now_iso = datetime.now(timezone.utc).isoformat()
        cache.set(f"presence:user:{user_id}", {"online": True, "last_seen": now_iso}, timeout=cls.PRESENCE_TTL)

    @classmethod
    def set_user_offline(cls, user_id: int):
        now_iso = datetime.now(timezone.utc).isoformat()
        cache.set(f"presence:user:{user_id}", {"online": False, "last_seen": now_iso}, timeout=86400)

    @classmethod
    def get_user_status(cls, user_id: int) -> dict:
        status = cache.get(f"presence:user:{user_id}")
        if status:
            return status
        return {"online": False, "last_seen": None}

    @classmethod
    def set_user_typing(cls, conversation_id: int, user_id: int, username: str):
        cache.set(f"typing:conv:{conversation_id}:user:{user_id}", username, timeout=cls.TYPING_TTL)

    @classmethod
    def is_user_typing(cls, conversation_id: int, user_id: int) -> bool:
        return cache.get(f"typing:conv:{conversation_id}:user:{user_id}") is not None
