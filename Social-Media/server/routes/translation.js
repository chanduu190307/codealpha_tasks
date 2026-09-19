import express from 'express';

const router = express.Router();

// POST /api/translation/translate/
router.post('/translate/', (req, res) => {
  const { text, target_language } = req.body;
  const lang = target_language || 'es';

  // Sample dynamic translation dictionary / AI simulated mapping
  const langNames = {
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'ja': 'Japanese',
    'kn': 'Kannada',
    'hi': 'Hindi'
  };

  const sampleTranslations = {
    'kn': `[ಕನ್ನಡ ಅನುವಾದ] ${text}`,
    'es': `[Traducción en Español] ${text}`,
    'fr': `[Traduction en Français] ${text}`,
    'ja': `[日本語訳] ${text}`
  };

  res.json({
    original_text: text,
    translated_text: sampleTranslations[lang] || `[${langNames[lang] || lang}] ${text}`,
    target_language: lang,
    target_language_name: langNames[lang] || lang
  });
});

export default router;
