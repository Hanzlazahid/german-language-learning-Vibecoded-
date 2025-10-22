// pages/progress.js
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import ProgressTracker from '@/components/ProgressTracker';
import { getWords } from '@/lib/firestoreService';

export default function ProgressPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    try {
      setLoading(true);
      const fetchedWords = await getWords();
      setWords(fetchedWords);
    } catch (err) {
      console.error('Error loading words:', err);
      // Fallback to localStorage
      const localWords = localStorage.getItem('germanWords');
      if (localWords) {
        setWords(JSON.parse(localWords));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>German Learning App - Progress</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            📊 Your Progress
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Track your learning journey and achievements
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Loading progress...</p>
          </div>
        ) : (
          <ProgressTracker words={words} />
        )}
      </div>
    </>
  );
}
