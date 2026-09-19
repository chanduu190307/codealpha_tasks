from dataclasses import dataclass, field
from typing import Dict, List, Optional
from abc import ABC, abstractmethod

@dataclass
class ModerationResultDTO:
    is_flagged: bool = False
    confidence: float = 0.0
    categories: Dict[str, float] = field(default_factory=dict)
    suggested_action: str = 'allow'  # 'allow', 'flag_review', 'auto_flag'
    reason: str = ''
    provider_name: str = 'rule_based'

@dataclass
class RecommendationScoreDTO:
    candidate_id: int
    score: float
    reasons: List[str] = field(default_factory=list)

class BaseAIProvider(ABC):
    """
    Abstract AI Provider Interface for Content Moderation & Smart Recommendations.
    Enables pluggable backend models (Rule-based, Gemini, OpenAI, Claude, Local Transformers).
    """

    @abstractmethod
    def analyze_text(self, text: str) -> ModerationResultDTO:
        pass

    @abstractmethod
    def score_user_recommendation(self, user, candidate_user) -> RecommendationScoreDTO:
        pass
