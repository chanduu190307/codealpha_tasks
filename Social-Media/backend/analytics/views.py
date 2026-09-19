from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from analytics.service import CreatorAnalyticsService
from analytics.models import UserActivityLog
from analytics.serializers import UserActivityLogSerializer

class CreatorOverviewAnalyticsView(APIView):
    """
    Returns creator statistics across selectable timeframes (7, 30, 90 days).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            days = int(request.query_params.get('days', 30))
        except ValueError:
            days = 30

        overview = CreatorAnalyticsService.get_creator_overview(request.user, days=days)
        return Response(overview, status=status.HTTP_200_OK)


class UserActivityCenterView(generics.ListAPIView):
    """
    Returns personal activity audit history for authenticated user.
    """
    serializer_class = UserActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserActivityLog.objects.filter(user=self.request.user)[:50]
