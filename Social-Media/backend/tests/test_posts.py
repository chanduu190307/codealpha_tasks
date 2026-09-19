import io
from PIL import Image
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Post
from interactions.models import Follow

def create_test_image(filename='test.jpg', size=(100, 100), image_format='JPEG'):
    file_obj = io.BytesIO()
    image = Image.new('RGB', size, color='blue')
    image.save(file_obj, image_format)
    file_obj.seek(0)
    return SimpleUploadedFile(filename, file_obj.read(), content_type=f'image/{image_format.lower()}')

class PostTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='Password123!')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='Password123!')
        self.client.force_login(self.user1)

    def test_create_text_post(self):
        data = {'content': 'Hello world! This is my first post.'}
        response = self.client.post('/api/posts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['post']['content'], 'Hello world! This is my first post.')
        self.assertEqual(response.data['post']['author']['username'], 'user1')
        self.assertTrue(Post.objects.filter(content='Hello world! This is my first post.').exists())

    def test_create_post_with_image(self):
        test_img = create_test_image()
        data = {
            'content': 'Check out this photo!',
            'image': test_img
        }
        response = self.client.post('/api/posts/', data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data['post']['image'])

    def test_unauthenticated_post_creation_fails(self):
        self.client.logout()
        data = {'content': 'Anonymous post'}
        response = self.client.post('/api/posts/', data, format='json')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_feed_only_shows_followed_and_self_posts(self):
        user3 = User.objects.create_user(username='user3', email='user3@example.com', password='Password123!')
        
        # User 1 posts
        p1 = Post.objects.create(author=self.user1, content="User 1 post")
        # User 2 posts
        p2 = Post.objects.create(author=self.user2, content="User 2 post")
        # User 3 posts (Not followed)
        p3 = Post.objects.create(author=user3, content="User 3 post")

        # User 1 follows User 2
        Follow.objects.create(follower=self.user1, following=self.user2)

        feed_res = self.client.get('/api/feed/')
        self.assertEqual(feed_res.status_code, status.HTTP_200_OK)
        results = feed_res.data['results']
        feed_contents = [p['content'] for p in results]

        self.assertIn("User 1 post", feed_contents)
        self.assertIn("User 2 post", feed_contents)
        self.assertNotIn("User 3 post", feed_contents)

    def test_owner_can_edit_post(self):
        post = Post.objects.create(author=self.user1, content="Original content")
        self.client.force_login(self.user1)
        res = self.client.patch(f'/api/posts/{post.id}/', {'content': 'Updated content'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        post.refresh_from_db()
        self.assertEqual(post.content, 'Updated content')

    def test_non_owner_cannot_edit_post(self):
        post = Post.objects.create(author=self.user1, content="User 1 content")
        self.client.force_login(self.user2)
        res = self.client.patch(f'/api/posts/{post.id}/', {'content': 'Malicious overwrite'}, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        post.refresh_from_db()
        self.assertEqual(post.content, 'User 1 content')

    def test_owner_can_delete_post(self):
        post = Post.objects.create(author=self.user1, content="To be deleted")
        self.client.force_login(self.user1)
        res = self.client.delete(f'/api/posts/{post.id}/')
        self.assertIn(res.status_code, [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT])
        self.assertFalse(Post.objects.filter(id=post.id).exists())

    def test_non_owner_cannot_delete_post(self):
        post = Post.objects.create(author=self.user1, content="Protected post")
        self.client.force_login(self.user2)
        res = self.client.delete(f'/api/posts/{post.id}/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Post.objects.filter(id=post.id).exists())

    def test_unauthenticated_cannot_edit_or_delete_post(self):
        post = Post.objects.create(author=self.user1, content="Public post")
        self.client.logout()
        res_edit = self.client.patch(f'/api/posts/{post.id}/', {'content': 'Hacked content'}, format='json')
        self.assertIn(res_edit.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        res_del = self.client.delete(f'/api/posts/{post.id}/')
        self.assertIn(res_del.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
        self.assertTrue(Post.objects.filter(id=post.id).exists())

    def test_delete_post_cascades_dependent_records_cleanly(self):
        from comments.models import Comment
        from interactions.models import Like
        from posts.models import Bookmark

        post = Post.objects.create(author=self.user1, content="Post with relations")
        comment = Comment.objects.create(post=post, author=self.user2, content="Nice post")
        like = Like.objects.create(post=post, user=self.user2)
        bookmark = Bookmark.objects.create(post=post, user=self.user2)

        self.client.force_login(self.user1)
        res = self.client.delete(f'/api/posts/{post.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        self.assertFalse(Post.objects.filter(id=post.id).exists())
        self.assertFalse(Comment.objects.filter(id=comment.id).exists())
        self.assertFalse(Like.objects.filter(id=like.id).exists())
        self.assertFalse(Bookmark.objects.filter(id=bookmark.id).exists())

    def test_post_serializer_is_author_flag_accuracy(self):
        post = Post.objects.create(author=self.user1, content="Author test")

        # As User 1 (Owner)
        self.client.force_login(self.user1)
        res_owner = self.client.get(f'/api/posts/{post.id}/')
        self.assertEqual(res_owner.status_code, status.HTTP_200_OK)
        self.assertTrue(res_owner.data.get('is_author'))

        # As User 2 (Visitor)
        self.client.force_login(self.user2)
        res_visitor = self.client.get(f'/api/posts/{post.id}/')
        self.assertEqual(res_visitor.status_code, status.HTTP_200_OK)
        self.assertFalse(res_visitor.data.get('is_author'))

