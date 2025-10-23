// components/Navbar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Layers, Brain, TrendingUp, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Words', path: '/', icon: BookOpen, emoji: '📘' },
    { name: 'Flashcards', path: '/flashcards', icon: Layers, emoji: '💬' },
    { name: 'Quiz', path: '/quiz', icon: Brain, emoji: '🧠' },
    { name: 'Progress', path: '/progress', icon: TrendingUp, emoji: '📊' },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  return (
    <nav className="bg-germanblack shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl">🇩🇪</span>
            <span className="text-xl font-bold text-primary-500 group-hover:text-accent-500 transition-colors">
              Deutsch Lernen
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-germanblack shadow-md'
                      : 'text-primary-500 hover:bg-accent-500 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle & Logout */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-germanblack" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Links - Mobile */}
        <div className="md:hidden flex overflow-x-auto pb-3 space-x-2 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center justify-center min-w-[80px] px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <span className="text-xl mb-1">{item.emoji}</span>
                <span className="text-xs font-medium whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
