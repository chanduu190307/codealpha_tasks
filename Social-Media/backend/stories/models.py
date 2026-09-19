from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from django.core.exceptions import ValidationError
from core.validators import validate_image_file, SecureFilePathGenerator

story_media_upload_path = SecureFilePathGenerator(sub_dir='stories')

def get_default_story_expiry():
    return timezone.now() + timedelta(hours=24)

class Story(models.Model):
    """
    Ephemerally published stories that expire automatically in 24 hours.
    """
    AUDIENCE_CHOICES = [
        ('everyone', 'Everyone'),
        ('followers', 'Followers Only'),
        ('close_friends', 'Close Friends Only'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stories')
    media = models.ImageField(
        upload_to=story_media_upload_path,
        validators=[validate_image_file]
    )
    caption = models.CharField(max_length=500, blank=True)
    audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='everyone')
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=get_default_story_expiry)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['expires_at', 'is_deleted']),
            models.Index(fields=['author', '-created_at']),
        ]

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    def __str__(self):
        return f"Story #{self.id} by {self.author.username}"


class StoryView(models.Model):
    """
    Tracks unique viewers for each story.
    """
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='views')
    viewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='story_views')
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['story', 'viewer'], name='unique_story_viewer')
        ]
        indexes = [
            models.Index(fields=['story', 'viewed_at']),
        ]

    def __str__(self):
        return f"{self.viewer.username} viewed Story #{self.story_id}"


class StoryReaction(models.Model):
    """
    Quick emoji reaction on an active story.
    """
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='story_reactions')
    reaction = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['story', 'user', 'reaction'], name='unique_story_user_reaction')
        ]
        indexes = [
            models.Index(fields=['story', 'user']),
        ]

    def __str__(self):
        return f"{self.user.username} reacted {self.reaction} to Story #{self.story_id}"


class CloseFriend(models.Model):
    """
    Close Friends relationship list for story audience filtering.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='close_friends_owner')
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='close_friend_of')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'friend'], name='unique_close_friend'),
            models.CheckConstraint(
                check=~models.Q(user=models.F('friend')),
                name='prevent_self_close_friend'
            )
        ]

    def clean(self):
        if self.user == self.friend:
            raise ValidationError("You cannot add yourself to your close friends list.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.friend.username} is close friend of {self.user.username}"
