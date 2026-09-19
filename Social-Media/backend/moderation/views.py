from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.utils import timezone
from moderation.models import Report, ModerationQueueItem, ModerationAuditLog, ModerationAppeal
from moderation.serializers import (
    ReportSerializer, ModerationQueueItemSerializer,
    ModerationAuditLogSerializer, ModerationAppealSerializer
)
from posts.models import Post
from comments.models import Comment

class ReportCreateView(generics.CreateAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        suspended_users = User.objects.filter(is_active=False).count()
        total_posts = Post.objects.count()
        total_comments = Comment.objects.count()
        pending_reports = Report.objects.filter(status='pending').count()
        resolved_reports = Report.objects.filter(status='resolved').count()
        ai_flagged_pending = ModerationQueueItem.objects.filter(status='pending').count()
        pending_appeals = ModerationAppeal.objects.filter(status='pending').count()

        return Response({
            "metrics": {
                "total_users": total_users,
                "active_users": active_users,
                "suspended_users": suspended_users,
                "total_posts": total_posts,
                "total_comments": total_comments,
                "pending_reports": pending_reports,
                "resolved_reports": resolved_reports,
                "ai_flagged_pending": ai_flagged_pending,
                "pending_appeals": pending_appeals
            }
        }, status=status.HTTP_200_OK)


class AdminReportListView(generics.ListAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        status_filter = self.request.query_params.get('status', 'pending')
        return Report.objects.filter(status=status_filter).select_related('reporter', 'reporter__profile')


class AdminReportResolveView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        action = request.data.get('action', 'resolved')
        reason = request.data.get('reason', 'Moderator reviewed and updated status.')

        report.status = action
        report.resolved_at = timezone.now()
        report.assigned_moderator = request.user
        report.save(update_fields=['status', 'resolved_at', 'assigned_moderator'])

        ModerationAuditLog.objects.create(
            moderator=request.user,
            action=f"report_{action}",
            target_summary=f"Report #{report.id} on {report.target_type} #{report.target_id}",
            reason=reason
        )

        return Response({"status": action, "report_id": report.id}, status=status.HTTP_200_OK)


class AdminSuspendUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, user_id):
        target_user = get_object_or_404(User, id=user_id)
        action = request.data.get('action', 'suspend')
        reason = request.data.get('reason', 'Staff action.')

        if action == 'suspend':
            target_user.is_active = False
        else:
            target_user.is_active = True
        target_user.save(update_fields=['is_active'])

        ModerationAuditLog.objects.create(
            moderator=request.user,
            action=f"user_{action}",
            target_summary=f"User @{target_user.username} (ID: {target_user.id})",
            reason=reason
        )

        return Response({"status": action, "user": target_user.username, "is_active": target_user.is_active}, status=status.HTTP_200_OK)


class AdminModerationQueueListView(generics.ListAPIView):
    serializer_class = ModerationQueueItemSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return ModerationQueueItem.objects.filter(status='pending').order_by('-confidence_score')


class ModerationAppealCreateView(generics.CreateAPIView):
    serializer_class = ModerationAppealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AdminAppealResolveView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        appeal = get_object_or_404(ModerationAppeal, pk=pk)
        decision = request.data.get('decision', 'approved')  # approved or rejected
        notes = request.data.get('notes', 'Staff decision on appeal.')

        appeal.status = decision
        appeal.reviewed_by = request.user
        appeal.review_notes = notes
        appeal.reviewed_at = timezone.now()
        appeal.save(update_fields=['status', 'reviewed_by', 'review_notes', 'reviewed_at'])

        ModerationAuditLog.objects.create(
            moderator=request.user,
            action=f"appeal_{decision}",
            target_summary=f"Appeal #{appeal.id} for {appeal.user.username}",
            reason=notes
        )

        return Response({"status": decision, "appeal_id": appeal.id}, status=status.HTTP_200_OK)
