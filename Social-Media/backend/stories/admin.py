from django.contrib import admin
from stories.models import Story, StoryView, StoryReaction, CloseFriend

@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'author', 'audience', 'created_at', 'expires_at', 'is_deleted']
    list_filter = ['audience', 'is_deleted', 'created_at']
    search_fields = ['author__username', 'caption']

@admin.register(StoryView)
class StoryViewAdmin(admin.ModelAdmin):
    list_display = ['id', 'story', 'viewer', 'viewed_at']

@admin.register(CloseFriend)
class CloseFriendAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'friend', 'created_at']
