// pages/index.js
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import AddWordForm from '@/components/AddWordForm';
import WordList from '@/components/WordList';
import { addWord, getWords, deleteWord } from '@/lib/firestoreService';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setError(null);
    } catch (err) {
      console.error('Error loading words:', err);
      setError('Failed to load words. Using offline mode.');
      // Try to load from localStorage as fallback
      const localWords = localStorage.getItem('germanWords');
      if (localWords) {
        setWords(JSON.parse(localWords));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async (wordData) => {
    try {
      const newWord = await addWord(wordData);
      setWords([newWord, ...words]);
      
      // Also save to localStorage as backup
      localStorage.setItem('germanWords', JSON.stringify([newWord, ...words]));
    } catch (err) {
      console.error('Error adding word:', err);
      // Fallback to localStorage
      const newWord = { ...wordData, id: Date.now().toString() };
      const updatedWords = [newWord, ...words];
      setWords(updatedWords);
      localStorage.setItem('germanWords', JSON.stringify(updatedWords));
    }
  };

  const handleDeleteWord = async (wordId) => {
    if (!confirm('Are you sure you want to delete this word?')) {
      return;
    }

    try {
      await deleteWord(wordId);
      const updatedWords = words.filter((word) => word.id !== wordId);
      setWords(updatedWords);
      
      // Also update localStorage
      localStorage.setItem('germanWords', JSON.stringify(updatedWords));
    } catch (err) {
      console.error('Error deleting word:', err);
      // Fallback to localStorage
      const updatedWords = words.filter((word) => word.id !== wordId);
      setWords(updatedWords);
      localStorage.setItem('germanWords', JSON.stringify(updatedWords));
    }
  };

  return (
    <>
      <Head>
        <title>German Learning App - Vocabulary</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            🇩🇪 German Vocabulary
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Build your German vocabulary collection
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 rounded-lg text-yellow-800 dark:text-yellow-300">
            ⚠️ {error}
          </div>
        )}

        {!authReady ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Connecting...</p>
          </div>
        ) : (
          <>
            <AddWordForm onAddWord={handleAddWord} />

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-4">Loading vocabulary...</p>
              </div>
            ) : (
              <WordList words={words} onDeleteWord={handleDeleteWord} />
            )}
          </>
        )}
      </div>
    </>
  );
}
