from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from verification.models import VerificationRequest
from verification.serializers import VerificationRequestSerializer
from core.events import publish_event

class VerificationRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        latest = VerificationRequest.objects.filter(user=request.user).first()
        if not latest:
            return Response({"status": "none"}, status=status.HTTP_200_OK)
        return Response(VerificationRequestSerializer(latest).data, status=status.HTTP_200_OK)

    def post(self, request):
        # Check if already pending
        if VerificationRequest.objects.filter(user=request.user, status='pending').exists():
            return Response({"detail": "You already have a pending verification request."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already verified
        if getattr(request.user.profile, 'is_verified', False):
            return Response({"detail": "Your account is already verified."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = VerificationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        req = serializer.save(user=request.user, status='pending')
        publish_event('verification_requested', user_id=request.user.id, request_id=req.id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AdminVerificationListView(generics.ListAPIView):
    serializer_class = VerificationRequestSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return VerificationRequest.objects.filter(status='pending').select_related('user', 'user__profile')


class AdminVerificationReviewView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        req = get_object_or_404(VerificationRequest, pk=pk)
        decision = request.data.get('decision', 'approved') # approved or rejected
        notes = request.data.get('notes', 'Reviewed by staff.')

        if decision == 'approved':
            req.status = 'approved'
            profile = req.user.profile
            profile.is_verified = True
            profile.verified_at = timezone.now()
            profile.save(update_fields=['is_verified', 'verified_at'])
            publish_event('verification_approved', user_id=req.user.id)
        else:
            req.status = 'rejected'
            profile = req.user.profile
            profile.is_verified = False
            profile.save(update_fields=['is_verified'])

        req.reviewed_by = request.user
        req.review_notes = notes
        req.reviewed_at = timezone.now()
        req.save(update_fields=['status', 'reviewed_by', 'review_notes', 'reviewed_at'])

        return Response({"status": decision, "request_id": req.id, "is_verified": req.user.profile.is_verified}, status=status.HTTP_200_OK)
