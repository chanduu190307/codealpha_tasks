from rest_framework import serializers
from verification.models import VerificationRequest
from accounts.serializers import UserSummarySerializer

class VerificationRequestSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = VerificationRequest
        fields = [
            'id', 'user', 'category', 'reference_url', 'reason',
            'status', 'created_at', 'reviewed_at', 'review_notes'
        ]
        read_only_fields = ['id', 'user', 'status', 'created_at', 'reviewed_at', 'review_notes']
