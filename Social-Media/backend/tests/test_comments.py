from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Post
from comments.models import Comment

class CommentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='author1', email='author1@example.com', password='Password123!')
        self.post = Post.objects.create(author=self.user, content='Post to comment on')
        self.client.force_login(self.user)

    def test_add_comment(self):
        data = {'content': 'Great post! Keep it up.'}
        response = self.client.post(f'/api/posts/{self.post.id}/comments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['comment']['content'], 'Great post! Keep it up.')
        self.assertTrue(Comment.objects.filter(content='Great post! Keep it up.').exists())

    def test_list_comments_for_post(self):
        Comment.objects.create(author=self.user, post=self.post, content='First comment')
        Comment.objects.create(author=self.user, post=self.post, content='Second comment')

        response = self.client.get(f'/api/posts/{self.post.id}/comments/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_empty_comment_fails(self):
        data = {'content': '   '}
        response = self.client.post(f'/api/posts/{self.post.id}/comments/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_edit_own_comment(self):
        comment = Comment.objects.create(author=self.user, post=self.post, content='Original comment')
        response = self.client.patch(f'/api/comments/{comment.id}/', {'content': 'Edited comment'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comment.refresh_from_db()
        self.assertEqual(comment.content, 'Edited comment')

    def test_delete_own_comment(self):
        comment = Comment.objects.create(author=self.user, post=self.post, content='To be deleted')
        response = self.client.delete(f'/api/comments/{comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Comment.objects.filter(id=comment.id).exists())

    def test_post_author_can_delete_other_users_comment_on_their_post(self):
        other_user = User.objects.create_user(username='commenter', email='commenter@example.com', password='Password123!')
        comment = Comment.objects.create(author=other_user, post=self.post, content='Inappropriate comment')
        # self.user is the author of self.post
        response = self.client.delete(f'/api/comments/{comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Comment.objects.filter(id=comment.id).exists())

    def test_unauthorized_user_cannot_delete_comment(self):
        other_user = User.objects.create_user(username='commenter2', email='c2@example.com', password='Password123!')
        comment = Comment.objects.create(author=other_user, post=self.post, content='Regular comment')
        intruder = User.objects.create_user(username='intruder', email='intruder@example.com', password='Password123!')
        self.client.force_login(intruder)
        response = self.client.delete(f'/api/comments/{comment.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Comment.objects.filter(id=comment.id).exists())
