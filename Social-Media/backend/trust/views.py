from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from trust.service import TrustService

class UserTrustStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        evaluation = TrustService.evaluate_user_risk(request.user)
        return Response(evaluation, status=status.HTTP_200_OK)
