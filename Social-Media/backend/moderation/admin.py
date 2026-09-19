from django.contrib import admin
from moderation.models import Report, ModerationQueueItem, ModerationAuditLog, ModerationAppeal

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['id', 'reporter', 'target_type', 'target_id', 'reason', 'status', 'created_at']
    list_filter = ['status', 'reason', 'target_type', 'created_at']
    search_fields = ['reporter__username', 'description']

@admin.register(ModerationQueueItem)
class ModerationQueueItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'content_type', 'object_id', 'flagged_reason', 'confidence_score', 'status', 'created_at']
    list_filter = ['status', 'ai_provider', 'created_at']

@admin.register(ModerationAuditLog)
class ModerationAuditLogAdmin(admin.ModelAdmin):
    list_display = ['id', 'moderator', 'action', 'target_summary', 'timestamp']
    list_filter = ['action', 'timestamp']

@admin.register(ModerationAppeal)
class ModerationAppealAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'created_at', 'reviewed_at']
    list_filter = ['status', 'created_at']
