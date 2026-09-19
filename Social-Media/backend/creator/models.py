from django.db import models
from django.contrib.auth.models import User
from core.validators import validate_image_file, SecureFilePathGenerator

creator_draft_upload_path = SecureFilePathGenerator(sub_dir='drafts')
creator_schedule_upload_path = SecureFilePathGenerator(sub_dir='scheduled')

class PostDraft(models.Model):
    """
    Private unfinished draft post for creators.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='drafts')
    content = models.TextField(max_length=2000, blank=True)
    image = models.ImageField(
        upload_to=creator_draft_upload_path,
        validators=[validate_image_file],
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Draft #{self.id} by {self.user.username}"


class ScheduledPost(models.Model):
    """
    Creator post queued for automated publishing at a future datetime.
    """
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('published', 'Published'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheduled_posts')
    content = models.TextField(max_length=2000)
    image = models.ImageField(
        upload_to=creator_schedule_upload_path,
        validators=[validate_image_file],
        null=True,
        blank=True
    )
    scheduled_time = models.DateTimeField(db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['scheduled_time']

    def __str__(self):
        return f"Scheduled #{self.id} for {self.user.username} at {self.scheduled_time}"
