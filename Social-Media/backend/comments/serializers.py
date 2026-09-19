from rest_framework import serializers
from .models import Comment
from accounts.serializers import UserSummarySerializer

class CommentSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    is_author = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at', 'updated_at', 'is_author']
        read_only_fields = ['id', 'post', 'author', 'created_at', 'updated_at']

    def get_is_author(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.author == request.user
        return False


class CommentCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']

    def validate_content(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Comment cannot be empty.")
        if len(cleaned) > 1000:
            raise serializers.ValidationError("Comment cannot exceed 1000 characters.")
        return cleaned
