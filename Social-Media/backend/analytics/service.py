from datetime import datetime, timedelta, timezone
from django.db.models import Count, Sum
from posts.models import Post
from analytics.models import PostImpression, ProfileVisit

class CreatorAnalyticsService:
    """
    Computes comprehensive creator analytics: reach, impressions, views, engagement rate,
    and post metrics across selectable time windows (7, 30, 90 days).
    """

    @classmethod
    def get_creator_overview(cls, user, days=30) -> dict:
        now = datetime.now(timezone.utc)
        start_date = now - timedelta(days=days)

        user_posts = Post.objects.filter(author=user)
        total_posts_count = user_posts.count()

        # Impressions
        impressions_count = PostImpression.objects.filter(
            post__author=user,
            timestamp__gte=start_date
        ).count()

        # Engagements (likes + comments + bookmarks on author's posts)
        recent_posts = user_posts.filter(created_at__gte=start_date)
        likes_count = sum(p.likes.count() for p in recent_posts)
        comments_count = sum(p.comments.count() for p in recent_posts)
        bookmarks_count = sum(p.bookmarks.count() for p in recent_posts)
        total_engagements = likes_count + comments_count + bookmarks_count

        # Profile Visits
        profile_visits = ProfileVisit.objects.filter(
            profile_user=user,
            timestamp__gte=start_date
        ).count()

        # Follower Growth
        new_followers = user.followers_received.filter(created_at__gte=start_date).count()

        # Engagement Rate = (Engagements / max(Impressions, 1)) * 100
        engagement_rate = round((total_engagements / max(impressions_count, 1)) * 100, 2)

        # Best Performing Post
        best_post = None
        best_post_score = -1
        for post in user_posts:
            eng = (post.likes.count() * 2) + (post.comments.count() * 3) + (post.bookmarks.count() * 4)
            if eng > best_post_score:
                best_post_score = eng
                best_post = {
                    "id": post.id,
                    "content_preview": post.content[:60],
                    "likes": post.likes.count(),
                    "comments": post.comments.count(),
                    "bookmarks": post.bookmarks.count(),
                    "created_at": post.created_at.isoformat()
                }

        return {
            "period_days": days,
            "total_posts": total_posts_count,
            "impressions": impressions_count,
            "engagements": total_engagements,
            "likes": likes_count,
            "comments": comments_count,
            "bookmarks": bookmarks_count,
            "engagement_rate_pct": engagement_rate,
            "profile_visits": profile_visits,
            "new_followers": new_followers,
            "best_performing_post": best_post
        }
