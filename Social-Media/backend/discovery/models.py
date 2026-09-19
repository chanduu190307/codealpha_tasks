from django.db import models
from django.contrib.auth.models import User
from posts.models import Post

class Hashtag(models.Model):
    """
    Normalized hashtag registry with post associations.
    """
    name = models.CharField(max_length=100, unique=True, db_index=True)
    posts = models.ManyToManyField(Post, related_name='hashtags', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"#{self.name}"

    @property
    def usage_count(self):
        return self.posts.count()


class TrendingTopic(models.Model):
    """
    Cached trending topics with calculated engagement velocity scores.
    """
    topic_name = models.CharField(max_length=100, unique=True)
    score = models.FloatField(default=0.0, db_index=True)
    post_count = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-score']

    def __str__(self):
        return f"#{self.topic_name} (Score: {self.score:.2f})"


class UserInterest(models.Model):
    """
    Dynamic interest vector modeling for each user with time decay tracking.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interests')
    topic = models.CharField(max_length=100, db_index=True)
    score = models.FloatField(default=1.0)
    last_interacted_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'topic'], name='unique_user_topic_interest')
        ]
        indexes = [
            models.Index(fields=['user', '-score']),
        ]

    def __str__(self):
        return f"{self.user.username} interested in #{self.topic} (score: {self.score:.2f})"


class SearchHistory(models.Model):
    """
    Private search history for user suggestions and query recall.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='search_history')
    query = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} searched '{self.query}'"


class PostHide(models.Model):
    """
    Negative feedback: user chose to hide a specific post from their timeline.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hidden_posts')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='hidden_by_users')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='unique_user_post_hide')
        ]

    def __str__(self):
        return f"{self.user.username} hid Post #{self.post_id}"


class PostNotInterested(models.Model):
    """
    Negative feedback: user signals lack of interest in this content category.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='not_interested_posts')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='not_interested_signals')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='unique_user_post_not_interested')
        ]

    def __str__(self):
        return f"{self.user.username} not interested in Post #{self.post_id}"
