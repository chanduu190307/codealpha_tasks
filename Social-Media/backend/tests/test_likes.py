from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Post
from interactions.models import Like

class LikeTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='liker', email='liker@example.com', password='Password123!')
        self.author = User.objects.create_user(username='author', email='author@example.com', password='Password123!')
        self.post = Post.objects.create(author=self.author, content='Likeable post')
        self.client.force_login(self.user)

    def test_like_and_unlike_post(self):
        # Like
        res1 = self.client.post(f'/api/posts/{self.post.id}/like/')
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertTrue(res1.data['is_liked'])
        self.assertEqual(res1.data['likes_count'], 1)
        self.assertTrue(Like.objects.filter(user=self.user, post=self.post).exists())

        # Duplicate like is idempotent and does not create duplicate rows
        res_dup = self.client.post(f'/api/posts/{self.post.id}/like/')
        self.assertEqual(res_dup.status_code, status.HTTP_200_OK)
        self.assertEqual(Like.objects.filter(user=self.user, post=self.post).count(), 1)

        # Unlike
        res2 = self.client.post(f'/api/posts/{self.post.id}/unlike/')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertFalse(res2.data['is_liked'])
        self.assertEqual(res2.data['likes_count'], 0)
        self.assertFalse(Like.objects.filter(user=self.user, post=self.post).exists())
