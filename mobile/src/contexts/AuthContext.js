/**
 * Authentication Context for Mobile
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxHACyjqOqidlx7CJNFGEfHHza_eUW9z4",
  authDomain: "skillchain-fe362.firebaseapp.com",
  projectId: "skillchain-fe362",
  storageBucket: "skillchain-fe362.firebasestorage.app",
  messagingSenderId: "841962814239",
  appId: "1:841962814239:web:3dd6ddf3477becc63f0e2a"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  // Check if Firebase is already initialized
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a minimal fallback
  try {
    app = initializeApp(firebaseConfig, 'fallback');
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (fallbackError) {
    console.error('Firebase fallback initialization failed:', fallbackError);
    // Create mock objects to prevent crashes
    auth = null;
    db = null;
  }
}

export { auth, db };

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseAvailable, setFirebaseAvailable] = useState(!!auth);

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase auth not available, skipping auth state listener');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch user data from Firestore
        if (db) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              setUserData(userDoc.data());
              await AsyncStorage.setItem('userData', JSON.stringify(userDoc.data()));
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      } else {
        setUser(null);
        setUserData(null);
        await AsyncStorage.removeItem('userData');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, displayName) => {
    if (!auth) {
      // Mock registration for development
      console.warn('Using mock authentication - Firebase not available');
      const mockUser = {
        uid: 'mock_' + Date.now(),
        email,
        displayName
      };
      
      const userData = {
        uid: mockUser.uid,
        email,
        displayName,
        skillCoinBalance: 100,
        createdAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      setUserData(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      return mockUser;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email,
        displayName,
        skillCoinBalance: 100,
        createdAt: new Date().toISOString()
      };

      if (db) {
        await setDoc(doc(db, 'users', user.uid), userData);
      }
      setUserData(userData);

      return user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    if (!auth) {
      // Mock login for development
      console.warn('Using mock authentication - Firebase not available');
      const mockUser = {
        uid: 'mock_' + Date.now(),
        email,
        displayName: 'Mock User'
      };
      
      const userData = {
        uid: mockUser.uid,
        email,
        displayName: 'Mock User',
        skillCoinBalance: 100,
        createdAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      setUserData(userData);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      return mockUser;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
      console.warn('Firebase auth not available, clearing local state only');
      setUser(null);
      setUserData(null);
      await AsyncStorage.removeItem('userData');
      return;
    }
    
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    userData,
    loading,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


