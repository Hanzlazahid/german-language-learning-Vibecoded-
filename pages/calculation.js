// pages/calculation.js
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Calculator } from 'lucide-react';
import CalculationExercise from '@/components/CalculationExercise';
import { useRequireAuth } from '@/utils/authGuard';

export default function CalculationPage() {
  const { user, checking } = useRequireAuth();

  if (checking || !user) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          {checking ? 'Checking session...' : 'Redirecting to login...'}
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>German Learning App - Calculation Practice</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            <Calculator className="w-10 h-10 text-primary-600" />
            <span>Calculation Practice</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Practice German numbers by solving calculations
          </p>
        </div>

        <CalculationExercise />
      </div>
    </>
  );
}

