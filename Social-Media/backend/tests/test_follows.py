from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from interactions.models import Follow

class FollowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_a = User.objects.create_user(username='usera', email='usera@example.com', password='Password123!')
        self.user_b = User.objects.create_user(username='userb', email='userb@example.com', password='Password123!')
        self.client.force_login(self.user_a)

    def test_follow_and_unfollow_user(self):
        # Follow user_b
        res1 = self.client.post('/api/users/userb/follow/')
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertTrue(res1.data['is_following'])
        self.assertEqual(res1.data['followers_count'], 1)
        self.assertTrue(Follow.objects.filter(follower=self.user_a, following=self.user_b).exists())

        # Duplicate follow is safe and idempotent
        res_dup = self.client.post('/api/users/userb/follow/')
        self.assertEqual(res_dup.status_code, status.HTTP_200_OK)
        self.assertEqual(Follow.objects.filter(follower=self.user_a, following=self.user_b).count(), 1)

        # Unfollow
        res2 = self.client.post('/api/users/userb/unfollow/')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertFalse(res2.data['is_following'])
        self.assertEqual(res2.data['followers_count'], 0)
        self.assertFalse(Follow.objects.filter(follower=self.user_a, following=self.user_b).exists())

    def test_self_follow_rejected(self):
        res = self.client.post('/api/users/usera/follow/')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Follow.objects.filter(follower=self.user_a, following=self.user_a).exists())

    def test_followers_and_following_lists(self):
        Follow.objects.create(follower=self.user_a, following=self.user_b)

        # Followers of user_b
        res_followers = self.client.get('/api/users/userb/followers/')
        self.assertEqual(res_followers.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_followers.data['results']), 1)
        self.assertEqual(res_followers.data['results'][0]['username'], 'usera')

        # Following of user_a
        res_following = self.client.get('/api/users/usera/following/')
        self.assertEqual(res_following.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_following.data['results']), 1)
        self.assertEqual(res_following.data['results'][0]['username'], 'userb')
