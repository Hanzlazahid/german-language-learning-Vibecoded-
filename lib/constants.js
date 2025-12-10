export const EMAIL_DOMAIN = 'umt.edu.pk';

export const ERRORS = {
  missingEnv: 'Firebase environment variables are not configured.',
  invalidEmailDomain: `Email must end with @${EMAIL_DOMAIN}`,
  missingName: 'Name is required.',
  weakPassword: 'Password must be at least 8 characters.',
  authGeneric: 'Authentication failed. Please try again.',
  invalidCredentials: 'Invalid email or password.',
  userNotFound: 'Account not found. Please sign up.',
  emailInUse: 'This email is already registered.',
  tooManyRequests: 'Too many attempts. Please wait and try again.',
  network: 'Network error. Check your connection and retry.',
};

export const SUCCESS = {
  signedUp: 'Account created successfully.',
  signedIn: 'Signed in successfully.',
  signedOut: 'Signed out.',
};

export const LOCAL_STORAGE_KEYS = {
  theme: 'theme',
};

// Auth/session
export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 4; // 4 days

