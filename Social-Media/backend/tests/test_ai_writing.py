from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from core.ai_writing import AIWritingAssistantService

class AIWritingAssistantTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='author_ai', password='Password123!')
        self.client.force_authenticate(user=self.user)

    def test_tone_and_grammar_suggestions(self):
        text = "just launched our new django real time features"
        result = AIWritingAssistantService.enhance_content(text, tone='engaging')

        self.assertEqual(len(result['suggestions']), 2)
        self.assertTrue(len(result['suggested_hashtags']) > 0)

    def test_ai_writing_api_endpoint(self):
        res = self.client.post('/api/ai/writing-assist/', {
            'text': 'exciting project release today with web sockets',
            'tone': 'professional'
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('suggestions', res.data)
        self.assertIn('suggested_hashtags', res.data)
