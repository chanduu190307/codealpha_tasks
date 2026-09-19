import os

class FeatureFlags:
    """
    Centralized Feature Flag management for Version 2 features.
    Configurable via environment variables or settings.
    """

    @staticmethod
    def is_stories_enabled() -> bool:
        return os.getenv('FEATURE_STORIES_ENABLED', 'True').lower() in ('true', '1', 'yes')

    @staticmethod
    def is_messaging_enabled() -> bool:
        return os.getenv('FEATURE_MESSAGING_ENABLED', 'True').lower() in ('true', '1', 'yes')

    @staticmethod
    def is_ai_moderation_enabled() -> bool:
        return os.getenv('FEATURE_AI_MODERATION_ENABLED', 'True').lower() in ('true', '1', 'yes')

    @staticmethod
    def is_recommendations_enabled() -> bool:
        return os.getenv('FEATURE_RECOMMENDATIONS_ENABLED', 'True').lower() in ('true', '1', 'yes')

    @staticmethod
    def is_push_notifications_enabled() -> bool:
        return os.getenv('FEATURE_PUSH_NOTIFICATIONS_ENABLED', 'True').lower() in ('true', '1', 'yes')

    @classmethod
    def get_all_flags(cls) -> dict:
        return {
            'stories_enabled': cls.is_stories_enabled(),
            'messaging_enabled': cls.is_messaging_enabled(),
            'ai_moderation_enabled': cls.is_ai_moderation_enabled(),
            'recommendations_enabled': cls.is_recommendations_enabled(),
            'push_notifications_enabled': cls.is_push_notifications_enabled(),
        }
