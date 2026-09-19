from django.db import models
from django.contrib.auth.models import User
from core.validators import validate_image_file, SecureFilePathGenerator

chat_attachment_upload_path = SecureFilePathGenerator(sub_dir='chat_attachments')

class Conversation(models.Model):
    """
    Direct 1-on-1 or multi-member messaging conversation.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Conversation #{self.id}"

    def get_other_member(self, current_user):
        member = self.members.exclude(user=current_user).select_related('user', 'user__profile').first()
        return member.user if member else None


class ConversationMember(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations')
    is_muted = models.BooleanField(default=False)
    last_read_at = models.DateTimeField(null=True, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['conversation', 'user'], name='unique_conversation_member')
        ]
        indexes = [
            models.Index(fields=['user', 'conversation']),
        ]

    def __str__(self):
        return f"{self.user.username} in Conversation #{self.conversation_id}"


class Message(models.Model):
    """
    Individual message sent within a conversation.
    """
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField(max_length=4000, blank=True)
    attachment = models.ImageField(
        upload_to=chat_attachment_upload_path,
        validators=[validate_image_file],
        null=True,
        blank=True
    )
    reply_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies')
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['conversation', 'created_at']),
            models.Index(fields=['sender', 'created_at']),
        ]

    def __str__(self):
        return f"Message #{self.id} by {self.sender.username} in Conv #{self.conversation_id}"
