import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from django.utils import timezone
from core.presence import PresenceManager

class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket Consumer for real-time one-to-one and group conversation threads.
    Handles message dispatch, ephemeral typing indicators, read receipts, and presence updates.
    """

    async def connect(self):
        self.user = self.scope.get("user")
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"

        # Reject unauthenticated WebSocket connections
        if not self.user or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        # Verify conversation membership (BOLA/IDOR protection)
        is_member = await self.check_membership(self.conversation_id, self.user.id)
        if not is_member:
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # Update presence
        await self.set_online()

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except Exception:
            return

        msg_type = data.get("type", "chat_message")

        if msg_type == "chat_message":
            content = data.get("content", "").strip()
            reply_to_id = data.get("reply_to_id")
            if not content:
                return

            saved_msg = await self.save_message(self.conversation_id, self.user.id, content, reply_to_id)
            if saved_msg:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "chat_message_broadcast",
                        "message": saved_msg
                    }
                )

        elif msg_type == "typing":
            is_typing = data.get("is_typing", True)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_broadcast",
                    "user_id": self.user.id,
                    "username": self.user.username,
                    "is_typing": is_typing
                }
            )

        elif msg_type == "read_receipt":
            await self.mark_conversation_read(self.conversation_id, self.user.id)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "read_receipt_broadcast",
                    "user_id": self.user.id,
                    "read_at": timezone.now().isoformat()
                }
            )

    async def chat_message_broadcast(self, event):
        await self.send(text_data=json.dumps({
            "type": "message",
            "message": event["message"]
        }))

    async def typing_broadcast(self, event):
        # Do not echo own typing to sender
        if event["user_id"] != self.user.id:
            await self.send(text_data=json.dumps({
                "type": "typing",
                "user_id": event["user_id"],
                "username": event["username"],
                "is_typing": event["is_typing"]
            }))

    async def read_receipt_broadcast(self, event):
        await self.send(text_data=json.dumps({
            "type": "read_receipt",
            "user_id": event["user_id"],
            "read_at": event["read_at"]
        }))

    @database_sync_to_async
    def check_membership(self, conv_id, user_id):
        from chat.models import ConversationMember
        return ConversationMember.objects.filter(conversation_id=conv_id, user_id=user_id).exists()

    @database_sync_to_async
    def save_message(self, conv_id, user_id, content, reply_to_id=None):
        from chat.models import Message, Conversation
        try:
            conv = Conversation.objects.get(id=conv_id)
            msg = Message.objects.create(
                conversation=conv,
                sender_id=user_id,
                content=content,
                reply_to_id=reply_to_id if reply_to_id else None
            )
            conv.save(update_fields=['updated_at'])
            return {
                "id": msg.id,
                "conversation_id": conv_id,
                "sender": {
                    "id": self.user.id,
                    "username": self.user.username,
                    "avatar": self.user.profile.avatar.url if hasattr(self.user, 'profile') and self.user.profile.avatar else None
                },
                "content": msg.content,
                "created_at": msg.created_at.isoformat(),
                "reply_to_id": msg.reply_to_id
            }
        except Exception:
            return None

    @database_sync_to_async
    def mark_conversation_read(self, conv_id, user_id):
        from chat.models import ConversationMember
        ConversationMember.objects.filter(conversation_id=conv_id, user_id=user_id).update(last_read_at=timezone.now())

    @database_sync_to_async
    def set_online(self):
        PresenceManager.set_user_online(self.user.id)
