from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Post, PostCollaboration

class CollaborativePostTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = User.objects.create_user(username='primary_author', password='Password123!')
        self.collab_user = User.objects.create_user(username='co_creator', password='Password123!')
        self.post = Post.objects.create(author=self.author, content='Joint Research paper published!')
        self.client.force_authenticate(user=self.author)

    def test_invite_and_accept_collaborator(self):
        # Primary author sends invite
        invite_res = self.client.post(f'/api/posts/{self.post.id}/collaborators/', {
            'username': 'co_creator'
        })
        self.assertEqual(invite_res.status_code, status.HTTP_201_CREATED)
        collab_id = invite_res.data['id']

        # Co-creator accepts
        self.client.force_authenticate(user=self.collab_user)
        respond_res = self.client.post(f'/api/collaborations/{collab_id}/respond/', {
            'decision': 'accepted'
        })
        self.assertEqual(respond_res.status_code, status.HTTP_200_OK)
        self.assertEqual(respond_res.data['status'], 'accepted')

        # Check post serialization includes co-creator
        post_res = self.client.get(f'/api/posts/{self.post.id}/')
        self.assertEqual(post_res.status_code, status.HTTP_200_OK)
        collab_usernames = [c['username'] for c in post_res.data['collaborators']]
        self.assertIn('co_creator', collab_usernames)

    def test_cannot_collaborate_with_self(self):
        self_res = self.client.post(f'/api/posts/{self.post.id}/collaborators/', {
            'username': 'primary_author'
        })
        self.assertEqual(self_res.status_code, status.HTTP_400_BAD_REQUEST)
