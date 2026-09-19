from django.urls import path
from stories.views import (
    StoryFeedView, StoryCreateView, StoryDetailView,
    StoryRecordView, StoryViewersListView,
    CloseFriendsListView, CloseFriendDeleteView
)

urlpatterns = [
    path('stories/feed/', StoryFeedView.as_view(), name='story_feed'),
    path('stories/', StoryCreateView.as_view(), name='story_create'),
    path('stories/<int:pk>/', StoryDetailView.as_view(), name='story_detail'),
    path('stories/<int:pk>/view/', StoryRecordView.as_view(), name='story_view'),
    path('stories/<int:pk>/viewers/', StoryViewersListView.as_view(), name='story_viewers'),
    path('close-friends/', CloseFriendsListView.as_view(), name='close_friends_list'),
    path('close-friends/<int:friend_id>/', CloseFriendDeleteView.as_view(), name='close_friend_delete'),
]
