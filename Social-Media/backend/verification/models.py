from django.db import models
from django.contrib.auth.models import User

class VerificationRequest(models.Model):
    CATEGORY_CHOICES = [
        ('creator', 'Content Creator / Artist'),
        ('developer', 'Software Engineer / Tech Contributor'),
        ('business', 'Business / Organization'),
        ('public_figure', 'Public Figure / Journalist'),
        ('community_leader', 'Community Leader'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved — Verified Badge Active'),
        ('rejected', 'Rejected'),
        ('revoked', 'Revoked'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_requests')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    reference_url = models.URLField(max_length=500, help_text="Public portfolio, GitHub, or official site")
    reason = models.TextField(max_length=1000, help_text="Brief explanation of work and credibility")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_verifications')
    review_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Verification for @{self.user.username} ({self.category}: {self.status})"
