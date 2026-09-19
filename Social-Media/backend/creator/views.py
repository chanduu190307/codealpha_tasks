from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from creator.models import PostDraft, ScheduledPost
from creator.serializers import PostDraftSerializer, ScheduledPostSerializer
from posts.models import Post
from discovery.algorithms import attach_hashtags_to_post
from moderation.service import ModerationService

class DraftListCreateView(generics.ListCreateAPIView):
    serializer_class = PostDraftSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return PostDraft.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DraftDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PostDraftSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PostDraft.objects.filter(user=self.request.user)


class ScheduledPostListCreateView(generics.ListCreateAPIView):
    serializer_class = ScheduledPostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return ScheduledPost.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, status='scheduled')


class ScheduledPostDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ScheduledPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ScheduledPost.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        instance.status = 'cancelled'
        instance.save(update_fields=['status'])


class PublishScheduledPostNowView(APIView):
    """
    Manually triggers publishing of a scheduled post immediately.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        item = get_object_or_404(ScheduledPost, pk=pk, user=request.user, status='scheduled')

        # Create live post
        live_post = Post.objects.create(
            author=request.user,
            content=item.content,
            image=item.image
        )
        attach_hashtags_to_post(live_post)
        ModerationService.inspect_content('post', live_post.id, live_post.content)

        item.status = 'published'
        item.published_at = timezone.now()
        item.save(update_fields=['status', 'published_at'])

        return Response({"status": "published", "post_id": live_post.id}, status=status.HTTP_200_OK)
