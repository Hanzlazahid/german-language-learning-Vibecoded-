// components/Navbar.js
'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookOpen, Layers, Brain, TrendingUp, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { signOutUser } from '@/lib/authService';

const Navbar = () => {
  const { pathname } = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Words', path: '/', icon: BookOpen },
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
  ];

  const handleLogout = async () => {
    await signOutUser();
    window.location.reload();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl">🇩🇪</span>
            <span className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium ml-1">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle & Logout */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Links - Mobile */}
        <div className="md:hidden flex overflow-x-auto pb-3 space-x-2 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
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
                <Icon className="w-5 h-5 mb-1" />
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
