from django.db import models
from django.contrib.auth.models import User

class Notification(models.Model):
    """
    In-app & real-time notification events.
    """
    VERB_CHOICES = [
        ('like', 'Liked your post'),
        ('comment', 'Commented on your post'),
        ('reply', 'Replied to your comment'),
        ('follow', 'Started following you'),
        ('mention', 'Mentioned you'),
        ('message', 'Sent you a message'),
        ('story_reaction', 'Reacted to your story'),
        ('bookmark', 'Saved your post'),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications_generated')
    verb = models.CharField(max_length=30, choices=VERB_CHOICES)
    target_id = models.IntegerField(null=True, blank=True)
    target_type = models.CharField(max_length=50, blank=True)
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', '-created_at']),
            models.Index(fields=['recipient', 'is_read']),
        ]

    def __str__(self):
        return f"{self.actor.username} {self.verb} -> {self.recipient.username}"


class NotificationPreference(models.Model):
    """
    Per-user notification toggle controls.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    likes_enabled = models.BooleanField(default=True)
    comments_enabled = models.BooleanField(default=True)
    follows_enabled = models.BooleanField(default=True)
    mentions_enabled = models.BooleanField(default=True)
    messages_enabled = models.BooleanField(default=True)
    stories_enabled = models.BooleanField(default=True)

    def __str__(self):
        return f"Notification Preferences for {self.user.username}"
