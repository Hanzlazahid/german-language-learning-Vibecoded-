// components/AddWordForm.js
'use client';

import { useRef, useState } from 'react';
import { Plus, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UmlautToolbar from '@/components/UmlautToolbar';

const AddWordForm = ({ onAddWord }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    german: '',
    english: '',
    type: '',
    gender: '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const germanRef = useRef(null);
  const englishRef = useRef(null);
  const tagsRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!formData.german.trim() || !formData.english.trim()) {
      alert('Please fill in both German and English fields');
      return;
    }

    const newWord = {
      german: formData.german.trim(),
      english: formData.english.trim(),
      ...(formData.type ? { type: formData.type } : {}),
      ...(formData.gender ? { gender: formData.gender } : {}),
      ...(formData.tags
        ? {
            tags: formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag !== ''),
          }
        : {}),
      createdAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      await onAddWord(newWord);
      setFormData({ german: '', english: '', type: '', gender: '', tags: '' });
      setIsOpen(false);
    } catch (err) {
      setSubmitError(err?.message || 'Failed to add word. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-6">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Word</span>
        </button>
      )}

      {/* Form */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Add New Word or Sentence
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* German Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    German *
                  </label>
                  <input
                    type="text"
                    name="german"
                    value={formData.german}
                    onChange={handleChange}
                    placeholder="e.g., Der Hund"
                    ref={germanRef}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    required
                  />
                  <UmlautToolbar targetRef={germanRef} />
                </div>

                {/* English Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    English *
                  </label>
                  <input
                    type="text"
                    name="english"
                    value={formData.english}
                    onChange={handleChange}
                    placeholder="e.g., The dog"
                    ref={englishRef}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    required
                  />
                  <UmlautToolbar targetRef={englishRef} />
                </div>

                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type (optional)
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">No type</option>
                    <option value="word">Word</option>
                    <option value="sentence">Sentence</option>
                    <option value="phrase">Phrase</option>
                  </select>
                </div>

                {/* Gender Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender (for nouns)
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  >
                    <option value="">None</option>
                    <option value="der">Der (Masculine)</option>
                    <option value="die">Die (Feminine)</option>
                    <option value="das">Das (Neuter)</option>
                  </select>
                </div>

                {/* Tags Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., noun, animal, A1"
                    ref={tagsRef}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  />
                  <UmlautToolbar targetRef={tagsRef} />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <span>Add Word</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
              {submitError && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{submitError}</span>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddWordForm;
