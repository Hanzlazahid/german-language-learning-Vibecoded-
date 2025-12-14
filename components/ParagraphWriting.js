// components/ParagraphWriting.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Copy, Check, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { translateText, debounce } from '@/lib/translationService';
import UmlautToolbar from '@/components/UmlautToolbar';

export default function ParagraphWriting() {
  const [germanText, setGermanText] = useState('');
  const [englishText, setEnglishText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);
  const [copied, setCopied] = useState(false);
  const germanTextareaRef = useRef(null);
  const englishTextareaRef = useRef(null);

  // Debounced translation function (German to English for checking)
  const debouncedTranslate = useRef(
    debounce(async (text) => {
      if (!text.trim()) {
        setEnglishText('');
        setIsTranslating(false);
        setTranslationError(null);
        return;
      }

      setIsTranslating(true);
      setTranslationError(null);

      try {
        const result = await translateText(text, 'de', 'en');
        
        if (result.error) {
          setTranslationError(result.error);
          setEnglishText('');
        } else {
          setEnglishText(result.translatedText);
          setTranslationError(null);
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTranslationError('Failed to translate. Please check your connection and try again.');
        setEnglishText('');
      } finally {
        setIsTranslating(false);
      }
    }, 800) // Wait 800ms after user stops typing
  ).current;

  // Trigger translation when German text changes
  useEffect(() => {
    debouncedTranslate(germanText);
  }, [germanText, debouncedTranslate]);

  const handleGermanChange = (e) => {
    setGermanText(e.target.value);
  };

  const handleCopy = async () => {
    if (!englishText) return;

    try {
      await navigator.clipboard.writeText(englishText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClear = () => {
    setGermanText('');
    setEnglishText('');
    setTranslationError(null);
    setCopied(false);
  };

  const wordCount = germanText.trim() ? germanText.trim().split(/\s+/).length : 0;
  const charCount = germanText.length;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* German Input Section (Left) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">German (Your Writing)</h2>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </button>
          </div>

          <div className="mb-4">
            <textarea
              ref={germanTextareaRef}
              value={germanText}
              onChange={handleGermanChange}
              placeholder="Type your German paragraph here..."
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              autoFocus
            />
            {germanTextareaRef.current && <UmlautToolbar targetRef={germanTextareaRef} />}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex gap-4">
              <span>Words: {wordCount}</span>
              <span>Characters: {charCount}</span>
            </div>
          </div>
        </div>

        {/* English Translation Section (Right - Disabled) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">English Translation</h2>
            </div>
            {englishText && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mb-4 relative">
            {isTranslating && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg z-10">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Translating...</span>
                </div>
              </div>
            )}

            <textarea
              ref={englishTextareaRef}
              value={englishText}
              readOnly
              disabled
              placeholder={isTranslating ? 'Translating...' : translationError ? 'Translation unavailable' : 'English translation will appear here...'}
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 resize-none cursor-not-allowed"
            />
          </div>

          {translationError && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <span className="text-yellow-800 dark:text-yellow-300">{translationError}</span>
            </div>
          )}

          {englishText && !isTranslating && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Translation complete
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Tips</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
          <li>Type in German and see the English translation appear in real-time to check your writing</li>
          <li>Translation updates automatically after you stop typing (800ms delay)</li>
          <li>Use the copy button to copy the English translation</li>
          <li>Practice writing simple sentences first, then build up to paragraphs</li>
          <li>Compare your German writing with the English translation to verify accuracy</li>
        </ul>
      </div>
    </div>
  );
}

