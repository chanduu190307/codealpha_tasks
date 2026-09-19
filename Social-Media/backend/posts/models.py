from django.db import models
from django.contrib.auth.models import User
from core.validators import validate_image_file, SecureFilePathGenerator

post_image_upload_path = SecureFilePathGenerator(sub_dir='posts')

class Post(models.Model):
    CONTENT_WARNING_CHOICES = [
        ('none', 'No Warning'),
        ('sensitive', 'Sensitive Content'),
        ('spoiler', 'Spoiler Warning'),
        ('mature', 'Mature Content'),
        ('graphic', 'Graphic Content'),
        ('disturbing', 'Potentially Disturbing'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    community = models.ForeignKey('communities.Community', on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    content = models.TextField(max_length=2000)
    image = models.ImageField(
        upload_to=post_image_upload_path,
        validators=[validate_image_file],
        null=True,
        blank=True
    )
    content_warning = models.CharField(max_length=20, choices=CONTENT_WARNING_CHOICES, default='none', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['author', '-created_at']),
            models.Index(fields=['community', '-created_at']),
        ]

    def __str__(self):
        return f"Post by {self.author.username} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"

    @property
    def likes_count(self):
        if hasattr(self, '_likes_count'):
            return self._likes_count
        if hasattr(self, 'likes'):
            return self.likes.count()
        return 0

    @likes_count.setter
    def likes_count(self, value):
        self._likes_count = value

    @property
    def comments_count(self):
        if hasattr(self, '_comments_count'):
            return self._comments_count
        if hasattr(self, 'comments'):
            return self.comments.count()
        return 0

    @comments_count.setter
    def comments_count(self, value):
        self._comments_count = value

    @property
    def bookmarks_count(self):
        if hasattr(self, '_bookmarks_count'):
            return self._bookmarks_count
        if hasattr(self, 'bookmarks'):
            return self.bookmarks.count()
        return 0

    @bookmarks_count.setter
    def bookmarks_count(self, value):
        self._bookmarks_count = value


class PostCollaboration(models.Model):
    """
    Dual creator attribution & collaborative post publishing.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending Collaboration Invite'),
        ('accepted', 'Accepted — Co-Creator'),
        ('rejected', 'Rejected'),
        ('revoked', 'Revoked'),
    ]

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='collaborations')
    collaborator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collaborative_posts')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    invited_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['post', 'collaborator'], name='unique_post_collaborator')
        ]

    def __str__(self):
        return f"Collab on Post #{self.post_id} with @{self.collaborator.username} ({self.status})"


class Bookmark(models.Model):
    """
    Saved posts for user bookmark collections.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='unique_user_post_bookmark')
        ]
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} saved Post #{self.post_id}"


class PostReaction(models.Model):
    """
    Rich normalized reactions for posts (like, love, laugh, insightful, support).
    """
    REACTION_CHOICES = [
        ('like', 'Like'),
        ('love', 'Love'),
        ('laugh', 'Laugh'),
        ('insightful', 'Insightful'),
        ('support', 'Support'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reactions')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=20, choices=REACTION_CHOICES, default='like')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='unique_user_post_reaction')
        ]

    def __str__(self):
        return f"{self.user.username} reacted {self.reaction_type} on Post #{self.post_id}"


class UserTag(models.Model):
    """
    Tags associating users to specific posts.
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='user_tags')
    tagged_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tagged_posts')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['post', 'tagged_user'], name='unique_post_user_tag')
        ]

    def __str__(self):
        return f"@{self.tagged_user.username} tagged in Post #{self.post_id}"
