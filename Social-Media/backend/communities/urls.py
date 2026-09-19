from django.urls import path
from communities.views import (
    CommunityListCreateView, CommunityDetailView, CommunityJoinLeaveView,
    CommunityPostsListView, CommunityMembersListView, CommunityJoinRequestListView,
    CommunityJoinRequestRespondView, CommunityBanUserView
)

urlpatterns = [
    path('communities/', CommunityListCreateView.as_view(), name='community_list_create'),
    path('communities/<slug:slug>/', CommunityDetailView.as_view(), name='community_detail'),
    path('communities/<slug:slug>/join-leave/', CommunityJoinLeaveView.as_view(), name='community_join_leave'),
    path('communities/<slug:slug>/posts/', CommunityPostsListView.as_view(), name='community_posts'),
    path('communities/<slug:slug>/members/', CommunityMembersListView.as_view(), name='community_members'),
    path('communities/<slug:slug>/requests/', CommunityJoinRequestListView.as_view(), name='community_requests_list'),
    path('communities/<slug:slug>/requests/<int:request_id>/respond/', CommunityJoinRequestRespondView.as_view(), name='community_request_respond'),
    path('communities/<slug:slug>/users/<int:user_id>/ban/', CommunityBanUserView.as_view(), name='community_ban_user'),
]
