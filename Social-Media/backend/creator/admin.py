from django.contrib import admin
from creator.models import PostDraft, ScheduledPost

@admin.register(PostDraft)
class PostDraftAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'created_at', 'updated_at']

@admin.register(ScheduledPost)
class ScheduledPostAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'scheduled_time', 'status', 'created_at']
    list_filter = ['status', 'scheduled_time']
