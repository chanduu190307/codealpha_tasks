from rest_framework import serializers
from notifications.models import Notification, NotificationPreference
from accounts.serializers import UserSerializer

class NotificationSerializer(serializers.ModelSerializer):
    actor = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'actor', 'verb', 'target_id', 'target_type', 'is_read', 'created_at']
        read_only_fields = ['id', 'actor', 'verb', 'target_id', 'target_type', 'created_at']

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = ['likes_enabled', 'comments_enabled', 'follows_enabled', 'mentions_enabled', 'messages_enabled', 'stories_enabled']
