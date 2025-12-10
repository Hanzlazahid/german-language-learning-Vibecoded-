import { useState } from 'react';
import { Lock, LogIn, UserPlus, AlertCircle, Mail, ShieldCheck } from 'lucide-react';
import { signIn, signUp } from '@/lib/authService';
import { EMAIL_DOMAIN, ERRORS } from '@/lib/constants';
import { useRouter } from 'next/router';

export default function AuthForm({ onAuth }) {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [emailUser, setEmailUser] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      let user;
      if (isSignup) {
        const result = await signUp({ username: emailUser, password, name });
        user = result.user;
        setSuccess(result.message);
      } else {
        const result = await signIn({ username: emailUser, password });
        user = result.user;
        setSuccess(result.message);
      }
      onAuth && onAuth(user);
    } catch (err) {
      setError(err.message || ERRORS.authGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-1 bg-gradient-to-r from-primary-500/20 via-primary-500/10 to-transparent rounded-2xl">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary-600 font-semibold">
              Deutsch Lernen
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {isSignup ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Use your `{EMAIL_DOMAIN}` email to continue.
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Campus access</span>
          </div>
        </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <div>
            <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="e.g., Anna Müller"
              required
            />
          </div>
        )}
        <div className="flex flex-col space-y-1">
          <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">UMT Email</label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={emailUser}
              onChange={(e) => setEmailUser(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
              className="w-full pl-10 pr-28 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="username"
              required
            />
            <span className="absolute right-3 text-sm px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 select-none pointer-events-none">
              @{EMAIL_DOMAIN}
            </span>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-800 dark:text-gray-200">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
              placeholder="Min 8 characters"
              required
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use at least 8 characters for a secure account.
          </p>
        </div>
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm">{success}</div>
        )}
        {router?.query?.expired && !error && !success && (
          <div className="text-amber-600 text-sm">
            Your session expired. Please sign in again.
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center space-x-2"
          disabled={loading}
        >
          {loading ? (
            <span>Please wait...</span>
          ) : isSignup ? (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </>
          )}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          className="text-primary-600 hover:underline"
          onClick={() => setIsSignup((v) => !v)}
        >
          {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
      </div>
      </div>
    </div>
  );
}
