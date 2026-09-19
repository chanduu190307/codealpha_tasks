from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from stories.models import Story, StoryView, StoryReaction, CloseFriend
from stories.serializers import StorySerializer, StoryViewSerializer, CloseFriendSerializer
from core.permissions import IsOwnerOrReadOnly
from accounts.models import UserBlock

class StoryFeedView(generics.ListAPIView):
    """
    Returns active (unexpired, non-deleted) stories visible to current user based on:
    - Author is user or user follows author
    - Audience privacy rules (everyone, followers, close_friends)
    - Block isolation
    """
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        now = timezone.now()

        # Blocked users filter
        blocked_by_user = UserBlock.objects.filter(blocker=user).values_list('blocked_id', flat=True)
        blocked_user = UserBlock.objects.filter(blocked=user).values_list('blocker_id', flat=True)
        excluded_users = set(blocked_by_user).union(set(blocked_user))

        # Followed users + self
        following_ids = set(user.following_sent.values_list('following_id', flat=True))
        eligible_authors = (following_ids | {user.id}) - excluded_users

        # Authors where current user is in their CloseFriends list
        close_friend_authors = set(CloseFriend.objects.filter(friend=user).values_list('user_id', flat=True))

        return Story.objects.filter(
            author_id__in=eligible_authors,
            expires_at__gt=now,
            is_deleted=False
        ).filter(
            Q(author=user) |
            Q(audience='everyone') |
            Q(audience='followers') |
            (Q(audience='close_friends') & Q(author_id__in=close_friend_authors))
        ).select_related('author', 'author__profile').prefetch_related('views').order_by('-created_at')


class StoryCreateView(generics.CreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class StoryDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    lookup_url_kwarg = 'pk'

    def get_queryset(self):
        now = timezone.now()
        user = self.request.user

        # Ensure blocked users cannot access story via ID
        blocked_by_user = UserBlock.objects.filter(blocker=user).values_list('blocked_id', flat=True)
        blocked_user = UserBlock.objects.filter(blocked=user).values_list('blocker_id', flat=True)
        excluded = set(blocked_by_user).union(set(blocked_user))

        following_ids = set(user.following_sent.values_list('following_id', flat=True))
        close_friend_authors = set(CloseFriend.objects.filter(friend=user).values_list('user_id', flat=True))

        return Story.objects.filter(
            expires_at__gt=now,
            is_deleted=False
        ).exclude(
            author_id__in=excluded
        ).filter(
            Q(author=user) |
            Q(audience='everyone') |
            (Q(audience='followers') & Q(author_id__in=following_ids)) |
            (Q(audience='close_friends') & Q(author_id__in=close_friend_authors))
        ).select_related('author', 'author__profile')

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save(update_fields=['is_deleted'])


class StoryRecordView(APIView):
    """
    Records a unique story view.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        now = timezone.now()
        story = get_object_or_404(Story, pk=pk, expires_at__gt=now, is_deleted=False)

        # Do not record self views
        if story.author != request.user:
            StoryView.objects.get_or_create(story=story, viewer=request.user)

        return Response({"status": "viewed", "views_count": story.views.count()}, status=status.HTTP_200_OK)


class StoryViewersListView(generics.ListAPIView):
    """
    Author-only view for story audience analytics.
    """
    serializer_class = StoryViewSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        story = get_object_or_404(Story, pk=self.kwargs['pk'], author=self.request.user)
        return story.views.select_related('viewer', 'viewer__profile').order_by('-viewed_at')


class CloseFriendsListView(generics.ListCreateAPIView):
    serializer_class = CloseFriendSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return CloseFriend.objects.filter(user=self.request.user).select_related('friend', 'friend__profile')

    def perform_create(self, serializer):
        friend_id = serializer.validated_data['friend_id']
        friend = get_object_or_404(User, id=friend_id)
        if friend == self.request.user:
            raise serializers.ValidationError({"detail": "Cannot add yourself to close friends."})
        serializer.save(user=self.request.user, friend=friend)


class CloseFriendDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, friend_id):
        cf = CloseFriend.objects.filter(user=request.user, friend_id=friend_id).first()
        if cf:
            cf.delete()
            return Response({"status": "removed"}, status=status.HTTP_200_OK)
        return Response({"detail": "Not found in close friends."}, status=status.HTTP_404_NOT_FOUND)
