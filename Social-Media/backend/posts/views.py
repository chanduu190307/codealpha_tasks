from django.db.models import Count, Exists, OuterRef, Prefetch
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.contrib.auth.models import User
from rest_framework import generics, status, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Post, Bookmark, PostCollaboration
from .serializers import PostSerializer, PostCreateUpdateSerializer, BookmarkSerializer, PostCollaborationSerializer
from core.permissions import IsAuthorOrReadOnly
from core.pagination import StandardResultsSetPagination
from core.ranking import FeedRankingService
from core.media_pipeline import MediaProcessingPipeline
from core.events import publish_event
from interactions.models import Like, Follow
from comments.models import Comment
from accounts.models import UserBlock, UserMute
from discovery.algorithms import attach_hashtags_to_post
from discovery.models import PostHide, PostNotInterested
from moderation.service import ModerationService


def get_optimized_post_queryset(user=None):
    """
    Returns an optimized Post queryset with selective joins and dynamic annotation
    for is_liked by the requesting user, with block and mute isolation filters applied.
    """
    qs = Post.objects.select_related(
        'author',
        'author__profile',
        'community'
    ).prefetch_related(
        Prefetch('comments', queryset=Comment.objects.select_related('author', 'author__profile').order_by('created_at')),
        Prefetch('collaborations', queryset=PostCollaboration.objects.select_related('collaborator', 'collaborator__profile')),
        'hashtags'
    ).annotate(
        likes_count_annotated=Count('likes', distinct=True),
        comments_count_annotated=Count('comments', distinct=True),
        bookmarks_count_annotated=Count('bookmarks', distinct=True)
    )

    if user and user.is_authenticated:
        # Check if user liked each post
        user_likes = Like.objects.filter(post=OuterRef('pk'), user=user)
        user_bookmarks = Bookmark.objects.filter(post=OuterRef('pk'), user=user)
        qs = qs.annotate(
            is_liked_annotated=Exists(user_likes),
            is_bookmarked_annotated=Exists(user_bookmarks)
        )

        # Exclude blocked & muted authors
        from core.utils import get_user_exclusion_ids
        excluded_users = get_user_exclusion_ids(user)
        hidden_ids = PostHide.objects.filter(user=user).values_list('post_id', flat=True)
        not_interested_ids = PostNotInterested.objects.filter(user=user).values_list('post_id', flat=True)
        excluded_posts = set(hidden_ids).union(set(not_interested_ids))
        qs = qs.exclude(author_id__in=excluded_users).exclude(id__in=excluded_posts)

    return qs.order_by('-created_at')


class PostListCreateView(generics.ListCreateAPIView):
    pagination_class = StandardResultsSetPagination
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    throttle_scope = 'posts_create'

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return get_optimized_post_queryset(self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateUpdateSerializer
        return PostSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save(author=request.user)

        attach_hashtags_to_post(post)
        ModerationService.inspect_content('post', post.id, post.content)
        publish_event('post_created', post_id=post.id, author_id=request.user.id)

        full_qs = get_optimized_post_queryset(request.user)
        created_post = full_qs.get(pk=post.pk)
        output_serializer = PostSerializer(created_post, context={'request': request})
        return Response({
            'success': True,
            'detail': 'Post created successfully.',
            'post': output_serializer.data
        }, status=status.HTTP_201_CREATED)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return get_optimized_post_queryset(self.request.user)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return PostCreateUpdateSerializer
        return PostSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        attach_hashtags_to_post(instance)
        ModerationService.inspect_content('post', instance.id, instance.content)

        full_qs = get_optimized_post_queryset(request.user)
        updated_post = full_qs.get(pk=instance.pk)
        output_serializer = PostSerializer(updated_post, context={'request': request})
        return Response({
            'success': True,
            'detail': 'Post updated successfully.',
            'post': output_serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'detail': 'Post deleted successfully.'
        }, status=status.HTTP_200_OK)


class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        username = self.kwargs.get('username')
        return get_optimized_post_queryset(self.request.user).filter(author__username__iexact=username)


class FeedView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        following_ids = Follow.objects.filter(follower=user).values_list('following_id', flat=True)
        feed_user_ids = list(following_ids) + [user.id]

        candidates = get_optimized_post_queryset(user).filter(author_id__in=feed_user_ids)
        return FeedRankingService.rank_feed_posts(user, candidates)


class BookmarkPostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        if Bookmark.objects.filter(user=request.user, post=post).exists():
            return Response({"detail": "Post already bookmarked."}, status=status.HTTP_400_BAD_REQUEST)
        Bookmark.objects.create(user=request.user, post=post)
        return Response({"status": "bookmarked", "post_id": post.id}, status=status.HTTP_200_OK)


class UnbookmarkPostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        Bookmark.objects.filter(user=request.user, post=post).delete()
        return Response({"status": "unbookmarked", "post_id": post.id}, status=status.HTTP_200_OK)


class SavedPostsListView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        saved_post_ids = Bookmark.objects.filter(user=self.request.user).values_list('post_id', flat=True)
        return get_optimized_post_queryset(self.request.user).filter(id__in=saved_post_ids)


class PostCollaborationInviteView(APIView):
    """
    Primary author invites another user to collaborate on their post.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk, author=request.user)
        collaborator_username = request.data.get('username', '').strip()
        collaborator = get_object_or_404(User, username=collaborator_username)

        if collaborator == request.user:
            return Response({"detail": "Cannot invite yourself as collaborator."}, status=status.HTTP_400_BAD_REQUEST)

        # Check block isolation
        if UserBlock.objects.filter(blocker=request.user, blocked=collaborator).exists() or \
           UserBlock.objects.filter(blocker=collaborator, blocked=request.user).exists():
            return Response({"detail": "Cannot collaborate with this user."}, status=status.HTTP_400_BAD_REQUEST)

        collab, created = PostCollaboration.objects.get_or_create(
            post=post, collaborator=collaborator,
            defaults={'status': 'pending'}
        )
        return Response(PostCollaborationSerializer(collab).data, status=status.HTTP_201_CREATED)


class PostCollaborationRespondView(APIView):
    """
    Invited user accepts or rejects collaboration invite.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        collab = get_object_or_404(PostCollaboration, pk=pk, collaborator=request.user)
        decision = request.data.get('decision', 'accepted') # accepted or rejected

        if decision in ['accepted', 'rejected']:
            collab.status = decision
            collab.responded_at = timezone.now()
            collab.save(update_fields=['status', 'responded_at'])

        return Response({"status": collab.status, "collab_id": collab.id}, status=status.HTTP_200_OK)
