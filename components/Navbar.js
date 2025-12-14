// components/Navbar.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookOpen, Layers, Calendar, Moon, Sun, LogOut, ChevronDown, Brain, Calculator, FileText } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { signOutUser } from '@/lib/authService';

const Navbar = () => {
  const router = useRouter();
  const [pathname, setPathname] = useState('/');
  const [exercisesDropdownOpen, setExercisesDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setPathname(router.pathname);
  }, [router.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exercisesDropdownOpen && !event.target.closest('.exercises-dropdown')) {
        setExercisesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exercisesDropdownOpen]);

  const navItems = [
    { name: 'Word Bank', path: '/', icon: BookOpen },
    { name: 'Essentials', path: '/essentials', icon: Calendar },
  ];

  const exercisesItems = [
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
    { name: 'Numbers Practice', path: '/calculation', icon: Calculator },
    { name: 'Paragraph Writing', path: '/paragraph-writing', icon: FileText },
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
          <div className="hidden md:flex space-x-1 items-center">
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
            
            {/* Exercises Dropdown */}
            <div className="relative exercises-dropdown">
              <button
                onClick={() => setExercisesDropdownOpen(!exercisesDropdownOpen)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  exercisesItems.some(item => pathname === item.path)
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span className="font-medium ml-1">Exercises</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${exercisesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {exercisesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {exercisesItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setExercisesDropdownOpen(false)}
                        className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
                          isActive
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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
          
          {/* Exercises Dropdown - Mobile */}
          <div className="relative exercises-dropdown">
            <button
              onClick={() => setExercisesDropdownOpen(!exercisesDropdownOpen)}
              className={`flex flex-col items-center justify-center min-w-[80px] px-3 py-2 rounded-lg transition-all ${
                exercisesItems.some(item => pathname === item.path)
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <Brain className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium whitespace-nowrap">Exercises</span>
            </button>
            
            {exercisesDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                {exercisesItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setExercisesDropdownOpen(false)}
                      className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
                        isActive
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
