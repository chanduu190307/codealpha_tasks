import re
from typing import List, Dict
from core.ai.base import BaseAIProvider, ModerationResultDTO, RecommendationScoreDTO

class RuleBasedModerationProvider(BaseAIProvider):
    """
    High-performance rule-based content moderation engine.
    Uses regex patterns, sentiment triggers, spam heuristics, and scam/threat detection.
    """

    SPAM_PATTERNS = [
        re.compile(r'\b(free\s*followers|buy\s*crypto|earn\s*\$\d+|click\s*here\s*now|dm\s*for\s*promo|telegram\s*@|wa\.me/)\b', re.IGNORECASE),
        re.compile(r'https?://(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl)/\w+', re.IGNORECASE),
        re.compile(r'(.)\1{6,}', re.IGNORECASE),  # Repeated characters
    ]

    HARASSMENT_PATTERNS = [
        re.compile(r'\b(die\b|kill\s*yourself|kys\b|threat\b|idiot\b|loser\b|worthless)\b', re.IGNORECASE),
    ]

    HATE_PATTERNS = [
        re.compile(r'\b(hate\s*all\b|slur\b|subhuman)\b', re.IGNORECASE),
    ]

    def analyze_text(self, text: str) -> ModerationResultDTO:
        if not text or not text.strip():
            return ModerationResultDTO(is_flagged=False, confidence=0.0, provider_name='rule_based')

        categories: Dict[str, float] = {}
        flags: List[str] = []

        # Check spam
        for pattern in self.SPAM_PATTERNS:
            if pattern.search(text):
                categories['spam'] = 0.85
                flags.append('Spam/Promotional link detected')
                break

        # Check harassment
        for pattern in self.HARASSMENT_PATTERNS:
            if pattern.search(text):
                categories['harassment'] = 0.90
                flags.append('Harassment/Hostile language detected')
                break

        # Check hate speech
        for pattern in self.HATE_PATTERNS:
            if pattern.search(text):
                categories['hate'] = 0.92
                flags.append('Hate speech pattern detected')
                break

        if categories:
            max_conf = max(categories.values())
            suggested_action = 'flag_review' if max_conf >= 0.70 else 'allow'
            return ModerationResultDTO(
                is_flagged=True,
                confidence=max_conf,
                categories=categories,
                suggested_action=suggested_action,
                reason='; '.join(flags),
                provider_name='rule_based'
            )

        return ModerationResultDTO(
            is_flagged=False,
            confidence=0.0,
            categories={},
            suggested_action='allow',
            reason='Clean content',
            provider_name='rule_based'
        )

    def score_user_recommendation(self, user, candidate_user) -> RecommendationScoreDTO:
        """
        Calculates recommendation score using mutual follows, mutual interests, and freshness.
        """
        score = 1.0
        reasons = []

        # Mutual follow scoring
        user_following_ids = set(user.following_sent.values_list('following_id', flat=True))
        candidate_followers = set(candidate_user.followers_received.values_list('follower_id', flat=True))
        mutual_count = len(user_following_ids.intersection(candidate_followers))

        if mutual_count > 0:
            score += mutual_count * 2.5
            reasons.append(f"{mutual_count} mutual connections")

        # Profile completeness bonus
        if hasattr(candidate_user, 'profile'):
            if candidate_user.profile.avatar:
                score += 1.0
            if candidate_user.profile.bio:
                score += 0.5

        # Active post count bonus
        post_count = candidate_user.posts.count()
        if post_count > 0:
            score += min(post_count * 0.2, 3.0)

        return RecommendationScoreDTO(
            candidate_id=candidate_user.id,
            score=score,
            reasons=reasons
        )
