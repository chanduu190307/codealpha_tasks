import os
import uuid
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible
from PIL import Image

ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
ALLOWED_IMAGE_FORMATS = {'JPEG', 'PNG', 'WEBP', 'GIF'}
MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5 MB

def validate_image_file(file_obj):
    """
    Validates uploaded image file:
    1. Checks file size
    2. Checks file extension
    3. Performs deep inspection using PIL to verify actual image headers/bytes
    """
    if not file_obj:
        return

    # 1. File size check
    if file_obj.size > MAX_UPLOAD_SIZE:
        raise ValidationError(f"File size exceeds maximum allowed limit of {MAX_UPLOAD_SIZE // (1024 * 1024)}MB.")

    # 2. Extension check
    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError(f"Unsupported file extension '{ext}'. Allowed extensions: {', '.join(ALLOWED_IMAGE_EXTENSIONS)}")

    # 3. Magic bytes / PIL format verification
    try:
        # Reset file pointer to beginning
        file_obj.seek(0)
        img = Image.open(file_obj)
        img.verify()

        if img.format not in ALLOWED_IMAGE_FORMATS:
            raise ValidationError(f"Invalid image format '{img.format}'. Allowed: {', '.join(ALLOWED_IMAGE_FORMATS)}")

        # Reset pointer back for Django storage
        file_obj.seek(0)
    except Exception as e:
        if isinstance(e, ValidationError):
            raise e
        raise ValidationError("Uploaded file is not a valid or readable image.")


@deconstructible
class SecureFilePathGenerator:
    """
    Generates a secure, randomized filename to prevent path traversal
    and filename exploitation.
    """
    def __init__(self, sub_dir='uploads'):
        self.sub_dir = sub_dir

    def __call__(self, instance, filename):
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            ext = '.jpg'
        safe_filename = f"{uuid.uuid4().hex}{ext}"
        return os.path.join(self.sub_dir, safe_filename)
