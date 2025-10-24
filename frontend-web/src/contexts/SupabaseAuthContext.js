"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { mockUserData } from '@/lib/mockApi';
import toast from 'react-hot-toast';

const SupabaseAuthContext = createContext({});

export const useAuth = () => useContext(SupabaseAuthContext);

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // This will store public user data from 'users' table
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is available
    const checkSupabaseConnection = async () => {
      try {
        // Try to get session to test connection
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.log('Supabase not available, using mock data');
          // Use mock data when Supabase is not available
          setUser(mockUserData);
          setUserData(mockUserData);
          setLoading(false);
          return;
        }

        if (session) {
          setUser(session.user);
          // Fetch public user data from your 'users' table
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data from Supabase:', error);
            setUserData(null);
          } else {
            setUserData(data);
          }
        }
        setLoading(false);
      } catch (error) {
        console.log('Supabase connection failed, using mock data:', error);
        // Use mock data when Supabase is not available
        setUser(mockUserData);
        setUserData(mockUserData);
        setLoading(false);
      }
    };

    checkSupabaseConnection();

    // Listen for auth changes (only if Supabase is available)
    let authListener = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          setUser(session.user);
          // Fetch public user data from your 'users' table
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data from Supabase:', error);
            setUserData(null);
          } else {
            setUserData(data);
          }
        } else {
          setUser(null);
          setUserData(null);
        }
        setLoading(false);
      });
      authListener = data;
    }

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    try {
      if (!supabase) {
        // Use mock data when Supabase is not available
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email,
          display_name: displayName,
          email_verified: false,
          skill_coin_balance: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(mockUser);
        setUserData(mockUser);
        toast.success('Registration successful! (Demo mode)');
        return mockUser;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Insert into public 'users' table
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          display_name: displayName,
          email_verified: data.user.email_confirmed_at ? true : false,
          skill_coin_balance: 100, // Initial balance
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;

        toast.success('Registration successful! Please check your email to verify your account.');
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message);
      throw error;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      if (!supabase) {
        // Use mock data when Supabase is not available
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          email,
          display_name: 'Demo User',
          email_verified: true,
          skill_coin_balance: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(mockUser);
        setUserData(mockUser);
        toast.success('Welcome back! (Demo mode)');
        return mockUser;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if email is verified (Supabase handles this internally, but we can add a check if needed)
        if (!data.user.email_confirmed_at) {
          toast.error('Please verify your email before logging in. Check your inbox for the verification link.');
          await supabase.auth.signOut(); // Log out unverified user
          return null;
        }
        toast.success('Welcome back!');
        return data.user;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      throw error;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      if (!supabase) {
        // Use mock data when Supabase is not available
        const mockUser = {
          id: 'mock-user-google-' + Date.now(),
          email: 'demo@example.com',
          display_name: 'Demo User',
          email_verified: true,
          skill_coin_balance: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(mockUser);
        setUserData(mockUser);
        toast.success('Welcome! (Demo mode)');
        return { user: mockUser };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`, // Redirect to dashboard after Google login
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.message);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      setUser(null);
      setUserData(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error.message);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      if (!user) throw new Error('No user logged in');

      if (supabase) {
        const { error } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id);

        if (error) throw error;
      }

      setUserData(prev => ({ ...prev, ...updates }));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.message);
      throw error;
    }
  }, [user]);

  const refreshUserData = useCallback(async () => {
    if (!user) return;
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error refreshing user data:', error);
        } else {
          setUserData(data);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }, [user]);

  const resendEmailVerification = useCallback(async (email) => {
    try {
      if (!supabase) {
        toast.success('Verification email sent! (Demo mode)');
        return;
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });
      if (error) throw error;
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to send verification email');
      throw error;
    }
  }, []);

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
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};