import logging
from core.ai.base import BaseAIProvider
from core.ai.gemini_provider import GeminiAIProvider
from core.feature_flags import FeatureFlags
from moderation.models import ModerationQueueItem

logger = logging.getLogger(__name__)

class ModerationService:
    """
    Unified Content Moderation Orchestrator.
    Executes automated AI & heuristic analysis and enqueues suspicious items for moderator review.
    """

    _provider: BaseAIProvider = None

    @classmethod
    def get_provider(cls) -> BaseAIProvider:
        if cls._provider is None:
            cls._provider = GeminiAIProvider()
        return cls._provider

    @classmethod
    def inspect_content(cls, content_type: str, object_id: int, text: str):
        if not FeatureFlags.is_ai_moderation_enabled():
            return None

        if not text or not text.strip():
            return None

        try:
            provider = cls.get_provider()
            result = provider.analyze_text(text)

            if result.is_flagged and result.confidence >= 0.60:
                item = ModerationQueueItem.objects.create(
                    content_type=content_type,
                    object_id=object_id,
                    flagged_reason=result.reason,
                    confidence_score=result.confidence,
                    ai_provider=result.provider_name,
                    status='pending'
                )
                logger.info("Content %s #%s flagged for review by %s (conf: %.2f)",
                            content_type, object_id, result.provider_name, result.confidence)
                return item
        except Exception as e:
            logger.warning("Moderation analysis error on %s #%s: %s", content_type, object_id, str(e))

        return None
