from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from chat.models import Conversation, ConversationMember, Message
from accounts.models import UserBlock

class ChatTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='alice', email='alice@example.com', password='Password123!')
        self.user2 = User.objects.create_user(username='bob', email='bob@example.com', password='Password123!')
        self.user3 = User.objects.create_user(username='eve', email='eve@example.com', password='Password123!')

    def test_start_conversation_and_send_message(self):
        self.client.force_login(self.user1)

        # Create conversation with Bob
        res = self.client.post('/api/conversations/', {'recipient_id': self.user2.id}, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        conv_id = res.data['id']

        # Send message
        msg_res = self.client.post(f'/api/conversations/{conv_id}/messages/', {'content': 'Hey Bob!'}, format='json')
        self.assertEqual(msg_res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Message.objects.filter(conversation_id=conv_id).count(), 1)

    def test_unauthorized_conversation_access_rejection(self):
        # Conversation between Alice and Bob
        conv = Conversation.objects.create()
        ConversationMember.objects.create(conversation=conv, user=self.user1)
        ConversationMember.objects.create(conversation=conv, user=self.user2)
        Message.objects.create(conversation=conv, sender=self.user1, content='Private secret')

        # Eve attempts to read messages (BOLA / IDOR Protection)
        self.client.force_login(self.user3)
        res = self.client.get(f'/api/conversations/{conv.id}/messages/')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_cannot_message_blocked_user(self):
        UserBlock.objects.create(blocker=self.user1, blocked=self.user2)

        self.client.force_login(self.user1)
        res = self.client.post('/api/conversations/', {'recipient_id': self.user2.id}, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
