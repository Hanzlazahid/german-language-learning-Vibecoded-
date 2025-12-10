import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';
import { EMAIL_DOMAIN, ERRORS, SUCCESS } from './constants';

const validateDomainEmail = (usernamePart) => {
  const sanitized = usernamePart.replace(/[^a-zA-Z0-9._-]/g, '');
  const email = `${sanitized}@${EMAIL_DOMAIN}`;
  if (!new RegExp(`@${EMAIL_DOMAIN}$`, 'i').test(email)) {
    throw new Error(ERRORS.invalidEmailDomain);
  }
  return email;
};

export const signUp = async ({ username, password, name }) => {
  if (!name?.trim()) {
    throw new Error(ERRORS.missingName);
  }
  if (!password || password.length < 8) {
    throw new Error(ERRORS.weakPassword);
  }
  try {
    const email = validateDomainEmail(username);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name.trim() });
    return { user: credential.user, message: SUCCESS.signedUp };
  } catch (err) {
    throw new Error(mapFirebaseAuthError(err));
  }
};

export const signIn = async ({ username, password }) => {
  try {
    const email = validateDomainEmail(username);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { user: credential.user, message: SUCCESS.signedIn };
  } catch (err) {
    throw new Error(mapFirebaseAuthError(err));
  }
};

export const signOutUser = async () => {
  await signOut(auth);
  return SUCCESS.signedOut;
};

const mapFirebaseAuthError = (error) => {
  const code = error?.code || '';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return ERRORS.invalidCredentials;
  }
  if (code === 'auth/user-not-found') {
    return ERRORS.userNotFound;
  }
  if (code === 'auth/email-already-in-use') {
    return ERRORS.emailInUse;
  }
  if (code === 'auth/weak-password') {
    return ERRORS.weakPassword;
  }
  if (code === 'auth/too-many-requests') {
    return ERRORS.tooManyRequests;
  }
  if (code === 'auth/network-request-failed') {
    return ERRORS.network;
  }
  return ERRORS.authGeneric;
};

