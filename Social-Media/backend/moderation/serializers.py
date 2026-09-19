from rest_framework import serializers
from moderation.models import Report, ModerationQueueItem, ModerationAuditLog, ModerationAppeal
from accounts.serializers import UserSerializer

class ReportSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'reporter', 'target_type', 'target_id', 'reason', 'description', 'status', 'created_at', 'resolved_at']
        read_only_fields = ['id', 'reporter', 'status', 'created_at', 'resolved_at']

class ModerationQueueItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModerationQueueItem
        fields = ['id', 'content_type', 'object_id', 'flagged_reason', 'confidence_score', 'ai_provider', 'status', 'created_at']

class ModerationAuditLogSerializer(serializers.ModelSerializer):
    moderator = UserSerializer(read_only=True)

    class Meta:
        model = ModerationAuditLog
        fields = ['id', 'moderator', 'action', 'target_summary', 'reason', 'timestamp']

class ModerationAppealSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ModerationAppeal
        fields = ['id', 'user', 'target_summary', 'statement', 'status', 'created_at', 'reviewed_at']
        read_only_fields = ['id', 'user', 'status', 'created_at', 'reviewed_at']
