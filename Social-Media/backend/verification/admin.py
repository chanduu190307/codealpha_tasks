from django.contrib import admin
from verification.models import VerificationRequest

@admin.register(VerificationRequest)
class VerificationRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'category', 'status', 'created_at', 'reviewed_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['user__username', 'reason']
