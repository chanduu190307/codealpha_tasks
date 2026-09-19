from django.urls import path
from analytics.views import CreatorOverviewAnalyticsView, UserActivityCenterView

urlpatterns = [
    path('creator/analytics/overview/', CreatorOverviewAnalyticsView.as_view(), name='creator_analytics_overview'),
    path('activity/center/', UserActivityCenterView.as_view(), name='user_activity_center'),
]
