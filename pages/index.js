// pages/index.js
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { AlertTriangle, BookOpen as BookIcon, WifiOff } from 'lucide-react';
import AddWordForm from '@/components/AddWordForm';
import WordList from '@/components/WordList';
import { addWord, getWords, deleteWord } from '@/lib/firestoreService';
import { useRequireAuth } from '@/utils/authGuard';

export default function Home() {
  const { user, checking } = useRequireAuth();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (user) {
      loadWords(user.uid);
    }
  }, [user, isOnline]);

  useEffect(() => {
    const updateStatus = () => setIsOnline(typeof navigator === 'undefined' ? true : navigator.onLine);
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  const loadWords = async (uid) => {
    if (!isOnline) {
      setError('No internet connection. Please connect to continue.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const fetchedWords = await getWords(uid);
      setWords(fetchedWords);
      setError(null);
    } catch (err) {
      console.error('Error loading words:', err);
      setError('Failed to load words from server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async (wordData) => {
    if (!isOnline) {
      setError('You are offline. Connect to the internet to add words.');
      return;
    }
    try {
      const newWord = await addWord(user.uid, wordData);
      setWords([newWord, ...words]);
      return newWord;
    } catch (err) {
      console.error('Error adding word:', err);
      const message = err?.message || 'Failed to add word. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  const handleDeleteWord = async (wordId) => {
    if (!confirm('Are you sure you want to delete this word?')) {
      return;
    }
    if (!isOnline) {
      setError('You are offline. Connect to the internet to delete words.');
      return;
    }
    try {
      await deleteWord(user.uid, wordId);
      const updatedWords = words.filter((word) => word.id !== wordId);
      setWords(updatedWords);
    } catch (err) {
      console.error('Error deleting word:', err);
      setError('Failed to delete word. Please try again.');
    }
  };

  return (
    <>
      <Head>
        <title>German Learning App - Vocabulary</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            <BookIcon className="w-10 h-10 text-primary-600" />
            <span>German Vocabulary</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Build your German vocabulary collection
          </p>
        </div>

        {(!isOnline || error) && (
          <div className="flex items-start space-x-3 mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 dark:border-yellow-600 rounded-lg text-yellow-800 dark:text-yellow-300">
            {isOnline ? (
              <AlertTriangle className="w-5 h-5 mt-0.5" />
            ) : (
              <WifiOff className="w-5 h-5 mt-0.5" />
            )}
            <span>{isOnline ? error : 'No internet connection. Please reconnect to continue.'}</span>
          </div>
        )}

        {checking ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Checking session...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Redirecting to login...</p>
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
