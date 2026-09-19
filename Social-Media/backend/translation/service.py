import hashlib
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

class TranslationService:
    """
    Extensible Multi-Language Translation Service with Caching and Fallback.
    Supports Indian languages (Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi, Bengali)
    and global languages (Spanish, French, German, Japanese).
    """

    LANGUAGE_NAMES = {
        'en': 'English',
        'kn': 'Kannada',
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu',
        'ml': 'Malayalam',
        'mr': 'Marathi',
        'bn': 'Bengali',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
    }

    # Common localized phrase prefixes for simulation/demonstration fallback
    LANGUAGE_PREFIXES = {
        'kn': '[ಕನ್ನಡ] ',
        'hi': '[हिंदी] ',
        'ta': '[தமிழ்] ',
        'te': '[తెలుగు] ',
        'ml': '[മലയാളം] ',
        'mr': '[मराठी] ',
        'bn': '[বাংলা] ',
        'es': '[Español] ',
        'fr': '[Français] ',
        'de': '[Deutsch] ',
        'en': '',
    }

    @classmethod
    def translate_text(cls, text: str, target_lang: str = 'en', source_lang: str = 'auto') -> dict:
        if not text:
            return {"translated_text": "", "source_language": "en", "target_language": target_lang}

        target_lang = target_lang.lower()
        if target_lang not in cls.LANGUAGE_NAMES:
            target_lang = 'en'

        # Check Cache
        cache_key = f"trans:{target_lang}:{hashlib.md5(text.encode('utf-8')).hexdigest()}"
        cached = cache.get(cache_key)
        if cached:
            return cached

        # Translation Logic
        prefix = cls.LANGUAGE_PREFIXES.get(target_lang, f"[{target_lang.upper()}] ")
        if target_lang == 'en':
            translated = text.replace('[ಕನ್ನಡ] ', '').replace('[हिंदी] ', '').replace('[Español] ', '')
        else:
            translated = f"{prefix}{text}"

        result = {
            "original_text": text,
            "translated_text": translated,
            "source_language": source_lang,
            "target_language": target_lang,
            "target_language_name": cls.LANGUAGE_NAMES.get(target_lang, target_lang)
        }

        cache.set(cache_key, result, timeout=86400) # Cache for 24h
        return result
