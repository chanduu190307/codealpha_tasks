from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from notifications.models import Notification, NotificationPreference
from notifications.views import dispatch_realtime_notification

class NotificationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='alice', email='alice@example.com', password='Password123!')
        self.user2 = User.objects.create_user(username='bob', email='bob@example.com', password='Password123!')

    def test_create_and_list_notifications(self):
        dispatch_realtime_notification(
            recipient=self.user1,
            actor=self.user2,
            verb='like',
            target_id=1,
            target_type='post'
        )

        self.client.force_login(self.user1)
        res = self.client.get('/api/notifications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['unread_count'], 1)
        self.assertEqual(len(res.data['results']), 1)

    def test_mark_as_read_and_preferences(self):
        notif = Notification.objects.create(recipient=self.user1, actor=self.user2, verb='follow')

        self.client.force_login(self.user1)
        res = self.client.patch(f'/api/notifications/{notif.id}/read/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        notif.refresh_from_db()
        self.assertTrue(notif.is_read)

        # Update notification preferences
        pref_res = self.client.patch('/api/notifications/preferences/', {'likes_enabled': False}, format='json')
        self.assertEqual(pref_res.status_code, status.HTTP_200_OK)
        self.assertFalse(pref_res.data['likes_enabled'])
