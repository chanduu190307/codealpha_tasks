from django.contrib import admin
from communities.models import Community, CommunityMember, CommunityJoinRequest, CommunityBan, CommunityModerationLog

@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'created_by', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(CommunityMember)
class CommunityMemberAdmin(admin.ModelAdmin):
    list_display = ['community', 'user', 'role', 'joined_at']
    list_filter = ['role', 'community']

@admin.register(CommunityJoinRequest)
class CommunityJoinRequestAdmin(admin.ModelAdmin):
    list_display = ['community', 'user', 'status', 'created_at']

@admin.register(CommunityBan)
class CommunityBanAdmin(admin.ModelAdmin):
    list_display = ['community', 'user', 'banned_by', 'created_at']

@admin.register(CommunityModerationLog)
class CommunityModerationLogAdmin(admin.ModelAdmin):
    list_display = ['community', 'moderator', 'action', 'created_at']
