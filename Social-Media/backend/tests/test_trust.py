from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from trust.service import TrustService

class TrustServiceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='trusty_user', password='Password123!')

    def test_trust_evaluation(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.get('/api/trust/status/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('tier', res.data)
        self.assertIn('score', res.data)
        self.assertIn(res.data['tier'], ['NORMAL', 'LOW_RISK', 'ELEVATED_RISK', 'HIGH_RISK'])
