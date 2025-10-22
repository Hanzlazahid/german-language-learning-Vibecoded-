// pages/_app.js
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default function App({ Component, pageProps }) {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User signed in:', user.uid);
        setAuthReady(true);
      } else {
        // Sign in anonymously if not authenticated
        console.log('Signing in anonymously...');
        signInAnonymously(auth)
          .then(() => {
            console.log('Anonymous sign-in successful');
          })
          .catch((error) => {
            console.error('Error signing in anonymously:', error);
            setAuthReady(true); // Still render the app even if auth fails
          });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {authReady ? (
            <Component {...pageProps} />
          ) : (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
