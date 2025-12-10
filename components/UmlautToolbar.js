'use client';

import { useCallback } from 'react';

const CHARS = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];

export default function UmlautToolbar({ targetRef, className = '' }) {
  const insertChar = useCallback(
    (char) => {
      const input = targetRef?.current;
      if (!input) return;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? input.value.length;
      const value = input.value || '';
      const nextValue = `${value.slice(0, start)}${char}${value.slice(end)}`;
      input.value = nextValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      const caret = start + char.length;
      input.setSelectionRange(caret, caret);
    },
    [targetRef]
  );

  return (
    <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
      {CHARS.map((char) => (
        <button
          key={char}
          type="button"
          onClick={() => insertChar(char)}
          className="px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-400 transition"
        >
          {char}
        </button>
      ))}
    </div>
  );
}

