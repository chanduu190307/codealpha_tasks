from rest_framework import serializers
from communities.models import Community, CommunityMember, CommunityJoinRequest, CommunityBan, CommunityModerationLog
from accounts.serializers import UserSummarySerializer
from core.fields import NormalizedImageField

class CommunitySerializer(serializers.ModelSerializer):
    created_by = UserSummarySerializer(read_only=True)
    avatar = NormalizedImageField(required=False, allow_null=True)
    member_count = serializers.IntegerField(read_only=True)
    user_role = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = [
            'id', 'name', 'slug', 'description', 'type',
            'avatar', 'banner', 'rules', 'created_by',
            'created_at', 'member_count', 'user_role'
        ]
        read_only_fields = ['id', 'slug', 'created_by', 'created_at', 'member_count']

    def get_user_role(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            member = CommunityMember.objects.filter(community=obj, user=request.user).first()
            return member.role if member else None
        return None


class CommunityMemberSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = CommunityMember
        fields = ['id', 'user', 'role', 'joined_at']
        read_only_fields = ['id', 'user', 'joined_at']


class CommunityJoinRequestSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = CommunityJoinRequest
        fields = ['id', 'user', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'status', 'created_at']


class CommunityModerationLogSerializer(serializers.ModelSerializer):
    moderator = UserSummarySerializer(read_only=True)

    class Meta:
        model = CommunityModerationLog
        fields = ['id', 'moderator', 'action', 'target_summary', 'reason', 'created_at']
