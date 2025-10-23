// components/QuizMode.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';

const QuizMode = ({ words }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    if (words.length >= 4) {
      generateQuiz();
    }
  }, [words]);

  const generateQuiz = () => {
    // Shuffle and take up to 10 questions
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, Math.min(10, words.length));

    const questions = selectedWords.map((word) => {
      // Get 3 random wrong answers
      const wrongAnswers = words
        .filter((w) => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.english);

      // Create options array with correct answer and wrong answers
      const options = [word.english, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        german: word.german,
        correctAnswer: word.english,
        options: options,
        gender: word.gender || '',
      };
    });

    setQuizQuestions(questions);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setQuizComplete(false);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question after 1.5 seconds
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    generateQuiz();
  };

  if (words.length < 4) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-2xl mb-4">🧠</p>
        <p className="text-gray-600 dark:text-gray-400 text-lg text-center">
          You need at least 4 words to start a quiz!
        </p>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-12">
          <div className="text-6xl mb-6">
            {isExcellent ? '🏆' : isGood ? '👍' : '💪'}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Quiz Complete!
          </h2>
          <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            {score} / {quizQuestions.length}
          </div>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8">
            {percentage}% Correct
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {isExcellent
              ? 'Ausgezeichnet! Excellent work!'
              : isGood
              ? 'Gut gemacht! Good job!'
              : 'Keep practicing! You\'re getting better!'}
          </p>
          <button
            onClick={restartQuiz}
            className="flex items-center justify-center space-x-2 mx-auto px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Quiz Again</span>
          </button>
        </div>
      </motion.div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = quizQuestions.length > 0 ? ((currentQuestion + 1) / quizQuestions.length) * 100 : 0;

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

  // Guard: If question is undefined, show nothing (should not happen, but prevents crash)
  if (!question) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </div>
          <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            Score: {score}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-primary-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6"
        >
          <div className="text-center mb-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              What is the English translation of:
            </p>
            {question.gender && (
              <div className="mb-4">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 px-3 py-1 rounded border border-gray-300 dark:border-gray-600">
                  {question.gender.toUpperCase()} {getGenderEmoji(question.gender)}
                </span>
              </div>
            )}
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
              {question.german}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  className={`p-4 rounded-xl font-semibold text-lg transition-all border-2 ${
                    showCorrect
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300'
                      : showWrong
                      ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                  } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <CheckCircle className="w-6 h-6" />}
                    {showWrong && <XCircle className="w-6 h-6" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Result Message */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                selectedAnswer === question.correctAnswer
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}
            >
              {selectedAnswer === question.correctAnswer
                ? '✅ Richtig! Correct!'
                : `❌ Incorrect. The correct answer is: ${question.correctAnswer}`}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizMode;
