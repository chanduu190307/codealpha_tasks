from django.contrib.auth.models import User
from django.db import transaction, IntegrityError
from rest_framework import status, permissions, generics
from rest_framework.views import APIView
from rest_framework.response import Response

from posts.models import Post
from .models import Like, Follow
from accounts.models import Profile
from accounts.serializers import ProfileSerializer, UserSummarySerializer
from core.pagination import StandardResultsSetPagination
from notifications.views import dispatch_realtime_notification


class LikePostView(APIView):
    """
    Like a specific post. Idempotent and duplicate-safe.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = 'interactions'

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except (Post.DoesNotExist, ValueError):
            return Response({
                'success': False,
                'errors': {'detail': 'Post not found.'}
            }, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            like, created = Like.objects.get_or_create(user=request.user, post=post)

        if created:
            dispatch_realtime_notification(
                recipient=post.author,
                actor=request.user,
                verb='like',
                target_id=post.id,
                target_type='post'
            )

        likes_count = post.likes.count()
        return Response({
            'success': True,
            'is_liked': True,
            'likes_count': likes_count,
            'detail': 'Post liked successfully.'
        }, status=status.HTTP_200_OK)


class UnlikePostView(APIView):
    """
    Unlike a specific post.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = 'interactions'

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except (Post.DoesNotExist, ValueError):
            return Response({
                'success': False,
                'errors': {'detail': 'Post not found.'}
            }, status=status.HTTP_404_NOT_FOUND)

        Like.objects.filter(user=request.user, post=post).delete()
        likes_count = post.likes.count()

        return Response({
            'success': True,
            'is_liked': False,
            'likes_count': likes_count,
            'detail': 'Post unliked successfully.'
        }, status=status.HTTP_200_OK)


class FollowUserView(APIView):
    """
    Follow a user by username. Enforces self-follow prevention.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = 'interactions'

    def post(self, request, username):
        if request.user.username.lower() == username.lower():
            return Response({
                'success': False,
                'errors': {'detail': 'You cannot follow yourself.'}
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'errors': {'detail': 'User not found.'}
            }, status=status.HTTP_404_NOT_FOUND)

        try:
            with transaction.atomic():
                follow, created = Follow.objects.get_or_create(follower=request.user, following=target_user)
                if created:
                    dispatch_realtime_notification(
                        recipient=target_user,
                        actor=request.user,
                        verb='follow',
                        target_id=request.user.id,
                        target_type='user'
                    )
        except IntegrityError:
            pass

        followers_count = target_user.followers_received.count()
        return Response({
            'success': True,
            'is_following': True,
            'followers_count': followers_count,
            'detail': f'You are now following {target_user.username}.'
        }, status=status.HTTP_200_OK)


class UnfollowUserView(APIView):
    """
    Unfollow a user by username.
    """
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = 'interactions'

    def post(self, request, username):
        try:
            target_user = User.objects.get(username__iexact=username)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'errors': {'detail': 'User not found.'}
            }, status=status.HTTP_404_NOT_FOUND)

        Follow.objects.filter(follower=request.user, following=target_user).delete()
        followers_count = target_user.followers_received.count()

        return Response({
            'success': True,
            'is_following': False,
            'followers_count': followers_count,
            'detail': f'You have unfollowed {target_user.username}.'
        }, status=status.HTTP_200_OK)


class FollowersListView(generics.ListAPIView):
    """
    List all followers of a specific user.
    """
    serializer_class = UserSummarySerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs.get('username')
        return User.objects.filter(
            following_sent__following__username__iexact=username
        ).select_related('profile').order_by('username')


class FollowingListView(generics.ListAPIView):
    """
    List all users that a specific user is following.
    """
    serializer_class = UserSummarySerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs.get('username')
        return User.objects.filter(
            followers_received__follower__username__iexact=username
        ).select_related('profile').order_by('username')
