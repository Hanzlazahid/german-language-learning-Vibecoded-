// lib/firestoreService.js
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';


// Helper to get user-specific collection
const getUserWordsCollection = (uid) => collection(db, 'users', uid, 'words');


// Add a new word or sentence for a user
export const addWord = async (uid, wordData) => {
  try {
    const docRef = await addDoc(getUserWordsCollection(uid), {
      ...wordData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...wordData };
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

// Get all words for a user
export const getWords = async (uid) => {
  try {
    const q = query(getUserWordsCollection(uid), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const words = [];
    querySnapshot.forEach((doc) => {
      words.push({ id: doc.id, ...doc.data() });
    });
    return words;
  } catch (error) {
    console.error('Error getting words:', error);
    throw error;
  }
};

// Delete a word for a user
export const deleteWord = async (uid, wordId) => {
  try {
    await deleteDoc(doc(db, 'users', uid, 'words', wordId));
    return true;
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

// Update a word for a user
export const updateWord = async (uid, wordId, updatedData) => {
  try {
    const wordRef = doc(db, 'users', uid, 'words', wordId);
    await updateDoc(wordRef, updatedData);
    return true;
  } catch (error) {
    console.error('Error updating word:', error);
    throw error;
  }
};

// LocalStorage fallback functions
export const saveToLocalStorage = (words) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('germanWords', JSON.stringify(words));
  }
};

export const getFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('germanWords');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};
