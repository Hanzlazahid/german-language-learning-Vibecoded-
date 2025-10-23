// components/Flashcards.js
'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakGerman } from '@/lib/speechService';

const Flashcards = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledWords, setShuffledWords] = useState(words);

  useEffect(() => {
    setShuffledWords(words);
  }, [words]);

  const shuffleCards = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (shuffledWords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-2xl mb-4">📚</p>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No words available. Add some words first!
        </p>
      </div>
    );
  }

  const currentWord = shuffledWords[currentIndex];
  const progress = ((currentIndex + 1) / shuffledWords.length) * 100;

  const getGenderEmoji = (gender) => {
    switch (gender) {
      case 'der':
        return '💙';
      case 'die':
        return '❤️';
      case 'das':
        return '💚';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div className="text-lg font-semibold text-primary-500">
          Card {currentIndex + 1} of {shuffledWords.length}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={resetProgress}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-100 hover:bg-primary-200 text-germanblack rounded-lg transition-all"
            title="Reset to first card"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={shuffleCards}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-accent-500 text-germanblack rounded-lg transition-all"
            title="Shuffle cards"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-primary-200 rounded-full h-2 mb-8">
        <motion.div
          className="bg-primary-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Flashcard */}
      <div className="perspective-1000 mb-8">
        <motion.div
          className="relative w-full h-80 sm:h-96 cursor-pointer"
          onClick={handleFlip}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isFlipped ? 'back' : 'front'}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-primary-200 rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center border-2 border-primary-400"
            >
              {!isFlipped ? (
                // Front: German
                <div className="text-center w-full">
                  <div className="text-6xl mb-6">🇩🇪</div>
                  {currentWord.gender && (
                    <div className="mb-4">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400 px-3 py-1 rounded border border-gray-300 dark:border-gray-600">
                        {currentWord.gender.toUpperCase()} {getGenderEmoji(currentWord.gender)}
                      </span>
                    </div>
                  )}
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4 break-words">
                    {currentWord.german}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakGerman(currentWord.german);
                    }}
                    className="p-3 bg-primary-100 hover:bg-primary-200 rounded-full transition-colors"
                  >
                    <Volume2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </button>
                  <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">
                    Click to reveal translation
                  </p>
                </div>
              ) : (
                // Back: English
                <div className="text-center w-full">
                  <div className="text-6xl mb-6">🇬🇧</div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4 break-words">
                    {currentWord.english}
                  </h2>
                  {currentWord.tags && currentWord.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                      {currentWord.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-accent-500/10 text-accent-500 px-3 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">
                    Click to flip back
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-100 hover:bg-primary-200 text-germanblack rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-100"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isFlipped ? 'Showing translation' : 'Showing German'}
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === shuffledWords.length - 1}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-100 hover:bg-primary-200 text-germanblack rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-100"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Completion Message */}
      {currentIndex === shuffledWords.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg text-center"
        >
          <p className="text-green-800 dark:text-green-300 font-semibold">
            🎉 You've reached the last card! Great job!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Flashcards;
