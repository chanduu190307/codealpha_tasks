from rest_framework import serializers
from django.contrib.auth.models import User
from stories.models import Story, StoryView, StoryReaction, CloseFriend
from accounts.serializers import UserSerializer
from core.fields import NormalizedImageField

class StoryViewSerializer(serializers.ModelSerializer):
    viewer = UserSerializer(read_only=True)

    class Meta:
        model = StoryView
        fields = ['id', 'viewer', 'viewed_at']

class StorySerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    media = NormalizedImageField()
    views_count = serializers.SerializerMethodField()
    has_viewed = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = ['id', 'author', 'media', 'caption', 'audience', 'created_at', 'expires_at', 'views_count', 'has_viewed']
        read_only_fields = ['id', 'author', 'created_at', 'expires_at', 'views_count', 'has_viewed']

    def get_views_count(self, obj):
        return obj.views.count()

    def get_has_viewed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.views.filter(viewer=request.user).exists()
        return False

class CloseFriendSerializer(serializers.ModelSerializer):
    friend = UserSerializer(read_only=True)
    friend_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CloseFriend
        fields = ['id', 'friend', 'friend_id', 'created_at']
        read_only_fields = ['id', 'created_at']
