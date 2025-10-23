// components/WordList.js
'use client';

import { useState, useEffect } from 'react';
import { Volume2, Trash2, Search, Filter } from 'lucide-react';
import { speakGerman } from '@/lib/speechService';
import { motion } from 'framer-motion';

const WordList = ({ words, onDeleteWord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filteredWords, setFilteredWords] = useState(words);

  useEffect(() => {
    let result = words;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (word) =>
          word.german.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (word.tags && word.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((word) => word.type === filterType);
    }

    setFilteredWords(result);
  }, [searchTerm, filterType, words]);

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'der':
        return 'text-masculine border-masculine';
      case 'die':
        return 'text-feminine border-feminine';
      case 'das':
        return 'text-neuter border-neuter';
      default:
        return 'text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600';
    }
  };

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
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search words, translations, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all appearance-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="word">Words</option>
            <option value="sentence">Sentences</option>
            <option value="phrase">Phrases</option>
          </select>
        </div>
      </div>

      {/* Word Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredWords.length} of {words.length} items
      </div>

      {/* Words Grid */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {words.length === 0 ? '📚 No words yet. Add your first word!' : '🔍 No matches found'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredWords.map((word, index) => (
            <motion.div
              key={word.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-5">
                {/* Header with Gender and Type */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {word.gender && (
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${getGenderColor(word.gender)}`}>
                        {word.gender.toUpperCase()} {getGenderEmoji(word.gender)}
                      </span>
                    )}
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                      {word.type || 'word'}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteWord(word.id)}
                    className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
                    title="Delete word"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>

                {/* German Text */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">🇩🇪 German</span>
                    <button
                      onClick={() => speakGerman(word.german)}
                      className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors group"
                      title="Pronounce"
                    >
                      <Volume2 className="w-5 h-5 text-primary-500 group-hover:text-primary-600 transition-colors" />
                    </button>
                  </div>
                  <p className="text-xl font-bold text-gray-800 dark:text-white break-words">
                    {word.german}
                  </p>
                </div>

                {/* English Translation */}
                <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">🇬🇧 English</span>
                  <p className="text-lg text-gray-700 dark:text-gray-300 break-words">
                    {word.english}
                  </p>
                </div>

                {/* Tags */}
                {word.tags && word.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {word.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WordList;
