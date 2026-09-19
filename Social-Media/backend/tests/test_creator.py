from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from rest_framework import status
from creator.models import PostDraft, ScheduledPost
from posts.models import Post
from analytics.models import PostImpression, ProfileVisit

class CreatorStudioTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.creator = User.objects.create_user(username='topcreator', password='Password123!')
        self.fan = User.objects.create_user(username='fanuser', password='Password123!')
        self.client.force_authenticate(user=self.creator)

        self.post = Post.objects.create(author=self.creator, content='Creator post for metrics')
        PostImpression.objects.create(post=self.post, viewer=self.fan)
        ProfileVisit.objects.create(profile_user=self.creator, visitor=self.fan)

    def test_creator_overview_analytics_endpoint(self):
        res = self.client.get('/api/creator/analytics/overview/?days=30')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['impressions'], 1)
        self.assertEqual(res.data['profile_visits'], 1)
        self.assertEqual(res.data['total_posts'], 1)

    def test_draft_lifecycle(self):
        # Create draft
        create_res = self.client.post('/api/creator/drafts/', {'content': 'My draft ideas'})
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        draft_id = create_res.data['id']

        # Retrieve drafts
        list_res = self.client.get('/api/creator/drafts/')
        self.assertEqual(len(list_res.data), 1)

        # Update draft
        patch_res = self.client.patch(f'/api/creator/drafts/{draft_id}/', {'content': 'Updated ideas'})
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_res.data['content'], 'Updated ideas')

    def test_scheduled_post_publish_now(self):
        future_time = timezone.now() + timedelta(days=2)
        sched_res = self.client.post('/api/creator/scheduled/', {
            'content': 'Future announcement!',
            'scheduled_time': future_time.isoformat()
        })
        self.assertEqual(sched_res.status_code, status.HTTP_201_CREATED)
        sched_id = sched_res.data['id']

        # Publish now
        pub_res = self.client.post(f'/api/creator/scheduled/{sched_id}/publish-now/')
        self.assertEqual(pub_res.status_code, status.HTTP_200_OK)
        self.assertEqual(pub_res.data['status'], 'published')

        # Verify live post created
        self.assertTrue(Post.objects.filter(author=self.creator, content='Future announcement!').exists())
