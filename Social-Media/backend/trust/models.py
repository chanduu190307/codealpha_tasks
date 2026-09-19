from django.db import models
from django.contrib.auth.models import User

class TrustSignalLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trust_signals')
    signal_type = models.CharField(max_length=50)
    score_delta = models.FloatField(default=0.0)
    reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.signal_type} ({self.score_delta:+0.2f})"
