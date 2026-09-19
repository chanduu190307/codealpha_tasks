from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from discovery.models import Hashtag, TrendingTopic, SearchHistory, UserInterest, PostHide, PostNotInterested
from discovery.serializers import (
    HashtagSerializer, TrendingTopicSerializer, SearchHistorySerializer,
    UserInterestSerializer, SuggestedUserSerializer
)
from discovery.algorithms import get_suggested_users
from accounts.serializers import UserSerializer, UserSummarySerializer
from posts.models import Post
from posts.serializers import PostSerializer
from accounts.models import UserBlock, UserMute
from core.caching import CacheService
from core.recommendations import RecommendationService

class TrendingHashtagsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cached_tags = CacheService.get_trending_tags()
        if cached_tags is not None:
            return Response(cached_tags, status=status.HTTP_200_OK)

        top_hashtags = Hashtag.objects.annotate(
            usage=Count('posts')
        ).filter(usage__gt=0).order_by('-usage')[:10]

        serializer = HashtagSerializer(top_hashtags, many=True)
        data = serializer.data
        CacheService.set_trending_tags(data, timeout=300)
        return Response(data, status=status.HTTP_200_OK)


class SuggestedUsersView(APIView):
    """
    Publicly safe suggested users endpoint.
    Allows unauthenticated visitors to receive suggested accounts with only safe public fields.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        suggested = get_suggested_users(request.user, limit=6)
        serializer = SuggestedUserSerializer(suggested, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class RecommendedPostsView(APIView):
    """
    Returns AI-scored diverse recommended posts.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        posts = RecommendationService.get_recommended_posts(request.user, limit=20)
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class HashtagPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        tag_name = self.kwargs['name'].lower()
        user = self.request.user

        queryset = Post.objects.filter(hashtags__name=tag_name).select_related(
            'author', 'author__profile'
        ).prefetch_related('likes', 'comments', 'bookmarks')

        if user.is_authenticated:
            # Update user interest score
            interest, _ = UserInterest.objects.get_or_create(user=user, topic=tag_name)
            interest.score = min(interest.score + 0.5, 5.0)
            interest.save(update_fields=['score', 'last_interacted_at'])

            blocked_ids = UserBlock.objects.filter(blocker=user).values_list('blocked_id', flat=True)
            blocked_by_ids = UserBlock.objects.filter(blocked=user).values_list('blocker_id', flat=True)
            muted_ids = UserMute.objects.filter(muter=user).values_list('muted_id', flat=True)
            queryset = queryset.exclude(author_id__in=set(blocked_ids) | set(blocked_by_ids) | set(muted_ids))

        return queryset.order_by('-created_at')


class RankedSearchView(APIView):
    """
    Multi-entity ranked search across users, posts, and hashtags.
    Saves search history for authenticated users.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"users": [], "posts": [], "hashtags": []}, status=status.HTTP_200_OK)

        user = request.user

        # Record private search history
        if user.is_authenticated:
            SearchHistory.objects.get_or_create(user=user, query=query[:255])

        # Excluded IDs
        excluded_users = set()
        if user.is_authenticated:
            blocked = UserBlock.objects.filter(blocker=user).values_list('blocked_id', flat=True)
            blocked_by = UserBlock.objects.filter(blocked=user).values_list('blocker_id', flat=True)
            excluded_users = set(blocked) | set(blocked_by)

        # 1. Search Users
        matched_users = User.objects.filter(
            Q(username__icontains=query) | Q(profile__display_name__icontains=query)
        ).exclude(id__in=excluded_users).select_related('profile')[:5]

        # 2. Search Hashtags
        matched_tags = Hashtag.objects.filter(name__icontains=query.lstrip('#'))[:5]

        # 3. Search Posts
        matched_posts = Post.objects.filter(
            content__icontains=query
        ).exclude(author_id__in=excluded_users).select_related('author', 'author__profile')[:10]

        return Response({
            "users": UserSummarySerializer(matched_users, many=True, context={'request': request}).data,
            "hashtags": HashtagSerializer(matched_tags, many=True).data,
            "posts": PostSerializer(matched_posts, many=True, context={'request': request}).data,
        }, status=status.HTTP_200_OK)


class SearchHistoryListView(generics.ListAPIView):
    serializer_class = SearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)[:15]


class SearchHistoryDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk=None):
        if pk:
            SearchHistory.objects.filter(user=request.user, pk=pk).delete()
        else:
            # Clear all history
            SearchHistory.objects.filter(user=request.user).delete()
        return Response({"status": "cleared"}, status=status.HTTP_200_OK)


class PostHideView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        PostHide.objects.get_or_create(user=request.user, post=post)
        return Response({"status": "hidden"}, status=status.HTTP_200_OK)


class PostNotInterestedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        PostNotInterested.objects.get_or_create(user=request.user, post=post)

        # Decay user interest in post's hashtags
        for tag in post.hashtags.all():
            interest = UserInterest.objects.filter(user=request.user, topic=tag.name).first()
            if interest:
                interest.score = max(interest.score - 1.0, 0.0)
                interest.save(update_fields=['score'])

        return Response({"status": "not_interested_recorded"}, status=status.HTTP_200_OK)
