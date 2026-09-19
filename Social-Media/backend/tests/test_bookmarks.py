from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Post, Bookmark

class BookmarkTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='alice', email='alice@example.com', password='Password123!')
        self.user2 = User.objects.create_user(username='bob', email='bob@example.com', password='Password123!')
        self.post = Post.objects.create(author=self.user2, content='Great tutorial on web sockets!')

    def test_bookmark_and_unbookmark_workflow(self):
        self.client.force_login(self.user1)

        # Bookmark post
        res = self.client.post(f'/api/posts/{self.post.id}/bookmark/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(Bookmark.objects.filter(user=self.user1, post=self.post).exists())

        # Duplicate bookmark returns 400
        dup_res = self.client.post(f'/api/posts/{self.post.id}/bookmark/')
        self.assertEqual(dup_res.status_code, status.HTTP_400_BAD_REQUEST)

        # Saved posts collection
        saved_res = self.client.get('/api/posts/saved/')
        self.assertEqual(saved_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(saved_res.data['results']), 1)

        # Unbookmark
        unbm_res = self.client.post(f'/api/posts/{self.post.id}/unbookmark/')
        self.assertEqual(unbm_res.status_code, status.HTTP_200_OK)
        self.assertFalse(Bookmark.objects.filter(user=self.user1, post=self.post).exists())
