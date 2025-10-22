// pages/quiz.js
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import QuizMode from '@/components/QuizMode';
import { getWords } from '@/lib/firestoreService';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function QuizPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Wait for authentication before loading words
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthReady(true);
        loadWords();
      }
    });

    return () => unsubscribe();
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
        <title>German Learning App - Quiz</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            🧠 Quiz Mode
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Test your knowledge with multiple-choice questions
          </p>
        </div>

        {!authReady || loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {!authReady ? 'Connecting...' : 'Loading quiz...'}
            </p>
          </div>
        ) : (
          <QuizMode words={words} />
        )}
      </div>
    </>
  );
}
