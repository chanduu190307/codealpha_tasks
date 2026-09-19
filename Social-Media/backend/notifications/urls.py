from django.urls import path
from notifications.views import (
    NotificationListView, NotificationMarkReadView,
    NotificationMarkAllReadView, NotificationPreferencesView
)

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification_list'),
    path('notifications/<int:pk>/read/', NotificationMarkReadView.as_view(), name='notification_mark_read'),
    path('notifications/read-all/', NotificationMarkAllReadView.as_view(), name='notification_mark_all_read'),
    path('notifications/preferences/', NotificationPreferencesView.as_view(), name='notification_preferences'),
]
