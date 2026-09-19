from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from core.validators import validate_image_file, SecureFilePathGenerator

avatar_upload_path = SecureFilePathGenerator(sub_dir='avatars')

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=50, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(
        upload_to=avatar_upload_path,
        validators=[validate_image_file],
        null=True,
        blank=True
    )
    is_verified = models.BooleanField(default=False, db_index=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s Profile"

    @property
    def followers_count(self):
        if hasattr(self, '_followers_count'):
            return self._followers_count
        if hasattr(self.user, 'followers_received'):
            return self.user.followers_received.count()
        return 0

    @followers_count.setter
    def followers_count(self, value):
        self._followers_count = value

    @property
    def following_count(self):
        if hasattr(self, '_following_count'):
            return self._following_count
        if hasattr(self.user, 'following_sent'):
            return self.user.following_sent.count()
        return 0

    @following_count.setter
    def following_count(self, value):
        self._following_count = value

    @property
    def posts_count(self):
        if hasattr(self, '_posts_count'):
            return self._posts_count
        if hasattr(self.user, 'posts'):
            return self.user.posts.count()
        return 0

    @posts_count.setter
    def posts_count(self, value):
        self._posts_count = value


class UserPrivacySettings(models.Model):
    """
    Fine-grained privacy controls for user profiles, interactions, and direct messaging.
    """
    AUDIENCE_CHOICES = [
        ('everyone', 'Everyone'),
        ('followers', 'Followers Only'),
        ('nobody', 'Nobody'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='privacy_settings')
    is_private = models.BooleanField(default=False)
    who_can_message = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='everyone')
    who_can_mention = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='everyone')
    who_can_tag = models.CharField(max_length=20, choices=AUDIENCE_CHOICES, default='everyone')
    show_online_status = models.BooleanField(default=True)
    show_last_seen = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Privacy settings for {self.user.username}"


class UserBlock(models.Model):
    """
    Isolates all interactions between blocker and blocked user.
    """
    blocker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocking')
    blocked = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocked_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['blocker', 'blocked'], name='unique_user_block'),
            models.CheckConstraint(
                check=~models.Q(blocker=models.F('blocked')),
                name='prevent_self_block'
            )
        ]

    def clean(self):
        if self.blocker == self.blocked:
            raise ValidationError("A user cannot block themselves.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.blocker.username} blocked {self.blocked.username}"


class UserMute(models.Model):
    """
    Hides posts, stories, and notifications from the muted user without blocking.
    """
    muter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='muting')
    muted = models.ForeignKey(User, on_delete=models.CASCADE, related_name='muted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['muter', 'muted'], name='unique_user_mute'),
            models.CheckConstraint(
                check=~models.Q(muter=models.F('muted')),
                name='prevent_self_mute'
            )
        ]

    def clean(self):
        if self.muter == self.muted:
            raise ValidationError("A user cannot mute themselves.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.muter.username} muted {self.muted.username}"


class UserRestriction(models.Model):
    """
    Restricts a user: their comments are only visible to themselves unless approved,
    and messages are sent to message requests.
    """
    restrictor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restricting')
    restricted = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restricted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['restrictor', 'restricted'], name='unique_user_restriction'),
            models.CheckConstraint(
                check=~models.Q(restrictor=models.F('restricted')),
                name='prevent_self_restriction'
            )
        ]

    def clean(self):
        if self.restrictor == self.restricted:
            raise ValidationError("A user cannot restrict themselves.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.restrictor.username} restricted {self.restricted.username}"
