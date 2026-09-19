import express from 'express';

const router = express.Router();

// POST /api/ai/writing-assist/
router.post('/writing-assist/', (req, res) => {
  const { text, tone } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ detail: 'Text is required.' });
  }

  const cleanText = text.trim();
  const toneStyle = tone || 'engaging';

  let suggestions = [];
  if (toneStyle === 'engaging') {
    suggestions = [
      {
        title: '⚡ High Engagement Hook',
        content: `🚀 Game Changer: ${cleanText} — What are your thoughts on this? Let me know below! 👇`
      },
      {
        title: '✨ 3D Spatial Storyteller',
        content: `Entering the spatial dimension: "${cleanText}" 🌐 Connect with fellow pioneers in our 3D cosmos.`
      }
    ];
  } else if (toneStyle === 'professional') {
    suggestions = [
      {
        title: '💼 Executive Summary',
        content: `Key Insight: ${cleanText}. Driving measurable outcomes and collaborative innovation.`
      },
      {
        title: '📊 Crisp Industry Perspective',
        content: `Analysis: ${cleanText}. A strategic shift toward decentralized 3D spatial platforms.`
      }
    ];
  } else {
    suggestions = [
      {
        title: '🌟 Casual & Catchy',
        content: `Just thinking out loud: ${cleanText} ✨ Vibes are immaculate today!`
      },
      {
        title: '💡 Quick Thought',
        content: `Quick check-in: ${cleanText} 💫`
      }
    ];
  }

  // Generate suggested hashtags
  const words = cleanText.split(/\s+/).filter(w => w.length > 3).map(w => w.replace(/[^a-zA-Z0-9]/g, ''));
  const tags = ['#Pulse3D', '#Metaverse', '#SpatialWeb', ...words.slice(0, 3).map(w => `#${w.charAt(0).toUpperCase() + w.slice(1)}`)];

  res.json({
    suggestions,
    suggested_hashtags: [...new Set(tags)]
  });
});

export default router;
