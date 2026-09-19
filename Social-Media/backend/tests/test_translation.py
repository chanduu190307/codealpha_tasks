from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from translation.service import TranslationService

class TranslationServiceTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_translation_to_kannada_and_hindi(self):
        kn_res = TranslationService.translate_text('Hello world', target_lang='kn')
        self.assertEqual(kn_res['target_language'], 'kn')
        self.assertTrue(kn_res['translated_text'].startswith('[ಕನ್ನಡ]'))

        hi_res = TranslationService.translate_text('Hello world', target_lang='hi')
        self.assertEqual(hi_res['target_language'], 'hi')
        self.assertTrue(hi_res['translated_text'].startswith('[हिंदी]'))

    def test_translation_api_endpoint(self):
        res = self.client.post('/api/translation/translate/', {
            'text': 'Good morning everyone',
            'target_language': 'es'
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['target_language'], 'es')
