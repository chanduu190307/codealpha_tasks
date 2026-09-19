from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from verification.models import VerificationRequest

class UserVerificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='verified_candidate', password='Password123!')
        self.admin = User.objects.create_superuser(username='superadmin_staff', password='AdminPassword123!', email='admin@pulse.social')

    def test_verification_request_and_approval_workflow(self):
        self.client.force_authenticate(user=self.user)

        # 1. Candidate submits verification request
        sub_res = self.client.post('/api/verification/request/', {
            'category': 'developer',
            'reference_url': 'https://github.com/candidate',
            'reason': 'Core maintainer of open source social libraries.'
        })
        self.assertEqual(sub_res.status_code, status.HTTP_201_CREATED)
        req_id = sub_res.data['id']

        # Status check
        status_res = self.client.get('/api/verification/request/')
        self.assertEqual(status_res.data['status'], 'pending')

        # 2. Staff approves request
        self.client.force_authenticate(user=self.admin)
        app_res = self.client.post(f'/api/admin/verification/requests/{req_id}/review/', {
            'decision': 'approved',
            'notes': 'Verified GitHub identity.'
        })
        self.assertEqual(app_res.status_code, status.HTTP_200_OK)
        self.assertTrue(app_res.data['is_verified'])

        # Check profile has is_verified = True
        self.user.profile.refresh_from_db()
        self.assertTrue(self.user.profile.is_verified)
