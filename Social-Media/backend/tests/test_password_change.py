from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class PasswordChangeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='pwduser',
            email='pwduser@example.com',
            password='InitialPassword123!'
        )

    def test_unauthenticated_request_rejected(self):
        payload = {
            'current_password': 'InitialPassword123!',
            'new_password': 'NewStrongPassword123!',
            'confirm_password': 'NewStrongPassword123!'
        }
        response = self.client.post('/api/auth/change-password/', payload, format='json')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_successful_password_change(self):
        self.client.force_login(self.user)
        payload = {
            'current_password': 'InitialPassword123!',
            'new_password': 'NewStrongPassword123!',
            'confirm_password': 'NewStrongPassword123!'
        }
        response = self.client.post('/api/auth/change-password/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('NewStrongPassword123!'))

    def test_incorrect_current_password_rejected(self):
        self.client.force_login(self.user)
        payload = {
            'current_password': 'WrongPassword123!',
            'new_password': 'NewStrongPassword123!',
            'confirm_password': 'NewStrongPassword123!'
        }
        response = self.client.post('/api/auth/change-password/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_mismatched_new_passwords_rejected(self):
        self.client.force_login(self.user)
        payload = {
            'current_password': 'InitialPassword123!',
            'new_password': 'NewStrongPassword123!',
            'confirm_password': 'DifferentPassword123!'
        }
        response = self.client.post('/api/auth/change-password/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_weak_new_password_rejected(self):
        self.client.force_login(self.user)
        payload = {
            'current_password': 'InitialPassword123!',
            'new_password': 'weak',
            'confirm_password': 'weak'
        }
        response = self.client.post('/api/auth/change-password/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
