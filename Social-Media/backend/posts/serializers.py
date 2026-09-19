from rest_framework import serializers
from .models import Post, Bookmark, PostReaction, PostCollaboration
from accounts.serializers import UserSummarySerializer
from core.fields import NormalizedImageField

class PostCollaborationSerializer(serializers.ModelSerializer):
    collaborator = UserSummarySerializer(read_only=True)

    class Meta:
        model = PostCollaboration
        fields = ['id', 'collaborator', 'status', 'invited_at', 'responded_at']
        read_only_fields = ['id', 'collaborator', 'invited_at', 'responded_at']


class PostSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    image = NormalizedImageField(required=False, allow_null=True)
    collaborators = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    bookmarks_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    is_author = serializers.SerializerMethodField()
    hashtags = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')

    class Meta:
        model = Post
        fields = [
            'id', 'author', 'collaborators', 'community', 'content', 'image',
            'content_warning', 'created_at', 'updated_at',
            'likes_count', 'comments_count', 'bookmarks_count',
            'is_liked', 'is_bookmarked', 'is_author', 'hashtags'
        ]
        read_only_fields = ['id', 'author', 'collaborators', 'created_at', 'updated_at', 'likes_count', 'comments_count', 'bookmarks_count']

    def get_collaborators(self, obj):
        accepted = obj.collaborations.filter(status='accepted').select_related('collaborator', 'collaborator__profile')
        return [UserSummarySerializer(c.collaborator).data for c in accepted]

    def get_bookmarks_count(self, obj):
        return obj.bookmarks.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if hasattr(obj, 'user_has_liked'):
                return bool(obj.user_has_liked)
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False

    def get_is_author(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.author == request.user
        return False


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content', 'image', 'content_warning', 'community']

    def validate_content(self, value):
        cleaned = value.strip()
        if len(cleaned) > 2000:
            raise serializers.ValidationError("Post content cannot exceed 2000 characters.")
        return cleaned

    def validate(self, attrs):
        content = attrs.get('content', '')
        image = attrs.get('image', None)
        if not content and not image:
            raise serializers.ValidationError({"detail": "Post must contain either text content or an image."})
        return attrs


class BookmarkSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'post', 'created_at']
        read_only_fields = ['id', 'created_at']
