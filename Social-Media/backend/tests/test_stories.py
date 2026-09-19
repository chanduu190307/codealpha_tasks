from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from io import BytesIO
from PIL import Image

from stories.models import Story, StoryView, CloseFriend
from accounts.models import UserBlock

def generate_test_image():
    file_obj = BytesIO()
    image = Image.new("RGBA", size=(50, 50), color=(256, 0, 0))
    image.save(file_obj, 'png')
    file_obj.seek(0)
    return SimpleUploadedFile('story.png', file_obj.read(), content_type='image/png')

class StoryTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='alice', email='alice@example.com', password='Password123!')
        self.user2 = User.objects.create_user(username='bob', email='bob@example.com', password='Password123!')
        self.user3 = User.objects.create_user(username='charlie', email='charlie@example.com', password='Password123!')

    def test_create_story_and_feed(self):
        self.client.force_login(self.user1)
        image = generate_test_image()

        res = self.client.post('/api/stories/', {'media': image, 'caption': 'Hello Story', 'audience': 'everyone'}, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Story.objects.count(), 1)

        # Feed
        feed_res = self.client.get('/api/stories/feed/')
        self.assertEqual(feed_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(feed_res.data), 1)

    def test_close_friends_story_privacy(self):
        # Alice posts a close friends story
        story = Story.objects.create(author=self.user1, media=generate_test_image(), caption='Secret', audience='close_friends')

        # User2 follows user1
        self.user1.followers_received.create(follower=self.user2)

        # Bob is NOT close friend yet
        self.client.force_login(self.user2)
        res_before = self.client.get('/api/stories/feed/')
        self.assertEqual(len(res_before.data), 0)

        # Add Bob to Close Friends
        CloseFriend.objects.create(user=self.user1, friend=self.user2)

        res_after = self.client.get('/api/stories/feed/')
        self.assertEqual(len(res_after.data), 1)

    def test_story_view_tracking(self):
        story = Story.objects.create(author=self.user1, media=generate_test_image(), caption='View Test')

        self.client.force_login(self.user2)
        view_res = self.client.post(f'/api/stories/{story.id}/view/')
        self.assertEqual(view_res.status_code, status.HTTP_200_OK)
        self.assertEqual(StoryView.objects.filter(story=story, viewer=self.user2).count(), 1)

        # Viewers list (author only)
        self.client.force_login(self.user1)
        viewers_res = self.client.get(f'/api/stories/{story.id}/viewers/')
        self.assertEqual(viewers_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(viewers_res.data), 1)

    def test_expired_story_filter(self):
        # Expired story
        past_time = timezone.now() - timedelta(hours=25)
        story = Story.objects.create(author=self.user1, media=generate_test_image(), expires_at=past_time)

        self.client.force_login(self.user1)
        feed_res = self.client.get('/api/stories/feed/')
        self.assertEqual(len(feed_res.data), 0)
