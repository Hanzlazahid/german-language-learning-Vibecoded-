// lib/translationService.js
// Translation service using Next.js API route (avoids CORS issues)
// Uses MyMemory Translation API - free, no API key required

// Translate text using our Next.js API route (which uses MyMemory API)
export async function translateText(text, sourceLang = 'en', targetLang = 'de') {
  if (!text || !text.trim()) {
    return { translatedText: '', error: null };
  }

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLang,
        targetLang,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        translatedText: '',
        error: errorData.error || 'Translation service unavailable. Please try again later.',
      };
    }

    const data = await response.json();
    return {
      translatedText: data.translatedText || '',
      error: data.error || null,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      translatedText: '',
      error: 'Failed to connect to translation service. Please check your connection and try again.',
    };
  }
}

// Debounce function for translation
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

