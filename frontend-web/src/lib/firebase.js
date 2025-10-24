/**
 * Firebase Client Configuration - Optimized
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with performance optimizations
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services with optimizations
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optimize Firestore settings
if (typeof window !== 'undefined') {
  // Enable offline persistence for better performance
  import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all features required for persistence');
      }
    });
  });
}

// Initialize messaging (only in browser)
let messaging = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

// Connection state management
let isOnline = true;
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    enableNetwork(db);
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
    disableNetwork(db);
  });
}

export { messaging, isOnline };
export default app;


