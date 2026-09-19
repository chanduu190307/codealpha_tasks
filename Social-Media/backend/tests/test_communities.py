from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from communities.models import Community, CommunityMember, CommunityJoinRequest, CommunityBan

class CommunitiesTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(username='com_owner', password='Password123!')
        self.member = User.objects.create_user(username='com_member', password='Password123!')
        self.outsider = User.objects.create_user(username='outsider', password='Password123!')

        self.client.force_authenticate(user=self.owner)
        self.pub_com = Community.objects.create(name='Tech Enthusiasts', slug='tech-enthusiasts', type='public', created_by=self.owner)
        CommunityMember.objects.create(community=self.pub_com, user=self.owner, role='owner')

        self.priv_com = Community.objects.create(name='Secret Society', slug='secret-society', type='private', created_by=self.owner)
        CommunityMember.objects.create(community=self.priv_com, user=self.owner, role='owner')

    def test_join_public_community(self):
        self.client.force_authenticate(user=self.member)
        res = self.client.post(f'/api/communities/{self.pub_com.slug}/join-leave/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'joined')
        self.assertTrue(CommunityMember.objects.filter(community=self.pub_com, user=self.member).exists())

    def test_request_join_private_community_and_owner_approval(self):
        self.client.force_authenticate(user=self.outsider)
        res = self.client.post(f'/api/communities/{self.priv_com.slug}/join-leave/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'request_submitted')

        req = CommunityJoinRequest.objects.get(community=self.priv_com, user=self.outsider)
        self.assertEqual(req.status, 'pending')

        # Owner approves
        self.client.force_authenticate(user=self.owner)
        app_res = self.client.post(f'/api/communities/{self.priv_com.slug}/requests/{req.id}/respond/', {'decision': 'approved'})
        self.assertEqual(app_res.status_code, status.HTTP_200_OK)
        self.assertTrue(CommunityMember.objects.filter(community=self.priv_com, user=self.outsider).exists())

    def test_community_ban_prevents_rejoining(self):
        self.client.force_authenticate(user=self.owner)
        ban_res = self.client.post(f'/api/communities/{self.pub_com.slug}/users/{self.member.id}/ban/', {'reason': 'Spam'})
        self.assertEqual(ban_res.status_code, status.HTTP_200_OK)
        self.assertTrue(CommunityBan.objects.filter(community=self.pub_com, user=self.member).exists())

        # Member tries to join
        self.client.force_authenticate(user=self.member)
        join_res = self.client.post(f'/api/communities/{self.pub_com.slug}/join-leave/')
        self.assertEqual(join_res.status_code, status.HTTP_403_FORBIDDEN)
