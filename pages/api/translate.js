// pages/api/translate.js
// Next.js API route for translation using MyMemory Translation API (free, no API key required)

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, sourceLang = 'en', targetLang = 'de' } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required' });
  }

  // MyMemory Translation API - Free tier: 10,000 words/day, no API key required
  try {
    const encodedText = encodeURIComponent(text);
    const langPair = `${sourceLang}|${targetLang}`;
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseData && data.responseData.translatedText) {
      // MyMemory sometimes returns the same text if translation fails, check match percentage
      const matchPercentage = data.responseData.match || 0;
      
      // If match is 100%, it might mean no translation was found
      // But we'll still return it as it could be correct
      return res.status(200).json({
        translatedText: data.responseData.translatedText,
        error: null,
        matchPercentage: matchPercentage,
      });
    } else {
      throw new Error('No translation in response');
    }
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(503).json({
      translatedText: '',
      error: 'Translation service unavailable. Please try again later.',
    });
  }
}

