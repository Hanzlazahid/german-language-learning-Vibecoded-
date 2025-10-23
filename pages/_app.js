// pages/_app.js
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AuthForm from '@/components/AuthForm';

export default function App({ Component, pageProps }) {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {!authReady ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : !user ? (
            <AuthForm onAuth={setUser} />
          ) : (
            <Component {...pageProps} user={user} />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
