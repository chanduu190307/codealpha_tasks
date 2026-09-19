from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from moderation.models import Report, ModerationAuditLog, ModerationQueueItem
from moderation.service import ModerationService

class ModerationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='alice', email='alice@example.com', password='Password123!')
        self.admin_user = User.objects.create_superuser(username='admin', email='admin@example.com', password='Password123!')

    def test_submit_report(self):
        self.client.force_login(self.user)
        res = self.client.post('/api/reports/', {
            'target_type': 'post',
            'target_id': 1,
            'reason': 'spam',
            'description': 'Scam giveaway link'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Report.objects.count(), 1)

    def test_admin_dashboard_and_resolve_report(self):
        report = Report.objects.create(reporter=self.user, target_type='post', target_id=1, reason='harassment')

        self.client.force_login(self.admin_user)
        dash_res = self.client.get('/api/admin/dashboard/')
        self.assertEqual(dash_res.status_code, status.HTTP_200_OK)
        self.assertEqual(dash_res.data['metrics']['pending_reports'], 1)

        # Resolve report
        resolve_res = self.client.post(f'/api/admin/reports/{report.id}/resolve/', {
            'action': 'resolved',
            'reason': 'Post removed for violation'
        }, format='json')
        self.assertEqual(resolve_res.status_code, status.HTTP_200_OK)

        # Verify audit trail
        self.assertTrue(ModerationAuditLog.objects.filter(moderator=self.admin_user).exists())

    def test_ai_rule_based_moderation_service(self):
        item = ModerationService.inspect_content(
            content_type='post',
            object_id=99,
            text='Earn $5000 fast! Click here now to buy crypto: http://tinyurl.com/xyz'
        )
        self.assertIsNotNone(item)
        self.assertEqual(item.status, 'pending')
        self.assertTrue(item.confidence_score >= 0.6)
