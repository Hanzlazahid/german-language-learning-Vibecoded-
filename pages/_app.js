// pages/_app.js
import '@/styles/globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Component {...pageProps} />
        </main>
      </div>
    </ThemeProvider>
  );
}
