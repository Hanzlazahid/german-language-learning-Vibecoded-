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

const COLLECTION_NAME = 'words';

// Add a new word or sentence
export const addWord = async (wordData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...wordData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...wordData };
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

// Get all words
export const getWords = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
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

// Delete a word
export const deleteWord = async (wordId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, wordId));
    return true;
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

// Update a word
export const updateWord = async (wordId, updatedData) => {
  try {
    const wordRef = doc(db, COLLECTION_NAME, wordId);
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
