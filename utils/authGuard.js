import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signOutUser } from '@/lib/authService';
import { SESSION_MAX_AGE_MS } from '@/lib/constants';

export const useRequireAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState(() => auth.currentUser);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Enforce max session age based on last sign-in time
      if (currentUser && isSessionExpired(currentUser)) {
        await signOutUser();
        setUser(null);
        setChecking(false);
        if (router.pathname !== '/login') {
          router.replace('/login?expired=1');
        }
        return;
      }

      setUser(currentUser);
      setChecking(false);

      if (!currentUser && router.pathname !== '/login') {
        router.replace('/login');
      }
      if (currentUser && router.pathname === '/login') {
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user, checking };
};

const isSessionExpired = (firebaseUser) => {
  const lastSignIn = firebaseUser?.metadata?.lastSignInTime;
  if (!lastSignIn) return false;
  const last = Date.parse(lastSignIn);
  if (Number.isNaN(last)) return false;
  return Date.now() - last > SESSION_MAX_AGE_MS;
};

