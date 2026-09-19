from rest_framework import serializers

def normalize_image_url(value) -> str | None:
    """
    One consistent image URL normalization mechanism for Django runtime:
    - https://images.unsplash.com/... & approved absolute URLs preserved
    - /media/... & media/... relative paths
    - data: and blob: URIs
    - null / empty values
    Never transforms https://... into /media/https%3A/...
    """
    if not value:
        return None
    name = getattr(value, 'name', None)
    raw_str = str(name).strip() if name else str(value).strip()
    if not raw_str:
        return None

    if raw_str.startswith(('http://', 'https://', 'data:', 'blob:')):
        return raw_str
    if raw_str.startswith('/media/'):
        return raw_str
    if raw_str.startswith('media/'):
        return f"/{raw_str}"
    if raw_str.startswith('/'):
        return raw_str
    return f"/media/{raw_str}"


class NormalizedImageField(serializers.ImageField):
    """
    DRF field that normalizes image representation cleanly:
    Never converts external URLs (like Unsplash) into /media/https%3A/... paths.
    """
    def to_representation(self, value):
        if not value:
            return None
        name = getattr(value, 'name', None)
        raw_str = str(name).strip() if name else str(value).strip()
        if not raw_str:
            return None
        return normalize_image_url(raw_str)
