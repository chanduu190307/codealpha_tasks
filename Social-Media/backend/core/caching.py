from django.core.cache import cache
import json
import logging

logger = logging.getLogger(__name__)

class CacheService:
    """
    Centralized caching utility for trending metrics, suggestions, and presence.
    """

    TRENDING_TAGS_KEY = "pulse:trending:tags"
    RECOMMENDED_USERS_KEY_PREFIX = "pulse:rec:users:"
    USER_ONLINE_KEY_PREFIX = "pulse:presence:user:"

    @classmethod
    def get_trending_tags(cls):
        return cache.get(cls.TRENDING_TAGS_KEY)

    @classmethod
    def set_trending_tags(cls, data, timeout=300):
        cache.set(cls.TRENDING_TAGS_KEY, data, timeout=timeout)

    @classmethod
    def invalidate_trending_tags(cls):
        cache.delete(cls.TRENDING_TAGS_KEY)

    @classmethod
    def get_user_recommendations(cls, user_id):
        return cache.get(f"{cls.RECOMMENDED_USERS_KEY_PREFIX}{user_id}")

    @classmethod
    def set_user_recommendations(cls, user_id, data, timeout=600):
        cache.set(f"{cls.RECOMMENDED_USERS_KEY_PREFIX}{user_id}", data, timeout=timeout)
