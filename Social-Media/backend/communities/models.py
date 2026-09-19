from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from core.validators import validate_image_file, SecureFilePathGenerator

community_avatar_path = SecureFilePathGenerator(sub_dir='communities/avatars')
community_banner_path = SecureFilePathGenerator(sub_dir='communities/banners')

class Community(models.Model):
    TYPE_CHOICES = [
        ('public', 'Public — Anyone can view and join'),
        ('private', 'Private — Request to join required'),
        ('restricted', 'Restricted — Approved members only post'),
    ]

    name = models.CharField(max_length=100, unique=True, db_index=True)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    description = models.TextField(max_length=1000, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='public')
    avatar = models.ImageField(upload_to=community_avatar_path, validators=[validate_image_file], null=True, blank=True)
    banner = models.ImageField(upload_to=community_banner_path, validators=[validate_image_file], null=True, blank=True)
    rules = models.TextField(max_length=3000, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_communities')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Communities'

    def __str__(self):
        return f"c/{self.name} ({self.type})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def member_count(self):
        return self.members.count()


class CommunityMember(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('moderator', 'Moderator'),
        ('member', 'Member'),
    ]

    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['community', 'user'], name='unique_community_member')
        ]
        indexes = [
            models.Index(fields=['community', 'role']),
        ]

    def __str__(self):
        return f"{self.user.username} in c/{self.community.name} as {self.role}"


class CommunityJoinRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='join_requests')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_join_requests')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['community', 'user'], name='unique_community_join_request')
        ]

    def __str__(self):
        return f"Join request by {self.user.username} to c/{self.community.name} ({self.status})"


class CommunityBan(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='banned_users')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_bans')
    reason = models.CharField(max_length=255, blank=True)
    banned_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='issued_community_bans')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['community', 'user'], name='unique_community_ban')
        ]

    def __str__(self):
        return f"{self.user.username} banned from c/{self.community.name}"


class CommunityModerationLog(models.Model):
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='moderation_logs')
    moderator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_mod_actions')
    action = models.CharField(max_length=50)
    target_summary = models.CharField(max_length=255)
    reason = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[c/{self.community.name}] {self.moderator.username} -> {self.action}"
