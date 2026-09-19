from django.db import models
from django.contrib.auth.models import User

class Report(models.Model):
    TARGET_TYPE_CHOICES = [
        ('post', 'Post'),
        ('comment', 'Comment'),
        ('user', 'User'),
        ('message', 'Message'),
        ('story', 'Story'),
    ]

    REASON_CHOICES = [
        ('spam', 'Spam / Commercial advertising'),
        ('harassment', 'Harassment / Bullying'),
        ('hate', 'Hate speech or symbols'),
        ('violence', 'Violence or threat of violence'),
        ('scam', 'Scam / Fraudulent activity'),
        ('inappropriate', 'Inappropriate or explicit content'),
        ('other', 'Other issue'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('reviewing', 'Under Review'),
        ('resolved', 'Resolved / Action Taken'),
        ('dismissed', 'Dismissed / No Violation'),
    ]

    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_filed')
    target_type = models.CharField(max_length=20, choices=TARGET_TYPE_CHOICES)
    target_id = models.IntegerField()
    reason = models.CharField(max_length=30, choices=REASON_CHOICES)
    description = models.TextField(max_length=1000, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_moderator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_reports')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['target_type', 'target_id']),
        ]

    def __str__(self):
        return f"Report #{self.id} on {self.target_type} #{self.target_id} ({self.status})"


class ModerationQueueItem(models.Model):
    content_type = models.CharField(max_length=30)
    object_id = models.IntegerField()
    flagged_reason = models.CharField(max_length=255)
    confidence_score = models.FloatField(default=0.0)
    ai_provider = models.CharField(max_length=50, default='rule_based')
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-confidence_score', '-created_at']

    def __str__(self):
        return f"AI Flag on {self.content_type} #{self.object_id} ({self.confidence_score*100:.1f}%)"


class ModerationAuditLog(models.Model):
    moderator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='moderation_logs')
    action = models.CharField(max_length=50)
    target_summary = models.CharField(max_length=255)
    reason = models.CharField(max_length=500)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.moderator.username} -> {self.action} ({self.timestamp.strftime('%Y-%m-%d %H:%M')})"


class ModerationAppeal(models.Model):
    """
    User-submitted appeal against a moderation or account action.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved / Action Reversed'),
        ('rejected', 'Rejected / Action Upheld'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='moderation_appeals')
    target_summary = models.CharField(max_length=255)
    statement = models.TextField(max_length=2000)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_appeals')
    review_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Appeal #{self.id} by {self.user.username} ({self.status})"
