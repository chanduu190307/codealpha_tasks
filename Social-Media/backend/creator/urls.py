from django.urls import path
from creator.views import (
    DraftListCreateView, DraftDetailView,
    ScheduledPostListCreateView, ScheduledPostDetailView,
    PublishScheduledPostNowView
)

urlpatterns = [
    path('creator/drafts/', DraftListCreateView.as_view(), name='draft_list_create'),
    path('creator/drafts/<int:pk>/', DraftDetailView.as_view(), name='draft_detail'),
    path('creator/scheduled/', ScheduledPostListCreateView.as_view(), name='scheduled_list_create'),
    path('creator/scheduled/<int:pk>/', ScheduledPostDetailView.as_view(), name='scheduled_detail'),
    path('creator/scheduled/<int:pk>/publish-now/', PublishScheduledPostNowView.as_view(), name='scheduled_publish_now'),
]
