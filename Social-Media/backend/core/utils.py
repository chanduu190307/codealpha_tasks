from typing import Set
from django.contrib.auth.models import User
from accounts.models import UserBlock, UserMute

def get_blocked_user_ids(user: User) -> Set[int]:
    """
    Returns set of user IDs who have either blocked the current user
    or have been blocked by the current user.
    """
    if not user or not user.is_authenticated:
        return set()

    blocked_by_user = UserBlock.objects.filter(blocker=user).values_list('blocked_id', flat=True)
    blocked_user = UserBlock.objects.filter(blocked=user).values_list('blocker_id', flat=True)
    return set(blocked_by_user).union(set(blocked_user))


def get_muted_user_ids(user: User) -> Set[int]:
    """
    Returns set of user IDs muted by the current user.
    """
    if not user or not user.is_authenticated:
        return set()
    return set(UserMute.objects.filter(muter=user).values_list('muted_id', flat=True))


def get_user_exclusion_ids(user: User) -> Set[int]:
    """
    Combines both blocked and muted user IDs for complete timeline/discovery isolation.
    """
    return get_blocked_user_ids(user).union(get_muted_user_ids(user))
