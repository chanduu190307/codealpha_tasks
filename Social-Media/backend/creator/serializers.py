from rest_framework import serializers
from creator.models import PostDraft, ScheduledPost

class PostDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostDraft
        fields = ['id', 'content', 'image', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ScheduledPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduledPost
        fields = ['id', 'content', 'image', 'scheduled_time', 'status', 'created_at', 'published_at']
        read_only_fields = ['id', 'status', 'created_at', 'published_at']
