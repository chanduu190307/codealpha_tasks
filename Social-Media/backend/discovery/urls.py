from django.urls import path
from discovery.views import (
    TrendingHashtagsView, SuggestedUsersView, RecommendedPostsView,
    HashtagPostsView, RankedSearchView, SearchHistoryListView,
    SearchHistoryDeleteView, PostHideView, PostNotInterestedView
)

urlpatterns = [
    path('trending/hashtags/', TrendingHashtagsView.as_view(), name='trending_hashtags'),
    path('discovery/suggestions/', SuggestedUsersView.as_view(), name='suggested_users'),
    path('discovery/recommended-posts/', RecommendedPostsView.as_view(), name='recommended_posts'),
    path('hashtags/<str:name>/posts/', HashtagPostsView.as_view(), name='hashtag_posts'),

    path('search/', RankedSearchView.as_view(), name='ranked_search'),
    path('search/history/', SearchHistoryListView.as_view(), name='search_history_list'),
    path('search/history/<int:pk>/', SearchHistoryDeleteView.as_view(), name='search_history_delete_single'),
    path('search/history/clear/', SearchHistoryDeleteView.as_view(), name='search_history_clear_all'),

    path('posts/<int:pk>/hide/', PostHideView.as_view(), name='post_hide'),
    path('posts/<int:pk>/not-interested/', PostNotInterestedView.as_view(), name='post_not_interested'),
]
