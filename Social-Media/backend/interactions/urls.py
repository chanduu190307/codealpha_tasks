from django.urls import path
from .views import (
    LikePostView,
    UnlikePostView,
    FollowUserView,
    UnfollowUserView,
    FollowersListView,
    FollowingListView
)

urlpatterns = [
    path('posts/<int:pk>/like/', LikePostView.as_view(), name='post_like'),
    path('posts/<int:pk>/unlike/', UnlikePostView.as_view(), name='post_unlike'),
    path('users/<str:username>/follow/', FollowUserView.as_view(), name='user_follow'),
    path('users/<str:username>/unfollow/', UnfollowUserView.as_view(), name='user_unfollow'),
    path('users/<str:username>/followers/', FollowersListView.as_view(), name='user_followers'),
    path('users/<str:username>/following/', FollowingListView.as_view(), name='user_following'),
]
