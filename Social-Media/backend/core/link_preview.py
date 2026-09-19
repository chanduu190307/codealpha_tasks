import ipaddress
import socket
import urllib.request
import urllib.parse
from html.parser import HTMLParser
import logging

logger = logging.getLogger(__name__)

class SSRFProtectionError(Exception):
    pass

class OpenGraphParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = None
        self.description = None
        self.image = None
        self._in_title = False
        self._title_tag_content = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        prop = attr_dict.get('property', '').lower()
        name = attr_dict.get('name', '').lower()
        content = attr_dict.get('content', '')

        if prop == 'og:title' or name == 'twitter:title':
            if not self.title:
                self.title = content
        elif prop == 'og:description' or name == 'description' or name == 'twitter:description':
            if not self.description:
                self.description = content
        elif prop == 'og:image' or name == 'twitter:image':
            if not self.image:
                self.image = content

        if tag == 'title':
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == 'title':
            self._in_title = False
            if not self.title and self._title_tag_content:
                self.title = ''.join(self._title_tag_content).strip()

    def handle_data(self, data):
        if self._in_title:
            self._title_tag_content.append(data)


class SafeRedirectHandler(urllib.request.HTTPRedirectHandler):
    """
    Ensures that every HTTP redirect target is validated against private/loopback/metadata IP filters
    before following the redirect.
    """
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        try:
            LinkPreviewService.validate_url(newurl)
        except Exception as e:
            raise SSRFProtectionError(f"Redirect target blocked by SSRF protection: {str(e)}")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


class LinkPreviewService:
    """
    SSRF-Hardened OpenGraph Link Preview Fetcher.
    Enforces:
    1. Scheme validation (only http and https)
    2. Socket IP pre-resolution and validation against RFC 1918, RFC 4193, loopback, link-local, multicast
    3. Blocking cloud metadata IPs (169.254.169.254, metadata.google.internal)
    4. Safe redirect validation on all HTTP redirects (prevents SSRF via redirect)
    5. 3-second timeout and 512KB max payload limit
    6. Content-Type verification (text/html only)
    """

    MAX_BYTES = 512 * 1024  # 512 KB
    TIMEOUT = 3.0  # seconds

    BLOCKED_IPS = {
        '169.254.169.254', # AWS / GCP / Azure metadata
        'metadata.google.internal',
    }

    @classmethod
    def validate_url(cls, url: str) -> str:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme not in ('http', 'https'):
            raise SSRFProtectionError("Invalid URL scheme. Only HTTP and HTTPS are permitted.")

        hostname = parsed.hostname
        if not hostname:
            raise SSRFProtectionError("Missing hostname in URL.")

        if hostname.lower() in cls.BLOCKED_IPS:
            raise SSRFProtectionError("Access to metadata endpoints is blocked.")

        # Resolve hostname to IP address and inspect
        try:
            addr_info = socket.getaddrinfo(hostname, None)
        except socket.gaierror:
            raise SSRFProtectionError(f"Could not resolve hostname {hostname}.")

        for family, socktype, proto, canonname, sockaddr in addr_info:
            ip_str = sockaddr[0]
            ip = ipaddress.ip_address(ip_str)

            if ip.is_loopback:
                raise SSRFProtectionError("Access to loopback IP addresses is blocked.")
            if ip.is_private:
                raise SSRFProtectionError("Access to private network IP addresses is blocked.")
            if ip.is_link_local:
                raise SSRFProtectionError("Access to link-local IP addresses is blocked.")
            if ip.is_multicast:
                raise SSRFProtectionError("Access to multicast IP addresses is blocked.")
            if ip.is_reserved:
                raise SSRFProtectionError("Access to reserved IP addresses is blocked.")

        return url

    @classmethod
    def fetch_preview(cls, url: str) -> dict:
        validated_url = cls.validate_url(url)
        parsed = urllib.parse.urlparse(validated_url)
        domain = parsed.netloc

        req = urllib.request.Request(
            validated_url,
            headers={'User-Agent': 'PulseBot/3.0 (+https://pulse.social/bot)'}
        )

        opener = urllib.request.build_opener(SafeRedirectHandler())

        try:
            with opener.open(req, timeout=cls.TIMEOUT) as response:
                content_type = response.headers.get('Content-Type', '').lower()
                if 'text/html' not in content_type and 'application/xhtml+xml' not in content_type:
                    raise SSRFProtectionError("Target resource is not an HTML document.")

                html_bytes = response.read(cls.MAX_BYTES)
                html_text = html_bytes.decode('utf-8', errors='ignore')

                parser = OpenGraphParser()
                parser.feed(html_text)

                return {
                    "url": validated_url,
                    "domain": domain,
                    "title": parser.title or domain,
                    "description": parser.description or "",
                    "image": parser.image or "",
                }
        except SSRFProtectionError:
            raise
        except Exception as e:
            logger.warning("Failed to fetch safe link preview for %s: %s", url, str(e))
            raise SSRFProtectionError(f"Unable to safely fetch link preview: {str(e)}")
