from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.logout_url = '/api/auth/logout/'
        self.me_url = '/api/auth/me/'

    def test_successful_registration(self):
        data = {
            'username': 'johndoe',
            'email': 'john@example.com',
            'password': 'SecurePassword123!',
            'password_confirm': 'SecurePassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['username'], 'johndoe')
        self.assertTrue(User.objects.filter(username='johndoe').exists())

    def test_registration_password_mismatch(self):
        data = {
            'username': 'janedoe',
            'email': 'jane@example.com',
            'password': 'SecurePassword123!',
            'password_confirm': 'DifferentPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_duplicate_username(self):
        User.objects.create_user(username='existinguser', email='first@example.com', password='Password123!')
        data = {
            'username': 'existinguser',
            'email': 'second@example.com',
            'password': 'Password123!',
            'password_confirm': 'Password123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_reserved_username(self):
        data = {
            'username': 'admin',
            'email': 'admin@example.com',
            'password': 'Password123!',
            'password_confirm': 'Password123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_successful_login_with_username_and_email(self):
        User.objects.create_user(username='alice', email='alice@example.com', password='Password123!')

        # Login with username
        res1 = self.client.post(self.login_url, {'username': 'alice', 'password': 'Password123!'}, format='json')
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertTrue(res1.data['success'])

        # Login with email
        res2 = self.client.post(self.login_url, {'username': 'alice@example.com', 'password': 'Password123!'}, format='json')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertTrue(res2.data['success'])

    def test_login_invalid_password(self):
        User.objects.create_user(username='bob', email='bob@example.com', password='Password123!')
        res = self.client.post(self.login_url, {'username': 'bob', 'password': 'WrongPassword'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(res.data['success'])

    def test_current_user_and_logout(self):
        user = User.objects.create_user(username='charlie', email='charlie@example.com', password='Password123!')
        self.client.force_login(user)

        # Check me
        me_res = self.client.get(self.me_url)
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertTrue(me_res.data['authenticated'])
        self.assertEqual(me_res.data['user']['username'], 'charlie')

        # Logout
        logout_res = self.client.post(self.logout_url)
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)
