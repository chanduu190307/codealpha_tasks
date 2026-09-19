from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Post
from discovery.models import Hashtag
from discovery.algorithms import extract_hashtags, attach_hashtags_to_post, calculate_post_velocity_score, get_suggested_users

class DiscoveryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='alice', email='alice@example.com', password='Password123!')
        self.user2 = User.objects.create_user(username='bob', email='bob@example.com', password='Password123!')
        self.user3 = User.objects.create_user(username='charlie', email='charlie@example.com', password='Password123!')

    def test_hashtag_extraction_and_search(self):
        tags = extract_hashtags("Learning #Django and #Python with #webdev_101!")
        self.assertIn('django', tags)
        self.assertIn('python', tags)
        self.assertIn('webdev_101', tags)

        post = Post.objects.create(author=self.user1, content="Excited about #django and #python!")
        attach_hashtags_to_post(post)

        self.assertEqual(Hashtag.objects.count(), 2)

        # Query hashtag posts endpoint
        res = self.client.get('/api/hashtags/django/posts/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 1)

    def test_trending_hashtags_endpoint(self):
        post = Post.objects.create(author=self.user1, content="Hello #trendingworld!")
        attach_hashtags_to_post(post)

        res = self.client.get('/api/trending/hashtags/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) > 0)

    def test_suggested_users_algorithm(self):
        # Alice follows Bob
        self.user1.following_sent.create(following=self.user2)

        suggestions = get_suggested_users(self.user1)
        suggested_ids = [u.id for u in suggestions]

        # Charlie should be suggested, Bob should be excluded since already followed
        self.assertIn(self.user3.id, suggested_ids)
        self.assertNotIn(self.user2.id, suggested_ids)
