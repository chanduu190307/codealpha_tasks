import re
from datetime import datetime, timezone
from django.contrib.auth.models import User
from django.db.models import Count, Q
from discovery.models import Hashtag, TrendingTopic
from accounts.models import UserBlock, UserMute

HASHTAG_REGEX = re.compile(r'#([a-zA-Z0-9_]{2,50})')

def extract_hashtags(text: str) -> list:
    if not text:
        return []
    matches = HASHTAG_REGEX.findall(text)
    return list(set(tag.lower() for tag in matches))

def attach_hashtags_to_post(post):
    tags = extract_hashtags(post.content)
    tag_objects = []
    for tag_name in tags:
        tag_obj, _ = Hashtag.objects.get_or_create(name=tag_name)
        tag_objects.append(tag_obj)
    post.hashtags.set(tag_objects)

def calculate_post_velocity_score(post) -> float:
    """
    Transparent trending engagement velocity score:
    Score = (Likes*2 + Comments*3 + Bookmarks*4) / (AgeInHours + 2)^1.5
    """
    likes = post.likes.count()
    comments = post.comments.count()
    bookmarks = post.bookmarks.count()

    now = datetime.now(timezone.utc)
    age_seconds = max((now - post.created_at).total_seconds(), 0)
    age_hours = age_seconds / 3600.0

    engagement = (likes * 2) + (comments * 3) + (bookmarks * 4) + 1.0
    gravity = (age_hours + 2.0) ** 1.5
    return round(engagement / gravity, 4)

def get_suggested_users(current_user, limit=5):
    """
    Recommends accounts based on mutual connections, activity, and completeness.
    Excludes self, already-followed users, blocked users, and muted users.
    """
    exclude_ids = set()
    if current_user and getattr(current_user, 'is_authenticated', False):
        following_ids = set(current_user.following_sent.values_list('following_id', flat=True))
        blocked_ids = set(UserBlock.objects.filter(blocker=current_user).values_list('blocked_id', flat=True))
        blocked_by_ids = set(UserBlock.objects.filter(blocked=current_user).values_list('blocker_id', flat=True))
        muted_ids = set(UserMute.objects.filter(muter=current_user).values_list('muted_id', flat=True))
        exclude_ids = following_ids | blocked_ids | blocked_by_ids | muted_ids | {current_user.id}

    # Query candidate users
    candidates = User.objects.filter(is_active=True).exclude(
        id__in=exclude_ids
    ).select_related('profile').annotate(
        follower_total=Count('followers_received', distinct=True)
    ).order_by('-follower_total', '-date_joined')[:limit]

    return candidates
