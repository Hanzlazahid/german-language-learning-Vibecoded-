'use client';

import Head from 'next/head';
import AuthForm from '@/components/AuthForm';
import { useRequireAuth } from '@/utils/authGuard';

export default function LoginPage() {
  const { user, checking } = useRequireAuth();

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Checking session...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // redirected by hook
  }

  return (
    <>
      <Head>
        <title>German Learning App - Login</title>
      </Head>
      <AuthForm />
    </>
  );
}

