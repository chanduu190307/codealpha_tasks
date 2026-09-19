from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Post
from discovery.models import Hashtag, SearchHistory

class SearchV3Tests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='searcher', password='Password123!')
        self.target = User.objects.create_user(username='target_dev', password='Password123!')
        self.tag = Hashtag.objects.create(name='python')
        self.post = Post.objects.create(author=self.target, content='Mastering Python WebSockets!')
        self.client.force_authenticate(user=self.user)

    def test_ranked_search_records_history_and_finds_entities(self):
        res = self.client.get('/api/search/?q=Python')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data['posts']) > 0)
        self.assertTrue(len(res.data['hashtags']) > 0)

        # Verify search history was recorded
        history_res = self.client.get('/api/search/history/')
        self.assertEqual(history_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(history_res.data), 1)
        self.assertEqual(history_res.data[0]['query'], 'Python')

    def test_clear_search_history(self):
        SearchHistory.objects.create(user=self.user, query='Django')
        SearchHistory.objects.create(user=self.user, query='Redis')

        clear_res = self.client.delete('/api/search/history/clear/')
        self.assertEqual(clear_res.status_code, status.HTTP_200_OK)
        self.assertEqual(SearchHistory.objects.filter(user=self.user).count(), 0)
