from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock

from core.link_preview import LinkPreviewService, SSRFProtectionError, SafeRedirectHandler
from posts.models import Post, Bookmark
from communities.models import Community, CommunityMember
from stories.models import Story, StoryReaction, CloseFriend
from accounts.models import Profile, UserBlock
from core.permissions import IsOwnerOrReadOnly

class RemediationSecurityRegressionTests(TestCase):
    """
    Comprehensive regression test suite verifying all fixes from the StackGrit audit.
    """

    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='alice', email='alice@pulse.local', password='Password123!')
        self.user2 = User.objects.create_user(username='bob', email='bob@pulse.local', password='Password123!')
        self.staff_user = User.objects.create_user(username='adminuser', email='admin@pulse.local', password='Password123!', is_staff=True)

        self.post1 = Post.objects.create(author=self.user1, content="Alice public post")

    # =========================================================================
    # 1. CRITICAL: SSRF HTTP Redirect Protection
    # =========================================================================
    def test_ssrf_validate_url_blocks_private_and_metadata_ips(self):
        """Verify validate_url directly blocks private and metadata IPs."""
        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url("http://127.0.0.1:8000/api/secret")
        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url("http://169.254.169.254/latest/meta-data/")
        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url("http://10.0.0.1/admin")

    def test_ssrf_safe_redirect_handler_blocks_private_destination(self):
        """Verify SafeRedirectHandler intercepts redirects to internal network addresses."""
        handler = SafeRedirectHandler()
        mock_req = MagicMock()
        with self.assertRaises(SSRFProtectionError):
            handler.redirect_request(mock_req, None, 302, "Found", {}, "http://127.0.0.1:8000/internal")
        with self.assertRaises(SSRFProtectionError):
            handler.redirect_request(mock_req, None, 301, "Moved", {}, "http://169.254.169.254/secret")

    # =========================================================================
    # 2. HIGH: BOLA/IDOR Protection on Private Stories & Communities
    # =========================================================================
    def test_private_story_access_denied_for_non_follower(self):
        """Verify followers-only story is inaccessible to non-followers."""
        story = Story.objects.create(
            author=self.user1,
            caption="Followers only story",
            audience='followers'
        )
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(f"/api/stories/{story.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_private_story_access_denied_for_non_close_friend(self):
        """Verify close-friends-only story is inaccessible to regular followers or strangers."""
        story = Story.objects.create(
            author=self.user1,
            caption="Close friends secret",
            audience='close_friends'
        )
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(f"/api/stories/{story.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Now add Bob to Close Friends and verify access is granted
        CloseFriend.objects.create(user=self.user1, friend=self.user2)
        response_allowed = self.client.get(f"/api/stories/{story.id}/")
        self.assertEqual(response_allowed.status_code, status.HTTP_200_OK)

    def test_private_community_posts_hidden_from_non_members(self):
        """Verify private community posts cannot be viewed by non-members."""
        comm = Community.objects.create(
            name="Secret Society",
            slug="secret-society",
            type="private",
            created_by=self.user1
        )
        CommunityMember.objects.create(community=comm, user=self.user1, role="owner")
        private_post = Post.objects.create(author=self.user1, community=comm, content="Classified discussion")

        # Bob is not a member
        self.client.force_authenticate(user=self.user2)
        res = self.client.get(f"/api/communities/{comm.slug}/posts/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Should return 0 posts for non-member
        self.assertEqual(len(res.data.get('results', [])), 0)

        # Alice is the owner / member
        self.client.force_authenticate(user=self.user1)
        res_alice = self.client.get(f"/api/communities/{comm.slug}/posts/")
        self.assertEqual(len(res_alice.data.get('results', [])), 1)

    # =========================================================================
    # 3. MEDIUM: PII Email Leakage Prevention in ProfileSerializer
    # =========================================================================
    def test_profile_email_privacy_for_unauthorized_users(self):
        """Verify third parties cannot see another user's email."""
        # Unauthenticated request
        res_anon = self.client.get(f"/api/profiles/{self.user1.username}/")
        self.assertEqual(res_anon.status_code, status.HTTP_200_OK)
        self.assertIsNone(res_anon.data.get('email'))

        # Logged-in as Bob
        self.client.force_authenticate(user=self.user2)
        res_bob = self.client.get(f"/api/profiles/{self.user1.username}/")
        self.assertEqual(res_bob.status_code, status.HTTP_200_OK)
        self.assertIsNone(res_bob.data.get('email'))

    def test_profile_email_returned_for_owner_and_staff(self):
        """Verify owner and staff can view email on profile."""
        # Alice viewing herself
        self.client.force_authenticate(user=self.user1)
        res_self = self.client.get(f"/api/profiles/{self.user1.username}/")
        self.assertEqual(res_self.data.get('email'), 'alice@pulse.local')

        # Staff viewing Alice
        self.client.force_authenticate(user=self.staff_user)
        res_staff = self.client.get(f"/api/profiles/{self.user1.username}/")
        self.assertEqual(res_staff.data.get('email'), 'alice@pulse.local')

    # =========================================================================
    # 4. MEDIUM: Story Reaction Constraint and Idempotency
    # =========================================================================
    def test_story_reaction_unique_constraint(self):
        """Verify unique constraint prevents duplicate identical story reactions."""
        from django.db import IntegrityError
        story = Story.objects.create(author=self.user1, caption="Test Story")
        StoryReaction.objects.create(story=story, user=self.user2, reaction="🔥")

        with self.assertRaises(IntegrityError):
            StoryReaction.objects.create(story=story, user=self.user2, reaction="🔥")

    # =========================================================================
    # 5. MEDIUM: Security Headers CSP and WebSockets
    # =========================================================================
    def test_security_headers_csp_contains_websocket_support(self):
        """Verify CSP header supports WebSocket schemes ws: and wss:."""
        res = self.client.get("/api/health/")
        csp = res.headers.get('Content-Security-Policy', '')
        self.assertIn("ws:", csp)
        self.assertIn("wss:", csp)
        self.assertIn("connect-src 'self' ws: wss:;", csp)

    # =========================================================================
    # 6. CODE QUALITY: IsOwnerOrReadOnly Supports Author & User Attributes
    # =========================================================================
    def test_is_owner_or_read_only_author_support(self):
        """Verify IsOwnerOrReadOnly correctly checks author attribute."""
        perm = IsOwnerOrReadOnly()
        mock_req_safe = MagicMock(method='GET', user=self.user2)
        mock_req_owner = MagicMock(method='DELETE', user=self.user1)
        mock_req_intruder = MagicMock(method='DELETE', user=self.user2)

        # Safe method (GET) -> True
        self.assertTrue(perm.has_object_permission(mock_req_safe, None, self.post1))

        # Author deleting -> True
        self.assertTrue(perm.has_object_permission(mock_req_owner, None, self.post1))

        # Intruder deleting -> False
        self.assertFalse(perm.has_object_permission(mock_req_intruder, None, self.post1))
