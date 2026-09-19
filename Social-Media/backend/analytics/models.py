from django.db import models
from django.contrib.auth.models import User
from posts.models import Post

class PostImpression(models.Model):
    """
    Tracks view impressions per post for analytics.
    """
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='impressions')
    viewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='post_impressions')
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['post', '-timestamp']),
        ]

    def __str__(self):
        return f"Impression on Post #{self.post_id} at {self.timestamp}"


class ProfileVisit(models.Model):
    """
    Tracks profile page visits.
    """
    profile_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile_visits_received')
    visitor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='profile_visits_made')
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f"Visit to {self.profile_user.username} at {self.timestamp}"


class UserActivityLog(models.Model):
    """
    Internal user activity log for transparency & activity center.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    action = models.CharField(max_length=50)
    details = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} -> {self.action} at {self.timestamp}"
