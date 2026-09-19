from django.urls import path
from .views import (
    PostListCreateView,
    PostDetailView,
    UserPostsView,
    FeedView,
    BookmarkPostView,
    UnbookmarkPostView,
    SavedPostsListView,
    PostCollaborationInviteView,
    PostCollaborationRespondView
)

urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='post_list_create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('posts/feed/', FeedView.as_view(), name='feed'),
    path('feed/', FeedView.as_view(), name='feed_direct'),
    path('users/<str:username>/posts/', UserPostsView.as_view(), name='user_posts'),

    path('posts/<int:pk>/bookmark/', BookmarkPostView.as_view(), name='post_bookmark'),
    path('posts/<int:pk>/unbookmark/', UnbookmarkPostView.as_view(), name='post_unbookmark'),
    path('posts/saved/', SavedPostsListView.as_view(), name='saved_posts_list'),

    # Collaborative Posts
    path('posts/<int:pk>/collaborators/', PostCollaborationInviteView.as_view(), name='post_collab_invite'),
    path('collaborations/<int:pk>/respond/', PostCollaborationRespondView.as_view(), name='post_collab_respond'),
]
