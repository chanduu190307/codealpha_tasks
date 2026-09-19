from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from posts.models import Post
from .models import Comment
from .serializers import CommentSerializer, CommentCreateUpdateSerializer
from core.permissions import IsAuthorOrReadOnly
from core.pagination import StandardResultsSetPagination
from notifications.views import dispatch_realtime_notification
from moderation.service import ModerationService


class PostCommentListCreateView(generics.ListCreateAPIView):
    """
    List comments for a specific post, or add a new comment to it.
    """
    pagination_class = StandardResultsSetPagination

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_throttles(self):
        if self.request.method == 'POST':
            self.throttle_scope = 'comments_create'
        return super().get_throttles()

    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id).select_related('author', 'author__profile').order_by('created_at')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateUpdateSerializer
        return CommentSerializer

    def create(self, request, *args, **kwargs):
        post_id = self.kwargs.get('post_id')
        try:
            post = Post.objects.get(pk=post_id)
        except (Post.DoesNotExist, ValueError):
            return Response({
                'success': False,
                'errors': {'detail': 'Post not found.'}
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        comment = serializer.save(author=request.user, post=post)

        # Dispatch real-time notification to post author
        dispatch_realtime_notification(
            recipient=post.author,
            actor=request.user,
            verb='comment',
            target_id=post.id,
            target_type='post'
        )

        # Content moderation check
        ModerationService.inspect_content('comment', comment.id, comment.content)

        output_serializer = CommentSerializer(comment, context={'request': request})
        return Response({
            'success': True,
            'detail': 'Comment added successfully.',
            'comment': output_serializer.data
        }, status=status.HTTP_201_CREATED)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a specific comment.
    Protected against IDOR/BOLA via IsAuthorOrReadOnly.
    """
    queryset = Comment.objects.select_related('author', 'author__profile').all()
    permission_classes = [IsAuthorOrReadOnly]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CommentCreateUpdateSerializer
        return CommentSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        ModerationService.inspect_content('comment', instance.id, instance.content)

        output_serializer = CommentSerializer(instance, context={'request': request})
        return Response({
            'success': True,
            'detail': 'Comment updated successfully.',
            'comment': output_serializer.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'detail': 'Comment deleted successfully.'
        }, status=status.HTTP_200_OK)
