from django.contrib import admin
from notifications.models import Notification, NotificationPreference

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'recipient', 'actor', 'verb', 'is_read', 'created_at']
    list_filter = ['verb', 'is_read', 'created_at']
    search_fields = ['recipient__username', 'actor__username']

@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'likes_enabled', 'comments_enabled', 'follows_enabled', 'messages_enabled', 'stories_enabled']
