from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from posts.models import Post
from discovery.models import Hashtag, PostHide, PostNotInterested, UserInterest
from core.ranking import FeedRankingService

class FeedRankingServiceTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='rankuser', password='Password123!')
        self.author1 = User.objects.create_user(username='creator1', password='Password123!')
        self.author2 = User.objects.create_user(username='creator2', password='Password123!')

        self.tag_tech = Hashtag.objects.create(name='tech')
        self.tag_art = Hashtag.objects.create(name='art')

        self.post1 = Post.objects.create(author=self.author1, content='Exploring deep learning #tech')
        self.post1.hashtags.add(self.tag_tech)

        self.post2 = Post.objects.create(author=self.author2, content='Oil painting on canvas #art')
        self.post2.hashtags.add(self.tag_art)

    def test_ranking_boosts_user_interested_topics(self):
        # User has high affinity for tech
        UserInterest.objects.create(user=self.user, topic='tech', score=3.0)

        candidates = Post.objects.all()
        ranked = FeedRankingService.rank_feed_posts(self.user, candidates)

        # post1 (#tech) should be ranked first
        self.assertEqual(ranked[0].id, self.post1.id)

    def test_negative_feedback_excludes_posts(self):
        # User marks post1 as hidden
        PostHide.objects.create(user=self.user, post=self.post1)

        candidates = Post.objects.all()
        ranked = FeedRankingService.rank_feed_posts(self.user, candidates)

        post_ids = [p.id for p in ranked]
        self.assertNotIn(self.post1.id, post_ids)
        self.assertIn(self.post2.id, post_ids)
