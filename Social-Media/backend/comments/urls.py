from django.urls import path
from .views import (
    PostCommentListCreateView,
    CommentDetailView
)

urlpatterns = [
    path('posts/<int:post_id>/comments/', PostCommentListCreateView.as_view(), name='post_comments'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment_detail'),
]
