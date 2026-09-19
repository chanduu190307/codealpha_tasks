from rest_framework import serializers
from django.contrib.auth.models import User
from discovery.models import Hashtag, TrendingTopic, SearchHistory, UserInterest
from core.fields import NormalizedImageField

class HashtagSerializer(serializers.ModelSerializer):
    posts_count = serializers.IntegerField(source='usage_count', read_only=True)

    class Meta:
        model = Hashtag
        fields = ['id', 'name', 'posts_count']

class TrendingTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrendingTopic
        fields = ['topic_name', 'score', 'post_count', 'updated_at']

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ['id', 'query', 'created_at']

class UserInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInterest
        fields = ['topic', 'score', 'last_interacted_at']


class SuggestedUserSerializer(serializers.ModelSerializer):
    """
    Safe public suggestion serializer.
    Only exposes safe public profile fields: id, username, display_name, avatar, bio, followers_count.
    Never exposes email, password, or sensitive metadata.
    """
    display_name = serializers.CharField(source='profile.display_name', read_only=True)
    avatar = NormalizedImageField(source='profile.avatar', read_only=True)
    bio = serializers.CharField(source='profile.bio', read_only=True)
    followers_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'display_name', 'avatar', 'bio', 'followers_count']

    def get_followers_count(self, obj):
        if hasattr(obj, 'follower_total'):
            return obj.follower_total
        return obj.followers_received.count()
