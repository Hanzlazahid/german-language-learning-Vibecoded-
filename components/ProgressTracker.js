// components/ProgressTracker.js
'use client';

import { motion } from 'framer-motion';
import { BookOpen, Target, TrendingUp, Calendar } from 'lucide-react';
import { exportToCSV, exportToJSON } from '@/lib/exportService';

const ProgressTracker = ({ words }) => {
  const totalWords = words.length;
  const wordTypes = words.reduce((acc, word) => {
    acc[word.type || 'word'] = (acc[word.type || 'word'] || 0) + 1;
    return acc;
  }, {});

  const genderCounts = words.reduce((acc, word) => {
    if (word.gender) {
      acc[word.gender] = (acc[word.gender] || 0) + 1;
    }
    return acc;
  }, {});

  const allTags = words.reduce((acc, word) => {
    if (word.tags) {
      word.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const topTags = Object.entries(allTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const getProgressLevel = () => {
    if (totalWords < 10) return { level: 'Beginner', emoji: '🌱', progress: 10 };
    if (totalWords < 50) return { level: 'Elementary', emoji: '🌿', progress: 30 };
    if (totalWords < 100) return { level: 'Intermediate', emoji: '🌳', progress: 50 };
    if (totalWords < 250) return { level: 'Advanced', emoji: '🎯', progress: 70 };
    return { level: 'Expert', emoji: '🏆', progress: 100 };
  };

  const levelInfo = getProgressLevel();

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-3xl font-bold text-gray-800 dark:text-white">{value}</div>
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 font-semibold">{title}</h3>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {levelInfo.emoji} {levelInfo.level}
            </h2>
            <p className="text-primary-100">Keep up the great work!</p>
          </div>
          <div className="text-5xl font-bold opacity-90">{totalWords}</div>
        </div>
        <div className="w-full bg-primary-700 rounded-full h-4 mt-4">
          <motion.div
            className="bg-white h-4 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${(totalWords / 250) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-sm text-primary-100 mt-2">
          {250 - totalWords > 0
            ? `${250 - totalWords} more words to reach Expert level!`
            : 'Expert level achieved! 🎉'}
        </p>
      </motion.div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={BookOpen}
          title="Total Vocabulary"
          value={totalWords}
          color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          subtitle="Words in your collection"
        />
        <StatCard
          icon={Target}
          title="Learning Goal"
          value="250"
          color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          subtitle={`${Math.round((totalWords / 250) * 100)}% complete`}
        />
        <StatCard
          icon={TrendingUp}
          title="Progress Rate"
          value={levelInfo.level}
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          subtitle="Current level"
        />
      </div>

      {/* Word Types Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-primary-500" />
          Word Types Distribution
        </h3>
        <div className="space-y-4">
          {Object.entries(wordTypes).map(([type, count]) => {
            const percentage = (count / totalWords) * 100;
            return (
              <div key={type}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium capitalize">
                    {type}s
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    className="bg-primary-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gender Distribution */}
      {Object.keys(genderCounts).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            Noun Gender Distribution
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-3xl mb-2">💙</div>
              <div className="text-2xl font-bold text-masculine mb-1">
                {genderCounts.der || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Der (Masculine)</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-3xl mb-2">❤️</div>
              <div className="text-2xl font-bold text-feminine mb-1">
                {genderCounts.die || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Die (Feminine)</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl mb-2">💚</div>
              <div className="text-2xl font-bold text-neuter mb-1">
                {genderCounts.das || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Das (Neuter)</div>
            </div>
          </div>
        </div>
      )}

      {/* Top Tags */}
      {topTags.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            Most Used Tags
          </h3>
          <div className="flex flex-wrap gap-3">
            {topTags.map(([tag, count]) => (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium"
              >
                #{tag} ({count})
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Export Your Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Download your vocabulary as a backup or for use in other applications.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportToCSV(words)}
            disabled={totalWords === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>📊 Export as CSV</span>
          </button>
          <button
            onClick={() => exportToJSON(words)}
            disabled={totalWords === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>📄 Export as JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
