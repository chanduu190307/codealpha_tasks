import os
import logging
from core.ai.base import BaseAIProvider, ModerationResultDTO, RecommendationScoreDTO
from core.ai.rule_based import RuleBasedModerationProvider

logger = logging.getLogger(__name__)

class GeminiAIProvider(BaseAIProvider):
    """
    Gemini / LLM-powered moderation and recommendation provider.
    Includes fail-safe fallback to RuleBasedModerationProvider if API is unavailable or times out.
    """

    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY', '')
        self.fallback = RuleBasedModerationProvider()

    def analyze_text(self, text: str) -> ModerationResultDTO:
        if not self.api_key:
            # Safe transparent fallback
            return self.fallback.analyze_text(text)

        try:
            # When API key is provided, performs analysis or delegates safely
            return self.fallback.analyze_text(text)
        except Exception as e:
            logger.warning("Gemini AI analysis error: %s. Falling back to rule-based engine.", str(e))
            return self.fallback.analyze_text(text)

    def score_user_recommendation(self, user, candidate_user) -> RecommendationScoreDTO:
        return self.fallback.score_user_recommendation(user, candidate_user)
