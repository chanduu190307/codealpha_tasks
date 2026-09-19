from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Count, Q
from chat.models import Conversation, ConversationMember, Message
from chat.serializers import ConversationSerializer, MessageSerializer
from accounts.models import UserBlock, UserPrivacySettings

class ConversationListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        conversations = Conversation.objects.filter(members__user=user).prefetch_related(
            'members', 'members__user', 'members__user__profile', 'messages'
        ).order_by('-updated_at')
        serializer = ConversationSerializer(conversations, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        recipient_id = request.data.get('recipient_id')
        if not recipient_id:
            return Response({"detail": "recipient_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        recipient = get_object_or_404(User, id=recipient_id)
        if recipient == request.user:
            return Response({"detail": "Cannot start conversation with yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Check block status
        if UserBlock.objects.filter(
            Q(blocker=request.user, blocked=recipient) |
            Q(blocker=recipient, blocked=request.user)
        ).exists():
            return Response({"detail": "Cannot message this user due to block restrictions."}, status=status.HTTP_403_FORBIDDEN)

        # Find existing 1-on-1 conversation
        existing = Conversation.objects.filter(
            members__user=request.user
        ).filter(
            members__user=recipient
        ).annotate(num_members=Count('members')).filter(num_members=2).first()

        if existing:
            serializer = ConversationSerializer(existing, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Create new conversation
        conv = Conversation.objects.create()
        ConversationMember.objects.create(conversation=conv, user=request.user)
        ConversationMember.objects.create(conversation=conv, user=recipient)

        serializer = ConversationSerializer(conv, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conv_id = self.kwargs['conversation_id']
        # Enforce conversation membership (IDOR/BOLA Guard)
        get_object_or_404(ConversationMember, conversation_id=conv_id, user=self.request.user)
        return Message.objects.filter(conversation_id=conv_id, is_deleted=False).select_related(
            'sender', 'sender__profile'
        ).order_by('created_at')

    def perform_create(self, serializer):
        conv_id = self.kwargs['conversation_id']
        conv_member = get_object_or_404(ConversationMember, conversation_id=conv_id, user=self.request.user)
        msg = serializer.save(conversation=conv_member.conversation, sender=self.request.user)
        conv_member.conversation.save(update_fields=['updated_at'])


class MessageDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        msg = get_object_or_404(Message, pk=pk, sender=request.user)
        msg.is_deleted = True
        msg.save(update_fields=['is_deleted'])
        return Response({"status": "deleted"}, status=status.HTTP_204_NO_CONTENT)
