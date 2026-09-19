from channels.testing import WebsocketCommunicator
from django.test import TestCase
from django.contrib.auth.models import User
from config.asgi import application
from chat.models import Conversation, ConversationMember

class WebSocketTests(TestCase):
    async def test_unauthenticated_websocket_connection_rejected(self):
        communicator = WebsocketCommunicator(application, "/ws/chat/1/")
        connected, close_code = await communicator.connect()
        self.assertFalse(connected)
        self.assertEqual(close_code, 4001)
        await communicator.disconnect()

    async def test_authenticated_chat_websocket_flow(self):
        # Setup conversation
        user = await User.objects.acreate(username='alice_ws', email='alice_ws@example.com')
        conv = await Conversation.objects.acreate()
        await ConversationMember.objects.acreate(conversation=conv, user=user)

        communicator = WebsocketCommunicator(application, f"/ws/chat/{conv.id}/")
        communicator.scope['user'] = user

        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Send chat message via WebSocket
        await communicator.send_json_to({
            "type": "chat_message",
            "content": "Hello real-time WebSocket!"
        })

        response = await communicator.receive_json_from()
        self.assertEqual(response["type"], "message")
        self.assertEqual(response["message"]["content"], "Hello real-time WebSocket!")

        await communicator.disconnect()
