import os
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
import logging

logger = logging.getLogger(__name__)

class MediaProcessingPipeline:
    """
    Image Optimization & Thumbnail Processing Pipeline.
    Generates optimized thumbnails and WebP assets to minimize bandwidth.
    """

    THUMBNAIL_SIZES = {
        'small': (150, 150),
        'medium': (600, 600),
    }

    @classmethod
    def optimize_image(cls, image_file, max_size=(1600, 1600), quality=85):
        """
        Resizes and compresses uploaded images, stripping metadata.
        """
        try:
            image_file.seek(0)
            img = Image.open(image_file)
            img.verify()
            image_file.seek(0)
            img = Image.open(image_file)

            img.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Convert RGBA to RGB for JPEG compatibility if necessary
            if img.mode in ('RGBA', 'P') and image_file.name.lower().endswith(('.jpg', '.jpeg')):
                img = img.convert('RGB')

            output = BytesIO()
            format_name = 'PNG' if image_file.name.lower().endswith('.png') else 'JPEG'
            content_type = 'image/png' if format_name == 'PNG' else 'image/jpeg'
            img.save(output, format=format_name, quality=quality, optimize=True)
            output.seek(0)

            optimized = SimpleUploadedFile(
                name=image_file.name,
                content=output.read(),
                content_type=content_type
            )
            return optimized
        except Exception as e:
            logger.warning("Could not optimize image: %s", str(e))
            if hasattr(image_file, 'seek'):
                image_file.seek(0)
            return image_file
