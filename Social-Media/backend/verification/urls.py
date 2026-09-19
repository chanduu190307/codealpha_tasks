from django.urls import path
from verification.views import (
    VerificationRequestView,
    AdminVerificationListView,
    AdminVerificationReviewView
)

urlpatterns = [
    path('verification/request/', VerificationRequestView.as_view(), name='verification_request'),
    path('admin/verification/requests/', AdminVerificationListView.as_view(), name='admin_verification_requests'),
    path('admin/verification/requests/<int:pk>/review/', AdminVerificationReviewView.as_view(), name='admin_verification_review'),
]
