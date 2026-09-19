from django.test import TestCase
from core.link_preview import LinkPreviewService, SSRFProtectionError

class LinkPreviewSSRFSecurityTests(TestCase):
    def test_blocks_localhost_and_loopback(self):
        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url('http://localhost:8000/secret')

        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url('http://127.0.0.1:8000/admin')

        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url('http://127.0.0.2:9000/')

    def test_blocks_private_ip_ranges(self):
        # RFC 1918 Class A
        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url('http://10.0.0.1/internal')

        # RFC 1918 Class B
        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url('http://172.16.0.5/api')

        # RFC 1918 Class C
        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url('http://192.168.1.1/router')

    def test_blocks_cloud_metadata_ip(self):
        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url('http://169.254.169.254/latest/meta-data/')

    def test_blocks_invalid_schemes(self):
        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url('file:///etc/passwd')

        with self.assertRaises(SSRFProtectionError):
            LinkPreviewService.validate_url('ftp://evil.com/payload')
