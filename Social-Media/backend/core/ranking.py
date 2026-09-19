import math
from datetime import datetime, timezone
from django.db.models import Count, Q
from accounts.models import UserBlock, UserMute, UserRestriction
from discovery.models import Hashtag, PostHide, PostNotInterested, UserInterest

class FeedRankingService:
    """
    Intelligent Multi-Signal Feed Ranking Service.
    Evaluates candidate posts using:
    - Recency score with exponential decay
    - Engagement velocity (Likes, Comments, Bookmarks)
    - Author Affinity score (previous interactions & follow strength)
    - Topic / User Interest alignment
    - Negative feedback penalties (Hide, Not Interested)
    """

    RECENCY_WEIGHT = 0.30
    ENGAGEMENT_WEIGHT = 0.25
    AFFINITY_WEIGHT = 0.25
    INTEREST_WEIGHT = 0.20

    @classmethod
    def rank_feed_posts(cls, user, candidate_posts, page_size=20, page=1):
        """
        Takes a candidate post queryset or list and returns ranked and paginated posts.
        """
        if not user or not user.is_authenticated:
            return candidate_posts.order_by('-created_at')

        # 1. Filter out blocked, muted, and hidden posts
        blocked_ids = set(UserBlock.objects.filter(blocker=user).values_list('blocked_id', flat=True)) | \
                      set(UserBlock.objects.filter(blocked=user).values_list('blocker_id', flat=True))
        muted_ids = set(UserMute.objects.filter(muter=user).values_list('muted_id', flat=True))
        hidden_post_ids = set(PostHide.objects.filter(user=user).values_list('post_id', flat=True))
        not_interested_post_ids = set(PostNotInterested.objects.filter(user=user).values_list('post_id', flat=True))

        filtered_posts = candidate_posts.exclude(
            author_id__in=blocked_ids | muted_ids
        ).exclude(
            id__in=hidden_post_ids | not_interested_post_ids
        )

        # 2. Extract user's topic interests
        user_interests = dict(UserInterest.objects.filter(user=user).values_list('topic', 'score'))

        # 3. Score each post
        scored_posts = []
        now = datetime.now(timezone.utc)

        # Fetch interactions for affinity
        liked_author_ids = set(user.likes.values_list('post__author_id', flat=True))
        commented_author_ids = set(user.comments.values_list('post__author_id', flat=True))

        for post in filtered_posts[:100]:  # Rank top 100 candidates
            age_hours = max((now - post.created_at).total_seconds() / 3600.0, 0.0)

            # Recency score (half-life of 18 hours)
            recency_score = math.exp(-age_hours / 18.0)

            # Engagement score (using annotated counts to avoid N+1 queries)
            likes = getattr(post, 'likes_count_annotated', None)
            if likes is None:
                likes = post.likes_count
            comments = getattr(post, 'comments_count_annotated', None)
            if comments is None:
                comments = post.comments_count
            bookmarks = getattr(post, 'bookmarks_count_annotated', None)
            if bookmarks is None:
                bookmarks = post.bookmarks_count
            engagement_score = math.log1p(likes * 1.5 + comments * 2.0 + bookmarks * 2.5)

            # Affinity score
            affinity_score = 0.5
            if post.author_id in liked_author_ids:
                affinity_score += 0.5
            if post.author_id in commented_author_ids:
                affinity_score += 0.5
            if post.author == user:
                affinity_score += 0.8

            # Topic / Interest Match score
            interest_score = 0.0
            for tag in post.hashtags.all():
                if tag.name in user_interests:
                    interest_score += user_interests[tag.name]

            total_score = (
                cls.RECENCY_WEIGHT * recency_score +
                cls.ENGAGEMENT_WEIGHT * engagement_score +
                cls.AFFINITY_WEIGHT * affinity_score +
                cls.INTEREST_WEIGHT * min(interest_score, 2.0)
            )

            scored_posts.append((post, total_score))

        # Sort by total score descending
        scored_posts.sort(key=lambda x: x[1], reverse=True)
        ranked = [p[0] for p in scored_posts]

        # Pagination slice
        start = (page - 1) * page_size
        end = start + page_size
        return ranked[start:end]
