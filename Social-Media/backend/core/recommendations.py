from datetime import datetime, timezone
from django.db.models import Count, Q
from posts.models import Post
from accounts.models import UserBlock, UserMute
from discovery.models import PostHide, PostNotInterested, UserInterest

class RecommendationService:
    """
    Multi-stage Recommendation Pipeline with Creator Diversity Constraints.
    Stages:
    1. Candidate Generation (explore public posts)
    2. Safety & Negative Filtering (blocks, mutes, hidden)
    3. Feature Scoring & Ranking
    4. Diversity Filtering (enforce creator diversity ceiling)
    """

    MAX_PER_CREATOR = 2

    @classmethod
    def get_recommended_posts(cls, user, limit=20):
        now = datetime.now(timezone.utc)

        # 1. Candidate Generation
        candidates = Post.objects.all().select_related(
            'author', 'author__profile'
        ).prefetch_related('hashtags', 'likes', 'comments', 'bookmarks')

        if user and user.is_authenticated:
            blocked_ids = set(UserBlock.objects.filter(blocker=user).values_list('blocked_id', flat=True)) | \
                          set(UserBlock.objects.filter(blocked=user).values_list('blocker_id', flat=True))
            muted_ids = set(UserMute.objects.filter(muter=user).values_list('muted_id', flat=True))
            hidden_ids = set(PostHide.objects.filter(user=user).values_list('post_id', flat=True))
            not_interested_ids = set(PostNotInterested.objects.filter(user=user).values_list('post_id', flat=True))

            # 2. Safety & Negative Filtering
            candidates = candidates.exclude(
                author_id__in=blocked_ids | muted_ids | {user.id}
            ).exclude(
                id__in=hidden_ids | not_interested_ids
            )

        # 3. Scoring
        scored = []
        for post in candidates[:100]:
            age_hours = max((now - post.created_at).total_seconds() / 3600.0, 0.0)
            likes = post.likes.count()
            comments = post.comments.count()
            bookmarks = post.bookmarks.count()

            score = ((likes * 2) + (comments * 3) + (bookmarks * 4) + 1.0) / ((age_hours + 2.0) ** 1.4)
            scored.append((post, score))

        scored.sort(key=lambda x: x[1], reverse=True)

        # 4. Diversity Filtering (Limit per creator)
        results = []
        creator_counts = {}

        for post, score in scored:
            author_id = post.author_id
            count = creator_counts.get(author_id, 0)
            if count < cls.MAX_PER_CREATOR:
                results.append(post)
                creator_counts[author_id] = count + 1
            if len(results) >= limit:
                break

        return results
