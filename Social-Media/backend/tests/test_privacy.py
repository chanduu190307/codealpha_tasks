from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import UserBlock, UserMute, UserRestriction, UserPrivacySettings

class PrivacyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='alice', email='alice@example.com', password='Password123!')
        self.user2 = User.objects.create_user(username='bob', email='bob@example.com', password='Password123!')

    def test_block_and_unblock_workflow(self):
        self.client.force_login(self.user1)

        # Block Bob
        block_res = self.client.post(f'/api/users/{self.user2.username}/block/')
        self.assertEqual(block_res.status_code, status.HTTP_200_OK)
        self.assertTrue(UserBlock.objects.filter(blocker=self.user1, blocked=self.user2).exists())

        # Cannot self-block
        self_block_res = self.client.post(f'/api/users/{self.user1.username}/block/')
        self.assertEqual(self_block_res.status_code, status.HTTP_400_BAD_REQUEST)

        # Unblock Bob
        unblock_res = self.client.post(f'/api/users/{self.user2.username}/unblock/')
        self.assertEqual(unblock_res.status_code, status.HTTP_200_OK)
        self.assertFalse(UserBlock.objects.filter(blocker=self.user1, blocked=self.user2).exists())

    def test_mute_and_restrict(self):
        self.client.force_login(self.user1)

        # Mute Bob
        mute_res = self.client.post(f'/api/users/{self.user2.username}/mute/')
        self.assertEqual(mute_res.status_code, status.HTTP_200_OK)
        self.assertTrue(UserMute.objects.filter(muter=self.user1, muted=self.user2).exists())

        # Restrict Bob
        restrict_res = self.client.post(f'/api/users/{self.user2.username}/restrict/')
        self.assertEqual(restrict_res.status_code, status.HTTP_200_OK)
        self.assertTrue(UserRestriction.objects.filter(restrictor=self.user1, restricted=self.user2).exists())

    def test_privacy_settings_update(self):
        self.client.force_login(self.user1)
        res = self.client.patch('/api/privacy/settings/', {
            'is_private': True,
            'who_can_message': 'followers'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['is_private'])
        self.assertEqual(res.data['who_can_message'], 'followers')
