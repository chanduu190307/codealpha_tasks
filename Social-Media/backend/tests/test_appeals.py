from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from moderation.models import ModerationAppeal, ModerationAuditLog

class ModerationAppealsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='appealer', password='Password123!')
        self.admin = User.objects.create_superuser(username='staff_mod', password='AdminPassword123!', email='staff@example.com')

    def test_appeal_submission_and_resolution(self):
        self.client.force_authenticate(user=self.user)
        submit_res = self.client.post('/api/moderation/appeals/', {
            'target_summary': 'Post #123 removed for spam',
            'statement': 'This was a false positive tech tutorial.'
        })
        self.assertEqual(submit_res.status_code, status.HTTP_201_CREATED)
        appeal_id = submit_res.data['id']

        # Staff resolves appeal
        self.client.force_authenticate(user=self.admin)
        resolve_res = self.client.post(f'/api/admin/appeals/{appeal_id}/resolve/', {
            'decision': 'approved',
            'notes': 'Verified false positive.'
        })
        self.assertEqual(resolve_res.status_code, status.HTTP_200_OK)
        self.assertEqual(resolve_res.data['status'], 'approved')

        appeal = ModerationAppeal.objects.get(id=appeal_id)
        self.assertEqual(appeal.status, 'approved')
        self.assertEqual(appeal.reviewed_by, self.admin)
        self.assertTrue(ModerationAuditLog.objects.filter(action='appeal_approved').exists())
