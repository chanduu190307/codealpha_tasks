from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Post
from comments.models import Comment

class DataPrivacyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='gdpruser', password='SecurePassword123!', email='gdpr@example.com')
        self.post = Post.objects.create(author=self.user, content='My private post to export')
        self.comment = Comment.objects.create(post=self.post, author=self.user, content='My comment')
        self.client.force_authenticate(user=self.user)

    def test_user_data_export_archive(self):
        res = self.client.get('/api/users/export-data/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['account']['username'], 'gdpruser')
        self.assertEqual(len(res.data['posts']), 1)
        self.assertEqual(len(res.data['comments']), 1)

    def test_account_deletion_with_password(self):
        # Invalid password rejection
        wrong_res = self.client.post('/api/users/delete-account/', {'password': 'WrongPassword!'})
        self.assertEqual(wrong_res.status_code, status.HTTP_400_BAD_REQUEST)

        # Valid password deletion
        del_res = self.client.post('/api/users/delete-account/', {'password': 'SecurePassword123!'})
        self.assertEqual(del_res.status_code, status.HTTP_200_OK)
        self.assertFalse(User.objects.filter(username='gdpruser').exists())
