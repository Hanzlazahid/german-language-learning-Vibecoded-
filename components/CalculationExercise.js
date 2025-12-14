// components/CalculationExercise.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { Calculator, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';
import { numberToGerman, normalizeGermanNumber, operatorToGerman } from '@/lib/numberUtils';
import { speakGerman } from '@/lib/speechService';
import UmlautToolbar from '@/components/UmlautToolbar';

const DIFFICULTY_LEVELS = {
  easy: { min: 1, max: 10 },
  medium: { min: 1, max: 50 },
  hard: { min: 1, max: 100 },
};

// Algorithmic question generation (no hardcoding)
function generateQuestion(difficulty = 'medium') {
  const { min, max } = DIFFICULTY_LEVELS[difficulty] || DIFFICULTY_LEVELS.medium;
  
  const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Random operator (avoid division for simplicity)
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  // Calculate answer algorithmically
  let answer;
  switch (operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      // Ensure non-negative result
      answer = Math.max(num1, num2) - Math.min(num1, num2);
      break;
    case '*':
      // Limit multiplication for easier calculations
      answer = num1 * num2;
      break;
    default:
      answer = num1 + num2;
  }
  
  // Convert to German
  const germanNum1 = numberToGerman(num1);
  const germanNum2 = numberToGerman(num2);
  const operatorGerman = operatorToGerman(operator);
  
  // For subtraction, show larger number first
  const displayNum1 = operator === '-' ? Math.max(num1, num2) : num1;
  const displayNum2 = operator === '-' ? Math.min(num1, num2) : num2;
  const displayGerman1 = numberToGerman(displayNum1);
  const displayGerman2 = numberToGerman(displayNum2);
  
  return {
    num1: displayNum1,
    num2: displayNum2,
    operator,
    correctAnswer: answer,
    question: `${displayGerman1} ${operatorGerman} ${displayGerman2} = ?`,
    questionData: { num1: displayNum1, num2: displayNum2, operator },
  };
}

// Algorithmic validation (no hardcoding)
function validateAnswer(userInput, questionData) {
  const normalized = normalizeGermanNumber(userInput);
  if (normalized === null) return false;
  
  // Recalculate answer using same algorithm
  let correctAnswer;
  switch (questionData.operator) {
    case '+':
      correctAnswer = questionData.num1 + questionData.num2;
      break;
    case '-':
      correctAnswer = questionData.num1 - questionData.num2;
      break;
    case '*':
      correctAnswer = questionData.num1 * questionData.num2;
      break;
    default:
      return false;
  }
  
  return normalized === correctAnswer;
}

export default function CalculationExercise() {
  const [difficulty, setDifficulty] = useState('medium');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const answerInputRef = useRef(null);

  useEffect(() => {
    generateNewQuestion();
  }, [difficulty]);

  const generateNewQuestion = () => {
    const question = generateQuestion(difficulty);
    setCurrentQuestion(question);
    setUserAnswer('');
    setIsCorrect(null);
    setShowResult(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || !currentQuestion) return;

    const correct = validateAnswer(userAnswer, currentQuestion.questionData);
    setIsCorrect(correct);
    setShowResult(true);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    generateNewQuestion();
  };

  const handleReset = () => {
    setScore({ correct: 0, total: 0 });
    generateNewQuestion();
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Difficulty Selector */}
      <div className="mb-6 flex justify-center gap-2">
        {Object.keys(DIFFICULTY_LEVELS).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              difficulty === level
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-4 bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-md">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Score: </span>
            <span className="text-xl font-bold text-primary-600">
              {score.correct}/{score.total}
            </span>
          </div>
          {score.total > 0 && (
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy: </span>
              <span className="text-xl font-bold text-primary-600">
                {Math.round((score.correct / score.total) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Solve the Calculation
            </h2>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <p className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              {currentQuestion.question}
            </p>
            <button
              onClick={() => speakGerman(currentQuestion.question)}
              className="mt-2 p-2 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded transition-colors"
              title="Pronounce question"
            >
              <Volume2 className="w-5 h-5 text-primary-500" />
            </button>
          </div>
        </div>

        {/* Answer Form */}
        {!showResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Answer (in German or number)
              </label>
              <input
                ref={answerInputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="e.g., drei or 3"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                autoFocus
              />
              {answerInputRef.current && <UmlautToolbar targetRef={answerInputRef} />}
            </div>
            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              Check Answer
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <span
                  className={`text-lg font-semibold ${
                    isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
                  }`}
                >
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              {!isCorrect && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Correct answer: <span className="font-bold">{numberToGerman(currentQuestion.correctAnswer)}</span> ({currentQuestion.correctAnswer})
                </p>
              )}
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              Next Question
            </button>
          </div>
        )}

        {/* Reset Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Score
          </button>
        </div>
      </div>
    </div>
  );
}

