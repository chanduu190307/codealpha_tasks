from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from posts.models import Post
from comments.models import Comment

class SecurityPenetrationTests(TestCase):
    def setUp(self):
        self.victim = User.objects.create_user(username='victim', email='victim@example.com', password='Password123!')
        self.attacker = User.objects.create_user(username='attacker', email='attacker@example.com', password='Password123!')
        
        self.victim_post = Post.objects.create(author=self.victim, content='Victim original content')
        self.victim_comment = Comment.objects.create(author=self.victim, post=self.victim_post, content='Victim comment')

        self.attacker_client = APIClient()
        self.attacker_client.force_login(self.attacker)

    def test_idor_attacker_cannot_edit_victim_post(self):
        """Test BOLA/IDOR: Attacker cannot modify victim's post"""
        res = self.attacker_client.patch(
            f'/api/posts/{self.victim_post.id}/',
            {'content': 'Hacked content by attacker'},
            format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.victim_post.refresh_from_db()
        self.assertEqual(self.victim_post.content, 'Victim original content')

    def test_idor_attacker_cannot_delete_victim_post(self):
        """Test BOLA/IDOR: Attacker cannot delete victim's post"""
        res = self.attacker_client.delete(f'/api/posts/{self.victim_post.id}/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Post.objects.filter(id=self.victim_post.id).exists())

    def test_idor_attacker_cannot_edit_victim_comment(self):
        """Test BOLA/IDOR: Attacker cannot modify victim's comment"""
        res = self.attacker_client.patch(
            f'/api/comments/{self.victim_comment.id}/',
            {'content': 'Hacked comment by attacker'},
            format='json'
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.victim_comment.refresh_from_db()
        self.assertEqual(self.victim_comment.content, 'Victim comment')

    def test_idor_attacker_cannot_delete_victim_comment(self):
        """Test BOLA/IDOR: Attacker cannot delete victim's comment"""
        res = self.attacker_client.delete(f'/api/comments/{self.victim_comment.id}/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Comment.objects.filter(id=self.victim_comment.id).exists())

    def test_malicious_file_upload_rejected(self):
        """Test File Upload Security: Disguised text/script with .jpg extension is rejected by deep inspection"""
        fake_image = SimpleUploadedFile(
            'malicious.jpg',
            b'<?php echo "evil"; ?>Not a real image file',
            content_type='image/jpeg'
        )
        res = self.attacker_client.post(
            '/api/posts/',
            {'content': 'Malicious upload', 'image': fake_image},
            format='multipart'
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_sql_injection_immunity_in_search(self):
        """Test SQL Injection prevention: SQL payload strings in search parameter are treated safely as literals"""
        sql_payloads = [
            "' OR '1'='1",
            "admin' --",
            "'; DROP TABLE accounts_profile; --",
            "1 UNION SELECT 1, 2, 3--"
        ]
        for payload in sql_payloads:
            res = self.attacker_client.get(f'/api/users/search/?q={payload}')
            self.assertEqual(res.status_code, status.HTTP_200_OK)
            self.assertIsInstance(res.data['results'], list)

    def test_mass_assignment_protection(self):
        """Test Mass Assignment: Client cannot override author or system fields"""
        data = {
            'content': 'Attempting mass assignment',
            'author': self.victim.id,
            'author_id': self.victim.id,
            'likes_count': 9999
        }
        res = self.attacker_client.post('/api/posts/', data, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        # Server must derive author strictly from authenticated request (attacker)
        created_post = Post.objects.get(id=res.data['post']['id'])
        self.assertEqual(created_post.author, self.attacker)
        self.assertEqual(created_post.likes_count, 0)
