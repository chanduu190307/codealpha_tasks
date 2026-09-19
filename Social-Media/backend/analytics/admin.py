from django.contrib import admin
from analytics.models import PostImpression, ProfileVisit, UserActivityLog

@admin.register(PostImpression)
class PostImpressionAdmin(admin.ModelAdmin):
    list_display = ['post', 'viewer', 'timestamp']

@admin.register(ProfileVisit)
class ProfileVisitAdmin(admin.ModelAdmin):
    list_display = ['profile_user', 'visitor', 'timestamp']

@admin.register(UserActivityLog)
class UserActivityLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'timestamp']
