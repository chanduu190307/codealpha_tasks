from django.contrib import admin
from discovery.models import Hashtag, TrendingTopic

@admin.register(Hashtag)
class HashtagAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(TrendingTopic)
class TrendingTopicAdmin(admin.ModelAdmin):
    list_display = ['topic_name', 'score', 'post_count', 'updated_at']
    ordering = ['-score']
