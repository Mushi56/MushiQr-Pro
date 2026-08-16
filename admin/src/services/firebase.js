// admin/src/services/firebase.js
// Standalone Super Admin App Firebase Instance (Shares identical production backend)

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyABHD4nD7iZJSRll6oClWInbFJuMxgg_KQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mushi-qr-pro.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mushi-qr-pro',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mushi-qr-pro.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1068457009199',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1068457009199:web:5b09d6a86f7ecd448966da'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const functions = getFunctions(app);
