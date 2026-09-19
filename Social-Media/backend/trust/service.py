from datetime import datetime, timezone
from django.contrib.auth.models import User

class TrustService:
    """
    Internal Account Reputation & Safety Risk Service.
    Produces risk tiers:
    - NORMAL (Trustworthy)
    - LOW_RISK (Minor anomalies, standard limits)
    - ELEVATED_RISK (Increased reports / rapid actions, apply scrutiny)
    - HIGH_RISK (Severe report volume / automated spam bursts)
    """

    @classmethod
    def evaluate_user_risk(cls, user: User) -> dict:
        if not user or not user.is_authenticated:
            return {"tier": "HIGH_RISK", "score": 0.0, "reason": "Anonymous user"}

        score = 50.0  # Baseline neutral

        # Positive Trust Factors
        now = datetime.now(timezone.utc)
        account_age_days = (now - user.date_joined).days
        if account_age_days > 30:
            score += 15.0
        elif account_age_days > 7:
            score += 5.0

        if getattr(user.profile, 'is_verified', False):
            score += 25.0

        if user.posts.count() > 5:
            score += 10.0

        # Negative Risk Factors
        reports_count = user.reports_filed.count() # Reports against user would be from target
        from moderation.models import Report
        reports_against = Report.objects.filter(target_type='user', target_id=user.id).count()
        if reports_against > 5:
            score -= 30.0
        elif reports_against > 1:
            score -= 15.0

        if score >= 75.0:
            tier = "NORMAL"
        elif score >= 50.0:
            tier = "LOW_RISK"
        elif score >= 30.0:
            tier = "ELEVATED_RISK"
        else:
            tier = "HIGH_RISK"

        return {
            "tier": tier,
            "score": round(score, 1),
            "account_age_days": account_age_days,
            "is_verified": getattr(user.profile, 'is_verified', False)
        }
