import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function AuthForm({ onAuth }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  // Only store the username part before @umt.edu.pk
  const [emailUser, setEmailUser] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /@umt\.edu\.pk$/i.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Compose full email from username part
    const fullEmail = `${emailUser}@umt.edu.pk`;
    if (!validateEmail(fullEmail)) {
      setError('Email must end with @umt.edu.pk');
      setLoading(false);
      return;
    }
    if (isSignup && !name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    try {
      let userCredential;
      if (isSignup) {
        userCredential = await createUserWithEmailAndPassword(auth, fullEmail, password);
        await updateProfile(userCredential.user, { displayName: name });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, fullEmail, password);
      }
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);
      onAuth && onAuth(userCredential.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        {isSignup ? 'Sign Up' : 'Log In'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-black text-white placeholder-gray-400"
              required
            />
          </div>
        )}
        <div>
          <label className="block mb-1 font-medium">UMT Email</label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={emailUser}
              onChange={(e) => setEmailUser(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-black text-white placeholder-gray-400 pr-32"
              placeholder="username"
              required
            />
            <span className="absolute right-3 text-white bg-black px-2 py-1 rounded select-none pointer-events-none text-sm">@umt.edu.pk</span>
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring bg-black text-white placeholder-gray-400"
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
          disabled={loading}
        >
          {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Log In'}
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
  );
}
