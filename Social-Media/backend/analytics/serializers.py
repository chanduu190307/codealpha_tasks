from rest_framework import serializers
from analytics.models import UserActivityLog

class UserActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivityLog
        fields = ['id', 'action', 'details', 'timestamp']
