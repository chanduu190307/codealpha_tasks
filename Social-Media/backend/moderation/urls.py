from django.urls import path
from moderation.views import (
    ReportCreateView, AdminDashboardView, AdminReportListView,
    AdminReportResolveView, AdminSuspendUserView, AdminModerationQueueListView,
    ModerationAppealCreateView, AdminAppealResolveView
)

urlpatterns = [
    path('reports/', ReportCreateView.as_view(), name='report_create'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('admin/reports/', AdminReportListView.as_view(), name='admin_reports_list'),
    path('admin/reports/<int:pk>/resolve/', AdminReportResolveView.as_view(), name='admin_report_resolve'),
    path('admin/users/<int:user_id>/suspend/', AdminSuspendUserView.as_view(), name='admin_user_suspend'),
    path('admin/moderation-queue/', AdminModerationQueueListView.as_view(), name='admin_moderation_queue'),

    path('moderation/appeals/', ModerationAppealCreateView.as_view(), name='appeal_create'),
    path('admin/appeals/<int:pk>/resolve/', AdminAppealResolveView.as_view(), name='admin_appeal_resolve'),
]
