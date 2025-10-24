"use client";

/**
 * Authentication Context - Optimized
 */

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register with email and password
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName });

      // Send email verification
      await sendEmailVerification(user);
      toast.success('Verification email sent! Please check your inbox.');

      // Create user document in Firestore
      const userData = {
        uid: user.uid,
        email,
        displayName,
        emailVerified: false,
        photoURL: null,
        bio: '',
        location: '',
        phone: null,
        skillsOffered: [],
        skillsNeeded: [],
        skillCoinBalance: 100,
        rating: 0,
        reviewCount: 0,
        role: 'user',
        isPremium: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      setUserData(userData);

      toast.success('Account created successfully!');
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  // Login with email and password
  const login = useCallback(async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        toast.error('Please verify your email before logging in. Check your inbox for the verification link.');
        return null;
      }
      
      toast.success('Welcome back!');
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
      throw error;
    }
  }, []);

  // Resend email verification
  const resendEmailVerification = useCallback(async () => {
    try {
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        toast.success('Verification email sent! Please check your inbox.');
      } else {
        toast.error('No user logged in or email already verified');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to send verification email');
      throw error;
    }
  }, [user]);

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user document
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          bio: '',
          location: '',
          phone: null,
          skillsOffered: [],
          skillsNeeded: [],
          skillCoinBalance: 100,
          rating: 0,
          reviewCount: 0,
          role: 'user',
          isPremium: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(userDocRef, userData);
        setUserData(userData);
      }

      toast.success('Logged in with Google!');
      return user;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message);
      throw error;
    }
  }, []);

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      await userAPI.updateUser(user.uid, updates);
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString()
      }));

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value = useMemo(() => ({
    user,
    userData,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile,
    refreshUserData,
    resendEmailVerification
  }), [user, userData, loading, register, login, loginWithGoogle, logout, updateProfile, refreshUserData, resendEmailVerification]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


