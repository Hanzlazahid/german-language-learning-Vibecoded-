// components/Footer.js
'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-center gap-2">
            Made with
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            by hanzla
          </p>
        </div>
      </div>
    </footer>
  );
}

