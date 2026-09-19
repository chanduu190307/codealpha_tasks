from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class SystemHealthTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_check_endpoint(self):
        res = self.client.get('/api/health/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'healthy')
        self.assertIn('database', res.data['checks'])
        self.assertIn('cache', res.data['checks'])
        self.assertEqual(res.data['checks']['database']['status'], 'healthy')
