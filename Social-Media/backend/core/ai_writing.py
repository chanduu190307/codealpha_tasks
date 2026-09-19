import re
from typing import Dict, List

class AIWritingAssistantService:
    """
    AI Writing Enhancement Assistant Service.
    Assists creators with:
    - Tone shifting (casual, professional, engaging, humorous)
    - Grammar & clarity improvement
    - Caption expansion & shortening
    - Smart hashtag extraction & suggestions
    - Alternative title suggestions
    """

    TONE_TRANSFORMATIONS = {
        'professional': lambda text: f"{text.strip().capitalize()} — Sharing insights with the community.",
        'casual': lambda text: f"{text.strip().lower()} ✨ vibes & thoughts!",
        'engaging': lambda text: f"🔥 {text.strip()} What do you think about this? Drop your thoughts below! 👇",
        'humorous': lambda text: f"{text.strip()} (Don't judge me, it seemed like a good idea at the time 😂)",
    }

    @classmethod
    def enhance_content(cls, text: str, action: str = 'improve_grammar', tone: str = 'engaging') -> dict:
        clean_text = text.strip()
        if not clean_text:
            return {"suggestions": [], "hashtags": []}

        suggestions = []

        # 1. Grammar & Clarity
        fixed_grammar = re.sub(r'\s+', ' ', clean_text)
        fixed_grammar = fixed_grammar[0].upper() + fixed_grammar[1:] if fixed_grammar else fixed_grammar
        if not fixed_grammar.endswith(('.', '!', '?')):
            fixed_grammar += '.'
        suggestions.append({
            "type": "grammar_polish",
            "title": "Cleaned & Polished",
            "content": fixed_grammar
        })

        # 2. Tone Shift
        tone_fn = cls.TONE_TRANSFORMATIONS.get(tone, cls.TONE_TRANSFORMATIONS['engaging'])
        suggestions.append({
            "type": f"tone_{tone}",
            "title": f"Tone: {tone.capitalize()}",
            "content": tone_fn(clean_text)
        })

        # 3. Short & Concise Version
        words = clean_text.split()
        if len(words) > 10:
            shortened = ' '.join(words[:10]) + '...'
            suggestions.append({
                "type": "shortened",
                "title": "Concise Punchy Version",
                "content": shortened
            })

        # 4. Smart Hashtag Extraction & Suggestions
        hashtags = cls.suggest_hashtags(clean_text)

        return {
            "original": clean_text,
            "suggestions": suggestions,
            "suggested_hashtags": hashtags
        }

    @classmethod
    def suggest_hashtags(cls, text: str) -> List[str]:
        words = set(re.findall(r'\b[a-zA-Z]{4,15}\b', text.lower()))
        common_stop_words = {'this', 'that', 'with', 'from', 'have', 'what', 'your', 'about', 'some', 'they', 'will', 'there'}
        relevant = [f"#{w}" for w in words if w not in common_stop_words][:5]
        if not relevant:
            relevant = ['#Pulse', '#Community', '#Update']
        return relevant
