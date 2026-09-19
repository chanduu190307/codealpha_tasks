from rest_framework import serializers
from django.contrib.auth.models import User
from chat.models import Conversation, ConversationMember, Message
from accounts.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'attachment', 'reply_to', 'is_deleted', 'created_at']
        read_only_fields = ['id', 'conversation', 'sender', 'is_deleted', 'created_at']

class ConversationMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ConversationMember
        fields = ['id', 'user', 'is_muted', 'last_read_at', 'joined_at']

class ConversationSerializer(serializers.ModelSerializer):
    members = ConversationMemberSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    other_user = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'members', 'last_message', 'other_user', 'created_at', 'updated_at']

    def get_last_message(self, obj):
        last_msg = obj.messages.filter(is_deleted=False).order_by('-created_at').first()
        if last_msg:
            return MessageSerializer(last_msg, context=self.context).data
        return None

    def get_other_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            other = obj.get_other_member(request.user)
            if other:
                return UserSerializer(other, context=self.context).data
        return None
