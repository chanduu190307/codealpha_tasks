from django.urls import path
from trust.views import UserTrustStatusView

urlpatterns = [
    path('trust/status/', UserTrustStatusView.as_view(), name='user_trust_status'),
]
